"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { registerAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { registerSchema, type RegisterValues } from "@/lib/validations";

export function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      storeName: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  function onSubmit(values: RegisterValues) {
    startTransition(async () => {
      const result = await registerAction(values);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      router.push(result.redirectTo ?? "/onboarding");
      router.refresh();
    });
  }

  return (
    <>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Field label="Nome do comércio" error={errors.storeName?.message}>
          <Input placeholder="Mercadinho Boa Vista" {...register("storeName")} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <Input type="email" autoComplete="email" placeholder="voce@comercio.com.br" {...register("email")} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Senha" error={errors.password?.message}>
            <Input type="password" autoComplete="new-password" placeholder="Mínimo 6 caracteres" {...register("password")} />
          </Field>
          <Field label="Confirmar senha" error={errors.confirmPassword?.message}>
            <Input type="password" autoComplete="new-password" placeholder="Repita a senha" {...register("confirmPassword")} />
          </Field>
        </div>
        <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-600">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-blue-500/20"
            {...register("terms")}
          />
          <span>
            Aceito os termos de uso e política de privacidade do FiadoControl.
            {errors.terms?.message ? (
              <span className="block text-xs font-medium text-danger">{errors.terms.message}</span>
            ) : null}
          </span>
        </label>
        <Button className="w-full" type="submit" disabled={isPending}>
          {isPending ? "Criando conta..." : "Criar conta grátis"}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-500">
        Já tem conta?{" "}
        <Link className="font-medium text-primary hover:text-primary-dark" href="/login">
          Entrar
        </Link>
      </p>
    </>
  );
}
