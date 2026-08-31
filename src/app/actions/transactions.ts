"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  transactionFormSchema,
  type TransactionFormValues,
} from "@/lib/validations";
import type { ActionResult } from "@/app/actions/auth";

export async function createTransactionAction(
  values: TransactionFormValues,
): Promise<ActionResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, message: "Configure o Supabase para salvar transações." };
  }

  const parsed = transactionFormSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, message: "Sessão expirada.", redirectTo: "/login" };

  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .select("id")
    .eq("id", parsed.data.customer_id)
    .eq("merchant_id", user.id)
    .maybeSingle();

  if (customerError) return { ok: false, message: customerError.message };
  if (!customer) return { ok: false, message: "Cliente não encontrado." };

  const { error } = await supabase.from("transactions").insert({
    merchant_id: user.id,
    customer_id: parsed.data.customer_id,
    type: parsed.data.type,
    amount: parsed.data.amount,
    description: parsed.data.description || null,
    due_date:
      parsed.data.type === "debit" && parsed.data.due_date ? parsed.data.due_date : null,
  });

  if (error) return { ok: false, message: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/customers");
  revalidatePath("/dashboard/transactions");
  revalidatePath("/dashboard/reports");
  return { ok: true, message: "Lançamento salvo." };
}
