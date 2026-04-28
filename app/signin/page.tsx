import Image from "next/image";
import { redirect } from "next/navigation";
import { ArrowRight, BarChart3, ShieldCheck } from "lucide-react";

import { EmailOtpForm } from "@/components/auth/email-otp-form";
import { EnvSetupState } from "@/components/env-setup-state";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export default async function SignInPage() {
  if (!hasSupabaseEnv()) {
    return <EnvSetupState />;
  }

  const supabase = await createClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/dashboard");
  }

  async function signIn() {
    "use server";

    const supabase = await createClient();
    const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`
      }
    });

    if (error) {
      throw error;
    }

    if (data.url) {
      redirect(data.url as never);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-8 px-4 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(50,108,255,0.28),_transparent_40%),radial-gradient(circle_at_bottom_left,_rgba(15,118,110,0.20),_transparent_35%)]" />
          <div className="relative">
            <div className="mb-8 flex items-center gap-3">
              <div className="rounded-2xl bg-white/10 p-3 text-brand-200">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-200">
                  Investment Tracker
                </p>
                <p className="text-sm text-slate-300">Projection-first personal investing</p>
              </div>
            </div>

            <h1 className="max-w-xl text-4xl font-semibold leading-tight sm:text-5xl">
              See every SIP and lumpsum plan on one polished dashboard.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
              Track contributions, project future value with fixed return assumptions,
              and explore milestones without needing live NAV complexity.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <ShieldCheck className="h-5 w-5 text-emerald-300" />
                <h2 className="mt-3 text-lg font-semibold">Passwordless auth + RLS</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Email OTP sign-in, private portfolio rows, and free-tier friendly architecture.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <ArrowRight className="h-5 w-5 text-brand-200" />
                <h2 className="mt-3 text-lg font-semibold">Insight-rich projections</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Installment-level compounding, allocation views, trend charts, and AI-ready summaries.
                </p>
              </div>
            </div>

            <EmailOtpForm />

            <div className="mt-5 border-t border-white/10 pt-5">
              <p className="text-sm text-slate-300">
                Google sign-in is still wired in the codebase for later rollout.
              </p>
              <form action={signIn} className="mt-4">
                <Button size="lg" type="submit" variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10">
                  Continue with Google
                </Button>
              </form>
            </div>
          </div>
        </section>

        <section className="relative hidden min-h-[620px] overflow-hidden rounded-[28px] lg:block">
          <Image
            src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80"
            alt="Investment dashboard mood"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-200">
                Dashboard preview
              </p>
              <h2 className="mt-3 text-2xl font-semibold">Built for clarity, not spreadsheet fatigue</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Modern cards, responsive charts, and room to grow into withdrawals and AI guidance.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
