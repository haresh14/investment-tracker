import { format } from "date-fns";
import { NextResponse } from "next/server";

import { rebuildInstallments } from "@/lib/installment-generator";
import { createClient } from "@/lib/supabase/server";
import type { InvestmentLifecycleEventRow } from "@/lib/types";

export async function POST(
  request: Request,
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

  const { action } = (await request.json()) as {
    action: "pause" | "resume" | "close";
  };

  const today = format(new Date(), "yyyy-MM-dd");

  const { data: investment, error } = await supabase
    .from("investments")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const eventType =
    action === "pause" ? "PAUSE" : action === "resume" ? "RESUME" : "CLOSE";
  const nextStatus =
    action === "pause" ? "paused" : action === "resume" ? "active" : "closed";

  const { error: eventError } = await supabase.from("investment_lifecycle_events").insert({
    investment_id: id,
    type: eventType,
    effective_date: today
  });

  if (eventError) {
    return NextResponse.json({ error: eventError.message }, { status: 400 });
  }

  const { data: updatedInvestment, error: updateError } = await supabase
    .from("investments")
    .update({
      status: nextStatus,
      end_date: action === "close" ? today : investment.end_date
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  const { data: lifecycleEvents, error: lifecycleError } = await supabase
    .from("investment_lifecycle_events")
    .select("*")
    .eq("investment_id", id)
    .order("effective_date", { ascending: true });

  if (lifecycleError) {
    return NextResponse.json({ error: lifecycleError.message }, { status: 400 });
  }

  await rebuildInstallments(
    supabase,
    updatedInvestment,
    (lifecycleEvents ?? []) as InvestmentLifecycleEventRow[]
  );

  return NextResponse.json({ success: true, status: nextStatus });
}
