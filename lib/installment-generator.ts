import type { SupabaseClient } from "@supabase/supabase-js";

import { calculatePotentialInstallments } from "@/lib/calculations";
import type { InstallmentRow, InvestmentLifecycleEventRow, InvestmentRow } from "@/lib/types";

export async function ensureInstallmentsUpToDate(
  supabase: SupabaseClient,
  investment: InvestmentRow,
  lifecycleEvents: InvestmentLifecycleEventRow[] = []
) {
  const generatedInstallments = calculatePotentialInstallments(investment, lifecycleEvents);

  if (!generatedInstallments.length) {
    return [];
  }

  const { data, error } = await supabase
    .from("installments")
    .upsert(
      generatedInstallments.map((installment) => ({
        investment_id: investment.id,
        is_deleted: false,
        ...installment
      })),
      {
        onConflict: "investment_id,installment_number",
        ignoreDuplicates: true
      }
    )
    .select("*");

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function rebuildInstallments(
  supabase: SupabaseClient,
  investment: InvestmentRow,
  lifecycleEvents: InvestmentLifecycleEventRow[] = []
) {
  const generatedInstallments = calculatePotentialInstallments(investment, lifecycleEvents);

  const { data: existingInstallments, error: existingError } = await supabase
    .from("installments")
    .select("installment_number, is_deleted")
    .eq("investment_id", investment.id);

  if (existingError) {
    throw existingError;
  }

  const deletedInstallmentNumbers = new Set(
    ((existingInstallments ?? []) as Array<Pick<InstallmentRow, "installment_number" | "is_deleted">>)
      .filter((installment) => installment.is_deleted)
      .map((installment) => installment.installment_number)
  );
  const generatedNumbers = generatedInstallments.map((installment) => installment.installment_number);

  const { error: deleteError } = await supabase
    .from("installments")
    .delete()
    .eq("investment_id", investment.id)
    .not("installment_number", "in", `(${generatedNumbers.length ? generatedNumbers.join(",") : "0"})`);

  if (deleteError) {
    throw deleteError;
  }

  if (!generatedInstallments.length) {
    return [];
  }

  const { data, error } = await supabase
    .from("installments")
    .upsert(
      generatedInstallments.map((installment) => ({
        investment_id: investment.id,
        is_deleted: deletedInstallmentNumbers.has(installment.installment_number),
        ...installment
      })),
      {
        onConflict: "investment_id,installment_number",
        ignoreDuplicates: false
      }
    )
    .select("*");

  if (error) {
    throw error;
  }

  return data ?? [];
}
