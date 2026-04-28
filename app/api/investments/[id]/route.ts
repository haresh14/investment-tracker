import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { rebuildInstallments } from "@/lib/installment-generator";
import type { InvestmentLifecycleEventRow } from "@/lib/types";
import { investmentSchema } from "@/lib/validations";

export async function PATCH(
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

  try {
    const json = await request.json();
    const values = investmentSchema.parse(json);

    const { data: lifecycleEvents, error: lifecycleError } = await supabase
      .from("investment_lifecycle_events")
      .select("*")
      .eq("investment_id", id)
      .order("effective_date", { ascending: true });

    if (lifecycleError) {
      throw lifecycleError;
    }

    const payload = {
      ...values,
      end_date: values.end_date || null,
      monthly_amount: values.type === "sip" ? values.monthly_amount : null,
      lump_sum_amount: values.type === "lumpsum" ? values.lump_sum_amount : null,
      sip_day: values.type === "sip" ? values.sip_day : null
    };

    const { data, error } = await supabase
      .from("investments")
      .update(payload)
      .eq("id", id)
      .eq("user_id", user.id)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    await rebuildInstallments(
      supabase,
      data,
      (lifecycleEvents ?? []) as InvestmentLifecycleEventRow[]
    );

    return NextResponse.json({ investment: data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update investment" },
      { status: 400 }
    );
  }
}

export async function DELETE(
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

  const { error } = await supabase
    .from("investments")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
