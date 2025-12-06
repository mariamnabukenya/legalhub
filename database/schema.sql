-- LegalHub Database Schema
-- This file contains all the necessary tables for the book/document posting and payment system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
-- IMPORTANT: If profiles table doesn't exist, run create_profiles_first.sql first
-- Or uncomment the section below to create it here

-- Uncomment if profiles table doesn't exist:
/*
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

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
*/

-- Legal Documents/Books table
-- Note: created_by is nullable in case profiles table doesn't exist yet
CREATE TABLE IF NOT EXISTS legal_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  author TEXT,
  description TEXT,
  category TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  cover_image_url TEXT,
  file_url TEXT NOT NULL,
  downloads INTEGER DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 0,
  year INTEGER,
  created_by UUID,  -- Will add foreign key constraint after profiles table exists
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add foreign key constraint if profiles table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
    ALTER TABLE legal_documents 
    ADD CONSTRAINT fk_legal_documents_created_by 
    FOREIGN KEY (created_by) REFERENCES profiles(id);
  END IF;
END $$;

-- User Purchases table (tracks which books users have purchased)
CREATE TABLE IF NOT EXISTS user_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,  -- Will add foreign key constraint after profiles table exists
  document_id UUID NOT NULL,  -- Will add foreign key constraint after legal_documents exists
  amount_paid NUMERIC(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_reference TEXT,
  purchased_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, document_id) -- Prevent duplicate purchases
);

-- Add foreign key constraints if tables exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
    ALTER TABLE user_purchases 
    ADD CONSTRAINT fk_user_purchases_user_id 
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'legal_documents') THEN
    ALTER TABLE user_purchases 
    ADD CONSTRAINT fk_user_purchases_document_id 
    FOREIGN KEY (document_id) REFERENCES legal_documents(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Notifications table (for purchase confirmations)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,  -- Will add foreign key constraint after profiles table exists
  title TEXT NOT NULL,
  message TEXT,
  type TEXT DEFAULT 'payment' CHECK (type IN ('case', 'appointment', 'payment', 'document')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add foreign key constraint if profiles table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
    ALTER TABLE notifications 
    ADD CONSTRAINT fk_notifications_user_id 
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_legal_documents_category ON legal_documents(category);
CREATE INDEX IF NOT EXISTS idx_legal_documents_created_at ON legal_documents(created_at);
CREATE INDEX IF NOT EXISTS idx_user_purchases_user_id ON user_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_user_purchases_document_id ON user_purchases(document_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- Function to increment downloads
CREATE OR REPLACE FUNCTION increment_downloads(doc_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE legal_documents
  SET downloads = downloads + 1
  WHERE id = doc_id;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) Policies
-- Note: Only enable RLS if tables exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'legal_documents') THEN
    ALTER TABLE legal_documents ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_purchases') THEN
    ALTER TABLE user_purchases ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'notifications') THEN
    ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Legal Documents: Everyone can read, only admins can insert/update/delete
CREATE POLICY "Anyone can view legal documents" ON legal_documents
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert documents" ON legal_documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.user_type = 'admin'
    )
  );

CREATE POLICY "Admins can update documents" ON legal_documents
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.user_type = 'admin'
    )
  );

CREATE POLICY "Admins can delete documents" ON legal_documents
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.user_type = 'admin'
    )
  );

-- User Purchases: Users can view their own purchases, anyone can insert (for payment processing)
CREATE POLICY "Users can view own purchases" ON user_purchases
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create purchases" ON user_purchases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications: Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- Automatic Profile Creation Trigger
-- ============================================
-- This automatically creates a profile when a user signs up
-- Run this after creating the profiles table

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    phone,
    user_type,
    subscription_tier,
    storage_used_mb,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'client'),
    COALESCE(NEW.raw_user_meta_data->>'subscription_tier', 'free'),
    0,
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to make user admin easily
CREATE OR REPLACE FUNCTION public.make_user_admin(user_email TEXT)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET user_type = 'admin',
      updated_at = NOW()
  WHERE email = user_email;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

