-- SQL Script to Create Admin User
-- 
-- IMPORTANT: You must create the auth user in Supabase Dashboard FIRST!
-- 
-- Steps:
-- 1. Go to Supabase Dashboard → Authentication → Users
-- 2. Click "Add User"
-- 3. Enter email and password
-- 4. Enable "Auto Confirm User"
-- 5. Copy the User ID
-- 6. Replace 'YOUR-USER-ID-HERE' below with the actual User ID
-- 7. Run this SQL script

-- ============================================
-- OPTION 1: Create New Admin User
-- ============================================
-- Replace all the values below with your actual data

INSERT INTO profiles (
  id,
  email,
  full_name,
  phone,
  user_type,
  subscription_tier,
  storage_used_mb,
  created_at,
  updated_at
) VALUES (
  'YOUR-USER-ID-HERE',              -- ⚠️ REPLACE: Get from Authentication → Users
  'admin@legalhub.com',              -- ⚠️ REPLACE: Your admin email
  'Admin User',                      -- ⚠️ REPLACE: Admin's full name
  '+1234567890',                     -- ⚠️ REPLACE: Phone number (or NULL)
  'admin',                           -- ⚠️ MUST BE 'admin' (don't change this)
  'premium',                         -- ⚠️ REPLACE: 'free', 'basic', or 'premium'
  0,                                 -- Storage used (keep as 0)
  NOW(),
  NOW()
);

-- ============================================
-- OPTION 2: Convert Existing User to Admin
-- ============================================
-- If you already have a user and want to make them admin:

-- UPDATE profiles 
-- SET user_type = 'admin',
--     updated_at = NOW()
-- WHERE id = 'YOUR-USER-ID-HERE';  -- ⚠️ REPLACE: Your user's ID

-- ============================================
-- OPTION 3: Create Default Test Admin
-- ============================================
-- Default credentials for testing:
-- Email: admin@legalhub.com
-- Password: Admin@123456 (⚠️ Change this!)

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
--   'AUTH-USER-ID-FROM-DASHBOARD',  -- ⚠️ Get this from Authentication → Users
--   'admin@legalhub.com',
--   'System Administrator',
--   NULL,
--   'admin',
--   'premium',
--   0,
--   NOW(),
--   NOW()
-- );

-- ============================================
-- VERIFY ADMIN USER
-- ============================================
-- Run this to check if admin was created correctly:

-- SELECT 
--   id,
--   email,
--   full_name,
--   user_type,
--   subscription_tier,
--   created_at
-- FROM profiles
-- WHERE user_type = 'admin';

-- ============================================
-- NOTES
-- ============================================
-- 1. The 'id' field MUST match the User ID from Supabase Authentication
-- 2. The 'user_type' MUST be exactly 'admin' (lowercase)
-- 3. After creating, logout and login again to see admin access
-- 4. Admin can access:
--    - /admin (Admin Dashboard)
--    - /books/post (Post Books)
--    - All admin modules

