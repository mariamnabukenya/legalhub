# How to Create an Admin User

## ✅ Automatic Profile Creation (Recommended)

**Good News!** Profiles are now created automatically when users sign up. You just need to make them admin!

### Quick Method: Create Admin User

#### Step 1: Create User in Supabase Auth

1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Click **"Add User"** or **"Invite User"**
3. Fill in:
   - **Email:** `admin@legalhub.com`
   - **Password:** Choose a secure password (e.g., `Admin@123456`)
   - **Auto Confirm User:** ✅ Enable this
   - **User Metadata (Optional):** Add this JSON:
     ```json
     {
       "full_name": "Admin User",
       "user_type": "admin",
       "subscription_tier": "premium"
     }
     ```
4. Click **"Create User"**

**That's it!** The profile is created automatically. If you added `"user_type": "admin"` in metadata, you're done!

#### Step 2: If You Forgot Metadata - Make User Admin

If you already created the user without admin metadata, just run this SQL:

```sql
-- Make user admin by email
SELECT make_user_admin('admin@legalhub.com');
```

Or manually:

```sql
UPDATE profiles 
SET user_type = 'admin'
WHERE email = 'admin@legalhub.com';
```

#### Step 3: Login

1. Go to `/admin/login` on your website
2. Enter your email and password
3. You should now have admin access!

---

## Method 2: Using SQL Function (Easiest)

### Step 1: Create Auth User

1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Click **"Add User"**
3. Enter email and password
4. Enable **"Auto Confirm User"**
5. Click **"Create User"**

### Step 2: Make Admin with One SQL Command

Go to **SQL Editor** and run:

```sql
SELECT make_user_admin('admin@legalhub.com');
```

Replace `admin@legalhub.com` with your actual email.

**Done!** The user is now admin.

---

## Method 3: Convert Existing User to Admin

If you already have a user account (created via signup):

### Option A: Using SQL Function
```sql
SELECT make_user_admin('your-email@example.com');
```

### Option B: Using UPDATE
```sql
UPDATE profiles 
SET user_type = 'admin',
    updated_at = NOW()
WHERE email = 'your-email@example.com';
```

### Option C: Using Table Editor
1. Go to **Table Editor** → **profiles**
2. Find your user by email
3. Click **Edit**
4. Change **user_type** to `admin`
5. Click **Save**

---

## Setup Automatic Profile Creation (One-Time Setup)

If you haven't set up the automatic trigger yet, run this SQL once:

```sql
-- Run: database/auto_create_profile_trigger.sql
```

This creates:
- ✅ Automatic profile creation when users sign up
- ✅ `make_user_admin()` function for easy admin creation

---

## Complete Admin Creation Workflow

### For New Admin User:

1. **Create Auth User:**
   - Supabase Dashboard → Authentication → Users → Add User
   - Email: `admin@legalhub.com`
   - Password: `Admin@123456`
   - Auto Confirm: ✅
   - **Metadata (Optional but Recommended):**
     ```json
     {
       "full_name": "Admin User",
       "user_type": "admin",
       "subscription_tier": "premium"
     }
     ```

2. **If metadata wasn't added, make admin:**
   ```sql
   SELECT make_user_admin('admin@legalhub.com');
   ```

3. **Login:**
   - Go to `/admin/login`
   - Use your credentials

### For Existing User:

```sql
-- Just make them admin
SELECT make_user_admin('user-email@example.com');
```

---

## Verify Admin Access

After creating admin user:

1. **Logout** if currently logged in
2. Go to `/admin/login`
3. Enter admin credentials
4. You should see the admin dashboard
5. You should be able to access `/books/post` to post books

---

## Troubleshooting

### "User not found" when using make_user_admin()

**Solution:**
- Make sure the user exists in Authentication → Users
- Check the email spelling
- Verify the profile was created (should be automatic)

### "Access denied. Admin privileges required"

**Solution:**
- Verify `user_type = 'admin'` in profiles table:
  ```sql
  SELECT email, user_type FROM profiles WHERE email = 'your-email@example.com';
  ```
- If not admin, run: `SELECT make_user_admin('your-email@example.com');`
- Logout and login again

### Profile not created automatically

**Solution:**
- Make sure you ran `database/auto_create_profile_trigger.sql`
- Check if trigger exists:
  ```sql
  SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
  ```
- If missing, run the trigger setup SQL again

---

## Quick Reference

| Action | Command |
|--------|---------|
| Make user admin | `SELECT make_user_admin('email@example.com');` |
| Check user type | `SELECT email, user_type FROM profiles WHERE email = 'email@example.com';` |
| List all admins | `SELECT email, full_name FROM profiles WHERE user_type = 'admin';` |
| Remove admin | `UPDATE profiles SET user_type = 'client' WHERE email = 'email@example.com';` |

---

## Security Recommendations

⚠️ **Important Security Tips:**

1. **Use Strong Passwords:** Minimum 12 characters, mix of letters, numbers, symbols
2. **Enable 2FA:** In Supabase Dashboard → Authentication → Users → Enable 2FA
3. **Limit Admin Users:** Only create admin accounts for trusted personnel
4. **Regular Audits:** Periodically review admin users:
   ```sql
   SELECT email, full_name, created_at FROM profiles WHERE user_type = 'admin';
   ```
5. **Change Default Passwords:** If using default credentials, change immediately

---

**After creating the admin user, you can:**
- ✅ Post books at `/books/post`
- ✅ Access admin dashboard at `/admin`
- ✅ Manage users, cases, appointments, etc.
