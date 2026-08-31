"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import {
  BarChart3,
  Home,
  LogOut,
  Plus,
  ReceiptText,
  Settings,
  Store,
  UserRound,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { signOutAction } from "@/app/actions/auth";
import { Button, buttonClassName } from "@/components/ui/button";
import { TransactionModal } from "@/components/dashboard/transaction-modal";
import { cn } from "@/lib/utils";
import type { CustomerBalance, Merchant } from "@/lib/types";

const navItems = [
  { href: "/dashboard", label: "Início", icon: Home, exact: true },
  { href: "/dashboard/customers", label: "Clientes", icon: Users },
  { href: "/dashboard/transactions", label: "Transações", icon: ReceiptText },
  { href: "/dashboard/reports", label: "Relatórios", icon: BarChart3 },
];

const titleMap: Array<[string, string]> = [
  ["/dashboard/customers", "Clientes"],
  ["/dashboard/transactions", "Transações"],
  ["/dashboard/reports", "Relatórios"],
  ["/dashboard/settings", "Configurações"],
  ["/dashboard", "Início"],
];

type DashboardShellProps = {
  merchant: Merchant;
  customers: CustomerBalance[];
  children: React.ReactNode;
};

export function DashboardShell({ merchant, customers, children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [transactionOpen, setTransactionOpen] = useState(false);
  const [isSigningOut, startSignOut] = useTransition();

  const pageTitle = useMemo(() => {
    return titleMap.find(([prefix]) => pathname.startsWith(prefix))?.[1] ?? "FiadoControl";
  }, [pathname]);

  function handleSignOut() {
    startSignOut(async () => {
      const result = await signOutAction();
      toast.success(result.message);
      router.push(result.redirectTo ?? "/");
      router.refresh();
    });
  }

  return (
    <div className="min-h-screen bg-background text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-sidebar px-3 py-4 text-white lg:flex">
        <Link href="/dashboard" className="mb-6 flex items-center gap-3 rounded-2xl px-2">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-sm font-bold">
            FC
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">FiadoControl</p>
            <p className="truncate text-xs text-slate-400">{merchant.store_name}</p>
          </div>
        </Link>

        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
          {merchant.logo_url ? (
            <img
              src={merchant.logo_url}
              alt=""
              className="h-10 w-10 rounded-xl object-cover"
            />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-sm font-semibold">
              <Store className="h-5 w-5" />
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{merchant.store_name}</p>
            <p className="text-xs text-slate-400">Conta ativa</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-text transition hover:bg-white/10 hover:text-white",
                  active && "bg-primary text-white shadow-sm",
                )}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-white/10 pt-4">
          <Link
            href="/dashboard/settings"
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-text transition hover:bg-white/10 hover:text-white",
              pathname.startsWith("/dashboard/settings") && "bg-primary text-white",
            )}
          >
            <Settings className="h-5 w-5" />
            Configurações
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-text transition hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            <LogOut className="h-5 w-5" />
            {isSigningOut ? "Saindo..." : "Sair"}
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-background/90 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-slate-500 lg:hidden">{merchant.store_name}</p>
              <h1 className="text-[28px] font-bold leading-tight text-slate-950">{pageTitle}</h1>
            </div>
            <Button onClick={() => setTransactionOpen(true)} className="hidden sm:inline-flex">
              <Plus className="h-4 w-4" />
              Nova Transação
            </Button>
            <Button
              size="icon"
              onClick={() => setTransactionOpen(true)}
              className="sm:hidden"
              aria-label="Nova transação"
              title="Nova transação"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-5 pb-24 sm:px-6 lg:px-8 lg:pb-8">
          {children}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid h-16 grid-cols-5 border-t border-slate-200 bg-white px-2 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] lg:hidden">
        {[
          navItems[0],
          navItems[1],
          { href: "#quick", label: "Novo", icon: Plus },
          navItems[3],
          { href: "/dashboard/settings", label: "Perfil", icon: UserRound },
        ].map((item) => {
          const active =
            item.href !== "#quick" &&
            (item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href));
          const Icon = item.icon;

          if (item.href === "#quick") {
            return (
              <button
                key={item.href}
                type="button"
                className="flex flex-col items-center justify-center gap-1 text-xs font-medium text-primary"
                onClick={() => setTransactionOpen(true)}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-lg">
                  <Icon className="h-6 w-6" />
                </span>
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-500",
                active && "text-primary",
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="fixed bottom-20 right-4 z-30 hidden sm:block lg:hidden">
        <button
          type="button"
          className={buttonClassName({ size: "icon", className: "h-12 w-12 rounded-full" })}
          onClick={() => setTransactionOpen(true)}
          aria-label="Nova transação"
          title="Nova transação"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>

      <TransactionModal
        open={transactionOpen}
        onClose={() => setTransactionOpen(false)}
        customers={customers}
      />
    </div>
  );
}
