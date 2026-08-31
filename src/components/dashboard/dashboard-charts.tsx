"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import type {
  CustomerBalanceHistoryPoint,
  CustomerStatusPoint,
  MovementPoint,
} from "@/lib/types";

function CurrencyTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color?: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3 text-sm shadow-lg">
      <p className="mb-2 font-medium text-slate-950">{label}</p>
      {payload.map((item) => (
        <p key={item.name} className="text-slate-600">
          <span className="mr-2 inline-block h-2 w-2 rounded-full" style={{ background: item.color }} />
          {item.name}: <strong>{formatCurrency(item.value)}</strong>
        </p>
      ))}
    </div>
  );
}

export function DashboardCharts({
  movement,
  customerStatus,
}: {
  movement: MovementPoint[];
  customerStatus: CustomerStatusPoint[];
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Movimentação dos últimos 6 meses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={movement} margin={{ left: 0, right: 12, top: 12, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} tickFormatter={(value) => `R$ ${Number(value) / 1000}k`} />
                <Tooltip content={<CurrencyTooltip />} />
                <Legend verticalAlign="bottom" height={36} />
                <Line name="Fiado Lançado" type="monotone" dataKey="debit" stroke="#1B4DFF" strokeWidth={3} dot={{ r: 4 }} />
                <Line name="Recebido" type="monotone" dataKey="payment" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status dos Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid h-80 items-center gap-4 sm:grid-cols-[1fr_0.85fr] xl:grid-cols-1 2xl:grid-cols-[1fr_0.85fr]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={customerStatus} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={4}>
                  {customerStatus.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {customerStatus.map((item) => (
                <div key={item.name} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                  <span className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
                    {item.name}
                  </span>
                  <strong className="text-sm text-slate-950">{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function CustomerBalanceChart({ data }: { data: CustomerBalanceHistoryPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução do saldo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ left: 0, right: 12, top: 12, bottom: 8 }}>
              <defs>
                <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1B4DFF" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#1B4DFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} tickFormatter={(value) => `R$ ${value}`} />
              <Tooltip content={<CurrencyTooltip />} />
              <Area name="Saldo" type="monotone" dataKey="balance" stroke="#1B4DFF" strokeWidth={3} fill="url(#balanceFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function ReportsBarChart({ data }: { data: MovementPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fiado x Recebido</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ left: 0, right: 12, top: 12, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} tickFormatter={(value) => `R$ ${Number(value) / 1000}k`} />
              <Tooltip content={<CurrencyTooltip />} />
              <Legend verticalAlign="bottom" height={36} />
              <Bar name="Fiado" dataKey="debit" fill="#FCA5A5" radius={[8, 8, 0, 0]} />
              <Bar name="Recebido" dataKey="payment" fill="#6EE7B7" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
