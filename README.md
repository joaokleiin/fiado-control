# FiadoControl

SaaS de gestão de fiado para pequenos comércios brasileiros.

## Setup

1. Clone o repositório e instale as dependências:
   ```bash
   npm install
   ```

2. Configure as variáveis de ambiente:
   ```bash
   cp .env.local.example .env.local
   # Edite .env.local com suas chaves do Supabase
   ```

3. Execute o SQL em `supabase/schema.sql` no SQL Editor do seu projeto Supabase.

4. Rode o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Stack
- Next.js 16 + TypeScript
- Supabase (auth + banco + storage)
- Tailwind CSS v4 + shadcn/ui
- Recharts, React Hook Form, Zod, Sonner

## Estrutura de Pastas
```text
src/
  app/
    (auth)/          # login, register, onboarding
    dashboard/       # área protegida
      customers/     # lista e perfil de clientes
      transactions/  # histórico de transações
      reports/       # relatórios e gráficos
      settings/      # configurações do comércio
  components/
    ui/              # componentes base reutilizáveis
    dashboard/       # shell, gráficos, métricas
    customers/       # componentes de clientes
    transactions/    # componentes de transações
    reports/         # componentes de relatórios
    settings/        # componentes de configurações
  lib/
    supabase/        # clientes e queries
    actions/         # server actions
    *.ts             # tipos, helpers, validações
```
