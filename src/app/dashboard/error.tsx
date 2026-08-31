"use client";

import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="max-w-md rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Não foi possível carregar</h2>
        <p className="mt-2 text-sm text-slate-500">
          {error.message || "Ocorreu um erro ao buscar os dados do painel."}
        </p>
        <Button className="mt-5" onClick={reset}>
          Tentar novamente
        </Button>
      </div>
    </div>
  );
}
