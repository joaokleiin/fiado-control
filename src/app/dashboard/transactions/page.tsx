import { TransactionsPageClient } from "@/components/transactions/transactions-page-client";
import { getCustomerBalances, getTransactions } from "@/lib/data";

export default async function TransactionsPage() {
  const [transactions, customers] = await Promise.all([
    getTransactions(500),
    getCustomerBalances(),
  ]);

  return <TransactionsPageClient transactions={transactions} customers={customers} />;
}
