# Investment Tracking App - Project Context

## Project Overview

This is an **Investment Tracking App** - a lightweight personal finance tool designed to help users track their monthly investment installments, calculate expected returns, and manage withdrawals.

## Core Purpose

The app serves as a personal finance dashboard that:
- **Automatically tracks SIP installments** based on start date and frequency
- **Calculates expected returns** using compound interest formulas
- **Records withdrawals** and their impact on portfolio value
- **Provides portfolio insights** showing invested vs. expected vs. withdrawn amounts

## Key Business Logic

### SIP Calculation Formula
The app uses the standard future value formula for SIPs:
```
FutureValue = SIP × ((1 + r/12)^n - 1) / (r/12)
```
Where:
- `SIP` = monthly investment amount
- `r` = annual expected return (as decimal)
- `n` = number of installments paid

### Auto-Generated Installments
- **Installments paid** = months since start date
- **Total invested** = SIP amount × installments paid
- **Expected value** = calculated using compound growth formula

## Technical Architecture

### Frontend Stack
- **React** - Component-based UI framework
- **Tailwind CSS** - Utility-first styling
- **DaisyUI** - Component library for consistent design
- **React Query/Redux Toolkit** - State management (optional)

### Backend Stack
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Built-in authentication
  - Row Level Security for data isolation
- **No custom backend server** required

### Deployment
- **Frontend**: Vercel/Netlify
- **Database**: Supabase cloud

## Data Models

### SIP Entity
```typescript
{
  id: string
  name: string           // e.g., "HDFC Equity Fund"
  startDate: Date
  amount: number         // Monthly SIP amount
  annualReturn: number   // Expected annual return %
  userId: string         // Owner reference
}
```

### Withdrawal Entity
```typescript
{
  id: string
  amount: number
  date: Date
  sipId?: string         // Optional SIP reference
  userId: string         // Owner reference
}
```

## User Experience Flow

1. **Authentication**: Users sign up/login via Supabase Auth
2. **Add SIP**: Create new SIP with name, start date, amount, expected return
3. **Auto-calculation**: System calculates installments and expected returns
4. **Record Withdrawals**: Track money taken out of investments
5. **Dashboard View**: See portfolio summary and SIP-wise breakdown

## Key Features Scope

### ✅ Included (MVP)
- SIP management with auto-installment calculation
- Expected return calculations using compound interest
- Withdrawal tracking
- Portfolio dashboard with summary metrics
- User authentication and data isolation

### ❌ Excluded (Future)
- Real-time NAV fetching from mutual fund APIs
- Advanced taxation calculations
- Multi-frequency SIPs (weekly, quarterly)
- Complex portfolio analysis tools

## Performance Requirements

- **Portfolio calculations**: Under 1 second (client-side computation)
- **Data scalability**: Handled by Supabase with Row Level Security
- **User isolation**: Each user's data is completely private

## Success Metrics

- **Functional**: Track multiple SIPs with accurate calculations
- **Usability**: Simple, intuitive interface for non-technical users
- **Performance**: Fast dashboard loading and calculations
- **Reliability**: Secure data storage and user authentication

## Development Approach

This is a **serverless application** leveraging:
- Supabase for all backend needs (database + auth)
- React for frontend interactivity
- Client-side calculations for performance
- Modern deployment practices for scalability
- UI should be responsive and nice looking for mobile as well
- Keep upto date README.md file with the all the instructions to setup and run the app

The focus is on **simplicity and reliability** rather than complex features, making it accessible for personal finance tracking without overwhelming complexity.
