import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type MetricCardProps = {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  tone: "danger" | "success" | "primary" | "warning";
};

const toneMap: Record<MetricCardProps["tone"], string> = {
  danger: "bg-red-50 text-danger",
  success: "bg-emerald-50 text-success",
  primary: "bg-blue-50 text-primary",
  warning: "bg-amber-50 text-warning",
};

export function MetricCard({ title, value, subtitle, icon: Icon, tone }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="mt-3 text-2xl font-bold text-slate-950">{value}</p>
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          </div>
          <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl", toneMap[tone])}>
            <Icon className="h-5 w-5" />
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
