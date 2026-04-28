import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { ensureInstallmentsUpToDate } from "@/lib/installment-generator";
import type { InvestmentLifecycleEventRow } from "@/lib/types";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: investment, error } = await supabase
    .from("investments")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const { data: lifecycleEvents, error: lifecycleError } = await supabase
    .from("investment_lifecycle_events")
    .select("*")
    .eq("investment_id", id)
    .order("effective_date", { ascending: true });

  if (lifecycleError) {
    return NextResponse.json({ error: lifecycleError.message }, { status: 400 });
  }

  const generated = await ensureInstallmentsUpToDate(
    supabase,
    investment,
    (lifecycleEvents ?? []) as InvestmentLifecycleEventRow[]
  );
  return NextResponse.json({ generatedCount: generated.length });
}
