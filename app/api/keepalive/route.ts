import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();

    const [investmentsPing, installmentsPing] = await Promise.all([
      supabase.from("investments").select("id").limit(1),
      supabase.from("installments").select("id").limit(1)
    ]);

    if (investmentsPing.error || installmentsPing.error) {
      return NextResponse.json({ ok: false }, { status: 503 });
    }

    return NextResponse.json(
      { ok: true },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate"
        }
      }
    );
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
