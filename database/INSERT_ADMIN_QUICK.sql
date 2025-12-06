-- ============================================
-- AUTOMATIC ADMIN CREATION - NO SQL NEEDED!
-- ============================================
-- 
-- ✅ Profile is created AUTOMATICALLY when you create auth user!
-- ✅ User ID is generated AUTOMATICALLY by Supabase!
-- ✅ No manual INSERT needed!
--
-- ============================================
-- METHOD 1: Create Admin via Dashboard (EASIEST)
-- ============================================
--
-- 1. Go to Supabase Dashboard → Authentication → Users → Add User
-- 2. Enter:
--    - Email: admin@legalhub.com
--    - Password: Admin@123456
--    - Auto Confirm: ✅
--    - User Metadata (IMPORTANT - Add this JSON):
--      {
--        "full_name": "Admin User",
--        "user_type": "admin",
--        "subscription_tier": "premium"
--      }
-- 3. Click "Create User"
--
-- ✅ DONE! Profile created automatically with admin privileges!
-- ✅ User ID generated automatically!
-- ✅ No SQL needed!
--
-- ============================================
-- METHOD 2: Make Existing User Admin (If Already Created)
-- ============================================
-- If you already created a user without admin metadata, just run:

SELECT make_user_admin('admin@legalhub.com');

-- That's it! No User ID needed - uses email!

-- ============================================
-- METHOD 3: Manual Update (If Needed)
-- ============================================
-- Only use this if automatic trigger didn't work:

UPDATE profiles 
SET user_type = 'admin',
    updated_at = NOW()
WHERE email = 'admin@legalhub.com';

-- ============================================
-- VERIFY ADMIN WAS CREATED
-- ============================================

SELECT email, full_name, user_type, subscription_tier, created_at
FROM profiles
WHERE email = 'admin@legalhub.com';

-- Should show: user_type = 'admin'
