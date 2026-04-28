"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { SOURCE_OPTIONS } from "@/lib/constants";
import { getMonthlyRate, getProjectedMonthsForPreview } from "@/lib/calculations";
import type { InvestmentRow } from "@/lib/types";
import { investmentSchema, type InvestmentFormValues } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";

export function InvestmentForm({
  investment,
  cancelHref
}: {
  investment?: InvestmentRow;
  cancelHref: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const defaults = useMemo<InvestmentFormValues>(
    () => ({
      name: investment?.name ?? "",
      source: investment?.source ?? "Zerodha",
      type: investment?.type ?? "sip",
      monthly_amount: investment?.monthly_amount ?? 5000,
      lump_sum_amount: investment?.lump_sum_amount ?? 100000,
      expected_annual_return: investment?.expected_annual_return ?? 12,
      start_date: investment?.start_date ?? new Date().toISOString().slice(0, 10),
      end_date: investment?.end_date ?? "",
      sip_day: investment?.sip_day ?? 5,
      lock_in_months: investment?.lock_in_months ?? 0
    }),
    [investment]
  );

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors }
  } = useForm<InvestmentFormValues>({
    resolver: zodResolver(investmentSchema),
    defaultValues: defaults
  });

  const type = watch("type");
  const monthlyAmount = Number(watch("monthly_amount") ?? 0);
  const lumpSumAmount = Number(watch("lump_sum_amount") ?? 0);
  const annualReturn = Number(watch("expected_annual_return") ?? 0);
  const startDate = watch("start_date");
  const endDate = watch("end_date");
  const projectedMonths = startDate ? getProjectedMonthsForPreview(startDate, endDate || null) : 0;
  const principal = type === "sip" ? monthlyAmount * projectedMonths : lumpSumAmount;
  const monthlyRate = getMonthlyRate(annualReturn);
  const projected =
    type === "sip"
      ? Array.from({ length: projectedMonths }).reduce<number>((sum, _, index) => {
          const monthsInvested = projectedMonths - index;
          return sum + monthlyAmount * Math.pow(1 + monthlyRate, monthsInvested);
        }, 0)
      : lumpSumAmount * Math.pow(1 + monthlyRate, projectedMonths);

  async function onSubmit(values: InvestmentFormValues) {
    setLoading(true);

    try {
      const endpoint = investment ? `/api/investments/${investment.id}` : "/api/investments";
      const method = investment ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(values)
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Something went wrong");
      }

      toast.success(investment ? "Investment updated" : "Investment created");
      router.push(investment ? `/investments/${investment.id}` : "/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save investment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="section-shell p-6">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">Investment name</label>
          <Input {...register("name")} placeholder="Axis Bluechip Fund" />
          {errors.name && <p className="mt-2 text-sm text-error">{errors.name.message}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Source</label>
          <Controller
            control={control}
            name="source"
            render={({ field }) => (
              <select
                {...field}
                className="select h-11 w-full rounded-xl border-slate-200 bg-white text-sm"
              >
                {SOURCE_OPTIONS.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            )}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Type</label>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
                {[
                  { label: "SIP", value: "sip" },
                  { label: "Lumpsum", value: "lumpsum" }
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => field.onChange(item.value)}
                    className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                      field.value === item.value
                        ? "bg-white text-slate-950 shadow-sm"
                        : "text-slate-500"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          />
        </div>

        {type === "sip" ? (
          <>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Monthly amount</label>
              <Input {...register("monthly_amount")} type="number" min="0" />
              {errors.monthly_amount && (
                <p className="mt-2 text-sm text-error">{errors.monthly_amount.message}</p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">SIP day</label>
              <Input {...register("sip_day")} type="number" min="1" max="31" />
            </div>
          </>
        ) : (
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Lumpsum amount</label>
            <Input {...register("lump_sum_amount")} type="number" min="0" />
            {errors.lump_sum_amount && (
              <p className="mt-2 text-sm text-error">{errors.lump_sum_amount.message}</p>
            )}
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Expected annual return %
          </label>
          <Input {...register("expected_annual_return")} type="number" min="0" max="50" step="0.1" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Start date</label>
          <Controller
            control={control}
            name="start_date"
            render={({ field }) => (
              <DatePicker value={field.value} onChange={field.onChange} placeholder="Pick start date" />
            )}
          />
          {errors.start_date && (
            <p className="mt-2 text-sm text-error">{errors.start_date.message}</p>
          )}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            End date
          </label>
          <Controller
            control={control}
            name="end_date"
            render={({ field }) => (
              <DatePicker
                value={field.value}
                onChange={field.onChange}
                placeholder="Pick end date"
                allowClear
              />
            )}
          />
          <p className="mt-2 text-xs text-slate-500">
            Leave blank to keep generating installments until you pause or close the SIP.
          </p>
          {errors.end_date && <p className="mt-2 text-sm text-error">{errors.end_date.message}</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Lock-in months
          </label>
          <Input {...register("lock_in_months")} type="number" min="0" max="600" />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-brand-100 bg-brand-50/70 p-4">
        <p className="text-sm font-medium text-slate-800">Live projection preview</p>
        <p className="mt-2 text-2xl font-semibold text-slate-950">
          {new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
          }).format(Number.isFinite(projected) ? projected : 0)}
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Principal estimate:{" "}
          {new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
          }).format(Number.isFinite(principal) ? principal : 0)}
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Projection window: {projectedMonths} scheduled month{projectedMonths === 1 ? "" : "s"}
        </p>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.push(cancelHref)}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
          {investment ? "Save changes" : "Create investment"}
        </Button>
      </div>
    </form>
  );
}
