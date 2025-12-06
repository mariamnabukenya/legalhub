-- ============================================
-- ADMIN USER CREATION - AUTOMATIC METHOD (RECOMMENDED)
-- ============================================
-- 
-- ✅ NO SQL NEEDED! Profile is created automatically!
-- ✅ NO USER ID NEEDED! Generated automatically!
--
-- Just create auth user in Dashboard with admin metadata:
-- 1. Go to Authentication → Users → Add User
-- 2. Enter email and password
-- 3. Add metadata: {"user_type": "admin", "full_name": "Admin User"}
-- 4. Done! Profile created automatically!
--
-- ============================================
-- MANUAL INSERT METHOD (Only if trigger doesn't work)
-- ============================================
-- 
-- IMPORTANT: You MUST create the auth user FIRST!
-- 
-- Step 1: Create Auth User in Supabase Dashboard
--   - Go to Authentication → Users → Add User
--   - Email: admin@legalhub.com
--   - Password: Admin@123456
--   - Auto Confirm: ✅
--   - Copy the User ID (UUID)
--
-- Step 2: Replace 'YOUR-USER-ID-HERE' below with the actual UUID
-- Step 3: Run this SQL script
--
-- ============================================

-- ============================================
-- OPTION 1: Complete Admin User Insert
-- ============================================
-- Replace 'YOUR-USER-ID-HERE' with the UUID from Authentication → Users

INSERT INTO profiles (
  id,
  email,
  full_name,
  phone,
  user_type,
  subscription_tier,
  storage_used_mb,
  avatar_url,
  subscription_expires_at,
  created_at,
  updated_at
) VALUES (
  'YOUR-USER-ID-HERE',                    -- ⚠️ REPLACE: Get from Authentication → Users
  'admin@legalhub.com',                    -- Admin email
  'System Administrator',                   -- Full name
  '+1234567890',                           -- Phone number (or NULL)
  'admin',                                 -- ⚠️ MUST be 'admin'
  'premium',                               -- Subscription tier: 'free', 'basic', or 'premium'
  0,                                       -- Storage used in MB
  NULL,                                    -- Avatar URL (optional)
  NULL,                                    -- Subscription expiry (optional)
  NOW(),                                   -- Created timestamp
  NOW()                                    -- Updated timestamp
);

-- ============================================
-- OPTION 2: Quick Admin Insert (Minimal Fields)
-- ============================================

-- INSERT INTO profiles (
--   id,
--   email,
--   full_name,
--   user_type,
--   subscription_tier,
--   storage_used_mb
-- ) VALUES (
--   'YOUR-USER-ID-HERE',                   -- ⚠️ REPLACE: Get from Authentication → Users
--   'admin@legalhub.com',
--   'Admin User',
--   'admin',
--   'premium',
--   0
-- );

-- ============================================
-- OPTION 3: Insert with Custom Details
-- ============================================
-- Customize all values to your needs

-- INSERT INTO profiles (
--   id,
--   email,
--   full_name,
--   phone,
--   user_type,
--   subscription_tier,
--   storage_used_mb,
--   avatar_url,
--   subscription_expires_at,
--   created_at,
--   updated_at
-- ) VALUES (
--   'YOUR-USER-ID-HERE',                   -- ⚠️ REPLACE: UUID from Authentication
--   'your-admin@example.com',              -- Your email
--   'Your Full Name',                      -- Your name
--   '+1234567890',                         -- Your phone
--   'admin',                               -- Must be 'admin'
--   'premium',                             -- 'free', 'basic', or 'premium'
--   0,                                     -- Storage starts at 0
--   'https://example.com/avatar.jpg',      -- Avatar URL (optional)
--   '2025-12-31 23:59:59',                -- Subscription expiry (optional)
--   NOW(),
--   NOW()
-- );

-- ============================================
-- VERIFY THE INSERT
-- ============================================
-- Run this to check if admin was created:

-- SELECT 
--   id,
--   email,
--   full_name,
--   phone,
--   user_type,
--   subscription_tier,
--   storage_used_mb,
--   created_at
-- FROM profiles
-- WHERE email = 'admin@legalhub.com';

-- ============================================
-- EXAMPLE WITH REAL VALUES
-- ============================================
-- Here's an example with sample UUID (replace with your actual UUID):

-- INSERT INTO profiles (
--   id,
--   email,
--   full_name,
--   phone,
--   user_type,
--   subscription_tier,
--   storage_used_mb,
--   created_at,
--   updated_at
-- ) VALUES (
--   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',  -- Example UUID (replace with real one)
--   'admin@legalhub.com',
--   'John Admin',
--   '+1234567890',
--   'admin',
--   'premium',
--   0,
--   NOW(),
--   NOW()
-- );

-- ============================================
-- NOTES
-- ============================================
-- 1. Password is NOT stored in profiles table
-- 2. Password is managed by Supabase Auth (auth.users table)
-- 3. You must create the auth user FIRST in Supabase Dashboard
-- 4. The 'id' field MUST match the User ID from auth.users
-- 5. After inserting, logout and login again to see admin access
-- 6. Admin can access: /admin, /books/post, etc.

