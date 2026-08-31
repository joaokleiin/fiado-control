import "server-only";

import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  buildDemoDashboardData,
  demoCustomers,
  demoMerchant,
  demoTransactions,
} from "@/lib/demo-data";
import { getCustomerStatus, isLimitAlert } from "@/lib/status";
import { getMonthKey, monthLabel } from "@/lib/format";
import type {
  CustomerBalance,
  CustomerBalanceHistoryPoint,
  DashboardData,
  Merchant,
  Transaction,
  TransactionWithCustomer,
} from "@/lib/types";

type SupabaseContext = {
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
  user: User;
};

type CustomerBalanceRow = {
  id: string;
  merchant_id: string;
  name: string;
  phone: string | null;
  credit_limit: string | number | null;
  notes?: string | null;
  is_active: boolean | null;
  created_at?: string | null;
  total_debit: string | number | null;
  total_payment: string | number | null;
  balance: string | number | null;
};

type TransactionQueryRow = {
  id: string;
  merchant_id: string;
  customer_id: string;
  type: "debit" | "payment";
  amount: string | number;
  description: string | null;
  due_date: string | null;
  created_at: string;
  customers: { name: string; phone: string | null } | null;
};

function toNumber(value: string | number | null | undefined) {
  return Number(value ?? 0);
}

function mapCustomerBalance(row: CustomerBalanceRow): CustomerBalance {
  return {
    id: row.id,
    merchant_id: row.merchant_id,
    name: row.name,
    phone: row.phone,
    credit_limit: toNumber(row.credit_limit),
    notes: row.notes ?? null,
    is_active: Boolean(row.is_active),
    total_debit: toNumber(row.total_debit),
    total_payment: toNumber(row.total_payment),
    balance: toNumber(row.balance),
    created_at: row.created_at ?? undefined,
  };
}

function mapTransaction(row: TransactionQueryRow): TransactionWithCustomer {
  return {
    id: row.id,
    merchant_id: row.merchant_id,
    customer_id: row.customer_id,
    type: row.type,
    amount: toNumber(row.amount),
    description: row.description,
    due_date: row.due_date,
    created_at: row.created_at,
    customer_name: row.customers?.name ?? "Cliente removido",
    customer_phone: row.customers?.phone ?? null,
  };
}

async function getSupabaseContext(): Promise<SupabaseContext> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return { supabase, user };
}

async function ensureMerchant({ supabase, user }: SupabaseContext): Promise<Merchant> {
  const { data: merchant } = await supabase
    .from("merchants")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (merchant) return merchant;

  const fallbackName =
    typeof user.user_metadata.store_name === "string"
      ? user.user_metadata.store_name
      : "Meu comércio";

  const { data: created, error } = await supabase
    .from("merchants")
    .upsert({ id: user.id, store_name: fallbackName }, { onConflict: "id" })
    .select("*")
    .single();

  if (error) throw error;
  return created;
}

export async function getMerchantProfile() {
  if (!isSupabaseConfigured()) return demoMerchant;
  const context = await getSupabaseContext();
  return ensureMerchant(context);
}

export async function getCustomerBalances(): Promise<CustomerBalance[]> {
  if (!isSupabaseConfigured()) return demoCustomers;
  const { supabase, user } = await getSupabaseContext();

  const { data, error } = await supabase
    .from("customer_balances")
    .select("*")
    .eq("merchant_id", user.id)
    .order("name", { ascending: true });

  if (error) throw error;
  return ((data ?? []) as CustomerBalanceRow[]).map(mapCustomerBalance);
}

export async function getTransactions(limit = 500): Promise<TransactionWithCustomer[]> {
  if (!isSupabaseConfigured()) return demoTransactions.slice(0, limit);
  const { supabase, user } = await getSupabaseContext();

  const { data, error } = await supabase
    .from("transactions")
    .select("*, customers(name, phone)")
    .eq("merchant_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return ((data ?? []) as TransactionQueryRow[]).map(mapTransaction);
}

export async function getDashboardData(): Promise<DashboardData> {
  if (!isSupabaseConfigured()) return buildDemoDashboardData();

  const context = await getSupabaseContext();
  const merchant = await ensureMerchant(context);
  const [customers, transactions] = await Promise.all([
    getCustomerBalances(),
    getTransactions(120),
  ]);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const movementMap = new Map<string, { month: string; debit: number; payment: number }>();
  for (let index = 5; index >= 0; index -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
    movementMap.set(getMonthKey(date), {
      month: monthLabel(date),
      debit: 0,
      payment: 0,
    });
  }

  transactions.forEach((transaction) => {
    const createdAt = new Date(transaction.created_at);
    const key = getMonthKey(createdAt);
    const point = movementMap.get(key);
    if (!point) return;
    point[transaction.type] += transaction.amount;
  });

  const statusCounts = customers.reduce(
    (acc, customer) => {
      const status = getCustomerStatus(customer);
      if (status === "em_dia") acc.onTime += 1;
      else if (status === "acima_limite") acc.overLimit += 1;
      else acc.withDebt += 1;
      return acc;
    },
    { onTime: 0, withDebt: 0, overLimit: 0 },
  );

  return {
    merchant,
    customers,
    transactions,
    metrics: {
      openTotal: customers.reduce((sum, customer) => sum + Math.max(customer.balance, 0), 0),
      receivedThisMonth: transactions
        .filter(
          (transaction) =>
            transaction.type === "payment" && new Date(transaction.created_at) >= monthStart,
        )
        .reduce((sum, transaction) => sum + transaction.amount, 0),
      activeCustomers: customers.filter((customer) => customer.is_active).length,
      limitAlerts: customers.filter(isLimitAlert).length,
    },
    movement: Array.from(movementMap.values()),
    customerStatus: [
      { name: "Em dia", value: statusCounts.onTime, color: "#10B981" },
      { name: "Com débito", value: statusCounts.withDebt, color: "#F59E0B" },
      { name: "Acima do limite", value: statusCounts.overLimit, color: "#EF4444" },
    ],
  };
}

export async function getCustomerDetail(id: string) {
  if (!isSupabaseConfigured()) {
    const customer = demoCustomers.find((item) => item.id === id) ?? null;
    const transactions = demoTransactions.filter((item) => item.customer_id === id);
    return {
      merchant: demoMerchant,
      customer,
      transactions,
      history: buildCustomerHistory(transactions),
    };
  }

  const { supabase, user } = await getSupabaseContext();
  const merchant = await getMerchantProfile();

  const { data: customerData, error: customerError } = await supabase
    .from("customer_balances")
    .select("*")
    .eq("merchant_id", user.id)
    .eq("id", id)
    .maybeSingle();

  if (customerError) throw customerError;

  const { data: transactionData, error: transactionError } = await supabase
    .from("transactions")
    .select("*, customers(name, phone)")
    .eq("merchant_id", user.id)
    .eq("customer_id", id)
    .order("created_at", { ascending: false });

  if (transactionError) throw transactionError;

  const transactions = ((transactionData ?? []) as TransactionQueryRow[]).map(mapTransaction);

  return {
    merchant,
    customer: customerData ? mapCustomerBalance(customerData as CustomerBalanceRow) : null,
    transactions,
    history: buildCustomerHistory(transactions),
  };
}

export function buildCustomerHistory(transactions: Transaction[]): CustomerBalanceHistoryPoint[] {
  let runningBalance = 0;

  return [...transactions]
    .sort(
      (first, second) =>
        new Date(first.created_at).getTime() - new Date(second.created_at).getTime(),
    )
    .map((transaction) => {
      runningBalance += transaction.type === "debit" ? transaction.amount : -transaction.amount;
      return {
        date: new Date(transaction.created_at).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
        }),
        balance: Math.max(runningBalance, 0),
      };
    });
}
