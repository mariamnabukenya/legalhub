# Fix: Supabase Auth 400 Error

## Problem

You're seeing this error:
```
Failed to load resource: the server responded with a status of 400
ffmovimhqgyajsrterxv.supabase.co/auth/v1/token?grant_type=password
```

A 400 error from Supabase Auth usually means:
- ❌ Wrong email or password
- ❌ User doesn't exist
- ❌ User not confirmed
- ❌ Wrong Supabase URL/Key
- ❌ Email confirmation required

---

## Quick Fixes

### 1. Check Supabase URL Mismatch

**Issue:** The error shows `ffmovimhqgyajsrterxv.supabase.co` but your config has `guquwpfadpujzzclrdkc.supabase.co`

**Solution:** Make sure you're using the correct Supabase project:

1. Go to **Supabase Dashboard**
2. Check your project URL (should match the one in error)
3. Update `src/constants/supabase_config.ts` with the correct URL and key

Or create a `.env` file:

```env
VITE_PUBLIC_SUPABASE_URL=https://ffmovimhqgyajsrterxv.supabase.co
VITE_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 2. Verify User Exists

1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Check if the user exists
3. Verify the email matches exactly (case-sensitive)

### 3. Check User Confirmation

1. Go to **Authentication** → **Users**
2. Find your user
3. Check if **"Email Confirmed"** is ✅
4. If not:
   - Click **"Send Confirmation Email"**
   - Or enable **"Auto Confirm User"** when creating

### 4. Verify Password

- Make sure password is correct (no extra spaces)
- Try resetting password:
  - Dashboard → Users → User → Reset Password

### 5. Check Supabase Keys

Verify your Supabase keys are correct:

1. Go to **Supabase Dashboard** → **Settings** → **API**
2. Copy:
   - **Project URL** (should match your config)
   - **anon/public key** (should match your config)
3. Update `src/constants/supabase_config.ts` or `.env` file

---

## Step-by-Step Troubleshooting

### Step 1: Verify Supabase Connection

Check browser console for the actual error message. It should show more details.

### Step 2: Test with Correct Credentials

1. Create a test user in Supabase Dashboard:
   - Email: `test@example.com`
   - Password: `Test123456`
   - Auto Confirm: ✅
2. Try logging in with these credentials
3. If it works, the issue is with your original credentials

### Step 3: Check Browser Console

Open browser DevTools (F12) → Console tab and look for detailed error messages.

Common errors:
- `Invalid login credentials` → Wrong email/password
- `Email not confirmed` → User needs to confirm email
- `User not found` → User doesn't exist
- `Invalid API key` → Wrong Supabase key

### Step 4: Verify Supabase Project

Make sure you're using the correct Supabase project:

1. Check the URL in the error matches your project
2. If different, update the config
3. Restart dev server after changing config

---

## Common Solutions

### Solution 1: User Not Confirmed

**Fix:**
1. Go to Dashboard → Authentication → Users
2. Find user → Click user
3. Enable **"Auto Confirm User"** or click **"Send Confirmation Email"**

### Solution 2: Wrong Supabase URL

**Fix:**
Update `src/constants/supabase_config.ts`:

```typescript
// Replace with your actual Supabase URL
SUPABASE_URL_ENV = 'https://ffmovimhqgyajsrterxv.supabase.co';
```

Or use `.env` file:

```env
VITE_PUBLIC_SUPABASE_URL=https://ffmovimhqgyajsrterxv.supabase.co
VITE_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key
```

### Solution 3: Wrong Credentials

**Fix:**
1. Reset password in Dashboard
2. Or create new user with known credentials
3. Make sure email matches exactly

### Solution 4: User Doesn't Exist

**Fix:**
1. Create user in Dashboard first
2. Or use signup form at `/auth/register`
3. Then try logging in

---

## Update Supabase Config

If your Supabase project URL is different, update it:

### Option 1: Update Config File

Edit `src/constants/supabase_config.ts`:

```typescript
// Change this line:
SUPABASE_URL_ENV = 'https://ffmovimhqgyajsrterxv.supabase.co'; // Your actual URL

// And this line:
SUPABASE_ANON_KEY_ENV = 'your_actual_anon_key_here'; // Your actual key
```

### Option 2: Use Environment Variables

Create `.env` file in root directory:

```env
VITE_PUBLIC_SUPABASE_URL=https://ffmovimhqgyajsrterxv.supabase.co
VITE_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Then restart dev server.

---

## Test Authentication

After fixing, test:

1. **Create Test User:**
   - Dashboard → Authentication → Users → Add User
   - Email: `test@test.com`
   - Password: `Test123456`
   - Auto Confirm: ✅

2. **Try Login:**
   - Go to `/auth/login`
   - Enter test credentials
   - Should work now

---

## Still Not Working?

1. **Check Supabase Dashboard:**
   - Go to Settings → API
   - Verify URL and keys match your config

2. **Check Browser Console:**
   - Open DevTools (F12)
   - Look for detailed error messages
   - Check Network tab for failed requests

3. **Verify Database:**
   - Make sure `profiles` table exists
   - Check if user has profile record

4. **Clear Browser Cache:**
   - Hard refresh: `Ctrl + Shift + R`
   - Or clear cache and cookies

---

**The most common issue is a Supabase URL/key mismatch. Make sure your config matches your actual Supabase project!**

