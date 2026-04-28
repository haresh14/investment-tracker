"use client";

import { useMemo, useState } from "react";

import { formatCurrency, formatDateDisplay } from "@/lib/formatters";
import type { InstallmentRow } from "@/lib/types";
import { Button } from "@/components/ui/button";

const PAGE_SIZE_OPTIONS = [10, 25, 50];

export function InstallmentLedger({
  installments
}: {
  installments: InstallmentRow[];
}) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const sortedInstallments = useMemo(
    () =>
      [...installments].sort((a, b) => {
        const dateCompare = b.installment_date.localeCompare(a.installment_date);
        if (dateCompare !== 0) return dateCompare;
        return b.installment_number - a.installment_number;
      }),
    [installments]
  );

  const totalPages = Math.max(1, Math.ceil(sortedInstallments.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const paginated = sortedInstallments.slice(startIndex, startIndex + pageSize);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          Showing {paginated.length ? startIndex + 1 : 0}-
          {Math.min(startIndex + paginated.length, sortedInstallments.length)} of{" "}
          {sortedInstallments.length} installments
        </p>

        <label className="flex items-center gap-2 text-sm text-slate-500">
          <span>Per page</span>
          <select
            value={pageSize}
            onChange={(event) => {
              const nextPageSize = Number(event.target.value);
              setPageSize(nextPageSize);
              setPage(1);
            }}
            className="select select-sm rounded-xl border-slate-200 bg-white text-slate-700"
          >
            {PAGE_SIZE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr className="text-xs uppercase tracking-[0.16em] text-slate-500">
              <th>#</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Months invested</th>
              <th>Future value</th>
              <th>Gain</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((installment) => (
              <tr key={installment.id}>
                <td>{installment.installment_number}</td>
                <td>{formatDateDisplay(installment.installment_date)}</td>
                <td>{formatCurrency(Number(installment.amount))}</td>
                <td>{installment.months_invested}</td>
                <td>{formatCurrency(Number(installment.future_value))}</td>
                <td className="text-emerald-600">
                  {formatCurrency(Number(installment.gain))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          Page {safePage} of {totalPages}
        </p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={safePage === 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={safePage === totalPages}
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
