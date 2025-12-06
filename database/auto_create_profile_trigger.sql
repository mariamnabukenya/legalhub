-- Automatic Profile Creation Trigger
-- This trigger automatically creates a profile record when a user signs up in Supabase Auth
-- No need to manually copy User IDs anymore!

-- ============================================
-- Step 1: Create Function to Handle New Users
-- ============================================

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
    NEW.id,                                    -- User ID from auth.users
    NEW.email,                                 -- Email from auth.users
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),  -- Full name from metadata or default
    NEW.raw_user_meta_data->>'phone',          -- Phone from metadata (optional)
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'client'),  -- User type from metadata or default 'client'
    COALESCE(NEW.raw_user_meta_data->>'subscription_tier', 'free'),  -- Subscription tier or default 'free'
    0,                                         -- Storage used starts at 0
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Step 2: Create Trigger
-- ============================================

-- Drop trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger that fires when a new user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Step 3: Create Function to Make User Admin
-- ============================================
-- This function allows you to easily convert any user to admin

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

-- ============================================
-- Usage Examples
-- ============================================

-- Example 1: User signs up normally
-- Profile is automatically created with user_type = 'client'

-- Example 2: Make an existing user admin
-- SELECT make_user_admin('admin@legalhub.com');

-- Example 3: Create admin user with metadata
-- When creating user in Supabase Dashboard, add metadata:
-- {
--   "full_name": "Admin User",
--   "user_type": "admin",
--   "subscription_tier": "premium"
-- }

-- ============================================
-- Notes
-- ============================================
-- 1. This trigger runs automatically when a user signs up
-- 2. Default user_type is 'client' unless specified in metadata
-- 3. To make a user admin, use: SELECT make_user_admin('email@example.com');
-- 4. Or update manually: UPDATE profiles SET user_type = 'admin' WHERE email = 'email@example.com';

