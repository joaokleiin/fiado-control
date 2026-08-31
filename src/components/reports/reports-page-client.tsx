"use client";

import { useMemo, useState } from "react";
import { Download, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { exportTransactionsToCSV, formatCurrency } from "@/lib/format";
import type { CustomerBalance, TransactionWithCustomer } from "@/lib/types";
import { cn } from "@/lib/utils";

type PeriodKey = "last-1" | "last-3" | "last-6" | "this-year" | "custom";

function getMonthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function buildPeriodLabel(period: PeriodKey, startDate: string, endDate: string) {
  if (period !== "custom") return "Período selecionado";
  return `${startDate || "—"} até ${endDate || "—"}`;
}

export function ReportsPageClient({
  transactions,
  customers,
}: {
  transactions: TransactionWithCustomer[];
  customers: CustomerBalance[];
}) {
  const [period, setPeriod] = useState<PeriodKey>("last-3");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const baseStart = new Date(now.getFullYear(), now.getMonth(), 1);

    return transactions.filter((transaction) => {
      const createdAt = new Date(transaction.created_at);

      if (period === "last-1") {
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        return createdAt >= start && createdAt <= now;
      }

      if (period === "last-3") {
        const start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        return createdAt >= start && createdAt <= now;
      }

      if (period === "last-6") {
        const start = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        return createdAt >= start && createdAt <= now;
      }

      if (period === "this-year") {
        const start = new Date(now.getFullYear(), 0, 1);
        return createdAt >= start && createdAt <= now;
      }

      if (period === "custom") {
        const start = startDate ? new Date(`${startDate}T00:00:00`) : null;
        const end = endDate ? new Date(`${endDate}T23:59:59`) : null;
        if (start && end) return createdAt >= start && createdAt <= end;
        if (start) return createdAt >= start;
        if (end) return createdAt <= end;
        return true;
      }

      return createdAt >= baseStart && createdAt <= now;
    });
  }, [endDate, period, startDate, transactions]);

  const totals = useMemo(() => {
    const debit = filteredTransactions.filter((tx) => tx.type === "debit").reduce((sum, tx) => sum + tx.amount, 0);
    const payment = filteredTransactions.filter((tx) => tx.type === "payment").reduce((sum, tx) => sum + tx.amount, 0);
    const rate = debit > 0 ? Number(((payment / debit) * 100).toFixed(1)) : 0;

    return { debit, payment, net: debit - payment, rate };
  }, [filteredTransactions]);

  const topCustomers = useMemo(() => {
    return [...customers]
      .sort((first, second) => second.balance - first.balance)
      .slice(0, 10);
  }, [customers]);

  function handleExport() {
    const fileName = `relatorio-fiado-${new Date().toISOString().slice(0, 7)}.csv`;
    exportTransactionsToCSV(filteredTransactions, fileName);
  }

  const rateTone = totals.rate > 70 ? "text-success" : totals.rate >= 40 ? "text-warning" : "text-danger";
  const rateBadgeClass = totals.rate > 70 ? "bg-success/10 text-success" : totals.rate >= 40 ? "bg-warning/10 text-warning" : "bg-danger/10 text-danger";

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-[28px] font-bold leading-tight">Relatórios</h2>
          <p className="mt-1 text-sm text-slate-500">Monitore o volume de fiado e a taxa de recebimento.</p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtro de período</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "last-1", label: "Último mês" },
              { key: "last-3", label: "Últimos 3 meses" },
              { key: "last-6", label: "Últimos 6 meses" },
              { key: "this-year", label: "Este ano" },
              { key: "custom", label: "Intervalo customizado" },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition",
                  period === item.key ? "bg-primary text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50",
                )}
                onClick={() => setPeriod(item.key as PeriodKey)}
              >
                {item.label}
              </button>
            ))}
          </div>

          {period === "custom" ? (
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm text-slate-600">
                <span className="font-medium">Data inicial</span>
                <input
                  type="date"
                  className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-slate-600">
                <span className="font-medium">Data final</span>
                <input
                  type="date"
                  className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                />
              </label>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Fiado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-danger">{formatCurrency(totals.debit)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Recebido</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-success">{formatCurrency(totals.payment)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Saldo Líquido</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">{formatCurrency(totals.net)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Taxa de Recebimento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-3">
              <p className={cn("text-2xl font-bold", rateTone)}>{totals.rate.toFixed(1)}%</p>
              <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", rateBadgeClass)}>
                {totals.rate > 70 ? "Bom" : totals.rate >= 40 ? "Em atenção" : "Baixa"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {filteredTransactions.length === 0 ? (
        <EmptyState
          title="Nenhum relatório disponível"
          description="Não há transações para o período selecionado."
          icon={TrendingUp}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Top 10 clientes com saldo aberto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3">Saldo em aberto</th>
                    <th className="px-4 py-3">Limite</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {topCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-4 font-medium text-slate-950">{customer.name}</td>
                      <td className="px-4 py-4 font-semibold text-danger">{formatCurrency(customer.balance)}</td>
                      <td className="px-4 py-4 text-slate-600">{formatCurrency(customer.credit_limit)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
