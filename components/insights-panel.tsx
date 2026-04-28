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
    <div className="grid gap-4 md:grid-cols-3">
      {insights.map((insight) => {
        const Icon = iconMap[insight.tone];
        return (
          <div
            key={insight.title}
            className={cn(
              "rounded-2xl border p-5 shadow-sm",
              insight.tone === "success" && "border-emerald-100 bg-emerald-50/70",
              insight.tone === "warning" && "border-amber-100 bg-amber-50/70",
              insight.tone === "info" && "border-brand-100 bg-brand-50/70"
            )}
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-700">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">{insight.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{insight.description}</p>
          </div>
        );
      })}
    </div>
  );
}
