# Change Admin Password - Quick Guide

## ✅ Easiest Method: Supabase Dashboard

### Step 1: Open User Settings

1. Go to **Supabase Dashboard**
2. Navigate to **Authentication** → **Users**
3. Find your admin user (search by email: `admin@legalhub.com`)
4. Click on the user row

### Step 2: Change Password

1. Look for **"Reset Password"** or **"Change Password"** button
2. Click it
3. Enter new password (e.g., `NewAdmin@123456`)
4. Click **"Update"** or **"Save"**

### Step 3: Login with New Password

1. Go to `/admin/login` on your website
2. Enter:
   - Email: `admin@legalhub.com`
   - Password: Your new password
3. Click **"Sign In"**

**Done!** ✅

---

## Alternative: Send Password Reset Email

### Step 1: Send Reset Email

1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Find admin user
3. Click **"Send Password Reset Email"** button
4. Check email inbox

### Step 2: Reset via Email

1. Open the password reset email
2. Click the reset link
3. Enter new password
4. Confirm new password
5. Submit

**Done!** ✅

---

## Quick Steps Summary

```
1. Dashboard → Authentication → Users
2. Find admin user
3. Click user → Reset Password
4. Enter new password
5. Save
6. Login with new password
```

---

## Security Tips

- ✅ Use strong password (12+ characters, mixed case, numbers, symbols)
- ✅ Don't share passwords
- ✅ Enable 2FA for extra security
- ✅ Change password regularly

---

**That's it! No SQL needed - passwords are managed through Supabase Dashboard.**

