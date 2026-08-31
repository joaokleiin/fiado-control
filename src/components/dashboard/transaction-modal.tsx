"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2, CircleDollarSign, Search } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import { createTransactionAction } from "@/app/actions/transactions";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency, formatPhone } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  transactionFormSchema,
  type TransactionFormValues,
} from "@/lib/validations";
import type { CustomerBalance } from "@/lib/types";

type TransactionModalProps = {
  open: boolean;
  onClose: () => void;
  customers: CustomerBalance[];
  defaultCustomerId?: string;
  defaultType?: "debit" | "payment";
};

export function TransactionModal({
  open,
  onClose,
  customers,
  defaultCustomerId = "",
  defaultType = "debit",
}: TransactionModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const {
    register,
    control,
    setValue,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      customer_id: defaultCustomerId,
      type: defaultType,
      amount: 0,
      description: "",
      due_date: "",
    },
  });

  const selectedCustomerId = watch("customer_id");
  const type = watch("type");
  const amount = Number(watch("amount") ?? 0);
  const selectedCustomer = customers.find((customer) => customer.id === selectedCustomerId);

  const filteredCustomers = useMemo(() => {
    const normalized = query.toLowerCase();
    return customers
      .filter((customer) => {
        const phone = customer.phone ?? "";
        return (
          customer.name.toLowerCase().includes(normalized) ||
          phone.includes(query.replace(/\D/g, ""))
        );
      })
      .slice(0, 8);
  }, [customers, query]);

  const willExceedLimit =
    type === "debit" &&
    selectedCustomer &&
    selectedCustomer.credit_limit > 0 &&
    selectedCustomer.balance + amount > selectedCustomer.credit_limit;

  function submit(values: TransactionFormValues) {
    startTransition(async () => {
      const result = await createTransactionAction(values);
      if (!result.ok) {
        toast.error(result.message);
        if (result.redirectTo) router.push(result.redirectTo);
        return;
      }

      toast.success(result.message);
      reset({
        customer_id: defaultCustomerId,
        type: defaultType,
        amount: 0,
        description: "",
        due_date: "",
      });
      setQuery("");
      onClose();
      router.refresh();
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nova Transação"
      description="Lance um fiado ou registre pagamento sem sair da tela atual."
    >
      <form className="space-y-5" onSubmit={handleSubmit(submit)}>
        <Field label="Cliente" error={errors.customer_id?.message}>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                className="pl-9"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por nome ou telefone"
              />
            </div>
            <div className="mt-3 max-h-56 space-y-2 overflow-y-auto fc-scrollbar">
              {filteredCustomers.length ? (
                filteredCustomers.map((customer) => {
                  const selected = customer.id === selectedCustomerId;
                  return (
                    <button
                      key={customer.id}
                      type="button"
                      className={cn(
                        "flex w-full items-center justify-between gap-3 rounded-xl border bg-white px-3 py-2 text-left transition hover:border-primary/40",
                        selected ? "border-primary ring-2 ring-blue-500/20" : "border-slate-100",
                      )}
                      onClick={() => {
                        setValue("customer_id", customer.id, { shouldValidate: true });
                        setQuery(customer.name);
                      }}
                    >
                      <span>
                        <span className="block text-sm font-medium text-slate-950">
                          {customer.name}
                        </span>
                        <span className="text-xs text-slate-500">
                          {formatPhone(customer.phone)}
                        </span>
                      </span>
                      <span className="text-sm font-semibold text-danger">
                        {formatCurrency(customer.balance)}
                      </span>
                    </button>
                  );
                })
              ) : (
                <p className="px-2 py-3 text-sm text-slate-500">Nenhum cliente encontrado.</p>
              )}
            </div>
          </div>
        </Field>

        <Field label="Tipo" error={errors.type?.message}>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  {
                    value: "debit",
                    label: "Fiado (Débito)",
                    icon: CircleDollarSign,
                    className: "border-red-200 bg-red-50 text-red-700",
                  },
                  {
                    value: "payment",
                    label: "Pagamento (Crédito)",
                    icon: CheckCircle2,
                    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const checked = field.value === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => field.onChange(item.value)}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition",
                        item.className,
                        checked && "ring-2 ring-blue-500/25",
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            )}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Valor" error={errors.amount?.message}>
            <Controller
              control={control}
              name="amount"
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
                />
              )}
            />
          </Field>
          {type === "debit" ? (
            <Field label="Data de vencimento">
              <Input type="date" {...register("due_date")} />
            </Field>
          ) : null}
        </div>

        <Field label="Descrição">
          <Textarea placeholder="Ex: cerveja + pão" {...register("description")} />
        </Field>

        {willExceedLimit ? (
          <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            <p>
              Este lançamento ultrapassará o limite de crédito do cliente (
              {formatCurrency(selectedCustomer.credit_limit)}). Deseja continuar?
            </p>
          </div>
        ) : null}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending || customers.length === 0}>
            {isPending ? "Salvando..." : "Salvar lançamento"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
