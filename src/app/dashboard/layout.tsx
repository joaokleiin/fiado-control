import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getCustomerBalances, getMerchantProfile } from "@/lib/data";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [merchant, customers] = await Promise.all([
    getMerchantProfile(),
    getCustomerBalances(),
  ]);

  return (
    <DashboardShell merchant={merchant} customers={customers}>
      {children}
    </DashboardShell>
  );
}
