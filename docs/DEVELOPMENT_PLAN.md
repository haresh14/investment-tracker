# Investment Tracking App - Development Plan

## Project Overview
Building a lightweight React + Supabase app for tracking SIP investments, calculating expected returns, and managing withdrawals.

## Tech Stack
- **Frontend**: React + Vite + TypeScript + Tailwind CSS + DaisyUI
- **Backend**: Supabase (PostgreSQL + Auth + Row Level Security)
- **State Management**: React Query (TanStack Query)
- **Deployment**: Vercel (frontend) + Supabase (backend)

## Development Phases

### Phase 1: Project Foundation ✅
**Status**: ✅ COMPLETED
- [x] Create development plan document
- [x] Define project structure and tech stack
- [x] Set up initial documentation

### Phase 2: Project Setup 🔄
**Status**: 🔄 IN PROGRESS
- [ ] Initialize React project with Vite + TypeScript
- [ ] Install and configure dependencies (Tailwind, DaisyUI, React Query)
- [ ] Set up project folder structure
- [ ] Create basic routing structure
- [ ] Set up development environment

**Sub-tasks for Project Setup:**
- [ ] Create React app with Vite
- [ ] Install UI dependencies (Tailwind + DaisyUI)
- [ ] Install state management (React Query)
- [ ] Set up TypeScript configuration
- [ ] Create folder structure (/components, /pages, /hooks, /utils)
- [ ] Set up basic routing with React Router
- [ ] Create development scripts and README

### Phase 3: Supabase Configuration 📋
**Status**: 📋 PLANNED
- [ ] Create Supabase project
- [ ] Design database schema (sips, withdrawals tables)
- [ ] Set up Row Level Security policies
- [ ] Configure authentication providers
- [ ] Create database migrations
- [ ] Set up environment variables

**Database Schema:**
```sql
-- sips table
CREATE TABLE sips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  annual_return DECIMAL(5,2) NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- withdrawals table
CREATE TABLE withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  sip_id UUID REFERENCES sips(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Phase 4: Authentication System 📋
**Status**: 📋 PLANNED
- [ ] Set up Supabase Auth context
- [ ] Create login/signup components
- [ ] Implement protected routes
- [ ] Create auth hooks and utilities
- [ ] Handle authentication states
- [ ] Add logout functionality

### Phase 5: Core Dashboard Layout 📋
**Status**: 📋 PLANNED
- [ ] Create main layout component
- [ ] Design navigation structure
- [ ] Create responsive sidebar/header
- [ ] Set up page routing
- [ ] Implement loading states
- [ ] Add error boundaries

### Phase 6: SIP Management 📋
**Status**: 📋 PLANNED
- [ ] Create SIP form component
- [ ] Implement SIP CRUD operations
- [ ] Set up React Query mutations
- [ ] Add form validation
- [ ] Create SIP list component
- [ ] Implement edit/delete functionality

### Phase 7: Calculation Engine 📋
**Status**: 📋 PLANNED
- [ ] Implement SIP calculation utilities
- [ ] Create expected returns formula
- [ ] Calculate installments paid automatically
- [ ] Handle edge cases (future dates, negative values)
- [ ] Add calculation hooks
- [ ] Test calculation accuracy

**Core Formula:**
```typescript
// Future Value = SIP × ((1 + r/12)^n - 1) / (r/12)
const calculateExpectedValue = (
  sipAmount: number,
  annualReturn: number,
  installmentsPaid: number
): number => {
  const monthlyRate = annualReturn / 100 / 12;
  if (monthlyRate === 0) return sipAmount * installmentsPaid;
  return sipAmount * ((Math.pow(1 + monthlyRate, installmentsPaid) - 1) / monthlyRate);
};
```

### Phase 8: Withdrawal System 📋
**Status**: 📋 PLANNED
- [ ] Create withdrawal form component
- [ ] Implement withdrawal CRUD operations
- [ ] Link withdrawals to SIPs (optional)
- [ ] Update portfolio calculations
- [ ] Add withdrawal history view
- [ ] Handle withdrawal validation

### Phase 9: Portfolio Dashboard 📋
**Status**: 📋 PLANNED
- [ ] Create portfolio summary cards
- [ ] Display total invested amount
- [ ] Show expected vs actual values
- [ ] Create SIP-wise breakdown
- [ ] Add withdrawal impact visualization
- [ ] Implement responsive design

**Dashboard Metrics:**
- Total Invested: Sum of all SIP investments
- Total Withdrawals: Sum of all withdrawal amounts
- Net Portfolio: Total Invested - Total Withdrawals
- Expected Value: Sum of all SIP expected returns
- Gain/Loss: Expected Value - Total Invested

### Phase 10: Testing & Deployment 📋
**Status**: 📋 PLANNED
- [ ] Set up unit tests for utilities
- [ ] Test calculation accuracy
- [ ] Perform end-to-end testing
- [ ] Set up Vercel deployment
- [ ] Configure environment variables
- [ ] Test production build
- [ ] Update README with setup instructions

## Testing Instructions per Phase

### Phase 2 Testing:
1. Verify React app starts with `npm run dev`
2. Check Tailwind CSS styling works
3. Confirm DaisyUI components render correctly
4. Test basic routing navigation
5. Verify TypeScript compilation

### Phase 3 Testing:
1. Test Supabase connection
2. Verify database tables created
3. Check RLS policies work
4. Test authentication setup
5. Confirm environment variables loaded

### Phase 4 Testing:
1. Test email/password signup
2. Test login/logout flow
3. Verify protected routes work
4. Check authentication persistence
5. Test error handling

### Phase 5 Testing:
1. Test responsive layout
2. Verify navigation works
3. Check loading states
4. Test error boundaries
5. Confirm mobile responsiveness

### Phase 6 Testing:
1. Test SIP creation form
2. Verify SIP data persistence
3. Test edit/delete operations
4. Check form validation
5. Test SIP list display

### Phase 7 Testing:
1. Test calculation accuracy with known values
2. Verify installment counting
3. Test edge cases (0% return, future dates)
4. Check calculation performance
5. Verify formula implementation

### Phase 8 Testing:
1. Test withdrawal creation
2. Verify SIP linking works
3. Check withdrawal history
4. Test portfolio impact
5. Verify validation rules

### Phase 9 Testing:
1. Test portfolio summary accuracy
2. Verify all metrics display correctly
3. Check responsive design
4. Test data updates in real-time
5. Verify SIP breakdown accuracy

### Phase 10 Testing:
1. Run full test suite
2. Test production build
3. Verify deployment works
4. Check all features in production
5. Test with sample data

## Current Status: Phase 2 - Project Setup

**Next Action**: Initialize React project with Vite and set up the basic project structure.

## Notes
- Each phase should be completed and tested before moving to the next
- Regular commits after each sub-task completion
- Update this document as progress is made
- Focus on mobile-first responsive design throughout
