import { AlertTriangle, CheckCircle2, TrendingUp, Users } from "lucide-react";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { MetricCard } from "@/components/dashboard/metric-card";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { formatCurrency } from "@/lib/format";
import { getDashboardData } from "@/lib/data";

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total em Aberto"
          value={formatCurrency(data.metrics.openTotal)}
          subtitle="Total fiado ativo"
          icon={TrendingUp}
          tone="danger"
        />
        <MetricCard
          title="Recebido este mês"
          value={formatCurrency(data.metrics.receivedThisMonth)}
          subtitle="Mês atual"
          icon={CheckCircle2}
          tone="success"
        />
        <MetricCard
          title="Clientes ativos"
          value={String(data.metrics.activeCustomers)}
          subtitle="Cadastrados"
          icon={Users}
          tone="primary"
        />
        <MetricCard
          title="Alertas de limite"
          value={String(data.metrics.limitAlerts)}
          subtitle="Próximos ou acima do limite"
          icon={AlertTriangle}
          tone="warning"
        />
      </div>

      <DashboardCharts movement={data.movement} customerStatus={data.customerStatus} />
      <RecentTransactions transactions={data.transactions} />
    </div>
  );
}
