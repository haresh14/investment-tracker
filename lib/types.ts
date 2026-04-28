export type InvestmentType = "sip" | "lumpsum";
export type TransactionType = "INVEST" | "WITHDRAWAL";
export type InvestmentStatus = "active" | "paused" | "closed";
export type LifecycleEventType = "PAUSE" | "RESUME" | "CLOSE";

export type InvestmentRow = {
  id: string;
  user_id: string;
  name: string;
  source: string;
  type: InvestmentType;
  monthly_amount: number | null;
  lump_sum_amount: number | null;
  expected_annual_return: number;
  start_date: string;
  end_date: string | null;
  sip_day: number | null;
  status: InvestmentStatus;
  lock_in_months: number | null;
  created_at: string;
};

export type InstallmentRow = {
  id: string;
  investment_id: string;
  installment_number: number;
  installment_date: string;
  amount: number;
  months_invested: number;
  future_value: number;
  gain: number;
  is_deleted: boolean;
  created_at: string;
};

export type TransactionRow = {
  id: string;
  investment_id: string;
  type: TransactionType;
  amount: number;
  date: string;
};

export type InvestmentLifecycleEventRow = {
  id: string;
  investment_id: string;
  type: LifecycleEventType;
  effective_date: string;
  created_at: string;
};

export type InvestmentWithInstallments = InvestmentRow & {
  installments: InstallmentRow[];
  lifecycle_events?: InvestmentLifecycleEventRow[];
};

export type InvestmentSummary = InvestmentRow & {
  investedAmount: number;
  projectedValue: number;
  profit: number;
  gainPercent: number;
  installmentCount: number;
  nextMilestoneValue: number | null;
  sourceLabel: string;
  visibleInstallments: InstallmentRow[];
};

export type DashboardTotals = {
  totalInvested: number;
  totalProjectedValue: number;
  totalProfit: number;
  activeCount: number;
};

export type DashboardInsight = {
  title: string;
  description: string;
  tone: "success" | "warning" | "info";
};

export type ChartPoint = {
  label: string;
  invested: number;
  projected: number;
};

export type DistributionPoint = {
  name: string;
  value: number;
};

export type MonthlyTrendPoint = {
  month: string;
  invested: number;
};

export type Milestone = {
  investmentId: string;
  investmentName: string;
  target: number;
  monthLabel: string;
};
