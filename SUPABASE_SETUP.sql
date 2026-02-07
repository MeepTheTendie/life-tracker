-- Iron Tracker & Life Tracker Database Setup
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/vihmrwjkxuubvjkztiwe/sql/new

-- ============ IRON TRACKER TABLES ============

-- Create daily_rituals table for Iron Tracker
CREATE TABLE IF NOT EXISTS daily_rituals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  am_squats_completed BOOLEAN DEFAULT FALSE,
  steps_completed BOOLEAN DEFAULT FALSE,
  bike_completed BOOLEAN DEFAULT FALSE,
  pm_squats_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Create user_stats table for Iron Tracker
CREATE TABLE IF NOT EXISTS user_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  streak INTEGER DEFAULT 0,
  total_lifts INTEGER DEFAULT 0,
  max_weight INTEGER DEFAULT 0,
  calories TEXT DEFAULT '0',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============ LIFE TRACKER TABLES ============

-- Create habit_entries table for Life Tracker
CREATE TABLE IF NOT EXISTS habit_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  habit_data TEXT, -- JSON array of habits with completion status
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- ============ SECURITY POLICIES ============

-- Enable RLS on all tables
ALTER TABLE daily_rituals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (single user app)
CREATE POLICY "Public access daily_rituals" ON daily_rituals FOR ALL USING (true);
CREATE POLICY "Public access user_stats" ON user_stats FOR ALL USING (true);
CREATE POLICY "Public access habit_entries" ON habit_entries FOR ALL USING (true);

-- ============ VERIFY ============
-- Run this to check tables were created:
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
