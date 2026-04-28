import { TrendingUp } from "lucide-react";

import { formatCompactCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  percentage,
  hint,
  tone = "default",
  format = "currency"
}: {
  label: string;
  value: number;
  percentage?: string;
  hint: string;
  tone?: "default" | "success";
  format?: "currency" | "number";
}) {
  return (
    <div className="metric-card">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">
            {format === "currency" ? formatCompactCurrency(value) : value} {percentage && (<span className="text-sm text-slate-500">({percentage}%)</span>)}
          </p>
        </div>
        <div
          className={cn(
            "rounded-2xl p-3",
            tone === "success" ? "bg-emerald-50 text-emerald-600" : "bg-brand-50 text-brand-600"
          )}
        >
          <TrendingUp className="h-5 w-5" />
        </div>
      </div>
      <p className="text-sm text-slate-500">{hint}</p>
    </div>
  );
}
