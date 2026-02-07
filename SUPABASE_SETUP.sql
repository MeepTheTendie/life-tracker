-- Life Tracker Database Setup
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/zmrnfedkieoaxcnaalqn/sql/new

-- Create habit_entries table
CREATE TABLE IF NOT EXISTS habit_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  habit_data TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Enable Row Level Security
ALTER TABLE habit_entries ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (single user app)
CREATE POLICY "Public access" ON habit_entries FOR ALL USING (true);

-- Verify table created
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
