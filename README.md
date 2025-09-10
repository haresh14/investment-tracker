# Investment Tracker App

A lightweight personal finance tool for tracking SIP (Systematic Investment Plan) investments, calculating expected returns, and managing withdrawals.

## Features

- 📊 **SIP Management**: Track multiple SIP investments with auto-calculated installments
- 💰 **Expected Returns**: Calculate compound interest returns using standard SIP formula
- 📤 **Withdrawal Tracking**: Record and track withdrawals from investments
- 📈 **Portfolio Dashboard**: View comprehensive portfolio summary and insights
- 🔐 **Secure Authentication**: Email/password and Google OAuth via Supabase Auth
- 👥 **User Switching**: Seamless account switching with automatic data isolation
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

4. **Set up database schema**
   - Go to your Supabase project dashboard → SQL Editor
   - Copy and paste the contents of `migrations/run_all_migrations.sql`
   - Execute the script to create all required tables, indexes, and security policies
   - See `migrations/README.md` for detailed migration instructions

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

7. **Optional: Set up Google OAuth** (Recommended)
   - Follow the detailed setup guide in `docs/GOOGLE_OAUTH_SETUP.md`
   - Configure Google Cloud Console and Supabase OAuth settings

## Development Status

### ✅ Completed Features (MVP Ready!)
- **Authentication System**: Email/password + Google OAuth
- **SIP Management**: Full CRUD operations with validation
- **Withdrawal System**: Complete tracking with SIP linking
- **Portfolio Dashboard**: Real-time calculations and summaries
- **Responsive Design**: Mobile-first UI with DaisyUI
- **Data Security**: Row Level Security and user isolation
- **User Switching**: Automatic cache management

### 🚀 Current Status: Production Ready
All core MVP features are complete and tested. The app is ready for production deployment.

### 📋 Next Steps (Optional Enhancements)
- Unit testing implementation
- Performance optimization
- Advanced analytics
- Data export features

## Database Setup

The application uses Supabase PostgreSQL with the following schema:

### Tables
- **sips**: SIP investment records with pause and locking functionality
- **withdrawals**: Withdrawal transaction records linked to SIPs

### Key Features
- **Row Level Security (RLS)**: Users can only access their own data
- **Pause Functionality**: Temporarily pause SIP calculations
- **Locking Period**: Set withdrawal restrictions for specific periods
- **Automatic Timestamps**: Created/updated timestamps with triggers

### Migration Files
All database migrations are located in the `migrations/` folder:
- `run_all_migrations.sql` - Complete setup script (recommended)
- `001_initial_setup.sql` - Base tables and security
- `002_add_pause_functionality.sql` - SIP pause feature
- `003_add_locking_period.sql` - Investment locking feature

For detailed migration instructions, see `migrations/README.md`.

## Project Structure

```
investment-tracker/
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components  
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   ├── lib/               # Library configurations
│   ├── types/             # TypeScript type definitions
│   └── main.tsx           # App entry point
├── migrations/            # Database migration files
│   ├── run_all_migrations.sql     # Complete setup script
│   ├── 001_initial_setup.sql      # Base schema
│   ├── 002_add_pause_functionality.sql
│   ├── 003_add_locking_period.sql
│   └── README.md          # Migration instructions
├── docs/                  # Documentation
│   ├── DEVELOPMENT_PLAN.md
│   ├── PRD.md
│   └── CONTEXT.md
└── README.md              # This file
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

## Authentication Options

### Email/Password Authentication
- Standard email and password signup/signin
- Secure password handling via Supabase Auth
- Email verification and password reset support

### Google OAuth (Recommended)
- One-click Google sign-in
- Automatic account creation
- Secure OAuth flow with proper redirects
- Setup guide available in `docs/GOOGLE_OAUTH_SETUP.md`

## Contributing

1. Follow the development phases outlined in `docs/DEVELOPMENT_PLAN.md`
2. Test each phase thoroughly before proceeding
3. Update documentation as features are implemented
4. Use TypeScript strict mode and proper error handling

## License

MIT License - see LICENSE file for details

## Support

For questions or issues, please refer to the development plan in `docs/DEVELOPMENT_PLAN.md` or create an issue in the repository.