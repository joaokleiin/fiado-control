import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";

type LoginPageProps = {
  searchParams: Promise<{
    missingConfig?: string;
    registered?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <AuthCard
      title="Entrar no painel"
      subtitle="Acesse seus clientes, saldos e cobranças em poucos segundos."
    >
      <LoginForm
        missingConfig={params.missingConfig === "1"}
        registered={params.registered === "1"}
      />
    </AuthCard>
  );
}
