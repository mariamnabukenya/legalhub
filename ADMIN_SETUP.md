# Admin User Setup Guide

## Default Admin Credentials

A default admin user has been seeded into your database:

**Email:** `admin@legalhub.com`  
**Password:** You need to create this in Supabase Auth

---

## How to Complete Admin Setup

### Step 1: Create Auth User in Supabase

1. Go to your **Supabase Dashboard**
2. Navigate to **Authentication** → **Users**
3. Click **"Add User"** or **"Invite User"**
4. Enter:
   - **Email:** `admin@legalhub.com`
   - **Password:** Choose a secure password (e.g., `Admin@123456`)
   - **Auto Confirm User:** ✅ Enable this
5. Click **"Create User"**

### Step 2: Link Auth User to Profile

After creating the auth user, you need to update the profile with the correct user ID:

1. Copy the **User ID** from the Authentication page (it looks like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)
2. Go to **Table Editor** → **profiles** table
3. Find the row with email `admin@legalhub.com`
4. Click **Edit**
5. Update the `id` field with the User ID you copied
6. Click **Save**

### Step 3: Login

1. Go to `/admin/login` on your website
2. Enter:
   - **Email:** `admin@legalhub.com`
   - **Password:** (the password you set in Step 1)
3. Click **Sign In**

---

## Alternative: Quick SQL Method

If you prefer, you can run this SQL in Supabase SQL Editor after creating the auth user:

```sql
-- Replace 'YOUR-AUTH-USER-ID' with the actual UUID from Supabase Auth
UPDATE profiles 
SET id = 'YOUR-AUTH-USER-ID'
WHERE email = 'admin@legalhub.com';
```

---

## Security Recommendations

⚠️ **Important:** After first login, please:

1. **Change the default password** immediately
2. **Update the email** to your actual admin email
3. **Add your phone number** in profile settings
4. **Enable 2FA** in Supabase Auth (recommended)

---

## Creating Additional Admin Users

To create more admin users:

1. **Via Supabase Dashboard:**
   - Go to Authentication → Users → Add User
   - Create the auth account
   - Go to Table Editor → profiles
   - Insert a new row with `user_type = 'admin'`

2. **Via SQL:**
```sql
-- First create auth user in Supabase Dashboard, then run:
INSERT INTO profiles (
  id,
  email,
  full_name,
  phone,
  user_type,
  subscription_tier,
  storage_used_mb
) VALUES (
  'AUTH-USER-ID-HERE',
  'newadmin@legalhub.com',
  'Admin Name',
  '+1234567890',
  'admin',
  'premium',
  0
);
```

---

## Troubleshooting

### "Invalid login credentials" error
- Make sure you created the auth user in Supabase Authentication
- Verify the email and password match exactly
- Check that "Auto Confirm User" was enabled

### "Access denied. Admin privileges required" error
- Check that `user_type` in profiles table is set to `'admin'`
- Verify the profile `id` matches the auth user `id`

### Can't see the admin user in profiles table
- The SQL seeding has been run
- Check Supabase Table Editor → profiles table
- Look for email `admin@legalhub.com`

---

## Database Schema Reference

The `profiles` table structure:

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Must match Supabase Auth user ID |
| email | text | User's email address |
| full_name | text | Full name |
| phone | text | Phone number (optional) |
| user_type | text | Must be 'admin' for admin access |
| subscription_tier | text | 'free', 'basic', or 'premium' |
| storage_used_mb | numeric | Storage usage in MB |
| created_at | timestamp | Auto-generated |
| updated_at | timestamp | Auto-updated |

---

## Need Help?

If you're still having issues:

1. Check the browser console for error messages
2. Verify Supabase connection in `.env` file
3. Ensure RLS policies allow admin operations
4. Contact support with specific error messages

---

**Last Updated:** $(date)
