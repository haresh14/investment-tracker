-- Migration: Add SIP Pause Functionality
-- This script adds pause/resume functionality to the SIPs table

-- Add pause-related columns to the sips table
ALTER TABLE sips 
ADD COLUMN pause_date DATE,
ADD COLUMN is_paused BOOLEAN DEFAULT FALSE;

-- Add index for better query performance on paused SIPs
CREATE INDEX idx_sips_is_paused ON sips(is_paused);
CREATE INDEX idx_sips_pause_date ON sips(pause_date);

-- Update existing SIPs to have is_paused = false (default)
UPDATE sips SET is_paused = FALSE WHERE is_paused IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN sips.pause_date IS 'Date when the SIP was paused (NULL if never paused or currently active)';
COMMENT ON COLUMN sips.is_paused IS 'Current pause status of the SIP (TRUE = paused, FALSE = active)';
