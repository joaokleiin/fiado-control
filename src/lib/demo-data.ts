import type {
  CustomerBalance,
  DashboardData,
  Merchant,
  TransactionWithCustomer,
} from "@/lib/types";
import { getCustomerStatus } from "@/lib/status";
import { getMonthKey, monthLabel } from "@/lib/format";

export const demoMerchant: Merchant = {
  id: "demo-merchant",
  store_name: "Mercadinho Boa Vista",
  phone: "11987654321",
  logo_url: null,
  created_at: "2026-01-08T09:00:00.000Z",
};

export const demoCustomers: CustomerBalance[] = [
  {
    id: "ana",
    merchant_id: demoMerchant.id,
    name: "Ana Paula",
    phone: "11982345678",
    credit_limit: 250,
    notes: "Prefere receber cobrança no começo do mês.",
    is_active: true,
    total_debit: 320,
    total_payment: 140,
    balance: 180,
    created_at: "2026-02-12T10:00:00.000Z",
  },
  {
    id: "carlos",
    merchant_id: demoMerchant.id,
    name: "Carlos Souza",
    phone: "11973451234",
    credit_limit: 100,
    notes: null,
    is_active: true,
    total_debit: 168,
    total_payment: 42,
    balance: 126,
    created_at: "2026-03-05T11:00:00.000Z",
  },
  {
    id: "maria",
    merchant_id: demoMerchant.id,
    name: "Maria Oliveira",
    phone: "11991231234",
    credit_limit: 0,
    notes: null,
    is_active: true,
    total_debit: 92.5,
    total_payment: 92.5,
    balance: 0,
    created_at: "2026-01-24T13:10:00.000Z",
  },
  {
    id: "joao",
    merchant_id: demoMerchant.id,
    name: "João Batista",
    phone: "11966112233",
    credit_limit: 400,
    notes: "Cliente antigo do bairro.",
    is_active: true,
    total_debit: 230,
    total_payment: 25,
    balance: 205,
    created_at: "2026-04-15T08:30:00.000Z",
  },
];

export const demoTransactions: TransactionWithCustomer[] = [
  {
    id: "t1",
    merchant_id: demoMerchant.id,
    customer_id: "ana",
    customer_name: "Ana Paula",
    customer_phone: "11982345678",
    type: "debit",
    amount: 37.9,
    description: "pão, leite e frios",
    due_date: "2026-07-25",
    created_at: "2026-07-20T11:20:00.000Z",
  },
  {
    id: "t2",
    merchant_id: demoMerchant.id,
    customer_id: "maria",
    customer_name: "Maria Oliveira",
    customer_phone: "11991231234",
    type: "payment",
    amount: 50,
    description: "Pix",
    due_date: null,
    created_at: "2026-07-19T17:10:00.000Z",
  },
  {
    id: "t3",
    merchant_id: demoMerchant.id,
    customer_id: "carlos",
    customer_name: "Carlos Souza",
    customer_phone: "11973451234",
    type: "debit",
    amount: 58.4,
    description: "carnes e carvão",
    due_date: "2026-07-28",
    created_at: "2026-07-18T18:42:00.000Z",
  },
  {
    id: "t4",
    merchant_id: demoMerchant.id,
    customer_id: "joao",
    customer_name: "João Batista",
    customer_phone: "11966112233",
    type: "payment",
    amount: 25,
    description: "Dinheiro",
    due_date: null,
    created_at: "2026-07-17T09:30:00.000Z",
  },
  {
    id: "t5",
    merchant_id: demoMerchant.id,
    customer_id: "ana",
    customer_name: "Ana Paula",
    customer_phone: "11982345678",
    type: "debit",
    amount: 76.2,
    description: "compras da semana",
    due_date: "2026-07-22",
    created_at: "2026-07-15T14:05:00.000Z",
  },
  {
    id: "t6",
    merchant_id: demoMerchant.id,
    customer_id: "carlos",
    customer_name: "Carlos Souza",
    customer_phone: "11973451234",
    type: "payment",
    amount: 42,
    description: "Pix",
    due_date: null,
    created_at: "2026-07-11T10:17:00.000Z",
  },
  {
    id: "t7",
    merchant_id: demoMerchant.id,
    customer_id: "joao",
    customer_name: "João Batista",
    customer_phone: "11966112233",
    type: "debit",
    amount: 114.5,
    description: "bebidas",
    due_date: "2026-07-26",
    created_at: "2026-07-09T19:10:00.000Z",
  },
  {
    id: "t8",
    merchant_id: demoMerchant.id,
    customer_id: "ana",
    customer_name: "Ana Paula",
    customer_phone: "11982345678",
    type: "payment",
    amount: 40,
    description: "Pix",
    due_date: null,
    created_at: "2026-07-07T13:08:00.000Z",
  },
];

export function buildDemoDashboardData(): DashboardData {
  const movementMap = new Map<string, { month: string; debit: number; payment: number }>();
  const base = new Date("2026-07-01T00:00:00.000Z");

  for (let index = 5; index >= 0; index -= 1) {
    const date = new Date(base);
    date.setMonth(base.getMonth() - index);
    movementMap.set(getMonthKey(date), {
      month: monthLabel(date),
      debit: 0,
      payment: 0,
    });
  }

  const sampleMonthly = [
    ["2026-02", 980, 620],
    ["2026-03", 1280, 710],
    ["2026-04", 1130, 790],
    ["2026-05", 1540, 860],
    ["2026-06", 1690, 1190],
    ["2026-07", 1450, 980],
  ] as const;

  sampleMonthly.forEach(([key, debit, payment]) => {
    const point = movementMap.get(key);
    if (point) {
      point.debit = debit;
      point.payment = payment;
    }
  });

  const statusCounts = demoCustomers.reduce(
    (acc, customer) => {
      const status = getCustomerStatus(customer);
      if (status === "em_dia") acc.onTime += 1;
      else if (status === "acima_limite") acc.overLimit += 1;
      else acc.withDebt += 1;
      return acc;
    },
    { onTime: 0, withDebt: 0, overLimit: 0 },
  );

  return {
    merchant: demoMerchant,
    customers: demoCustomers,
    transactions: demoTransactions,
    metrics: {
      openTotal: demoCustomers.reduce((sum, customer) => sum + Math.max(customer.balance, 0), 0),
      receivedThisMonth: demoTransactions
        .filter((transaction) => transaction.type === "payment")
        .reduce((sum, transaction) => sum + transaction.amount, 0),
      activeCustomers: demoCustomers.length,
      limitAlerts: demoCustomers.filter((customer) => {
        const limit = customer.credit_limit;
        return limit > 0 && customer.balance >= limit * 0.7;
      }).length,
    },
    movement: Array.from(movementMap.values()),
    customerStatus: [
      { name: "Em dia", value: statusCounts.onTime, color: "#10B981" },
      { name: "Com débito", value: statusCounts.withDebt, color: "#F59E0B" },
      { name: "Acima do limite", value: statusCounts.overLimit, color: "#EF4444" },
    ],
  };
}
