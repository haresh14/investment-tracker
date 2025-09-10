# Database Migrations

This folder contains all database migration files for the Investment Tracker application.

## Quick Setup (Recommended)

For new installations, simply run the complete migration script:

```sql
-- Copy and paste the contents of run_all_migrations.sql into Supabase SQL Editor
```

**File:** `run_all_migrations.sql`
- Contains all migrations in the correct order
- Safe to run multiple times (uses IF NOT EXISTS)
- Sets up the complete database schema

## Individual Migration Files

If you prefer to run migrations individually or need to understand the evolution of the schema:

### 1. Initial Setup
**File:** `001_initial_setup.sql`
- Creates `sips` and `withdrawals` tables
- Sets up Row Level Security (RLS) policies
- Creates indexes and triggers
- **Required:** Must be run first

### 2. Pause Functionality
**File:** `002_add_pause_functionality.sql`
- Adds `pause_date` and `is_paused` columns to `sips` table
- Creates indexes for pause-related queries
- **Depends on:** Migration 001

### 3. Locking Period Feature
**File:** `003_add_locking_period.sql`
- Adds `lock_period_months` and `lock_end_date` columns to `sips` table
- Creates indexes for locking period queries
- **Depends on:** Migration 001, 002

## How to Run Migrations

### Option 1: Complete Setup (Recommended)
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy the contents of `run_all_migrations.sql`
4. Paste and execute

### Option 2: Individual Migrations
1. Run migrations in order: 001 → 002 → 003
2. Copy contents of each file to Supabase SQL Editor
3. Execute one by one

## Database Schema Overview

After running all migrations, your database will have:

### Tables
- **sips**: SIP investment records with pause and locking functionality
- **withdrawals**: Withdrawal transaction records

### Key Columns
- `sips.pause_date`: When SIP was paused (nullable)
- `sips.is_paused`: Current pause status (boolean)
- `sips.lock_period_months`: Locking period in months (0 = no lock)
- `sips.lock_end_date`: When locking period ends (nullable)

### Security
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Policies enforce user isolation

## Troubleshooting

### Permission Errors
If you get permission errors, ensure you're running the SQL as a Supabase admin or service role.

### Column Already Exists
If you see "column already exists" errors, it's safe to ignore them. The migrations use `IF NOT EXISTS` clauses.

### Authentication Required
Some sample data insertions require user authentication. Sign up/login to the app first, then run sample data queries.

## Migration History

| Version | Description | Date Added |
|---------|-------------|------------|
| 001 | Initial database setup | Initial |
| 002 | SIP pause functionality | Phase 13 |
| 003 | Locking period feature | Phase 15 |
