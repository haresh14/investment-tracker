"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, LoaderCircle, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Step = "email" | "sent";

export function EmailOtpForm() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  async function sendCode() {
    if (!email.trim()) {
      toast.error("Enter your email to continue.");
      return;
    }

    setSending(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        throw error;
      }

      setStep("sent");
      toast.success("Check your inbox for a sign-in link or verification code.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to send code.");
    } finally {
      setSending(false);
    }
  }

  async function verifyCode() {
    if (!code.trim()) {
      toast.error("Enter the verification code.");
      return;
    }

    setVerifying(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: code.trim(),
        type: "email"
      });

      if (error) {
        throw error;
      }

      toast.success("Signed in successfully.");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Invalid or expired code.");
    } finally {
      setVerifying(false);
    }
  }

  return (
    <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-white/10 p-3 text-brand-200">
          {step === "email" ? <Mail className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">
            {step === "email"
              ? "Passwordless email login"
              : "Open the email or enter a code"}
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-300">
            {step === "email"
              ? "We’ll send a one-time login code to your inbox."
              : `We sent a sign-in email to ${email}. If your template includes a code, you can enter it here too.`}
          </p>
        </div>
      </div>

      {step === "email" ? (
        <div className="mt-5 space-y-4">
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="border-white/10 bg-white/5 text-white placeholder:text-slate-400"
          />
          <Button type="button" size="lg" onClick={() => void sendCode()} disabled={sending}>
            {sending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            Send sign-in email
          </Button>
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/10 p-4 text-sm leading-6 text-emerald-100">
            The fastest path is to click the sign-in link in your email. If Supabase sends a code instead, enter it below.
          </div>
          <Input
            inputMode="numeric"
            placeholder="Optional code"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            className="border-white/10 bg-white/5 text-white placeholder:text-slate-400"
          />
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="button" size="lg" onClick={() => void verifyCode()} disabled={verifying}>
              {verifying ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
              Verify code
            </Button>
            <Button
              type="button"
              size="lg"
              variant="ghost"
              className="text-white hover:bg-white/10 hover:text-white"
              onClick={() => void sendCode()}
              disabled={sending}
            >
              Resend email
            </Button>
          </div>
          <button
            type="button"
            onClick={() => {
              setCode("");
              setStep("email");
            }}
            className="inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Use a different email
          </button>
        </div>
      )}
    </div>
  );
}
