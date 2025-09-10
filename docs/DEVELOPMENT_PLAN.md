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

### Phase 2: Project Setup ✅
**Status**: ✅ COMPLETED
- [x] Initialize React project with Vite + TypeScript
- [x] Install and configure dependencies (Tailwind, DaisyUI, React Query)
- [x] Set up project folder structure
- [x] Create basic routing structure
- [x] Set up development environment

**Sub-tasks for Project Setup:**
- [x] Create React app with Vite
- [x] Install UI dependencies (Tailwind + DaisyUI)
- [x] Install state management (React Query)
- [x] Set up TypeScript configuration
- [x] Create folder structure (/components, /pages, /hooks, /utils)
- [x] Set up basic routing with React Router
- [x] Create development scripts and README
- [x] Create basic Dashboard and Login page components
- [x] Set up calculation utilities and TypeScript types
- [x] Configure Supabase client (ready for environment variables)

### Phase 3: Supabase Configuration ✅
**Status**: ✅ COMPLETED
- [x] Create Supabase project
- [x] Design database schema (sips, withdrawals tables)
- [x] Set up Row Level Security policies
- [x] Configure authentication providers
- [x] Create database migrations
- [x] Set up environment variables

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

### Phase 4: Authentication System ✅
**Status**: ✅ COMPLETED
- [x] Set up Supabase Auth context
- [x] Create login/signup components
- [x] Implement protected routes
- [x] Create auth hooks and utilities
- [x] Handle authentication states
- [x] Add logout functionality

### Phase 5: Core Dashboard Layout ✅
**Status**: ✅ COMPLETED
- [x] Create main layout component
- [x] Design navigation structure
- [x] Create responsive sidebar/header
- [x] Set up page routing
- [x] Implement loading states
- [x] Add error boundaries

### Phase 6: SIP Management ✅
**Status**: ✅ COMPLETED
- [x] Create SIP form component (Add & Edit)
- [x] Implement SIP CRUD operations
- [x] Set up React Query mutations
- [x] Add form validation
- [x] Create SIP list component
- [x] Implement edit/delete functionality

### Phase 7: Calculation Engine ✅
**Status**: ✅ COMPLETED
- [x] Implement SIP calculation utilities
- [x] Create expected returns formula
- [x] Calculate installments paid automatically
- [x] Handle edge cases (future dates, negative values)
- [x] Add calculation hooks
- [x] Test calculation accuracy

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

### Phase 8: Withdrawal System ✅
**Status**: ✅ COMPLETED
- [x] Create withdrawal form component (Add & Edit)
- [x] Implement withdrawal CRUD operations
- [x] Link withdrawals to SIPs (optional)
- [x] Update portfolio calculations
- [x] Add withdrawal history view
- [x] Handle withdrawal validation

### Phase 9: Portfolio Dashboard ✅
**Status**: ✅ COMPLETED
- [x] Create portfolio summary cards
- [x] Display total invested amount
- [x] Show expected vs actual values
- [x] Create SIP-wise breakdown
- [x] Add withdrawal impact visualization (ready for withdrawals)
- [x] Implement responsive design

**Dashboard Metrics:**
- Total Invested: Sum of all SIP investments
- Total Withdrawals: Sum of all withdrawal amounts
- Net Portfolio: Total Invested - Total Withdrawals
- Expected Value: Sum of all SIP expected returns
- Gain/Loss: Expected Value - Total Invested

### Phase 10: Google OAuth & Advanced Features ✅
**Status**: ✅ COMPLETED
- [x] Implement Google OAuth signup and signin
- [x] Create Google OAuth setup documentation
- [x] Fix React Query cache issue when switching users
- [x] Test Google OAuth functionality
- [x] Update authentication context with OAuth support

### Phase 11: UI/UX Enhancements 📋
**Status**: 📋 PLANNED
- [ ] Optimize portfolio cards for mobile (2-column layout)
- [ ] Reduce card and font sizes for better mobile experience
- [ ] Improve responsive design for dashboard cards
- [ ] Test mobile layout across different screen sizes

**Sub-tasks for UI/UX Enhancements:**
- [ ] Update PortfolioSummary component for 2-column mobile layout
- [ ] Adjust card sizing and typography for mobile devices
- [ ] Ensure proper spacing and readability on small screens
- [ ] Test responsive behavior on various mobile devices

### Phase 12: Advanced SIP List View ✅
**Status**: ✅ COMPLETED
- [ ] Create tabular SIP list view with columns
- [ ] Implement responsive table design for mobile
- [ ] Add sortable columns (Name, Start Date, Installments, etc.)
- [ ] Optimize table layout to avoid horizontal scrolling on mobile

**SIP List Columns:**
- Name: SIP investment name
- Start Date: When the SIP started
- Installments: Number of installments paid/total
- Total Invested: Amount invested so far
- Expected Return: Current expected value
- Actions: Edit/Delete/View buttons

**Sub-tasks for SIP List View:**
- [ ] Design responsive table component
- [ ] Implement column sorting functionality
- [ ] Create mobile-optimized table layout (stacked cards or accordion)
- [ ] Add loading states and empty states
- [ ] Integrate with existing SIP data and actions

### Phase 13: SIP Pause Functionality ✅
**Status**: ✅ COMPLETED
- [ ] Add pause_date field to SIP database schema
- [ ] Implement pause/resume SIP functionality
- [ ] Update calculation engine to handle paused periods
- [ ] Create UI controls for pausing/resuming SIPs

**Database Schema Updates:**
```sql
-- Add pause functionality to sips table
ALTER TABLE sips ADD COLUMN pause_date DATE;
ALTER TABLE sips ADD COLUMN is_paused BOOLEAN DEFAULT FALSE;
```

**Sub-tasks for SIP Pause:**
- [ ] Update database schema with pause fields
- [ ] Modify SIP calculation logic to account for paused periods
- [ ] Add pause/resume buttons to SIP list and detail views
- [ ] Update forms to handle pause date input
- [ ] Create visual indicators for paused SIPs
- [ ] Test pause functionality with various scenarios

### Phase 14: SIP Detail View & Transaction History ✅
**Status**: ✅ COMPLETED
- [x] Create detailed SIP view page with full information
- [x] Generate transaction history table for each SIP
- [x] Calculate expected returns for individual installments
- [x] Implement navigation to SIP detail from list view
- [x] Add responsive design for mobile and desktop
- [x] Include comprehensive SIP metrics and status indicators

**SIP Detail View Features:**
- Complete SIP information (name, amount, return rate, dates)
- Transaction history table with columns:
  - Date: Installment date
  - Amount: Investment amount
  - Cumulative Invested: Running total
  - Expected Value: Projected value at that point
  - Growth: Gain/loss for that installment
- Visual charts for growth over time (optional)
- Edit/Delete actions

**Sub-tasks for SIP Detail View:**
- [ ] Create SIP detail page component
- [ ] Implement transaction history generation logic
- [ ] Design responsive detail view layout
- [ ] Add navigation routing for SIP details
- [ ] Create installment-wise calculation utilities
- [ ] Add breadcrumb navigation
- [ ] Implement print/export functionality (optional)

### Phase 15: Locking Period & Available Withdrawal ✅
**Status**: ✅ COMPLETED
- [x] Add locking period field to SIP schema
- [x] Calculate available withdrawal amounts
- [x] Update SIP views to show locked vs available amounts
- [x] Implement withdrawal restrictions based on locking period
- [x] Add locking period input to Add/Edit SIP forms
- [x] Display lock status indicators and badges
- [x] Show lock end dates and availability percentages

**Database Schema Updates:**
All database migrations are now organized in the `migrations/` folder:
- `run_all_migrations.sql` - Complete setup script
- `003_add_locking_period.sql` - Locking period migration

```sql
-- Add locking period to sips table
ALTER TABLE sips ADD COLUMN lock_period_months INTEGER DEFAULT 0;
ALTER TABLE sips ADD COLUMN lock_end_date DATE;
```

**Locking Period Logic:**
- Lock Period: Number of months from start date
- Locked Amount: Investments made within the locking period
- Available Amount: Investments older than locking period
- Withdrawal Restriction: Only allow withdrawals from available amount

**Sub-tasks for Locking Period:**
- [ ] Update database schema with locking fields
- [ ] Create locking period calculation utilities
- [ ] Update SIP forms to include locking period input
- [ ] Modify portfolio calculations to show locked vs available
- [ ] Add visual indicators for locked amounts
- [ ] Update withdrawal forms with availability checks
- [ ] Create validation rules for withdrawal limits
- [ ] Test locking scenarios with various time periods

### Phase 16: SIP Status Management ✅
**Status**: ✅ COMPLETED
- [x] Add ability to mark SIP as inactive/active
- [x] Update database schema with status field
- [x] Implement status toggle functionality
- [x] Add visual indicators for inactive SIPs
- [x] Update calculations to exclude inactive SIPs
- [x] Add status filter options

**Database Schema Updates:**
```sql
-- Add status field to sips table
ALTER TABLE sips ADD COLUMN status VARCHAR(20) DEFAULT 'active';
-- Possible values: 'active', 'inactive', 'completed'
```

**Sub-tasks for SIP Status:**
- [x] Update database schema with status field
- [x] Add status toggle in SIP forms and list view
- [x] Create visual indicators (badges) for different statuses
- [x] Update calculation engine to handle inactive SIPs
- [x] Add status filter functionality
- [x] Test status changes and portfolio impact

### Phase 17: Enhanced UX & Navigation ✅
**Status**: ✅ COMPLETED
- [x] Redesign SIP list actions with context menu
- [x] Make SIP rows clickable for detail view navigation
- [x] Improve user interaction patterns
- [x] Add keyboard navigation support
- [x] Implement better touch interactions for mobile
- [x] Fix three-dots button visibility and functionality

**Enhanced SIP List Features:**
- Context menu for all SIP actions (Edit, Delete, Pause/Resume, Mark Inactive)
- Clickable rows for quick navigation to detail view
- Right-click context menu on desktop
- Long-press context menu on mobile
- Keyboard shortcuts for power users

**Sub-tasks for Enhanced UX:**
- [ ] Create reusable context menu component
- [ ] Implement row click handlers for navigation
- [ ] Add context menu trigger (right-click, three-dots button)
- [ ] Design mobile-friendly context menu
- [ ] Add keyboard navigation (arrow keys, enter, escape)
- [ ] Implement touch gestures for mobile interactions
- [ ] Add visual feedback for interactive elements

### Phase 18: Page Structure Reorganization ✅
**Status**: ✅ COMPLETED
- [x] Create separate Withdrawals page
- [x] Remove withdrawals from main dashboard
- [x] Implement proper page navigation
- [x] Update routing structure
- [x] Create page-specific layouts

**New Page Structure:**
- **Dashboard**: Portfolio summary + SIP list only
- **Withdrawals**: Dedicated page for withdrawal management
- **SIP Details**: Individual SIP detail pages (existing)
- **Settings**: User preferences and account settings (future)

**Sub-tasks for Page Reorganization:**
- [ ] Create dedicated Withdrawals page component
- [ ] Remove WithdrawalList from Dashboard
- [ ] Update navigation menu with new pages
- [ ] Add proper page routing for Withdrawals
- [ ] Design consistent page layouts
- [ ] Add breadcrumb navigation
- [ ] Update mobile navigation for new structure

### Phase 19: Header & Navigation Redesign 📋
**Status**: 📋 PLANNED
- [ ] Redesign header with modern, attractive design
- [ ] Implement responsive navigation
- [ ] Add user profile section
- [ ] Create mobile-friendly hamburger menu
- [ ] Add proper branding and logo area

**Modern Header Features:**
- Clean, professional design with proper branding
- Responsive navigation that works on all devices
- User profile dropdown with avatar and account options
- Mobile hamburger menu with smooth animations
- Search functionality (future enhancement)
- Notification center (future enhancement)

**Sub-tasks for Header Redesign:**
- [ ] Design new header layout with modern styling
- [ ] Create responsive navigation component
- [ ] Add user profile dropdown with avatar
- [ ] Implement mobile hamburger menu
- [ ] Add smooth animations and transitions
- [ ] Create logo/branding area
- [ ] Add proper spacing and typography
- [ ] Test responsive behavior across devices
- [ ] Add accessibility features (ARIA labels, keyboard nav)

### Phase 20: Testing & Deployment ✅
**Status**: ✅ COMPLETED
- [ ] Set up unit tests for new features
- [ ] Test calculation accuracy for all scenarios
- [ ] Perform end-to-end testing
- [ ] Set up Vercel deployment
- [ ] Configure environment variables
- [ ] Test production build
- [ ] Update README with new features

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
1. Test Google OAuth setup and configuration
2. Verify Google sign-in flow works correctly
3. Test user switching with cache clearing
4. Check OAuth redirect handling
5. Verify authentication persistence across sessions

### Phase 11 Testing:
1. Test portfolio cards in mobile view (2-column layout)
2. Verify card sizing and font readability on small screens
3. Check responsive behavior across different devices
4. Test touch interactions on mobile
5. Verify proper spacing and alignment

### Phase 12 Testing:
1. Test SIP list table view on desktop and mobile
2. Verify column sorting functionality
3. Check mobile table layout (no horizontal scroll)
4. Test all table actions (edit, delete, view)
5. Verify data accuracy in all columns

### Phase 13 Testing:
1. Test SIP pause/resume functionality
2. Verify calculation accuracy with paused periods
3. Check pause date validation and UI controls
4. Test visual indicators for paused SIPs
5. Verify database updates for pause status

### Phase 14 Testing:
1. Test SIP detail view navigation and layout
2. Verify transaction history accuracy
3. Check installment-wise calculations
4. Test responsive design of detail view
5. Verify all SIP information display

### Phase 15 Testing:
1. Test locking period calculations
2. Verify available vs locked amount display
3. Check withdrawal restrictions based on locking
4. Test locking period form inputs and validation
5. Verify visual indicators for locked amounts

### Phase 16 Testing:
1. Test SIP status toggle functionality (active/inactive)
2. Verify inactive SIPs are excluded from calculations
3. Check visual indicators for different statuses
4. Test status filter functionality
5. Verify database updates for status changes

### Phase 17 Testing:
1. Test context menu functionality on desktop and mobile
2. Verify row click navigation to detail view
3. Check right-click and long-press context menu triggers
4. Test keyboard navigation (arrow keys, enter, escape)
5. Verify touch interactions work smoothly on mobile

### Phase 18 Testing:
1. Test new Withdrawals page functionality
2. Verify navigation between Dashboard and Withdrawals
3. Check that Dashboard no longer shows withdrawals
4. Test page routing and URL structure
5. Verify consistent layouts across all pages

### Phase 19 Testing:
1. Test header responsiveness across all devices
2. Verify mobile hamburger menu functionality
3. Check user profile dropdown interactions
4. Test navigation accessibility features
5. Verify header design consistency and branding

### Phase 20 Testing:
1. Run comprehensive test suite for all features
2. Test production build with new features
3. Verify deployment works with updated schema
4. Check all features in production environment
5. Test with various data scenarios

## Current Status: Phase 16 - SIP Status Management 🔄

**Completed Phases:**
- ✅ **Phase 1**: Project Foundation
- ✅ **Phase 2**: Project Setup (React + Vite + Tailwind + DaisyUI)
- ✅ **Phase 3**: Supabase Configuration (Database + Auth + RLS)
- ✅ **Phase 4**: Authentication System (Login/Signup + Protected Routes)
- ✅ **Phase 5**: Core Dashboard Layout (Responsive + Navigation)
- ✅ **Phase 6**: SIP Management (Full CRUD + Validation)
- ✅ **Phase 7**: Calculation Engine (Compound Interest + Auto-calculations)
- ✅ **Phase 8**: Withdrawal System (Full CRUD + SIP Linking)
- ✅ **Phase 9**: Portfolio Dashboard (Real-time Summary + Responsive Cards)
- ✅ **Phase 10**: Google OAuth & Advanced Features (OAuth + Cache Management)
- ✅ **Phase 11**: UI/UX Enhancements (Mobile-optimized 2-column portfolio cards)
- ✅ **Phase 12**: Advanced SIP List View (Tabular view with sorting and responsive design)
- ✅ **Phase 13**: SIP Pause Functionality (Pause/Resume with date tracking)
- ✅ **Phase 14**: SIP Detail View & Transaction History (Complete SIP details with installment history)
- ✅ **Phase 15**: Locking Period & Available Withdrawal (Withdrawal restrictions and availability calculations)

**Current Phase**: Phase 19 - Header & Navigation Redesign
**Next Action**: Create modern, responsive header with improved navigation and user experience

**🚀 Upcoming Enhanced Features:**
- ✅ **Phase 16**: SIP status management (active/inactive/completed) - COMPLETED
- ✅ **Phase 17**: Enhanced UX with context menus and clickable rows - COMPLETED
- ✅ **Phase 18**: Page reorganization with dedicated Withdrawals page - COMPLETED
- **Phase 19**: Modern header redesign with responsive navigation
- **Phase 20**: Comprehensive testing and deployment

**🎉 Major Accomplishments:**
- ✅ **Full Authentication System**: Secure login/signup with Supabase Auth + Google OAuth
- ✅ **Complete SIP Management**: Add, edit, delete SIPs with full validation
- ✅ **Complete Withdrawal System**: Add, edit, delete withdrawals with SIP linking
- ✅ **Real-time Calculations**: Automatic compound interest calculations
- ✅ **Responsive Dashboard**: Beautiful, mobile-first design with DaisyUI
- ✅ **Portfolio Summary**: Live aggregation of all investments and returns
- ✅ **Database Security**: Row Level Security ensuring user data isolation
- ✅ **Google OAuth Integration**: Seamless Google sign-in with proper cache management
- ✅ **User Switching**: Proper cache clearing when users switch accounts
- ✅ **Mobile-Optimized UI**: 2-column portfolio cards with responsive design
- ✅ **Advanced SIP List**: Tabular view with sorting, mobile cards, and consistent spacing
- ✅ **SIP Pause/Resume**: User-configurable pause dates with accurate calculations
- ✅ **SIP Detail Views**: Complete transaction history with installment-wise breakdown
- ✅ **Locking Period**: Withdrawal restrictions with available vs locked amount calculations
- ✅ **SIP Status Management**: Active/inactive/completed status with portfolio exclusion
- ✅ **Production Deployment**: Complete deployment guide with Supabase configuration

**🚀 Core MVP Features (100% Complete):**
- Authentication with email/password and Google OAuth
- SIP investment tracking with compound interest calculations
- Withdrawal management with portfolio impact
- Real-time portfolio dashboard with all key metrics
- Mobile-responsive design optimized for all devices
- Secure user switching with automatic cache management

**Issues Resolved:**
- ✅ Fixed PostCSS configuration for Tailwind CSS
- ✅ Resolved DaisyUI compatibility by using Tailwind CSS v3.x
- ✅ Fixed TypeScript strict mode import issues
- ✅ Verified build process works correctly
- ✅ Implemented complete SIP CRUD with real-time calculations
- ✅ Fixed edit functionality with proper form validation
- ✅ Implemented Google OAuth with proper redirect handling
- ✅ Fixed React Query cache persistence when switching users
- ✅ Added automatic cache clearing on user authentication changes
- ✅ Applied bumblebee theme for improved visual appeal
- ✅ Optimized mobile portfolio cards with 2-column responsive layout
- ✅ Implemented advanced SIP list with sortable table and mobile-friendly cards
- ✅ Fixed spacing consistency across all dashboard sections

## Database Migrations

All database schema changes have been organized into sequential migration files in the `migrations/` folder:

### Migration Files
1. **`001_initial_setup.sql`** - Base database schema with SIPs and withdrawals tables
2. **`002_add_pause_functionality.sql`** - Adds pause/resume functionality to SIPs  
3. **`003_add_locking_period.sql`** - Adds locking period feature for withdrawal restrictions

### Quick Setup
- **New installations**: Run `migrations/run_all_migrations.sql` (contains all migrations)
- **Existing installations**: Run individual migration files in sequence
- **Documentation**: See `migrations/README.md` for detailed instructions

### Migration History
- **Phase 1-12**: Initial setup and core features (`001_initial_setup.sql`)
- **Phase 13**: SIP pause functionality (`002_add_pause_functionality.sql`)
- **Phase 15**: Locking period feature (`003_add_locking_period.sql`)

## Notes
- Each phase should be completed and tested before moving to the next
- Regular commits after each sub-task completion
- Update this document as progress is made
- Focus on mobile-first responsive design throughout
- All database changes are tracked in sequential migration files
