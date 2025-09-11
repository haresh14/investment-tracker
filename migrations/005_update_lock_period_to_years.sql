-- Migration 005: Update lock period from months to years
-- This migration changes the lock period to be stored in years instead of months
-- and updates the column name to be more descriptive

-- Add new column for lock period in years
ALTER TABLE sips ADD COLUMN lock_period_years DECIMAL(3,1) DEFAULT 0;

-- Migrate existing data from months to years (divide by 12)
UPDATE sips SET lock_period_years = COALESCE(lock_period_months, 0) / 12.0;

-- Drop the old months column
ALTER TABLE sips DROP COLUMN IF EXISTS lock_period_months;

-- Drop the old lock_end_date column as we'll calculate this per installment
ALTER TABLE sips DROP COLUMN IF EXISTS lock_end_date;

-- Add comment for clarity
COMMENT ON COLUMN sips.lock_period_years IS 'Lock-in period in years for each installment';
