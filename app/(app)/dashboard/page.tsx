import { AiAssistantCard } from "@/components/ai-assistant-card";
import { EmptyState } from "@/components/empty-state";
import { GrowthLineChart, DistributionChart, MonthlyTrendChart } from "@/components/dashboard-charts";
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

      <section className="section-shell p-6">
        <SectionHeading
          eyebrow="Smart insights"
          title="What your portfolio is telling you"
          description="A quick read on best performers, weaker positions, and where your momentum is building."
        />
        <InsightsPanel insights={data.insights} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <Card className="p-6">
          <SectionHeading
            eyebrow="Comparison"
            title="Invested vs projected by investment"
            description="Compare actual committed capital against the future value each plan is targeting."
          />
          <GrowthLineChart data={data.investedVsProjected} />
        </Card>
        <Card className="p-6">
          <SectionHeading
            eyebrow="Allocation"
            title="Investment distribution"
            description="See which funds currently carry the most weight in your portfolio."
          />
          <DistributionChart data={data.distribution} />
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-6">
          <SectionHeading
            eyebrow="Monthly trend"
            title="Contribution pattern"
            description="Track how your cash deployment has built up month by month."
          />
          <MonthlyTrendChart data={data.monthlyTrend} />
        </Card>
        <Card className="p-6">
          <SectionHeading
            eyebrow="Growth curve"
            title="Projected portfolio runway"
            description="A month-by-month view of portfolio growth using your current assumptions."
          />
          <GrowthLineChart data={data.growthCurve} />
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-6">
          <SectionHeading
            eyebrow="Top 5"
            title="High performing investments"
            description="Ranked by projected gain percentage."
          />
          <div className="space-y-3">
            {data.topPerformers.map((investment, index) => (
              <div
                key={investment.id}
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4"
              >
                <div>
                  <p className="text-sm text-slate-500">#{index + 1}</p>
                  <p className="font-medium text-slate-900">{investment.name}</p>
                  <p className="text-xs text-slate-500">{investment.source}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-emerald-600">
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
        <div className="space-y-6">
          <AiAssistantCard />
          <Card className="p-6">
            <SectionHeading
              eyebrow="Milestones"
              title="Projected wins"
              description="Targets your current plans are already set to cross."
            />
            <div className="space-y-3">
              {data.milestones.map((item) => (
                <div
                  key={`${item.investmentId}-${item.target}`}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  <p className="font-medium text-slate-900">{item.investmentName}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Reaches {formatCurrency(item.target)} by {item.monthLabel}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
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
    </div>
  );
}
