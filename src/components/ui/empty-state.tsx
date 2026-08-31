import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: LucideIcon;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-10 text-center">
      <div className="relative mb-4 h-20 w-24">
        <svg viewBox="0 0 96 80" className="h-full w-full" aria-hidden="true">
          <rect x="8" y="20" width="80" height="48" rx="14" fill="#E0E7FF" />
          <rect x="20" y="12" width="56" height="44" rx="12" fill="#FFFFFF" />
          <path d="M31 32h34M31 42h24" stroke="#1B4DFF" strokeWidth="4" strokeLinecap="round" />
          <circle cx="72" cy="56" r="10" fill="#10B981" />
        </svg>
        {Icon ? (
          <Icon className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 text-primary" />
        ) : null}
      </div>
      <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-slate-500">{description}</p>
      {actionLabel && onAction ? (
        <Button className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
