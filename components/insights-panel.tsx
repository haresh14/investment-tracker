import { AlertTriangle, Info, Sparkles } from "lucide-react";

import type { DashboardInsight } from "@/lib/types";
import { cn } from "@/lib/utils";

const iconMap = {
  success: Sparkles,
  warning: AlertTriangle,
  info: Info
};

export function InsightsPanel({ insights }: { insights: DashboardInsight[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {insights.map((insight) => {
        const Icon = iconMap[insight.tone];
        return (
          <div
            key={insight.title}
            className={cn(
              "rounded-2xl border p-4 shadow-sm",
              insight.tone === "success" && "border-emerald-100 bg-emerald-50/70",
              insight.tone === "warning" && "border-amber-100 bg-amber-50/70",
              insight.tone === "info" && "border-brand-100 bg-brand-50/70"
            )}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-700">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">{insight.title}</h3>
                <p className="mt-1 text-xs leading-5 text-slate-600">{insight.description}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
