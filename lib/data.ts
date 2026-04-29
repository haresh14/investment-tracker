import { redirect } from "next/navigation";

import {
  getDistributionData,
  getMonthlyTrendData,
  summarizeInvestment
} from "@/lib/calculations";
import { findBestPerformers } from "@/lib/insights";
import { createClient } from "@/lib/supabase/server";
import type {
  DashboardFilterOptions,
  DashboardFilterState,
  InstallmentRow,
  InvestmentRow,
  InvestmentSummary
} from "@/lib/types";

const INVESTMENT_BASE_SELECT = `
  id,
  user_id,
  name,
  source,
  account,
  type,
  monthly_amount,
  lump_sum_amount,
  expected_annual_return,
  start_date,
  end_date,
  sip_day,
  status,
  lock_in_months,
  created_at
`;

const INSTALLMENT_SELECT = `
  id,
  investment_id,
  installment_number,
  installment_date,
  amount,
  months_invested,
  future_value,
  gain,
  is_deleted,
  created_at
`;

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

function matchesDashboardFilters(
  investment: InvestmentSummary,
  filters: DashboardFilterState
) {
  if (filters.source && investment.source !== filters.source) {
    return false;
  }

  if (filters.account && investment.account !== filters.account) {
    return false;
  }

  return true;
}

function getDashboardFilterOptions(investments: InvestmentSummary[]): DashboardFilterOptions {
  const sourceOptions = Array.from(new Set(investments.map((investment) => investment.source))).sort(
    (a, b) => a.localeCompare(b)
  );
  const accountOptions = Array.from(
    new Set(investments.map((investment) => investment.account))
  ).sort((a, b) => a.localeCompare(b));

  return { sourceOptions, accountOptions };
}

export async function getDashboardData(filters: DashboardFilterState = {}) {
  const user = await requireUser();
  const supabase = await createClient();

  const { data: investments, error } = await supabase
    .from("investments")
    .select(`${INVESTMENT_BASE_SELECT}, installments(${INSTALLMENT_SELECT})`)
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
  const filterOptions = getDashboardFilterOptions(summaries);
  const filteredSummaries = summaries.filter((investment) =>
    matchesDashboardFilters(investment, filters)
  );

  const totals = filteredSummaries.reduce(
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

  const allInstallments = filteredSummaries.flatMap((investment) => investment.visibleInstallments);
  totals.profitPercentage =
    totals.totalInvested > 0 ? (totals.totalProfit / totals.totalInvested) * 100 : 0;

  return {
    user,
    investments: filteredSummaries,
    totals,
    topPerformers: findBestPerformers(filteredSummaries, 5),
    monthlyTrend: getMonthlyTrendData(allInstallments),
    distribution: getDistributionData(filteredSummaries),
    filterOptions,
    filters,
    totalInvestmentCount: summaries.length
  };
}

export async function getInvestmentDetail(id: string) {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: investment, error } = await supabase
    .from("investments")
    .select(`${INVESTMENT_BASE_SELECT}, installments(${INSTALLMENT_SELECT})`)
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

export async function getInvestmentForEdit(id: string) {
  const user = await requireUser();
  const supabase = await createClient();

  const { data: investment, error } = await supabase
    .from("investments")
    .select(INVESTMENT_BASE_SELECT)
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    throw error;
  }

  return investment as InvestmentRow;
}
