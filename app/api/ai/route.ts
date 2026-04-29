import { NextResponse } from "next/server";
import OpenAI from "openai";

import {
  getDistributionData,
  getInvestedVsProjectedChartData,
  getMonthlyTrendData,
  summarizeInvestment
} from "@/lib/calculations";
import { createClient } from "@/lib/supabase/server";
import type { InstallmentRow, InvestmentRow } from "@/lib/types";

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!apiKey) {
    return NextResponse.json(
      {
        answer:
          "The AI assistant is wired, but OPENAI_API_KEY is not configured yet. Add it to enable portfolio Q&A."
      },
      { status: 200 }
    );
  }

  const { prompt } = (await request.json()) as { prompt: string };
  const { data: investments, error } = await supabase
    .from("investments")
    .select("*, installments(*)")
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const typed = (investments ?? []) as Array<InvestmentRow & { installments: InstallmentRow[] }>;
  const summaries = typed.map((investment) =>
    summarizeInvestment(investment, investment.installments ?? [])
  );

  const openai = new OpenAI({ apiKey });
  const completion = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content:
          "You are a helpful investment projection assistant. Use only the provided structured context. Clarify that returns are projection-based, not market-linked NAV or XIRR."
      },
      {
        role: "user",
        content: JSON.stringify({
          prompt,
          summary: {
            totalInvested: summaries.reduce((sum, item) => sum + item.investedAmount, 0),
            totalProjectedValue: summaries.reduce((sum, item) => sum + item.projectedValue, 0),
            totalProfit: summaries.reduce((sum, item) => sum + item.profit, 0),
            activeCount: summaries.length
          },
          investments: summaries.map((investment) => ({
            id: investment.id,
            name: investment.name,
            source: investment.source,
            account: investment.account,
            type: investment.type,
            investedAmount: investment.investedAmount,
            projectedValue: investment.projectedValue,
            profit: investment.profit,
            gainPercent: investment.gainPercent,
            endDate: investment.end_date,
            status: investment.status,
            annualReturn: investment.expected_annual_return
          })),
          charts: {
            distribution: getDistributionData(summaries),
            monthlyTrend: getMonthlyTrendData(typed.flatMap((item) => item.installments ?? [])),
            investedVsProjected: getInvestedVsProjectedChartData(summaries)
          }
        })
      }
    ]
  });

  const answer = completion.output_text;
  return NextResponse.json({ answer });
}
