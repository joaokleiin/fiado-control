"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { ActionResult } from "@/app/actions/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { onlyDigits } from "@/lib/format";

const merchantUpdateSchema = z.object({
  store_name: z.string().min(2, "Informe o nome do comércio."),
  phone: z.string().optional().transform((value) => onlyDigits(value)),
  logo_url: z.string().url().optional(),
});

async function getUserContext(): Promise<
  | { ok: true; supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>; userId: string }
  | { ok: false; result: ActionResult }
> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      result: {
        ok: false,
        message: "Configure o Supabase para salvar as informações do comércio.",
      },
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      result: { ok: false, message: "Sessão expirada.", redirectTo: "/login" },
    };
  }

  return { ok: true, supabase, userId: user.id };
}

export async function updateMerchant(formData: {
  store_name: string;
  phone?: string;
  logo_url?: string;
}): Promise<ActionResult> {
  const context = await getUserContext();
  if (!context.ok) return context.result;

  const parsed = merchantUpdateSchema.safeParse(formData);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { error } = await context.supabase
    .from("merchants")
    .update({
      store_name: parsed.data.store_name,
      phone: parsed.data.phone || null,
      logo_url: parsed.data.logo_url ?? null,
    })
    .eq("id", context.userId);

  if (error) return { ok: false, message: error.message };

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  return { ok: true, message: "Alterações salvas com sucesso." };
}

export async function uploadMerchantLogo(formData: FormData): Promise<ActionResult> {
  const context = await getUserContext();
  if (!context.ok) return context.result;

  const file = formData.get("logo");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "Escolha uma imagem para enviar." };
  }

  if (!file.type.startsWith("image/")) {
    return { ok: false, message: "Envie um arquivo de imagem válido." };
  }

  const extension = (file.name.split(".").pop() ?? "png").toLowerCase();
  const path = `${context.userId}/logo.${extension}`;
  const { error: uploadError } = await context.supabase.storage.from("logos").upload(path, file, {
    cacheControl: "3600",
    upsert: true,
  });

  if (uploadError) return { ok: false, message: uploadError.message };

  const { data } = context.supabase.storage.from("logos").getPublicUrl(path);
  const { error: updateError } = await context.supabase
    .from("merchants")
    .update({ logo_url: data.publicUrl })
    .eq("id", context.userId);

  if (updateError) return { ok: false, message: updateError.message };

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  return { ok: true, message: "Logo atualizado com sucesso." };
}
