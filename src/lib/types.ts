export type TransactionType = "debit" | "payment";

export type Merchant = {
  id: string;
  store_name: string;
  phone: string | null;
  logo_url: string | null;
  created_at: string;
};

export type Customer = {
  id: string;
  merchant_id: string;
  name: string;
  phone: string | null;
  credit_limit: number;
  notes: string | null;
  is_active: boolean;
  created_at: string;
};

export type CustomerBalance = {
  id: string;
  merchant_id: string;
  name: string;
  phone: string | null;
  credit_limit: number;
  notes?: string | null;
  is_active: boolean;
  total_debit: number;
  total_payment: number;
  balance: number;
  created_at?: string;
};

export type Transaction = {
  id: string;
  merchant_id: string;
  customer_id: string;
  type: TransactionType;
  amount: number;
  description: string | null;
  due_date: string | null;
  created_at: string;
};

export type TransactionWithCustomer = Transaction & {
  customer_name: string;
  customer_phone: string | null;
};

export type MovementPoint = {
  month: string;
  debit: number;
  payment: number;
};

export type CustomerStatusPoint = {
  name: string;
  value: number;
  color: string;
};

export type CustomerBalanceHistoryPoint = {
  date: string;
  balance: number;
};

export type DashboardData = {
  merchant: Merchant;
  customers: CustomerBalance[];
  transactions: TransactionWithCustomer[];
  metrics: {
    openTotal: number;
    receivedThisMonth: number;
    activeCustomers: number;
    limitAlerts: number;
  };
  movement: MovementPoint[];
  customerStatus: CustomerStatusPoint[];
};
