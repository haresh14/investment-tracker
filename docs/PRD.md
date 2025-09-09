# PRD – Investment Tracking App

## 1. Overview

The Investment Tracking App is a lightweight personal finance tool that allows users to:

- Automatically track SIP (Systematic Investment Plan) installments based on start date and frequency.
- Display the total invested amount and total installments paid.
- Record withdrawals.
- Estimate returns by applying a user-defined annual return % per SIP.
- Provide insights into expected total value so far vs. actual withdrawals/investments.

The app will be built with React as the frontend and Supabase as the backend-as-a-service (database + authentication). No custom backend server will be needed.

## 2. Goals

- Simple SIP tracking: Auto-generate monthly investments from a given start date.
- Portfolio visibility: Show total invested, installments paid, withdrawals made.
- Return estimation: Calculate expected returns based on annual return %.
- Minimal setup: Just React + Supabase.

## 3. Key Features

### 3.1 User Authentication

- Users can sign up/log in using Supabase Auth (email/password or OAuth).
- Each user's SIP data is private and scoped to their account.

### 3.2 SIP Management

**Add SIP:**
- Name (e.g., "HDFC Equity Fund").
- Start date.
- SIP amount.
- Annual return % (expected).

**System auto-calculates:**
- Number of installments paid = months since start date.
- Total invested = amount × installments paid.

### 3.3 Withdrawals

Users can record a withdrawal:
- Date.
- Amount.
- SIP linked (optional).

Withdrawals are deducted from the total value.

### 3.4 Expected Returns

For each SIP:

Calculate expected return using compounded monthly growth:

```
FutureValue = SIP × ((1 + r/12)^n - 1) / (r/12)
```

where:
- SIP = monthly investment,
- r = annual expected return (decimal),
- n = number of installments.

Display expected total portfolio value.

### 3.5 Dashboard

**Portfolio Summary:**
- Total invested.
- Total withdrawals.
- Net portfolio (invested – withdrawals).
- Expected portfolio value.

**SIP List:**
Each SIP with:
- Name,
- Start date,
- Installments paid,
- Invested amount,
- Expected value,
- Withdrawals linked.

## 4. Non-Goals

- Real-time NAV (Net Asset Value) fetching from APIs.
- Taxation or advanced portfolio analysis.
- Multi-frequency SIPs (only monthly).

## 5. Tech Stack

- **Frontend:** React + Tailwind (for UI) + https://daisyui.com/components/.
- **Backend (serverless):** Supabase (Postgres + Auth + Row Level Security).
- **State Management:** React Query / Redux Toolkit (optional).
- **Hosting:** Vercel / Netlify (frontend), Supabase (database).

## 6. User Flows

### 6.1 Add SIP

1. User clicks Add SIP.
2. Fills form (Name, Start Date, Amount, Annual Return %).
3. App saves record in sips.
4. Dashboard auto-updates with calculated installments & expected returns.

### 6.2 Auto Track Installments

On dashboard load:
1. Calculate months since start date.
2. Multiply by SIP amount to get total invested.

### 6.3 Record Withdrawal

1. User clicks Add Withdrawal.
2. Fills form (Amount, Date, Optional SIP).
3. App saves record in withdrawals.
4. Dashboard updates totals.

### 6.4 View Dashboard

Display:
- Portfolio summary.
- SIP-wise breakdown with expected vs. invested vs. withdrawn.

## 7. Expected Metrics

- **MVP Scope:** Track SIPs, calculate expected returns, withdrawals, dashboard summary.
- **Performance:** Portfolio calculation under 1 sec (done client-side).
- **Scalability:** Supabase handles user data separation with Row Level Security.

## 8. Future Enhancements

- Multi-frequency SIPs (weekly, quarterly).
- Real NAV integration (via mutual fund APIs).
- Graphs showing growth trajectory.
- Export to Excel/CSV.
