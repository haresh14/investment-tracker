import { redirect } from "next/navigation";

import {
  getDistributionData,
  getInvestedVsProjectedChartData,
  getMonthlyTrendData,
  getProjectedGrowthCurve,
  summarizeInvestment
} from "@/lib/calculations";
import { buildDashboardInsights, findBestPerformers, findMilestones } from "@/lib/insights";
import { createClient } from "@/lib/supabase/server";
import type {
  InstallmentRow,
  InvestmentRow,
  InvestmentSummary
} from "@/lib/types";

export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user;
}

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/signin");
  }
  return user;
}

export async function getDashboardData() {
  const user = await requireUser();
  const supabase = await createClient();

  const { data: investments, error } = await supabase
    .from("investments")
    .select("*, installments(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  const typedInvestments = ((investments ?? []) as Array<
    InvestmentRow & { installments: InstallmentRow[] }
  >).map((investment) => ({
    ...investment,
    installments: investment.installments ?? []
  }));

  const summaries: InvestmentSummary[] = typedInvestments.map((investment) =>
    summarizeInvestment(investment, investment.installments)
  );

  const totals = summaries.reduce(
    (acc, summary) => {
      acc.totalInvested += summary.investedAmount;
      acc.totalProjectedValue += summary.projectedValue;
      acc.totalProfit += summary.profit;
      acc.activeCount += summary.status === "active" ? 1 : 0;
      return acc;
    },
    {
      totalInvested: 0,
      totalProjectedValue: 0,
      totalProfit: 0,
      activeCount: 0,
      profitPercentage: 0
    }
  );

  const allInstallments = summaries.flatMap((investment) => investment.visibleInstallments);
  totals.profitPercentage = (totals.totalProfit / totals.totalInvested) * 100;

  return {
    user,
    investments: summaries,
    totals,
    insights: buildDashboardInsights(summaries),
    topPerformers: findBestPerformers(summaries, 5),
    monthlyTrend: getMonthlyTrendData(allInstallments),
    growthCurve: getProjectedGrowthCurve(summaries),
    investedVsProjected: getInvestedVsProjectedChartData(summaries),
    distribution: getDistributionData(summaries),
    milestones: findMilestones(summaries)
  };
}

export async function getInvestmentDetail(id: string) {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: investment, error } = await supabase
    .from("investments")
    .select("*, installments(*), transactions(*), lifecycle_events:investment_lifecycle_events(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    throw error;
  }

  const typedInvestment = investment as InvestmentRow & {
    installments: InstallmentRow[];
  };

  const summary = summarizeInvestment(typedInvestment, typedInvestment.installments ?? []);

  return {
    investment: typedInvestment,
    summary,
    monthlyTrend: getMonthlyTrendData(summary.visibleInstallments)
  };
}
