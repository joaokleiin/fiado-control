import { AuthCard } from "@/components/auth/auth-card";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <AuthCard
      title="Crie sua conta grátis"
      subtitle="Teste por 7 dias, sem cartão de crédito e sem complicação."
    >
      <RegisterForm />
    </AuthCard>
  );
}
