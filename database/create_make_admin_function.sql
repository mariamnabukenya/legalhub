-- ============================================
-- Create make_user_admin() Function
-- ============================================
-- Run this SQL to create the function that makes users admin
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
-- Test the Function
-- ============================================
-- After creating the function, test it:

-- SELECT make_user_admin('admin@legalhub.com');

-- ============================================
-- Verify It Works
-- ============================================

-- SELECT email, user_type FROM profiles WHERE email = 'admin@legalhub.com';
-- Should show: user_type = 'admin'

