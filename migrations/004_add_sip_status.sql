-- Migration: Add SIP Status Management
-- This script adds status functionality to the SIPs table

-- Add status column to the sips table
ALTER TABLE sips
ADD COLUMN status VARCHAR(20) DEFAULT 'active';

-- Add index for better query performance on status
CREATE INDEX idx_sips_status ON sips(status);

-- Update existing SIPs to have active status by default
UPDATE sips SET status = 'active' WHERE status IS NULL;

-- Add check constraint to ensure valid status values
ALTER TABLE sips
ADD CONSTRAINT chk_sip_status 
CHECK (status IN ('active', 'inactive', 'completed'));

-- Add comment for documentation
COMMENT ON COLUMN sips.status IS 'Current status of the SIP (active, inactive, completed)';
