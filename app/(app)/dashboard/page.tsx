import { AiAssistantCard } from "@/components/ai-assistant-card";
import { EmptyState } from "@/components/empty-state";
import { DistributionChart, MonthlyTrendChart } from "@/components/dashboard-charts";
import { InsightsPanel } from "@/components/insights-panel";
import { InvestmentList } from "@/components/investment-list";
import { SectionHeading } from "@/components/section-heading";
import { StatCard } from "@/components/stat-card";
import { Card } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import { getDashboardData } from "@/lib/data";

export default async function DashboardPage() {
  const data = await getDashboardData();

  if (!data.investments.length) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6 pb-8">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total invested"
          value={data.totals.totalInvested}
          hint="Across all active SIP and lumpsum plans"
        />
        <StatCard
          label="Projected value"
          value={data.totals.totalProjectedValue}
          hint="Based on fixed expected return assumptions"
          tone="success"
        />
        <StatCard
          label="Projected profit"
          value={data.totals.totalProfit}
          percentage={data.totals.profitPercentage.toFixed(2)}
          hint="Installment-level compounding gain"
          tone="success"
        />
        <StatCard
          label="Active investments"
          value={data.totals.activeCount}
          hint="Funds and plans currently being tracked"
          format="number"
        />
      </section>

      <section>
        <div>
          <SectionHeading
            eyebrow="All investments"
            title="Portfolio table"
            description="Open any investment to sync installments, inspect projections, and review growth details."
          />
          <InvestmentList investments={data.investments} />
        </div>
      </section>

      <section>
        <Card className="p-5">
          <SectionHeading
            eyebrow="Smart insights"
            title="What your portfolio is telling you"
            description="A quick read on performance, weak spots, and momentum."
          />
          <InsightsPanel insights={data.insights} />
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="p-5">
          <SectionHeading
            eyebrow="Allocation"
            title="Investment distribution"
            description="See which funds currently carry the most weight in your portfolio."
          />
          <DistributionChart data={data.distribution} />
        </Card>
        <Card className="p-5">
          <SectionHeading
            eyebrow="Monthly trend"
            title="Contribution pattern"
            description="Track how your cash deployment has built up month by month."
          />
          <MonthlyTrendChart data={data.monthlyTrend} />
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="p-5">
          <SectionHeading
            eyebrow="Top 5"
            title="High performing investments"
            description="Ranked by projected gain percentage."
          />
          <div className="space-y-2.5">
            {data.topPerformers.map((investment, index) => (
              <div
                key={investment.id}
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                    #{index + 1}
                  </p>
                  <p className="truncate text-sm font-medium text-slate-900">{investment.name}</p>
                  <p className="text-xs text-slate-500">{investment.source}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-emerald-600">
                    {formatPercent(investment.gainPercent)}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatCurrency(investment.profit)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <AiAssistantCard />
    </div>
  );
}
