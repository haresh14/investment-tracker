import Link from "next/link";
import { ArrowUpRight, Landmark } from "lucide-react";

import { formatCurrency, formatPercent } from "@/lib/formatters";
import type { InvestmentSummary } from "@/lib/types";

export function InvestmentList({ investments }: { investments: InvestmentSummary[] }) {
  const sortedInvestments = investments.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr className="border-slate-100 text-xs uppercase tracking-[0.16em] text-slate-500">
              <th>Investment</th>
              <th>Source</th>
              <th>Installments</th>
              <th>Expected %</th>
              <th>Invested</th>
              <th>Projected</th>
              <th>Gain</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sortedInvestments.map((investment) => (
              <tr key={investment.id} className="hover">
                <td>
                  <div>
                    <p className="font-medium text-slate-900">{investment.name}</p>
                    <p className="text-xs text-slate-500">
                      {investment.account} • {investment.type.toUpperCase()} • {investment.status}
                    </p>
                  </div>
                </td>
                <td>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    <Landmark className="h-3.5 w-3.5" />
                    {investment.source}
                  </span>
                </td>
                <td>
                  <div>
                    <p className="font-medium text-emerald-600">
                      {investment.installmentCount}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatCurrency(investment.monthlyAmount)}
                    </p>
                  </div>
                </td>
                <td>
                  <span className="text-sm font-medium text-slate-700">
                    {formatPercent(investment.expected_annual_return)}
                  </span>
                </td>
                <td>{formatCurrency(investment.investedAmount)}</td>
                <td>{formatCurrency(investment.projectedValue)}</td>
                <td>
                  <div>
                    <p className="font-medium text-emerald-600">
                      {formatPercent(investment.gainPercent)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatCurrency(investment.profit)}
                    </p>
                  </div>
                </td>
                <td>
                  <Link
                    href={`/investments/${investment.id}`}
                    prefetch
                    className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 transition hover:text-brand-700"
                  >
                    View
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
