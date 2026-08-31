import { notFound } from "next/navigation";
import { CustomerProfileClient } from "@/components/customers/customer-profile-client";
import { getCustomerDetail } from "@/lib/data";

type CustomerPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CustomerPage({ params }: CustomerPageProps) {
  const { id } = await params;
  const data = await getCustomerDetail(id);

  if (!data.customer) notFound();

  return (
    <CustomerProfileClient
      merchant={data.merchant}
      customer={data.customer}
      transactions={data.transactions}
      history={data.history}
    />
  );
}
