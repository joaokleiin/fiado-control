import { ReportsPageClient } from "@/components/reports/reports-page-client";
import { getCustomerBalances, getTransactions } from "@/lib/data";

export default async function ReportsPage() {
  const [transactions, customers] = await Promise.all([
    getTransactions(500),
    getCustomerBalances(),
  ]);

  return <ReportsPageClient transactions={transactions} customers={customers} />;
}
