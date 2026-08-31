"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Edit3, Eye, MessageCircle, Plus, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonClassName } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { CustomerFormModal } from "@/components/customers/customer-form-modal";
import { formatCurrency, formatPhone, toWhatsappNumber } from "@/lib/format";
import { getCustomerStatus, customerStatusMeta, isLimitAlert } from "@/lib/status";
import { cn } from "@/lib/utils";
import type { CustomerBalance, Merchant } from "@/lib/types";

type FilterKey = "all" | "debt" | "limit" | "ok";

const filters: Array<{ key: FilterKey; label: string }> = [
  { key: "all", label: "Todos" },
  { key: "debt", label: "Com débito" },
  { key: "limit", label: "Próximo do limite" },
  { key: "ok", label: "Em dia" },
];

export function CustomersPageClient({
  customers,
  merchant,
}: {
  customers: CustomerBalance[];
  merchant: Merchant;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerBalance | null>(null);

  const filteredCustomers = useMemo(() => {
    const normalized = query.toLowerCase();
    const digits = query.replace(/\D/g, "");

    return customers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(normalized) ||
        (customer.phone ?? "").includes(digits);
      const status = getCustomerStatus(customer);
      const matchesFilter =
        filter === "all" ||
        (filter === "debt" && status !== "em_dia") ||
        (filter === "limit" && isLimitAlert(customer)) ||
        (filter === "ok" && status === "em_dia");

      return matchesSearch && matchesFilter;
    });
  }, [customers, filter, query]);

  function openNewCustomer() {
    setEditingCustomer(null);
    setModalOpen(true);
  }

  function openEditCustomer(customer: CustomerBalance) {
    setEditingCustomer(customer);
    setModalOpen(true);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-[28px] font-bold leading-tight">
            Clientes <span className="text-slate-400">({customers.length} clientes)</span>
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Busque, edite e cobre quem está com saldo em aberto.
          </p>
        </div>
        <Button onClick={openNewCustomer}>
          <Plus className="h-4 w-4" />
          Novo cliente
        </Button>
      </div>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="relative xl:max-w-md xl:flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            className="pl-9"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nome ou telefone"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 fc-scrollbar">
          {filters.map((item) => (
            <button
              key={item.key}
              type="button"
              className={cn(
                "h-10 shrink-0 rounded-full px-4 text-sm font-medium transition",
                filter === item.key
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50",
              )}
              onClick={() => setFilter(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {customers.length === 0 ? (
        <EmptyState
          title="Você ainda não tem clientes cadastrados."
          description="Adicione seu primeiro cliente agora e comece a controlar o fiado sem caderninho."
          actionLabel="Novo cliente"
          onAction={openNewCustomer}
        />
      ) : filteredCustomers.length === 0 ? (
        <EmptyState
          title="Nenhum cliente encontrado"
          description="Tente mudar a busca ou limpar os filtros para ver mais cadastros."
        />
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm fc-scrollbar lg:block">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-slate-50 text-left text-xs font-medium uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3">Nome</th>
                  <th className="px-5 py-3">Telefone</th>
                  <th className="px-5 py-3">Saldo atual</th>
                  <th className="px-5 py-3">Limite de crédito</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((customer) => {
                  const status = getCustomerStatus(customer);
                  const meta = customerStatusMeta[status];
                  const whatsappText = encodeURIComponent(
                    `Olá ${customer.name}! Você tem um saldo de ${formatCurrency(customer.balance)} em aberto no ${merchant.store_name}. Vamos combinar o pagamento?`,
                  );
                  const whatsappUrl = `https://wa.me/${toWhatsappNumber(customer.phone)}?text=${whatsappText}`;

                  return (
                    <tr key={customer.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-primary">
                            {customer.name.charAt(0)}
                          </span>
                          <span className="font-medium text-slate-950">{customer.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-500">{formatPhone(customer.phone)}</td>
                      <td
                        className={cn(
                          "px-5 py-4 font-semibold",
                          customer.balance > 0 ? "text-danger" : "text-success",
                        )}
                      >
                        {formatCurrency(customer.balance)}
                      </td>
                      <td className="px-5 py-4">
                        {customer.credit_limit > 0 ? (
                          <Badge tone="primary">{formatCurrency(customer.credit_limit)}</Badge>
                        ) : (
                          <Badge tone="muted">Sem limite</Badge>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset", meta.badgeClass)}>
                          <span className={cn("h-1.5 w-1.5 rounded-full", meta.dotClass)} />
                          {meta.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            className={buttonClassName({ variant: "ghost", size: "icon" })}
                            href={`/dashboard/customers/${customer.id}`}
                            title="Ver perfil"
                            aria-label="Ver perfil"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button
                            type="button"
                            className={buttonClassName({ variant: "ghost", size: "icon" })}
                            onClick={() => openEditCustomer(customer)}
                            title="Editar cliente"
                            aria-label="Editar cliente"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          {customer.phone ? (
                            <a
                              className={buttonClassName({ variant: "success", size: "icon" })}
                              href={whatsappUrl}
                              target="_blank"
                              rel="noreferrer"
                              title="Cobrar pelo WhatsApp"
                              aria-label="Cobrar pelo WhatsApp"
                            >
                              <MessageCircle className="h-4 w-4" />
                            </a>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 lg:hidden">
            {filteredCustomers.map((customer) => {
              const status = getCustomerStatus(customer);
              const meta = customerStatusMeta[status];
              return (
                <div key={customer.id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-primary">
                        {customer.name.charAt(0)}
                      </span>
                      <div>
                        <h3 className="font-semibold text-slate-950">{customer.name}</h3>
                        <p className="text-xs text-slate-500">{formatPhone(customer.phone)}</p>
                      </div>
                    </div>
                    <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset", meta.badgeClass)}>
                      {meta.label}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500">Saldo atual</p>
                      <p className={cn("text-xl font-bold", customer.balance > 0 ? "text-danger" : "text-success")}>
                        {formatCurrency(customer.balance)}
                      </p>
                    </div>
                    <Link
                      href={`/dashboard/customers/${customer.id}`}
                      className={buttonClassName({ variant: "outline", size: "sm" })}
                    >
                      Ver
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <CustomerFormModal
        open={modalOpen}
        customer={editingCustomer}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
