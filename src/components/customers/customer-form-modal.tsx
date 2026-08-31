"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NumericFormat, PatternFormat } from "react-number-format";
import { toast } from "sonner";
import { upsertCustomerAction } from "@/app/actions/customers";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { customerFormSchema, type CustomerFormValues } from "@/lib/validations";
import type { CustomerBalance } from "@/lib/types";

type CustomerFormModalProps = {
  open: boolean;
  customer?: CustomerBalance | null;
  onClose: () => void;
};

export function CustomerFormModal({ open, customer, onClose }: CustomerFormModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      id: customer?.id,
      name: customer?.name ?? "",
      phone: customer?.phone ?? "",
      credit_limit: customer?.credit_limit ?? 0,
      notes: customer?.notes ?? "",
    },
  });

  useEffect(() => {
    reset({
      id: customer?.id,
      name: customer?.name ?? "",
      phone: customer?.phone ?? "",
      credit_limit: customer?.credit_limit ?? 0,
      notes: customer?.notes ?? "",
    });
  }, [customer, reset]);

  function submit(values: CustomerFormValues) {
    startTransition(async () => {
      const result = await upsertCustomerAction(values);
      if (!result.ok) {
        toast.error(result.message);
        if (result.redirectTo) router.push(result.redirectTo);
        return;
      }

      toast.success(result.message);
      onClose();
      router.refresh();
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={customer ? "Editar cliente" : "Novo cliente"}
      description="Mantenha o cadastro simples: nome, telefone e limite já resolvem o essencial."
    >
      <form className="space-y-4" onSubmit={handleSubmit(submit)}>
        <input type="hidden" {...register("id")} />
        <Field label="Nome*" error={errors.name?.message}>
          <Input placeholder="Nome do cliente" {...register("name")} />
        </Field>
        <Field label="Telefone" error={errors.phone?.message}>
          <PatternFormat
            customInput={Input}
            format="(##) #####-####"
            mask="_"
            defaultValue={customer?.phone ?? ""}
            placeholder="(11) 98765-4321"
            onValueChange={({ value }) => setValue("phone", value)}
          />
        </Field>
        <Field label="Limite de crédito" error={errors.credit_limit?.message}>
          <Controller
            control={control}
            name="credit_limit"
            render={({ field }) => (
              <NumericFormat
                customInput={Input}
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                decimalScale={2}
                fixedDecimalScale
                allowNegative={false}
                value={Number(field.value ?? 0)}
                onValueChange={(values) => field.onChange(values.floatValue ?? 0)}
                placeholder="0 = sem limite"
              />
            )}
          />
        </Field>
        <Field label="Observações">
          <Textarea placeholder="Algum combinado com este cliente?" {...register("notes")} />
        </Field>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
