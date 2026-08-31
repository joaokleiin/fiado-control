"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";
import { updateOnboardingAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { onboardingSchema, type OnboardingValues } from "@/lib/validations";

type OnboardingFormProps = {
  storeName: string;
  phone?: string | null;
};

type OnboardingFormValues = {
  storeName: string;
  phone?: string;
};

export function OnboardingForm({ storeName, phone }: OnboardingFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: { storeName, phone: phone ?? "" },
  });

  function onSubmit(values: OnboardingFormValues) {
    const payload: OnboardingValues = {
      storeName: values.storeName,
      phone: values.phone?.trim() ? values.phone : undefined,
    };

    startTransition(async () => {
      const result = await updateOnboardingAction(payload);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      router.push(result.redirectTo ?? "/dashboard");
      router.refresh();
    });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <Field label="Nome do comércio" error={errors.storeName?.message}>
        <Input {...register("storeName")} />
      </Field>
      <Field label="Telefone" error={errors.phone?.message}>
        <PatternFormat
          customInput={Input}
          format="(##) #####-####"
          mask="_"
          allowEmptyFormatting={false}
          defaultValue={phone ?? ""}
          onValueChange={({ value }) => setValue("phone", value)}
          placeholder="(11) 98765-4321"
        />
      </Field>
      <Button className="w-full" type="submit" disabled={isPending}>
        {isPending ? "Salvando..." : "Ir para o painel"}
      </Button>
    </form>
  );
}
