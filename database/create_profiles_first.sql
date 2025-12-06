-- Create profiles table FIRST before running the main schema
-- This ensures the profiles table exists before other tables reference it

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  user_type TEXT DEFAULT 'client' CHECK (user_type IN ('client', 'lawyer', 'admin')),
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'premium')),
  storage_used_mb NUMERIC(10,2) DEFAULT 0,
  avatar_url TEXT,
  subscription_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
    CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

    CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Note: After running this, you can run the main schema.sql file

