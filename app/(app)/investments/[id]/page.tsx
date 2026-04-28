import Link from "next/link";
import { ArrowLeft, Edit3 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/section-heading";
import { MonthlyTrendChart } from "@/components/dashboard-charts";
import { DeleteInvestmentButton } from "@/components/delete-investment-button";
import { InstallmentSyncIndicator } from "@/components/installment-sync-indicator";
import { InstallmentLedger } from "@/components/installment-ledger";
import { InvestmentLifecycleActions } from "@/components/investment-lifecycle-actions";
import { getInvestmentDetail } from "@/lib/data";
import { formatCurrency, formatDateDisplay, formatPercent } from "@/lib/formatters";

export default async function InvestmentDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { investment, summary, monthlyTrend } = await getInvestmentDetail(id);

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
            Investment detail
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">{investment.name}</h1>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
              {investment.source}
            </span>
            <span className="rounded-full bg-brand-50 px-3 py-1 text-sm text-brand-700">
              {investment.type.toUpperCase()}
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-700">
              {investment.status}
            </span>
            {investment.end_date ? (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                Ends {formatDateDisplay(investment.end_date)}
              </span>
            ) : null}
          </div>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/investments/${investment.id}/edit`}>
              <Edit3 className="h-4 w-4" />
              Edit
            </Link>
          </Button>
          {investment.type === "sip" ? (
            <InvestmentLifecycleActions id={investment.id} status={investment.status} />
          ) : null}
          <DeleteInvestmentButton id={investment.id} />
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-slate-500">Total invested</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">
            {formatCurrency(summary.investedAmount)}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-slate-500">Projected value</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">
            {formatCurrency(summary.projectedValue)}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-slate-500">Projected gain</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-600">
            {formatCurrency(summary.profit)}
          </p>
          <p className="mt-1 text-xs text-slate-500">{formatPercent(summary.gainPercent)}</p>
        </Card>
      </section>

      <section>
        <Card className="p-6">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
              Installments
            </p>
            <div className="mt-2 flex flex-row gap-3 md:items-center">
              <h2 className="text-xl font-semibold text-slate-950">Contribution ledger</h2>
              <InstallmentSyncIndicator
                investmentId={investment.id}
                className="flex-1 mt-0 max-w-[28rem]"
              />
            </div>
            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              Missing installments are generated lazily when you open this view.
            </p>
          </div>
          <InstallmentLedger installments={summary.visibleInstallments} />
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
        <Card className="p-6">
          <SectionHeading
            eyebrow="Growth"
            title="Installment trend"
            description="See how contributions have accumulated over time for this investment."
          />
          <MonthlyTrendChart data={monthlyTrend} />
        </Card>

        <Card className="p-6">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Phase 2 lock-in</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {investment.lock_in_months ?? 0} months
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Locked/withdrawable splits can plug into this model later without schema churn.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Transactions-ready</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">Withdrawals planned</p>
              <p className="mt-1 text-sm text-slate-500">
                The future-proof transactions table is ready for INVEST and WITHDRAWAL flows.
              </p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
