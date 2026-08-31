import { OnboardingForm } from "@/components/auth/onboarding-form";
import { getMerchantProfile } from "@/lib/data";

export default async function OnboardingPage() {
  const merchant = await getMerchantProfile();

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <section className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-primary">
          FC
        </span>
        <h1 className="text-[28px] font-bold leading-tight text-slate-950">
          Bem-vindo!
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Confirme os dados do seu comércio para deixar o painel pronto para uso.
        </p>
        <div className="mt-6">
          <OnboardingForm storeName={merchant.store_name} phone={merchant.phone} />
        </div>
      </section>
    </main>
  );
}
