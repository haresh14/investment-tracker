# Investment Tracker

Projection-first personal investment tracking built with Next.js, Supabase, TailwindCSS, DaisyUI, and Recharts.

## What it includes

- Google sign-in with Supabase Auth
- RLS-backed `investments`, `installments`, and `transactions` tables
- SIP + lumpsum modeling using fixed expected returns
- Lazy installment generation with duplicate-safe upserts
- Responsive fintech-style dashboard with insights and charts
- Investment detail view with installment ledger
- AI assistant route prepared for OpenAI

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` from `.env.example`

3. Run the SQL in [supabase/migrations/001_init.sql](/Users/mac/Flexteam/projects/flexteam/investment-tracker/supabase/migrations/001_init.sql)

4. Start the app:

```bash
npm run dev
```

## Notes

- Installments are created only when needed, usually when an investment is created or opened.
- Projections are based on fixed expected annual returns, not live NAV or XIRR.
- `transactions` and lock-in data are modeled now so withdrawals can land later without reshaping the app.
