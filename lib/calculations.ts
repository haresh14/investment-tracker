import {
  addMonths,
  differenceInCalendarMonths,
  format,
  getDate,
  isAfter,
  lastDayOfMonth,
  parseISO,
  startOfDay
} from "date-fns";

import type {
  ChartPoint,
  DistributionPoint,
  InstallmentRow,
  InvestmentLifecycleEventRow,
  InvestmentRow,
  InvestmentSummary,
  MonthlyTrendPoint
} from "@/lib/types";

export function getMonthlyRate(annualRate: number) {
  return Math.pow(1 + annualRate / 100, 1 / 12) - 1;
}

export function clampSipDay(yearMonthDate: Date, requestedDay: number) {
  return Math.min(requestedDay, getDate(lastDayOfMonth(yearMonthDate)));
}

export function buildSipInstallmentDate(
  startDate: string,
  sipDay: number,
  installmentNumber: number
) {
  const base = parseISO(startDate);
  const firstMonthOffset = sipDay < getDate(base) ? 1 : 0;
  const targetMonth = addMonths(base, firstMonthOffset + installmentNumber - 1);
  const clampedDay = clampSipDay(targetMonth, sipDay);
  return new Date(targetMonth.getFullYear(), targetMonth.getMonth(), clampedDay);
}

export function calculateInstallmentProjection(
  amount: number,
  annualReturn: number,
  monthsInvested: number
) {
  const monthlyRate = getMonthlyRate(annualReturn);
  const futureValue = amount * Math.pow(1 + monthlyRate, Math.max(monthsInvested, 0));
  const gain = futureValue - amount;

  return { futureValue, gain };
}

function getProjectionCutoffDate(investment: InvestmentRow) {
  const today = startOfDay(new Date());
  const endDate = investment.end_date ? startOfDay(parseISO(investment.end_date)) : null;
  return endDate && isAfter(today, endDate) ? endDate : today;
}

function getLifecycleStateOnDate(
  events: InvestmentLifecycleEventRow[],
  targetDate: Date
): "active" | "paused" | "closed" {
  const ordered = [...events].sort((a, b) => a.effective_date.localeCompare(b.effective_date));
  let state: "active" | "paused" | "closed" = "active";

  for (const event of ordered) {
    const effectiveDate = startOfDay(parseISO(event.effective_date));
    if (isAfter(effectiveDate, targetDate)) {
      break;
    }

    if (event.type === "PAUSE") {
      state = "paused";
    } else if (event.type === "RESUME") {
      state = "active";
    } else if (event.type === "CLOSE") {
      state = "closed";
    }
  }

  return state;
}

export function getVisibleInstallments(installments: InstallmentRow[]) {
  return installments.filter(
    (installment) => Number(installment.amount) > 0 && !installment.is_deleted
  );
}

export function getProjectedMonthsForPreview(startDate: string, endDate?: string | null) {
  const cutoff = endDate ? parseISO(endDate) : new Date();
  const safeCutoff = startOfDay(cutoff);
  const safeStart = startOfDay(parseISO(startDate));

  if (isAfter(safeStart, safeCutoff)) {
    return 0;
  }

  return differenceInCalendarMonths(safeCutoff, safeStart) + 1;
}

export function calculatePotentialInstallments(
  investment: InvestmentRow,
  lifecycleEvents: InvestmentLifecycleEventRow[] = []
) {
  const cutoffDate = getProjectionCutoffDate(investment);

  if (investment.type !== "sip") {
    if (isAfter(startOfDay(parseISO(investment.start_date)), cutoffDate)) {
      return [];
    }

    const amount = Number(investment.lump_sum_amount ?? 0);
    const monthsInvested = getProjectedMonthsForPreview(
      investment.start_date,
      format(cutoffDate, "yyyy-MM-dd")
    );
    const { futureValue, gain } = calculateInstallmentProjection(
      amount,
      investment.expected_annual_return,
      monthsInvested
    );

    return [
      {
        installment_number: 1,
        installment_date: investment.start_date,
        amount,
        months_invested: monthsInvested,
        future_value: futureValue,
        gain
      }
    ];
  }

  const start = parseISO(investment.start_date);
  const amount = Number(investment.monthly_amount ?? 0);
  const sipDay = investment.sip_day ?? getDate(start);
  const generated = [];

  for (let installmentNumber = 1; ; installmentNumber += 1) {
    const installmentDate = buildSipInstallmentDate(investment.start_date, sipDay, installmentNumber);

    if (isAfter(installmentDate, cutoffDate)) {
      break;
    }

    const state = getLifecycleStateOnDate(lifecycleEvents, installmentDate);
    if (state === "closed") {
      break;
    }

    const installmentAmount = state === "paused" ? 0 : amount;
    const monthsInvested = installmentAmount > 0
      ? differenceInCalendarMonths(cutoffDate, installmentDate) + 1
      : 0;
    const { futureValue, gain } = calculateInstallmentProjection(
      installmentAmount,
      investment.expected_annual_return,
      monthsInvested
    );

    generated.push({
      installment_number: installmentNumber,
      installment_date: format(installmentDate, "yyyy-MM-dd"),
      amount: installmentAmount,
      months_invested: monthsInvested,
      future_value: futureValue,
      gain
    });
  }

  return generated;
}

export function summarizeInvestment(
  investment: InvestmentRow,
  installments: InstallmentRow[]
): InvestmentSummary {
  const visibleInstallments = getVisibleInstallments(installments);
  const investedAmount = visibleInstallments.reduce(
    (sum, installment) => sum + Number(installment.amount),
    0
  );
  const projectedValue = visibleInstallments.reduce(
    (sum, installment) => sum + Number(installment.future_value),
    0
  );
  const profit = projectedValue - investedAmount;
  const gainPercent = investedAmount > 0 ? (profit / investedAmount) * 100 : 0;

  return {
    ...investment,
    investedAmount,
    projectedValue,
    profit,
    gainPercent,
    installmentCount: visibleInstallments.length,
    nextMilestoneValue: findNextMilestone(projectedValue),
    sourceLabel: investment.source,
    visibleInstallments
  };
}

export function getInvestedVsProjectedChartData(
  investments: Array<{ name: string; investedAmount: number; projectedValue: number }>
): ChartPoint[] {
  return investments.map((investment) => ({
    label: investment.name,
    invested: Number(investment.investedAmount.toFixed(0)),
    projected: Number(investment.projectedValue.toFixed(0))
  }));
}

export function getDistributionData(
  investments: Array<{ name: string; investedAmount: number }>
): DistributionPoint[] {
  return investments
    .filter((investment) => investment.investedAmount > 0)
    .map((investment) => ({
      name: investment.name,
      value: Number(investment.investedAmount.toFixed(0))
    }));
}

export function getMonthlyTrendData(installments: InstallmentRow[]): MonthlyTrendPoint[] {
  const monthlyMap = new Map<string, number>();

  getVisibleInstallments(installments).forEach((installment) => {
    const monthKey = installment.installment_date.slice(0, 7);
    monthlyMap.set(monthKey, (monthlyMap.get(monthKey) ?? 0) + Number(installment.amount));
  });

  return Array.from(monthlyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, invested]) => ({
      month: format(parseISO(`${month}-01`), "MMM yy"),
      invested: Number(invested.toFixed(0))
    }));
}

export function getProjectedGrowthCurve(summaries: InvestmentSummary[]) {
  const entries = summaries.flatMap((summary) =>
    summary.visibleInstallments.map((installment) => ({
      date: installment.installment_date,
      amount: Number(installment.amount),
      projected: Number(installment.future_value)
    }))
  );

  const monthlyMap = new Map<string, { invested: number; projected: number }>();

  entries.forEach((entry) => {
    const monthKey = entry.date.slice(0, 7);
    const current = monthlyMap.get(monthKey) ?? { invested: 0, projected: 0 };
    monthlyMap.set(monthKey, {
      invested: current.invested + entry.amount,
      projected: current.projected + entry.projected
    });
  });

  let runningInvested = 0;
  let runningProjected = 0;

  return Array.from(monthlyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, values]) => {
      runningInvested += values.invested;
      runningProjected += values.projected;
      return {
        label: format(parseISO(`${month}-01`), "MMM yy"),
        invested: Number(runningInvested.toFixed(0)),
        projected: Number(runningProjected.toFixed(0))
      };
    });
}

export function findNextMilestone(projectedValue: number) {
  const milestones = [100000, 250000, 500000, 1000000, 2500000, 5000000];
  return milestones.find((milestone) => projectedValue < milestone) ?? null;
}
