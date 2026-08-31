import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { TransactionWithCustomer } from "@/lib/types";

export function RecentTransactions({
  transactions,
}: {
  transactions: TransactionWithCustomer[];
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle>Últimas Transações</CardTitle>
        <Link className="text-sm font-medium text-primary hover:text-primary-dark" href="/dashboard/transactions">
          Ver todas
        </Link>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <EmptyState
            title="Nenhuma transação ainda"
            description="Lance o primeiro fiado ou pagamento para acompanhar o movimento do caixa."
          />
        ) : (
          <div className="overflow-x-auto fc-scrollbar">
            <table className="w-full min-w-[680px] border-separate border-spacing-y-2 text-sm">
              <thead>
                <tr className="text-left text-xs font-medium uppercase text-slate-500">
                  <th className="px-3 py-2">Cliente</th>
                  <th className="px-3 py-2">Data</th>
                  <th className="px-3 py-2">Tipo</th>
                  <th className="px-3 py-2 text-right">Valor</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 8).map((transaction) => (
                  <tr key={transaction.id} className="bg-slate-50">
                    <td className="rounded-l-xl px-3 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-primary">
                          {transaction.customer_name.charAt(0)}
                        </span>
                        <span className="font-medium text-slate-950">{transaction.customer_name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-slate-500">{formatDateTime(transaction.created_at)}</td>
                    <td className="px-3 py-3">
                      <Badge tone={transaction.type === "debit" ? "danger" : "success"}>
                        {transaction.type === "debit" ? "FIADO" : "PAGAMENTO"}
                      </Badge>
                    </td>
                    <td className="rounded-r-xl px-3 py-3 text-right font-semibold">
                      {formatCurrency(transaction.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
