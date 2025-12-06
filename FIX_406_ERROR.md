# Fix: 406 Error When Fetching Profiles

## Problem

You're getting 406 errors when trying to fetch profiles:
```
Failed to load resource: the server responded with a status of 406
Cannot coerce the result to a single JSON object
```

## Causes

1. **Profile doesn't exist** - User logged in but profile record wasn't created
2. **RLS blocking access** - Row Level Security policies preventing access
3. **Wrong query method** - Using `.single()` when no rows exist

## Solutions

### Solution 1: Profile Doesn't Exist

**Check if profile exists:**
```sql
SELECT * FROM profiles WHERE id = 'your-user-id-here';
```

**If profile doesn't exist, create it:**
- The automatic trigger should create it, but if it didn't:
- Run the trigger setup SQL again
- Or manually create the profile

### Solution 2: Fix RLS Policies

Make sure RLS policies allow users to read their own profile:

```sql
-- Check if policy exists
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- If missing, create it:
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
```

### Solution 3: Code Updated

The code has been updated to:
- Use `.maybeSingle()` instead of `.single()` (handles missing profiles)
- Better error handling
- Graceful fallback when profile doesn't exist

## Quick Fix

### Step 1: Verify Profile Exists

Run this SQL in Supabase:

```sql
-- Check if your user has a profile
SELECT id, email, full_name, user_type 
FROM profiles 
WHERE id = 'your-user-id-from-auth';
```

### Step 2: If Profile Missing, Create It

If no profile exists, the automatic trigger should create it. If not:

1. **Check trigger exists:**
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

2. **If missing, run:**
```sql
-- Run: database/auto_create_profile_trigger.sql
```

3. **Or manually create profile:**
```sql
-- Get user ID from Authentication → Users
INSERT INTO profiles (
  id,
  email,
  full_name,
  user_type,
  subscription_tier,
  storage_used_mb
) VALUES (
  'user-id-from-auth',
  'user@example.com',
  'User Name',
  'client', -- or 'admin'
  'free',
  0
);
```

### Step 3: Verify RLS Policies

```sql
-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Should see: "Users can view own profile"
```

## Updated Code

The code now uses `.maybeSingle()` which:
- Returns `null` if no rows found (instead of error)
- Handles missing profiles gracefully
- Prevents 406 errors

**Files updated:**
- `src/contexts/AuthContext.tsx` - Uses `.maybeSingle()`
- `src/pages/admin/LoginPage.tsx` - Better error handling

## Test

After fixing:

1. **Logout** if logged in
2. **Login again** at `/admin/login`
3. **Check browser console** - should not see 406 errors
4. **Verify profile loads** - should work now

---

**The code has been updated to handle missing profiles gracefully. Make sure your profile exists in the database!**

