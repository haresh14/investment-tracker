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
   - Run the SQL script from `supabase-setup.sql` in your Supabase SQL editor
   - This creates the required tables, indexes, and Row Level Security policies

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