"use client";

import { useMemo, useState } from "react";
import { Bot, LoaderCircle, Send } from "lucide-react";
import { toast } from "sonner";

import { AI_SUGGESTIONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AiAssistantCard() {
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
    } catch (error) {
      toast.error("AI assistant is not configured yet. Add OPENAI_API_KEY to enable it.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-soft">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-white/10 p-3 text-brand-200">
          <Bot className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-200">
            Phase 2 ready
          </p>
          <h3 className="mt-2 text-xl font-semibold">Portfolio AI assistant</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Ask portfolio questions using structured context from your investments,
            installments, and dashboard summaries.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {placeholders.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setQuery(item);
              void ask(item);
            }}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10"
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-5 flex gap-3">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ask about best SIPs, milestones, or projections..."
          className="border-white/10 bg-white/5 text-white placeholder:text-slate-400"
        />
        <Button
          onClick={() => void ask(query)}
          disabled={loading}
          className="bg-white text-slate-900 hover:bg-slate-100"
        >
          {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Ask
        </Button>
      </div>

      <div className="mt-5 min-h-28 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-200">
        {response || "Responses will appear here. The route is wired for OpenAI once the API key is set."}
      </div>
    </div>
  );
}
