"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  CheckCircle2,
  Edit3,
  MessageCircle,
  Phone,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonClassName } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CustomerBalanceChart } from "@/components/dashboard/dashboard-charts";
import { CustomerFormModal } from "@/components/customers/customer-form-modal";
import { TransactionModal } from "@/components/dashboard/transaction-modal";
import {
  formatCurrency,
  formatDateTime,
  formatPhone,
  toWhatsappNumber,
} from "@/lib/format";
import { customerStatusMeta, getCustomerStatus } from "@/lib/status";
import { cn } from "@/lib/utils";
import type {
  CustomerBalance,
  CustomerBalanceHistoryPoint,
  Merchant,
  TransactionWithCustomer,
} from "@/lib/types";

type CustomerProfileClientProps = {
  merchant: Merchant;
  customer: CustomerBalance;
  transactions: TransactionWithCustomer[];
  history: CustomerBalanceHistoryPoint[];
};

export function CustomerProfileClient({
  merchant,
  customer,
  transactions,
  history,
}: CustomerProfileClientProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [transactionOpen, setTransactionOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<"debit" | "payment">("debit");
  const [visibleCount, setVisibleCount] = useState(20);

  const status = getCustomerStatus(customer);
  const statusMeta = customerStatusMeta[status];
  const latestTransaction = transactions[0]?.created_at;
  const limitPercent =
    customer.credit_limit > 0
      ? Math.round((Math.max(customer.balance, 0) / customer.credit_limit) * 100)
      : 0;
  const limitColor =
    limitPercent >= 100 ? "bg-danger" : limitPercent >= 70 ? "bg-warning" : "bg-success";

  const whatsappUrl = useMemo(() => {
    const text = encodeURIComponent(
      `Olá ${customer.name}! Você tem um saldo de ${formatCurrency(customer.balance)} em aberto no ${merchant.store_name}. Vamos combinar o pagamento?`,
    );
    return `https://wa.me/${toWhatsappNumber(customer.phone)}?text=${text}`;
  }, [customer, merchant.store_name]);

  function openTransaction(type: "debit" | "payment") {
    setTransactionType(type);
    setTransactionOpen(true);
  }

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-2xl font-bold text-primary">
              {customer.name.charAt(0)}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-[28px] font-bold leading-tight text-slate-950">
                  {customer.name}
                </h1>
                <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset", statusMeta.badgeClass)}>
                  <span className={cn("h-1.5 w-1.5 rounded-full", statusMeta.dotClass)} />
                  {statusMeta.label}
                </span>
              </div>
              {customer.phone ? (
                <a
                  href={`tel:${customer.phone}`}
                  className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary"
                >
                  <Phone className="h-4 w-4" />
                  {formatPhone(customer.phone)}
                </a>
              ) : (
                <p className="mt-2 text-sm text-slate-500">Sem telefone cadastrado</p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            {customer.phone ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className={buttonClassName({ variant: "success" })}
              >
                <MessageCircle className="h-4 w-4" />
                Cobrar pelo WhatsApp
              </a>
            ) : null}
            <Button variant="outline" onClick={() => setEditOpen(true)}>
              <Edit3 className="h-4 w-4" />
              Editar cliente
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total em aberto", formatCurrency(customer.balance)],
          ["Total fiado histórico", formatCurrency(customer.total_debit)],
          ["Total pago histórico", formatCurrency(customer.total_payment)],
          ["Última movimentação", latestTransaction ? formatDateTime(latestTransaction) : "-"],
        ].map(([label, value]) => (
          <Card key={label}>
            <CardContent className="p-5">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {customer.credit_limit > 0 ? (
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-slate-950">Limite de crédito</h2>
            <Badge tone={limitPercent >= 100 ? "danger" : limitPercent >= 70 ? "warning" : "success"}>
              {limitPercent}%
            </Badge>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div className={cn("h-full rounded-full", limitColor)} style={{ width: `${Math.min(limitPercent, 100)}%` }} />
          </div>
          <p className="mt-3 text-sm text-slate-500">
            {formatCurrency(customer.balance)} de {formatCurrency(customer.credit_limit)} utilizado ({limitPercent}%)
          </p>
        </section>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button variant="danger" onClick={() => openTransaction("debit")}>
          <Plus className="h-4 w-4" />
          Lançar Fiado
        </Button>
        <Button variant="success" onClick={() => openTransaction("payment")}>
          <CheckCircle2 className="h-4 w-4" />
          Registrar Pagamento
        </Button>
      </div>

      <CustomerBalanceChart data={history} />

      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Histórico de transações</h2>
        <div className="mt-4 space-y-3">
          {transactions.length === 0 ? (
            <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
              Nenhuma transação para este cliente.
            </p>
          ) : (
            transactions.slice(0, visibleCount).map((transaction) => {
              const debit = transaction.type === "debit";
              const Icon = debit ? ArrowUpCircle : ArrowDownCircle;
              return (
                <div
                  key={transaction.id}
                  className="flex items-start justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3"
                >
                  <div className="flex gap-3">
                    <Icon className={cn("mt-0.5 h-5 w-5", debit ? "text-danger" : "text-success")} />
                    <div>
                      <p className="text-sm font-medium text-slate-950">
                        {transaction.description || (debit ? "Fiado lançado" : "Pagamento registrado")}
                      </p>
                      <p className="text-xs text-slate-500">{formatDateTime(transaction.created_at)}</p>
                    </div>
                  </div>
                  <p className={cn("shrink-0 text-sm font-bold", debit ? "text-danger" : "text-success")}>
                    {debit ? "+" : "-"} {formatCurrency(transaction.amount)}
                  </p>
                </div>
              );
            })
          )}
        </div>
        {visibleCount < transactions.length ? (
          <Button
            variant="outline"
            className="mt-4 w-full"
            onClick={() => setVisibleCount((count) => count + 20)}
          >
            Carregar mais
          </Button>
        ) : null}
      </section>

      <CustomerFormModal
        open={editOpen}
        customer={customer}
        onClose={() => setEditOpen(false)}
      />
      <TransactionModal
        open={transactionOpen}
        onClose={() => setTransactionOpen(false)}
        customers={[customer]}
        defaultCustomerId={customer.id}
        defaultType={transactionType}
      />
    </div>
  );
}
