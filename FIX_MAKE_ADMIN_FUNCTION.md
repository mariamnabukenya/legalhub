# Fix: make_user_admin() Function Not Found

## Problem

You're getting this error:
```
ERROR: function make_user_admin(unknown) does not exist
```

This means the function hasn't been created in your database yet.

## Solution: Create the Function

### Step 1: Run This SQL

Go to **Supabase Dashboard** → **SQL Editor** and run:

```sql
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
```

### Step 2: Now Use the Function

After creating the function, you can use it:

```sql
SELECT make_user_admin('admin@legalhub.com');
```

### Step 3: Verify

```sql
SELECT email, user_type FROM profiles WHERE email = 'admin@legalhub.com';
```

Should show: `user_type = 'admin'`

---

## Alternative: Manual Update (No Function Needed)

If you don't want to create the function, just use a regular UPDATE:

```sql
UPDATE profiles 
SET user_type = 'admin',
    updated_at = NOW()
WHERE email = 'admin@legalhub.com';
```

---

## Why This Happened

The function should be in `database/schema.sql`, but if you ran the schema before the function was added, it won't exist. Just run the SQL above to create it.

---

## Quick Fix (Copy & Paste)

```sql
-- Create the function
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

-- Now use it
SELECT make_user_admin('admin@legalhub.com');
```

---

**File:** `database/create_make_admin_function.sql` - Contains the function creation SQL

