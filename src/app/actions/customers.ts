"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { customerFormSchema, type CustomerFormValues } from "@/lib/validations";
import type { ActionResult } from "@/app/actions/auth";

async function getUserContext(): Promise<
  | { ok: true; supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>; userId: string }
  | { ok: false; result: ActionResult }
> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      result: {
        ok: false,
        message: "Configure o Supabase para salvar clientes.",
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

export async function upsertCustomerAction(values: CustomerFormValues): Promise<ActionResult> {
  const context = await getUserContext();
  if (!context.ok) return context.result;

  const parsed = customerFormSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const payload = {
    merchant_id: context.userId,
    name: parsed.data.name,
    phone: parsed.data.phone || null,
    credit_limit: parsed.data.credit_limit,
    notes: parsed.data.notes || null,
    is_active: true,
  };

  const query = parsed.data.id
    ? context.supabase.from("customers").update(payload).eq("id", parsed.data.id).eq("merchant_id", context.userId)
    : context.supabase.from("customers").insert(payload);

  const { error } = await query;
  if (error) return { ok: false, message: error.message };

  revalidatePath("/dashboard/customers");
  revalidatePath("/dashboard");
  return {
    ok: true,
    message: parsed.data.id ? "Cliente atualizado." : "Cliente criado.",
  };
}
