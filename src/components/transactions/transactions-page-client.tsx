"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { CustomerBalance, TransactionWithCustomer } from "@/lib/types";

type TypeFilter = "all" | "debit" | "payment";

function defaultMonth(transactions: TransactionWithCustomer[]) {
  const first = transactions[0]?.created_at ? new Date(transactions[0].created_at) : new Date();
  return `${first.getFullYear()}-${String(first.getMonth() + 1).padStart(2, "0")}`;
}

export function TransactionsPageClient({
  transactions,
  customers,
}: {
  transactions: TransactionWithCustomer[];
  customers: CustomerBalance[];
}) {
  const [month, setMonth] = useState(defaultMonth(transactions));
  const [customerId, setCustomerId] = useState("all");
  const [type, setType] = useState<TypeFilter>("all");

  const filtered = useMemo(() => {
    return transactions.filter((transaction) => {
      const transactionMonth = transaction.created_at.slice(0, 7);
      const matchesMonth = month ? transactionMonth === month : true;
      const matchesCustomer = customerId === "all" || transaction.customer_id === customerId;
      const matchesType = type === "all" || transaction.type === type;

      return matchesMonth && matchesCustomer && matchesType;
    });
  }, [customerId, month, transactions, type]);

  const totals = filtered.reduce(
    (acc, transaction) => {
      if (transaction.type === "debit") acc.debit += transaction.amount;
      else acc.payment += transaction.amount;
      return acc;
    },
    { debit: 0, payment: 0 },
  );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[28px] font-bold leading-tight">Transações</h2>
        <p className="mt-1 text-sm text-slate-500">
          Consulte todo o histórico de fiados e pagamentos.
        </p>
      </div>

      <section className="grid gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:grid-cols-3">
        <label className="space-y-1.5">
          <span className="text-xs font-medium uppercase text-slate-500">Período</span>
          <Input type="month" value={month} onChange={(event) => setMonth(event.target.value)} />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium uppercase text-slate-500">Cliente</span>
          <select
            value={customerId}
            onChange={(event) => setCustomerId(event.target.value)}
            className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">Todos os clientes</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium uppercase text-slate-500">Tipo</span>
          <select
            value={type}
            onChange={(event) => setType(event.target.value as TypeFilter)}
            className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">Todos</option>
            <option value="debit">Fiado</option>
            <option value="payment">Pagamento</option>
          </select>
        </label>
      </section>

      {filtered.length === 0 ? (
        <EmptyState
          title="Sem transações nesse filtro"
          description="Altere o período, cliente ou tipo para encontrar lançamentos."
        />
      ) : (
        <section className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm fc-scrollbar">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="bg-slate-50 text-left text-xs font-medium uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">Data</th>
                <th className="px-5 py-3">Cliente</th>
                <th className="px-5 py-3">Tipo</th>
                <th className="px-5 py-3">Descrição</th>
                <th className="px-5 py-3 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-4 text-slate-500">{formatDateTime(transaction.created_at)}</td>
                  <td className="px-5 py-4 font-medium text-slate-950">{transaction.customer_name}</td>
                  <td className="px-5 py-4">
                    <Badge tone={transaction.type === "debit" ? "danger" : "success"}>
                      {transaction.type === "debit" ? "FIADO" : "PAGAMENTO"}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-slate-500">{transaction.description || "-"}</td>
                  <td className="px-5 py-4 text-right font-semibold">
                    {formatCurrency(transaction.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50">
              <tr>
                <td colSpan={5} className="px-5 py-4 text-sm font-medium text-slate-600">
                  {filtered.length} transações — Total fiado: {formatCurrency(totals.debit)} | Total recebido:{" "}
                  {formatCurrency(totals.payment)}
                </td>
              </tr>
            </tfoot>
          </table>
        </section>
      )}
    </div>
  );
}
