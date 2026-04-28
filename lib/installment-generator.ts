import type { SupabaseClient } from "@supabase/supabase-js";

import { calculatePotentialInstallments } from "@/lib/calculations";
import type { InvestmentLifecycleEventRow, InvestmentRow } from "@/lib/types";

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
  const { error: deleteError } = await supabase
    .from("installments")
    .delete()
    .eq("investment_id", investment.id);

  if (deleteError) {
    throw deleteError;
  }

  return ensureInstallmentsUpToDate(supabase, investment, lifecycleEvents);
}
