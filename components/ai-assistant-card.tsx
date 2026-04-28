"use client";

import { useMemo, useState } from "react";
import { Bot, LoaderCircle, MessageSquare, Send, X } from "lucide-react";
import { toast } from "sonner";

import { AI_SUGGESTIONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AiAssistantCard() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const placeholders = useMemo(() => AI_SUGGESTIONS, []);

  async function ask(prompt: string) {
    if (!prompt.trim()) {
      return;
    }

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt })
      });

      if (!res.ok) {
        throw new Error("Unable to get AI response");
      }

      const data = (await res.json()) as { answer: string };
      setResponse(data.answer);
      setOpen(true);
    } catch (error) {
      toast.error("AI assistant is not configured yet. Add OPENAI_API_KEY to enable it.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {open ? (
        <div className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-sm" onClick={() => setOpen(false)} />
      ) : null}

      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
        {open ? (
          <div className="w-[calc(100vw-2rem)] max-w-md rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-white/10 p-3 text-brand-200">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-200">
                    AI assistant
                  </p>
                  <h3 className="mt-1 text-lg font-semibold">Portfolio questions</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {placeholders.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setQuery(item);
                    void ask(item);
                  }}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 transition hover:bg-white/10"
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Ask about SIPs, projections, or withdrawals..."
                className="border-white/10 bg-white/5 text-white placeholder:text-slate-400"
              />
              <Button
                onClick={() => void ask(query)}
                disabled={loading}
                className="bg-white text-slate-900 hover:bg-slate-100"
                size="icon"
              >
                {loading ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="mt-4 min-h-28 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-200">
              {response ||
                "Ask about best SIPs, future value, or withdrawal readiness. Responses use your portfolio context."}
            </div>
          </div>
        ) : null}

        <Button
          type="button"
          size="icon"
          onClick={() => setOpen((current) => !current)}
          className="h-14 w-14 rounded-full bg-slate-950 text-white shadow-2xl hover:bg-slate-800"
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
      </div>
    </>
  );
}
