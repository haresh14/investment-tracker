import type { DashboardInsight, InvestmentSummary, Milestone } from "@/lib/types";

export function buildDashboardInsights(investments: InvestmentSummary[]): DashboardInsight[] {
  if (!investments.length) {
    return [
      {
        title: "Add your first investment",
        description: "Once you add a SIP or lumpsum, the dashboard will start surfacing momentum, allocation, and milestones.",
        tone: "info"
      }
    ];
  }

  const sortedByGain = [...investments].sort((a, b) => b.gainPercent - a.gainPercent);
  const best = sortedByGain[0];
  const lowest = sortedByGain.at(-1);
  const totalProjected = investments.reduce((sum, item) => sum + item.projectedValue, 0);

  return [
    {
      title: `${best.name} leads your book`,
      description: `${best.source} is currently your strongest projected performer at ${best.gainPercent.toFixed(1)}% gain.`,
      tone: "success"
    },
    {
      title: `${lowest?.name ?? "Your portfolio"} needs attention`,
      description: lowest
        ? `${lowest.name} has the lowest projected gain at ${lowest.gainPercent.toFixed(1)}%. It may be a good candidate to revisit assumptions.`
        : "Add more data to compare performance across funds.",
      tone: "warning"
    },
    {
      title: "Projection outlook",
      description: `At current assumptions, your portfolio is pacing toward ${Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        notation: "compact",
        maximumFractionDigits: 1
      }).format(totalProjected)} projected value.`,
      tone: "info"
    }
  ];
}

export function findBestPerformers(investments: InvestmentSummary[], limit = 5) {
  return [...investments].sort((a, b) => b.gainPercent - a.gainPercent).slice(0, limit);
}

export function findMilestones(investments: InvestmentSummary[]): Milestone[] {
  const milestones = [100000, 500000, 1000000, 2500000];

  return investments
    .flatMap((investment) =>
      milestones
        .filter((target) => investment.projectedValue >= target)
        .slice(0, 1)
        .map((target) => ({
          investmentId: investment.id,
          investmentName: investment.name,
          target,
          monthLabel: investment.end_date ? investment.end_date : "current projection"
        }))
    )
    .slice(0, 3);
}
