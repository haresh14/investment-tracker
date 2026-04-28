import { Database, KeyRound } from "lucide-react";

export function EnvSetupState() {
  return (
    <div className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-10">
      <div className="section-shell w-full p-8 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
          Setup required
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">
          Connect Supabase to unlock the app
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
          The UI, routes, schema, and projection engine are ready. Add your Supabase URL and
          anon key in <code>.env.local</code>, then apply the SQL migration to start signing in
          with Google and storing investments.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <Database className="h-5 w-5 text-brand-600" />
            <p className="mt-3 text-sm font-semibold text-slate-900">Database</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Run the SQL in <code>supabase/migrations/001_init.sql</code> to create tables,
              constraints, and RLS policies.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <KeyRound className="h-5 w-5 text-brand-600" />
            <p className="mt-3 text-sm font-semibold text-slate-900">Environment</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Fill <code>NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
              <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, and optionally <code>OPENAI_API_KEY</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
