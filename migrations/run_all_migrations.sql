-- Investment Tracker - Complete Database Setup
-- Run this script in Supabase SQL Editor to set up the complete database
-- This script combines all migrations in the correct order
-- Last updated: Added SIP Status Management (Migration 004)

-- ============================================================================
-- MIGRATION 001: Initial Setup
-- ============================================================================

-- Create SIPs table
CREATE TABLE IF NOT EXISTS sips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    start_date DATE NOT NULL,
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    annual_return DECIMAL(5,2) NOT NULL CHECK (annual_return >= 0 AND annual_return <= 100),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create withdrawals table
CREATE TABLE IF NOT EXISTS withdrawals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    date DATE NOT NULL,
    sip_id UUID REFERENCES sips(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sips_user_id ON sips(user_id);
CREATE INDEX IF NOT EXISTS idx_sips_start_date ON sips(start_date);
CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id ON withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_sip_id ON withdrawals(sip_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_date ON withdrawals(date);

-- Enable Row Level Security
ALTER TABLE sips ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for sips table
CREATE POLICY "Users can view their own sips" ON sips
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sips" ON sips
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sips" ON sips
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sips" ON sips
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for withdrawals table
CREATE POLICY "Users can view their own withdrawals" ON withdrawals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own withdrawals" ON withdrawals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own withdrawals" ON withdrawals
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own withdrawals" ON withdrawals
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for sips table
CREATE TRIGGER update_sips_updated_at 
    BEFORE UPDATE ON sips 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- MIGRATION 002: Add Pause Functionality
-- ============================================================================

-- Add pause-related columns to the sips table
ALTER TABLE sips 
ADD COLUMN IF NOT EXISTS pause_date DATE,
ADD COLUMN IF NOT EXISTS is_paused BOOLEAN DEFAULT FALSE;

-- Add index for better query performance on paused SIPs
CREATE INDEX IF NOT EXISTS idx_sips_is_paused ON sips(is_paused);
CREATE INDEX IF NOT EXISTS idx_sips_pause_date ON sips(pause_date);

-- Update existing SIPs to have is_paused = false (default)
UPDATE sips SET is_paused = FALSE WHERE is_paused IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN sips.pause_date IS 'Date when the SIP was paused (NULL if never paused or currently active)';
COMMENT ON COLUMN sips.is_paused IS 'Current pause status of the SIP (TRUE = paused, FALSE = active)';

-- ============================================================================
-- MIGRATION 003: Add Locking Period Functionality
-- ============================================================================

-- Add locking period columns to the sips table
ALTER TABLE sips 
ADD COLUMN IF NOT EXISTS lock_period_months INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS lock_end_date DATE;

-- Add index for better query performance on locking period
CREATE INDEX IF NOT EXISTS idx_sips_lock_period ON sips(lock_period_months);
CREATE INDEX IF NOT EXISTS idx_sips_lock_end_date ON sips(lock_end_date);

-- Update existing SIPs to have no locking period by default
UPDATE sips SET lock_period_months = 0 WHERE lock_period_months IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN sips.lock_period_months IS 'Locking period in months (0 = no lock, >0 = locked for specified months)';
COMMENT ON COLUMN sips.lock_end_date IS 'Date when the locking period ends (calculated from start_date + lock_period_months)';

-- ============================================================================
-- SETUP COMPLETE
-- ============================================================================

-- Your Investment Tracker database is now ready!
-- You can now start the application and begin tracking your SIP investments.

-- ============================================================================
-- MIGRATION 004: Add SIP Status Management
-- ============================================================================

-- Add status column to the sips table
ALTER TABLE sips
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';

-- Add index for better query performance on status
CREATE INDEX IF NOT EXISTS idx_sips_status ON sips(status);

-- Update existing SIPs to have active status by default
UPDATE sips SET status = 'active' WHERE status IS NULL;

-- Add check constraint to ensure valid status values
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'chk_sip_status' 
        AND table_name = 'sips'
    ) THEN
        ALTER TABLE sips
        ADD CONSTRAINT chk_sip_status 
        CHECK (status IN ('active', 'inactive', 'completed'));
    END IF;
END $$;

-- Add comment for documentation
COMMENT ON COLUMN sips.status IS 'Current status of the SIP (active, inactive, completed)';

-- ============================================================================
-- Sample Data (Optional)
-- ============================================================================

-- Optional: Insert sample data for testing (uncomment the lines below)
-- Note: This will only work after you've authenticated at least once in the app

-- INSERT INTO sips (name, start_date, amount, annual_return, user_id) 
-- VALUES ('Sample Tech Fund', '2024-01-01', 5000.00, 12.00, auth.uid());

-- INSERT INTO withdrawals (amount, date, user_id) 
-- VALUES (10000.00, '2024-06-01', auth.uid());
