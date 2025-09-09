# Investment Tracker App

A lightweight personal finance tool for tracking SIP (Systematic Investment Plan) investments, calculating expected returns, and managing withdrawals.

## Features

- 📊 **SIP Management**: Track multiple SIP investments with auto-calculated installments
- 💰 **Expected Returns**: Calculate compound interest returns using standard SIP formula
- 📤 **Withdrawal Tracking**: Record and track withdrawals from investments
- 📈 **Portfolio Dashboard**: View comprehensive portfolio summary and insights
- 🔐 **Secure Authentication**: User authentication via Supabase Auth
- 📱 **Mobile Responsive**: Optimized for mobile and desktop use

## Tech Stack

- **Frontend**: React + Vite + TypeScript
- **Styling**: Tailwind CSS + DaisyUI
- **State Management**: React Query (TanStack Query)
- **Backend**: Supabase (PostgreSQL + Auth + Row Level Security)
- **Deployment**: Vercel (frontend) + Supabase (backend)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd investment-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   
   > **Note**: If you encounter PostCSS/Tailwind errors, the `@tailwindcss/postcss` plugin is already configured.

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Create a `.env.local` file:
   ```bash
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up database schema** (Coming in Phase 3)
   ```sql
   -- Will be provided in the next development phase
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## Development Phases

### ✅ Phase 1: Project Foundation (Completed)
- [x] Development plan and documentation
- [x] Tech stack selection and architecture design

### 🔄 Phase 2: Project Setup (In Progress)
- [x] React project with Vite + TypeScript
- [x] Tailwind CSS + DaisyUI setup
- [x] React Query configuration
- [x] Basic routing structure
- [x] Project folder organization
- [x] Basic UI components (Dashboard, Login)
- [ ] Environment setup and testing

### 📋 Phase 3: Supabase Configuration (Planned)
- Database schema design
- Row Level Security policies
- Authentication setup

### 📋 Phase 4+: Core Features (Planned)
- Authentication system
- SIP management
- Calculation engine
- Withdrawal tracking
- Portfolio dashboard

## Project Structure

```
src/
├── components/         # Reusable UI components
├── pages/             # Page components
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
├── lib/               # Library configurations
├── types/             # TypeScript type definitions
└── main.tsx           # App entry point
```

## Key Formulas

### SIP Expected Value Calculation
```typescript
FutureValue = SIP × ((1 + r/12)^n - 1) / (r/12)
```
Where:
- `SIP` = Monthly investment amount
- `r` = Annual expected return (as decimal)
- `n` = Number of installments paid

## Contributing

1. Follow the development phases outlined in `docs/DEVELOPMENT_PLAN.md`
2. Test each phase thoroughly before proceeding
3. Update documentation as features are implemented
4. Use TypeScript strict mode and proper error handling

## License

MIT License - see LICENSE file for details

## Support

For questions or issues, please refer to the development plan in `docs/DEVELOPMENT_PLAN.md` or create an issue in the repository.