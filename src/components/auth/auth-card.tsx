import Link from "next/link";

type AuthCardProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <main className="grid min-h-screen bg-background px-4 py-8 lg:grid-cols-[1fr_0.95fr] lg:px-0 lg:py-0">
      <section className="flex items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <Link href="/" className="mb-8 inline-flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-base font-bold text-white">
              FC
            </span>
            <span className="text-lg font-semibold text-slate-950">FiadoControl</span>
          </Link>
          <div className="mb-6">
            <h1 className="text-[28px] font-bold leading-tight text-slate-950">{title}</h1>
            <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
          </div>
          {children}
          {footer ? <div className="mt-6 text-center text-sm text-slate-500">{footer}</div> : null}
        </div>
      </section>
      <section className="hidden min-h-screen bg-sidebar p-8 text-white lg:flex lg:items-center">
        <div className="mx-auto max-w-lg">
          <div className="mb-8 rounded-2xl border border-white/10 bg-white/10 p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300">Hoje no balcão</p>
                <p className="text-3xl font-bold">R$ 1.284,50</p>
              </div>
              <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-medium text-emerald-200">
                +18% recebido
              </span>
            </div>
            <div className="space-y-3">
              {["Ana Paula", "Carlos Souza", "João Batista"].map((name, index) => (
                <div
                  key={name}
                  className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-semibold text-primary">
                      {name.charAt(0)}
                    </span>
                    <span className="text-sm font-medium">{name}</span>
                  </div>
                  <span className="text-sm text-slate-200">
                    {index === 1 ? "No limite" : "Em aberto"}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <h2 className="text-3xl font-bold leading-tight">
            Menos caderninho, mais dinheiro entrando no caixa.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            Feito para comércio de bairro: rápido, direto e fácil de usar até no
            movimento do fim de tarde.
          </p>
        </div>
      </section>
    </main>
  );
}
