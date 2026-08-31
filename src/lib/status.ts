import type { CustomerBalance } from "@/lib/types";

export type CustomerStatus =
  | "em_dia"
  | "com_debito"
  | "proximo_limite"
  | "no_limite"
  | "acima_limite";

export const customerStatusMeta: Record<
  CustomerStatus,
  { label: string; badgeClass: string; dotClass: string }
> = {
  em_dia: {
    label: "Em dia",
    badgeClass: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    dotClass: "bg-emerald-500",
  },
  com_debito: {
    label: "Com débito",
    badgeClass: "bg-amber-50 text-amber-700 ring-amber-100",
    dotClass: "bg-amber-500",
  },
  proximo_limite: {
    label: "Próximo do limite",
    badgeClass: "bg-yellow-50 text-yellow-700 ring-yellow-100",
    dotClass: "bg-yellow-500",
  },
  no_limite: {
    label: "No limite",
    badgeClass: "bg-orange-50 text-orange-700 ring-orange-100",
    dotClass: "bg-orange-500",
  },
  acima_limite: {
    label: "Acima do limite",
    badgeClass: "bg-red-50 text-red-700 ring-red-100",
    dotClass: "bg-red-500",
  },
};

export function getCustomerStatus(customer: Pick<CustomerBalance, "balance" | "credit_limit">) {
  const balance = Number(customer.balance ?? 0);
  const limit = Number(customer.credit_limit ?? 0);

  if (balance <= 0) return "em_dia" satisfies CustomerStatus;
  if (limit <= 0) return "com_debito" satisfies CustomerStatus;
  if (balance > limit) return "acima_limite" satisfies CustomerStatus;
  if (balance === limit) return "no_limite" satisfies CustomerStatus;
  if (balance >= limit * 0.7) return "proximo_limite" satisfies CustomerStatus;

  return "com_debito" satisfies CustomerStatus;
}

export function isLimitAlert(customer: Pick<CustomerBalance, "balance" | "credit_limit">) {
  const balance = Number(customer.balance ?? 0);
  const limit = Number(customer.credit_limit ?? 0);
  return limit > 0 && balance >= limit * 0.7;
}
