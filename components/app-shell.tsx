import Link from "next/link";
import type { ReactNode } from "react";
import { BarChart3, LogOut, Plus, Sparkles } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export async function AppShell({
  children
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  async function signOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  return (
    <div className="min-h-screen bg-base-100 bg-dashboard-grid [background-size:24px_24px]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="glass-panel sticky top-4 z-20 mb-6 rounded-3xl px-4 py-3">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-2xl transition hover:opacity-90"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Investment Tracker
                </p>
                <h1 className="text-lg font-semibold text-slate-900">
                  Personal wealth projections, beautifully organized
                </h1>
              </div>
            </Link>

            <div className="flex flex-wrap items-center gap-3">
              <div className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 sm:flex">
                <Sparkles className="h-4 w-4 text-brand-500" />
                {user?.email}
              </div>
              <Button asChild size="sm">
                <Link href="/investments/new">
                  <Plus className="h-4 w-4" />
                  Add investment
                </Link>
              </Button>
              <form action={signOut}>
                <Button type="submit" size="sm" variant="outline">
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
              </form>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
