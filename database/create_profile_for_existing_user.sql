-- ============================================
-- Create Profile for Existing User
-- ============================================
-- Use this when a user exists in auth.users but profile is missing
-- 
-- Replace the values below with your actual user details

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
  '6eedd8ec-5b80-4c5c-b84e-110954b5e38b',  -- ⚠️ Your User ID from Authentication
  'admin@legalhub.com',                     -- ⚠️ Your email
  'Admin User',                              -- ⚠️ Your full name
  NULL,                                      -- Phone (optional)
  'admin',                                   -- ⚠️ MUST be 'admin' for admin access
  'premium',                                 -- Subscription tier
  0,                                         -- Storage used
  NOW(),
  NOW()
);

-- ============================================
-- Verify Profile Was Created
-- ============================================

SELECT 
  id,
  email,
  full_name,
  user_type,
  subscription_tier,
  created_at
FROM profiles
WHERE id = '6eedd8ec-5b80-4c5c-b84e-110954b5e38b';

-- Should show your profile with user_type = 'admin'

