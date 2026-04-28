import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

async function getAuthorizedInvestment(id: string) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const { data: investment, error } = await supabase
    .from("investments")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    return { supabase, error: NextResponse.json({ error: error.message }, { status: 400 }) };
  }

  if (investment.type !== "sip") {
    return {
      supabase,
      error: NextResponse.json(
        { error: "Installment updates are only available for SIP investments." },
        { status: 400 }
      )
    };
  }

  return { supabase, investment, error: null };
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; installmentNumber: string }> }
) {
  const { id, installmentNumber } = await params;
  const parsedInstallmentNumber = Number(installmentNumber);

  if (!Number.isInteger(parsedInstallmentNumber) || parsedInstallmentNumber < 1) {
    return NextResponse.json({ error: "Invalid installment number." }, { status: 400 });
  }

  const { supabase, error } = await getAuthorizedInvestment(id);
  if (error) {
    return error;
  }

  const { data: installment, error: installmentError } = await supabase
    .from("installments")
    .select("id, amount, is_deleted")
    .eq("investment_id", id)
    .eq("installment_number", parsedInstallmentNumber)
    .maybeSingle();

  if (installmentError) {
    return NextResponse.json({ error: installmentError.message }, { status: 400 });
  }

  if (!installment || Number(installment.amount) <= 0 || installment.is_deleted) {
    return NextResponse.json(
      { error: "This installment is already deleted or unavailable." },
      { status: 404 }
    );
  }

  const { error: updateError } = await supabase
    .from("installments")
    .update({ is_deleted: true })
    .eq("investment_id", id)
    .eq("installment_number", parsedInstallmentNumber);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; installmentNumber: string }> }
) {
  const { id, installmentNumber } = await params;
  const parsedInstallmentNumber = Number(installmentNumber);

  if (!Number.isInteger(parsedInstallmentNumber) || parsedInstallmentNumber < 1) {
    return NextResponse.json({ error: "Invalid installment number." }, { status: 400 });
  }

  const { isDeleted } = (await request.json()) as { isDeleted?: boolean };
  if (typeof isDeleted !== "boolean") {
    return NextResponse.json({ error: "Missing installment state." }, { status: 400 });
  }

  const { supabase, error } = await getAuthorizedInvestment(id);
  if (error) {
    return error;
  }

  const { error: updateError } = await supabase
    .from("installments")
    .update({ is_deleted: isDeleted })
    .eq("investment_id", id)
    .eq("installment_number", parsedInstallmentNumber);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
