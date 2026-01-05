-- Fix analytics RLS for visitor tracking
-- Run this in Supabase SQL Editor

-- Disable RLS on analytics to allow public inserts
ALTER TABLE analytics DISABLE ROW LEVEL SECURITY;

-- Ensure the table has the correct structure
CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_path VARCHAR(255),
  visitor_id VARCHAR(100),
  session_id VARCHAR(100),
  action_type VARCHAR(50) DEFAULT 'page_view',
  visitor_ip VARCHAR(45),
  device_type VARCHAR(20),
  country VARCHAR(100),
  user_agent TEXT,
  referrer TEXT,
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add visited_at if using created_at
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'analytics' AND column_name = 'visited_at'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'analytics' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE analytics RENAME COLUMN created_at TO visited_at;
  END IF;
END $$;

-- Verify the table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'analytics'
ORDER BY ordinal_position;

-- Check for existing data
SELECT COUNT(*) as total_visits FROM analytics;
