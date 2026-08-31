"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { signInAction, sendPasswordResetAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signInSchema, type SignInValues } from "@/lib/validations";

type LoginFormProps = {
  missingConfig?: boolean;
  registered?: boolean;
};

export function LoginForm({ missingConfig, registered }: LoginFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isResetting, setIsResetting] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: SignInValues) {
    startTransition(async () => {
      const result = await signInAction(values);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      router.push(result.redirectTo ?? "/dashboard");
      router.refresh();
    });
  }

  async function onResetPassword() {
    const email = watch("email");
    setIsResetting(true);
    const result = await sendPasswordResetAction(email);
    setIsResetting(false);
    if (result.ok) toast.success(result.message);
    else toast.error(result.message);
  }

  return (
    <>
      {missingConfig ? (
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Configure o Supabase no arquivo `.env.local` para liberar o painel.
        </div>
      ) : null}
      {registered ? (
        <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Cadastro criado. Faça login para continuar.
        </div>
      ) : null}
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Field label="Email" error={errors.email?.message}>
          <Input type="email" autoComplete="email" placeholder="voce@comercio.com.br" {...register("email")} />
        </Field>
        <Field label="Senha" error={errors.password?.message}>
          <Input type="password" autoComplete="current-password" placeholder="Sua senha" {...register("password")} />
        </Field>
        <Button className="w-full" type="submit" disabled={isPending}>
          {isPending ? "Entrando..." : "Entrar"}
        </Button>
      </form>
      <div className="mt-4 flex items-center justify-between gap-3 text-sm">
        <button
          type="button"
          className="font-medium text-primary hover:text-primary-dark"
          onClick={onResetPassword}
          disabled={isResetting}
        >
          {isResetting ? "Enviando..." : "Esqueci a senha"}
        </button>
        <Link className="font-medium text-primary hover:text-primary-dark" href="/register">
          Criar conta grátis
        </Link>
      </div>
    </>
  );
}
