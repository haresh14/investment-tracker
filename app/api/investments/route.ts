import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { ensureInstallmentsUpToDate } from "@/lib/installment-generator";
import { investmentSchema } from "@/lib/validations";

export async function POST(request: Request) {
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

    const payload = {
      ...values,
      end_date: values.end_date || null,
      monthly_amount: values.type === "sip" ? values.monthly_amount : null,
      lump_sum_amount: values.type === "lumpsum" ? values.lump_sum_amount : null,
      sip_day: values.type === "sip" ? values.sip_day : null,
      status: "active",
      user_id: user.id
    };

    const { data, error } = await supabase
      .from("investments")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    await ensureInstallmentsUpToDate(supabase, data, []);

    return NextResponse.json({ investment: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create investment" },
      { status: 400 }
    );
  }
}
