"use client";

import { useCallback, useState } from "react";
import Link from "next/link";

export default function DevLoginPage() {
  const [loading, setLoading] = useState(false);

  const handleEnterDemo = useCallback(() => {
    setLoading(true);
    const maxAge = 60 * 60 * 24 * 7;
    document.cookie = `fiado_demo=1; path=/; max-age=${maxAge}; SameSite=Lax`;
    window.setTimeout(() => {
      window.location.replace("/dashboard");
    }, 80);
  }, []);

  const handleClearDemo = useCallback(() => {
    document.cookie = "fiado_demo=; path=/; max-age=0; SameSite=Lax";
    window.location.reload();
  }, []);

  return (
    <main className="mx-auto max-w-2xl px-4 py-24">
      <h1 className="text-2xl font-bold">Login de Desenvolvimento (Demo)</h1>
      <p className="mt-4 text-sm text-slate-600">
        Use este botão para entrar no modo demo e testar todas as páginas sem precisar do Supabase.
      </p>
      <div className="mt-6 flex flex-col gap-3">
        <button
          type="button"
          onClick={handleEnterDemo}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white"
        >
          {loading ? "Entrando..." : "Entrar como Demo"}
        </button>

        <button
          onClick={handleClearDemo}
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm"
        >
          Limpar modo Demo
        </button>

        <div className="mt-4 text-sm text-slate-500">
          <p>Também é possível usar <Link href="/register" className="underline">/register</Link> para criar conta real, se desejar.</p>
        </div>
      </div>
    </main>
  );
}
