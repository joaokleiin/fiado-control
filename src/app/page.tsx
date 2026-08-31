import Link from "next/link";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  CreditCard,
  Menu,
  MessageCircle,
  NotebookTabs,
  ShieldCheck,
  Smartphone,
  TrendingDown,
  Users,
  WalletCards,
} from "lucide-react";
import { buttonClassName } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const painPoints = [
  {
    icon: NotebookTabs,
    title: "Perdi o caderninho",
    text: "Sem rastreabilidade de quem deve e quando pagou. O controle fica preso ao papel e à memória.",
  },
  {
    icon: Users,
    title: "Não sei quem está devendo",
    text: "Saldo por cliente, histórico e alertas ficam espalhados. Tudo vira improviso no balcão.",
  },
  {
    icon: TrendingDown,
    title: "Deixo de ganhar dinheiro",
    text: "Sem lembrete e sem cobrança organizada, clientes esquecem de pagar e você perde receita.",
  },
];

const features = [
  {
    icon: BarChart3,
    title: "Gráficos de inadimplência",
    text: "Veja rapidamente quem está em atraso, quem está em dia e quanto está em aberto.",
  },
  {
    icon: CreditCard,
    title: "Limite de crédito por cliente",
    text: "Defina limites, acompanhe o saldo e receba alertas antes de ultrapassar o combinado.",
  },
  {
    icon: MessageCircle,
    title: "Cobrar pelo WhatsApp",
    text: "Abra uma conversa com mensagem pronta e o valor correto, sem perder tempo.",
  },
  {
    icon: Smartphone,
    title: "Funciona na palma da mão",
    text: "Cadastre clientes, lance fiado e registre pagamentos diretamente do celular.",
  },
];

const testimonials = [
  {
    initials: "MS",
    color: "bg-primary",
    quote: "Substituí meu caderno por esse sistema e meus recebimentos aumentaram 30%. Os clientes adoram receber a cobrança no WhatsApp!",
    name: "Maria Silva",
    business: "Dona de mercadinho",
  },
  {
    initials: "JA",
    color: "bg-success",
    quote: "Fácil de usar e muito prático. Agora consigo controlar melhor os clientes que pagam mensalmente.",
    name: "João Antônio",
    business: "Dono de barbearia",
  },
  {
    initials: "SS",
    color: "bg-warning",
    quote: "Antes eu anotava tudo no caderno e sempre perdia. Com o FiadoControl, tenho tudo organizado e nunca mais perco dinheiro.",
    name: "Seu Sebastião",
    business: "Proprietário de bar",
  },
];

const pricingFeatures = [
  "Clientes e transações ilimitados",
  "Relatórios e gráficos em tempo real",
  "Cobrança via WhatsApp",
  "Suporte por email",
];

function HeroMockup() {
  return (
    <div className="mx-auto flex max-w-xl justify-center">
      <div className="relative w-full max-w-[420px] rounded-[32px] border border-slate-200 bg-slate-900 p-3 shadow-[0_30px_90px_rgba(27,77,255,0.22)]">
        <div className="rounded-[24px] bg-white p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
            <div>
              <p className="text-sm font-semibold text-slate-900">FiadoControl</p>
              <p className="text-xs text-slate-500">Resumo do dia</p>
            </div>
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
              +12% hoje
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl bg-blue-50 p-4">
              <p className="text-sm font-medium text-primary">Em aberto</p>
              <p className="mt-3 text-3xl font-bold text-slate-950">R$ 4.820</p>
              <p className="mt-2 text-sm text-slate-600">3 clientes com saldo acima do limite</p>
            </div>
            <div className="space-y-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-3">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Recebido</p>
                <p className="mt-2 text-xl font-semibold text-success">R$ 2.310</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-3">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Fiado</p>
                <p className="mt-2 text-xl font-semibold text-danger">R$ 1.980</p>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Clientes</p>
              <span className="text-xs text-slate-500">Hoje</span>
            </div>
            <div className="space-y-2">
              {["Ana Souza", "Carlos Lima", "Beatriz Rocha"].map((name, index) => (
                <div key={name} className="flex items-center justify-between rounded-xl bg-white px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-primary">
                      {name.charAt(0)}
                    </span>
                    <span className="text-sm text-slate-700">{name}</span>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${index === 0 ? "bg-danger/10 text-danger" : "bg-success/10 text-success"}`}>
                    {index === 0 ? "Em aberto" : "Pago"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="bg-background text-slate-950">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white">
              FC
            </span>
            <span className="text-lg font-semibold text-slate-900">FiadoControl</span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <Link href="#features" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
              Recursos
            </Link>
            <Link href="#testimonials" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
              Depoimentos
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
              Preço
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:inline-flex">
              Entrar
            </Link>
            <Link href="/register" className={buttonClassName({ size: "sm" })}>
              Começar grátis
            </Link>
            <button type="button" aria-label="Menu" className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 md:hidden">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </header>

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(27,77,255,0.08),_transparent_45%),linear-gradient(135deg,_#f4f6fa_0%,_#ffffff_100%)] pt-16">
        <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1.5 text-sm font-medium text-primary shadow-sm">
              <ShieldCheck className="h-4 w-4" />
              Controle seu fiado sem caderninho e sem bagunça
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Chega de caderninho. Controle o fiado do seu comércio em segundos.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Cadastre clientes, lance compras fiadas, registre pagamentos e cobre pelo WhatsApp com uma mensagem pronta.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className={buttonClassName({ size: "lg", className: "w-full sm:w-auto" })}>
                Começar grátis — 7 dias
              </Link>
              <Link href="/dashboard" className={buttonClassName({ size: "lg", variant: "outline", className: "w-full sm:w-auto" })}>
                Ver demonstração
              </Link>
            </div>
            <p className="mt-5 text-sm text-slate-500">Sem cartão de crédito · Cancele quando quiser</p>
          </div>

          <HeroMockup />
        </div>
      </section>

      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Dores</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950">O que costuma quebrar no controle de fiado</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {painPoints.map(({ icon: Icon, title, text }) => (
              <Card key={title} className="border border-slate-200 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-warning/10 text-warning">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-slate-950">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Recursos</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950">Tudo que o comércio precisa, sem complicar</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {features.map(({ icon: Icon, title, text }) => (
              <Card key={title} className="border border-slate-200 bg-white shadow-sm">
                <CardContent className="flex gap-4 p-8">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Depoimentos</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950">Quem usa recomenda</h2>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible">
            {testimonials.map((item) => (
              <Card key={item.name} className="min-w-[280px] border border-slate-200 bg-slate-50 shadow-sm md:min-w-0">
                <CardContent className="p-8">
                  <p className="text-lg font-semibold leading-8 text-slate-900">“{item.quote}”</p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${item.color} text-sm font-semibold text-white`}>
                      {item.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-950">{item.name}</p>
                      <p className="text-sm text-slate-500">{item.business}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-[linear-gradient(135deg,_rgba(27,77,255,0.08)_0%,_rgba(16,185,129,0.08)_100%)] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-3xl justify-center">
          <Card className="w-full max-w-2xl border border-slate-200 bg-white shadow-2xl">
            <CardContent className="p-8 sm:p-12">
              <div className="flex items-center justify-center rounded-full bg-primary/10 p-3 text-primary">
                <WalletCards className="h-6 w-6" />
              </div>
              <h2 className="mt-6 text-center text-3xl font-bold text-slate-950">Plano Gratuito</h2>
              <p className="mt-4 text-center text-lg text-slate-600">Comece com 7 dias de teste e veja se encaixa no seu fluxo.</p>
              <div className="mt-8 text-center">
                <p className="text-5xl font-bold text-primary">R$ 29,90</p>
                <p className="mt-2 text-sm text-slate-500">por mês · após o período de teste</p>
              </div>
              <div className="mt-8 space-y-3">
                {pricingFeatures.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    {feature}
                  </div>
                ))}
              </div>
              <Link href="/register" className={buttonClassName({ size: "lg", className: "mt-8 w-full" })}>
                Começar agora — 7 dias grátis
              </Link>
              <p className="mt-4 text-center text-xs text-slate-500">Sem cartão de crédito · Cancele quando quiser</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="bg-slate-900 px-4 py-12 text-slate-300 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-lg font-semibold text-white">FiadoControl</p>
            <p className="mt-3 text-sm leading-7 text-slate-400">Uma plataforma simples para organizar fiado, clientes e cobranças no dia a dia do comércio.</p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Produto</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="#features" className="transition hover:text-white">Recursos</Link></li>
              <li><Link href="#pricing" className="transition hover:text-white">Preço</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Empresa</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/register" className="transition hover:text-white">Começar</Link></li>
              <li><Link href="/login" className="transition hover:text-white">Entrar</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Contato</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="mailto:contato@fiadocontrol.com.br" className="transition hover:text-white">contato@fiadocontrol.com.br</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </main>
  );
}
