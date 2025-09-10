-- Investment Tracker Database Schema
-- Run this script in Supabase SQL Editor

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

-- Insert sample data for testing (optional)
-- This will only work after you've authenticated at least once
-- INSERT INTO sips (name, start_date, amount, annual_return, user_id) 
-- VALUES ('HDFC Equity Fund', '2024-01-01', 5000.00, 12.00, auth.uid());

-- INSERT INTO withdrawals (amount, date, user_id) 
-- VALUES (10000.00, '2024-06-01', auth.uid());
