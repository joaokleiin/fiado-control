import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "warning"
  | "ghost"
  | "outline";

type ButtonSize = "sm" | "md" | "lg" | "icon";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary-dark focus:ring-blue-500/20",
  secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-500/20",
  danger: "bg-danger text-white hover:bg-red-600 focus:ring-red-500/20",
  success: "bg-success text-white hover:bg-emerald-600 focus:ring-emerald-500/20",
  warning: "bg-warning text-white hover:bg-amber-600 focus:ring-amber-500/20",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-500/20",
  outline:
    "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 focus:ring-blue-500/20",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 rounded-lg px-3 text-xs",
  md: "h-11 rounded-xl px-5 text-sm",
  lg: "h-12 rounded-xl px-6 text-base",
  icon: "h-10 w-10 rounded-xl p-0",
};

export function buttonClassName({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(
    "inline-flex shrink-0 items-center justify-center gap-2 font-medium shadow-sm transition focus:outline-none focus:ring-2 disabled:pointer-events-none disabled:opacity-50",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );
}

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={buttonClassName({ variant, size, className })}
      {...props}
    />
  ),
);

Button.displayName = "Button";
