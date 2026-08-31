import { CustomersPageClient } from "@/components/customers/customers-page-client";
import { getCustomerBalances, getMerchantProfile } from "@/lib/data";

export default async function CustomersPage() {
  const [customers, merchant] = await Promise.all([
    getCustomerBalances(),
    getMerchantProfile(),
  ]);

  return <CustomersPageClient customers={customers} merchant={merchant} />;
}
