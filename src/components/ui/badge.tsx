import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "default" | "success" | "danger" | "warning" | "muted" | "primary";

const toneClasses: Record<BadgeTone, string> = {
  default: "bg-slate-100 text-slate-700 ring-slate-200",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  danger: "bg-red-50 text-red-700 ring-red-100",
  warning: "bg-amber-50 text-amber-700 ring-amber-100",
  muted: "bg-gray-100 text-gray-600 ring-gray-200",
  primary: "bg-blue-50 text-blue-700 ring-blue-100",
};

export function Badge({
  className,
  tone = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
