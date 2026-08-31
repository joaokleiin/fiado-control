"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  onboardingSchema,
  registerSchema,
  settingsSchema,
  signInSchema,
  type OnboardingValues,
  type RegisterValues,
  type SettingsValues,
  type SignInValues,
} from "@/lib/validations";

export type ActionResult = {
  ok: boolean;
  message: string;
  redirectTo?: string;
};

function configurationError(): ActionResult {
  return {
    ok: false,
    message:
      "Supabase ainda não está configurado. Preencha NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.",
  };
}

export async function signInAction(values: SignInValues): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return configurationError();

  const parsed = signInSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { ok: false, message: "Email ou senha inválidos." };
  }

  revalidatePath("/dashboard");
  return { ok: true, message: "Login realizado.", redirectTo: "/dashboard" };
}

export async function registerAction(values: RegisterValues): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return configurationError();

  const parsed = registerSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createSupabaseServerClient();
  const { storeName, email, password } = parsed.data;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        store_name: storeName,
      },
    },
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  if (data.user && data.session) {
    await supabase
      .from("merchants")
      .upsert({ id: data.user.id, store_name: storeName }, { onConflict: "id" });
  }

  return {
    ok: true,
    message: data.session
      ? "Conta criada com sucesso."
      : "Conta criada. Confira seu email para confirmar o cadastro.",
    redirectTo: data.session ? "/onboarding" : "/login",
  };
}

export async function updateOnboardingAction(
  values: OnboardingValues,
): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return configurationError();

  const parsed = onboardingSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, message: "Faça login para continuar.", redirectTo: "/login" };

  const { error } = await supabase
    .from("merchants")
    .upsert(
      {
        id: user.id,
        store_name: parsed.data.storeName,
        phone: parsed.data.phone || null,
      },
      { onConflict: "id" },
    );

  if (error) return { ok: false, message: error.message };

  revalidatePath("/dashboard");
  return { ok: true, message: "Dados confirmados.", redirectTo: "/dashboard" };
}

export async function updateSettingsAction(values: SettingsValues): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return configurationError();

  const parsed = settingsSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, message: "Sessão expirada.", redirectTo: "/login" };

  const { error } = await supabase
    .from("merchants")
    .update({
      store_name: parsed.data.storeName,
      phone: parsed.data.phone || null,
    })
    .eq("id", user.id);

  if (error) return { ok: false, message: error.message };

  revalidatePath("/dashboard");
  return { ok: true, message: "Configurações salvas." };
}

export async function uploadLogoAction(formData: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return configurationError();

  const file = formData.get("logo");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "Escolha uma imagem para enviar." };
  }

  if (!file.type.startsWith("image/")) {
    return { ok: false, message: "Envie um arquivo de imagem válido." };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, message: "Sessão expirada.", redirectTo: "/login" };

  const extension = file.name.split(".").pop() ?? "png";
  const path = `${user.id}/logo-${Date.now()}.${extension}`;
  const { error: uploadError } = await supabase.storage
    .from("merchant-logos")
    .upload(path, file, { upsert: true });

  if (uploadError) return { ok: false, message: uploadError.message };

  const { data } = supabase.storage.from("merchant-logos").getPublicUrl(path);
  const { error: updateError } = await supabase
    .from("merchants")
    .update({ logo_url: data.publicUrl })
    .eq("id", user.id);

  if (updateError) return { ok: false, message: updateError.message };

  revalidatePath("/dashboard/settings");
  return { ok: true, message: "Logo atualizada." };
}

export async function sendPasswordResetAction(email: string): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return configurationError();
  const parsed = signInSchema.pick({ email: true }).safeParse({ email });
  if (!parsed.success) return { ok: false, message: "Informe um email válido." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email);

  if (error) return { ok: false, message: error.message };
  return { ok: true, message: "Email de recuperação enviado." };
}

export async function signOutAction(): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return { ok: true, message: "Sessão encerrada.", redirectTo: "/" };

  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  return { ok: true, message: "Sessão encerrada.", redirectTo: "/" };
}
