import { cn } from "@/lib/utils";

type FieldProps = {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
};

export function Field({ label, error, children, className }: FieldProps) {
  return (
    <label className={cn("block space-y-1.5", className)}>
      <span className="text-xs font-medium uppercase tracking-normal text-slate-500">
        {label}
      </span>
      {children}
      {error ? <span className="block text-xs font-medium text-danger">{error}</span> : null}
    </label>
  );
}
