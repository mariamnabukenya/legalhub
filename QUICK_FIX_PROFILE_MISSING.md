# Quick Fix: Profile Missing for User

## Problem

You're getting this error:
```
Cannot coerce the result to a single JSON object
The result contains 0 rows
```

**This means:** Your user exists in `auth.users` but the profile doesn't exist in `profiles` table.

## Your User Details

- **User ID:** `6eedd8ec-5b80-4c5c-b84e-110954b5e38b`
- **Email:** `admin@legalhub.com`
- **Status:** User exists in Authentication ✅
- **Profile:** Missing ❌

## Quick Fix: Create Profile

### Step 1: Run This SQL

Go to **Supabase Dashboard** → **SQL Editor** and run:

```sql
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
  '6eedd8ec-5b80-4c5c-b84e-110954b5e38b',  -- Your User ID
  'admin@legalhub.com',                     -- Your email
  'Admin User',                             -- Your name
  NULL,                                     -- Phone (optional)
  'admin',                                  -- ⚠️ MUST be 'admin'
  'premium',                                -- Subscription tier
  0,                                        -- Storage
  NOW(),
  NOW()
);
```

### Step 2: Verify

```sql
SELECT email, full_name, user_type FROM profiles 
WHERE id = '6eedd8ec-5b80-4c5c-b84e-110954b5e38b';
```

Should show: `user_type = 'admin'`

### Step 3: Login Again

1. **Logout** if currently logged in
2. Go to `/admin/login`
3. Login with:
   - Email: `admin@legalhub.com`
   - Password: (your password)
4. Should work now! ✅

---

## Why This Happened

The automatic trigger should have created the profile, but it might:
- Not be set up yet
- Have failed during user creation
- Not have run for existing users

## Prevent Future Issues

Make sure the automatic trigger is set up:

1. Run `database/auto_create_profile_trigger.sql` in SQL Editor
2. This will create profiles automatically for new users
3. For existing users, create profiles manually (like above)

---

## Alternative: Use Table Editor

1. Go to **Table Editor** → **profiles**
2. Click **"Insert row"**
3. Fill in:
   - **id:** `6eedd8ec-5b80-4c5c-b84e-110954b5e38b`
   - **email:** `admin@legalhub.com`
   - **full_name:** `Admin User`
   - **user_type:** `admin` ⚠️
   - **subscription_tier:** `premium`
   - **storage_used_mb:** `0`
4. Click **"Save"**

---

**After creating the profile, the 406 error should be gone and you can login!**

