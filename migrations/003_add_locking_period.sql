-- Migration: Add SIP Locking Period Functionality
-- This script adds locking period functionality to the SIPs table

-- Add locking period columns to the sips table
ALTER TABLE sips 
ADD COLUMN lock_period_months INTEGER DEFAULT 0,
ADD COLUMN lock_end_date DATE;

-- Add index for better query performance on locking period
CREATE INDEX idx_sips_lock_period ON sips(lock_period_months);
CREATE INDEX idx_sips_lock_end_date ON sips(lock_end_date);

-- Update existing SIPs to have no locking period by default
UPDATE sips SET lock_period_months = 0 WHERE lock_period_months IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN sips.lock_period_months IS 'Locking period in months (0 = no lock, >0 = locked for specified months)';
COMMENT ON COLUMN sips.lock_end_date IS 'Date when the locking period ends (calculated from start_date + lock_period_months)';
