-- =============================================
-- FiadoControl — Schema Completo do Supabase
-- Execute no SQL Editor do seu projeto Supabase
-- =============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1) Tabela de merchants
-- =============================================
CREATE TABLE IF NOT EXISTS public.merchants (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  store_name text NOT NULL DEFAULT 'Meu Comércio',
  phone text,
  logo_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- =============================================
-- 2) Tabela de clientes
-- =============================================
CREATE TABLE IF NOT EXISTS public.customers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  merchant_id uuid NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text,
  credit_limit numeric(12,2) NOT NULL DEFAULT 0,
  notes text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- =============================================
-- 3) Tabela de transações
-- =============================================
CREATE TABLE IF NOT EXISTS public.transactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  merchant_id uuid NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('debit', 'payment')),
  amount numeric(12,2) NOT NULL CHECK (amount >= 0),
  description text,
  due_date date,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- =============================================
-- 4) View para saldo dos clientes
-- =============================================
CREATE OR REPLACE VIEW public.customer_balances AS
SELECT
  c.id,
  c.merchant_id,
  c.name,
  c.phone,
  c.credit_limit,
  c.notes,
  c.is_active,
  c.created_at,
  COALESCE(SUM(CASE WHEN t.type = 'debit' THEN t.amount ELSE 0 END), 0) AS total_debit,
  COALESCE(SUM(CASE WHEN t.type = 'payment' THEN t.amount ELSE 0 END), 0) AS total_payment,
  COALESCE(SUM(CASE WHEN t.type = 'debit' THEN t.amount ELSE -t.amount END), 0) AS balance
FROM public.customers c
LEFT JOIN public.transactions t ON t.customer_id = c.id
GROUP BY
  c.id,
  c.merchant_id,
  c.name,
  c.phone,
  c.credit_limit,
  c.notes,
  c.is_active,
  c.created_at;

-- =============================================
-- 5) Trigger para criar merchant após signup
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.merchants (id, store_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'store_name', 'Meu Comércio')
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE PROCEDURE public.handle_new_user();

-- =============================================
-- 6) Habilitar RLS
-- =============================================
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 7) Policies de segurança
-- =============================================
CREATE POLICY IF NOT EXISTS "Merchants are viewable by owner"
  ON public.merchants
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Merchants can be updated by owner"
  ON public.merchants
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Merchants can be inserted by owner"
  ON public.merchants
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Customers are viewable by merchant owner"
  ON public.customers
  FOR SELECT
  USING (merchant_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Customers can be inserted by merchant owner"
  ON public.customers
  FOR INSERT
  WITH CHECK (merchant_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Customers can be updated by merchant owner"
  ON public.customers
  FOR UPDATE
  USING (merchant_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Customers can be deleted by merchant owner"
  ON public.customers
  FOR DELETE
  USING (merchant_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Transactions are viewable by merchant owner"
  ON public.transactions
  FOR SELECT
  USING (merchant_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Transactions can be inserted by merchant owner"
  ON public.transactions
  FOR INSERT
  WITH CHECK (merchant_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Transactions can be updated by merchant owner"
  ON public.transactions
  FOR UPDATE
  USING (merchant_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Transactions can be deleted by merchant owner"
  ON public.transactions
  FOR DELETE
  USING (merchant_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Customer balances are viewable by merchant owner"
  ON public.customer_balances
  FOR SELECT
  USING (merchant_id = auth.uid());
