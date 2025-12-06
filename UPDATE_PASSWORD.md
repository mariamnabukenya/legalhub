# How to Update User Password

## ⚠️ Important: Passwords Cannot Be Updated via SQL

For security reasons, Supabase doesn't allow direct password updates via SQL. You must use one of these methods:

---

## Method 1: Using Supabase Dashboard (Easiest)

### Step 1: Go to Authentication

1. Open **Supabase Dashboard**
2. Navigate to **Authentication** → **Users**
3. Find the user whose password you want to change
4. Click on the user (or click the **three dots** → **Edit**)

### Step 2: Update Password

1. Click **"Reset Password"** or **"Change Password"** button
2. Enter the new password
3. Click **"Update"** or **"Save"**

**Done!** The password is updated immediately.

---

## Method 2: User Self-Service (Password Reset)

### Via Website (If Implemented)

1. Go to `/auth/login`
2. Click **"Forgot password?"** link
3. Enter email address
4. Check email for reset link
5. Click link and set new password

### Via Supabase Auth

1. Go to **Authentication** → **Users**
2. Find the user
3. Click **"Send Password Reset Email"**
4. User receives email with reset link
5. User clicks link and sets new password

---

## Method 3: Using Supabase Admin API (Programmatic)

### Server-Side Only (Node.js/TypeScript)

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // ⚠️ Service role key (server-side only!)
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Update user password
const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
  'user-uuid-here',
  {
    password: 'NewPassword123!'
  }
)

if (error) {
  console.error('Error updating password:', error)
} else {
  console.log('Password updated successfully')
}
```

### Python Example

```python
from supabase import create_client, Client

supabase: Client = create_client(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY  # ⚠️ Service role key
)

# Update user password
response = supabase.auth.admin.update_user_by_id(
    user_id="user-uuid-here",
    attributes={"password": "NewPassword123!"}
)
```

---

## Method 4: Force Password Reset (Send Reset Email)

### Via Dashboard

1. Go to **Authentication** → **Users**
2. Find the user
3. Click **"Send Password Reset Email"**
4. User receives email
5. User sets new password via email link

### Via SQL (Send Reset Email)

```sql
-- This doesn't change the password, but sends a reset email
-- The user must click the link in the email to set a new password

-- Note: This requires using Supabase's auth functions
-- Usually done via API, not SQL
```

---

## Method 5: Delete and Recreate User (Last Resort)

⚠️ **Warning:** This deletes all user data. Only use if necessary.

### Step 1: Delete User

1. Go to **Authentication** → **Users**
2. Find the user
3. Click **"Delete User"**
4. Confirm deletion

### Step 2: Recreate User

1. Click **"Add User"**
2. Enter same email
3. Set new password
4. Enable **"Auto Confirm User"**
5. Click **"Create User"**

**Note:** Profile will be recreated automatically if trigger is set up.

---

## Quick Reference

| Method | Where | Best For |
|--------|-------|----------|
| Dashboard | Supabase Dashboard | Admin changing user password |
| Password Reset Email | Dashboard → Send Email | User forgot password |
| Admin API | Server-side code | Programmatic updates |
| Self-Service | Website reset flow | Users changing own password |

---

## Security Best Practices

1. **Use Strong Passwords:**
   - Minimum 12 characters
   - Mix of uppercase, lowercase, numbers, symbols
   - Example: `Admin@123456`

2. **Enable 2FA:**
   - Go to **Authentication** → **Users** → User → Enable 2FA
   - Adds extra security layer

3. **Regular Password Changes:**
   - Encourage users to change passwords regularly
   - Especially for admin accounts

4. **Never Share Passwords:**
   - Use password reset emails instead
   - Don't send passwords via email/chat

---

## Troubleshooting

### "Cannot update password via SQL"

**Solution:** This is by design for security. Use Dashboard or API methods above.

### "Password reset email not received"

**Solution:**
- Check spam folder
- Verify email address is correct
- Check Supabase email settings
- Try resending from Dashboard

### "User cannot login after password change"

**Solution:**
- Verify password was saved in Dashboard
- Check if user is confirmed (Auto Confirm enabled)
- Try password reset email method

---

## For Admin Users Specifically

### Update Admin Password:

1. **Dashboard Method (Recommended):**
   - Authentication → Users
   - Find admin user
   - Click user → Reset Password
   - Enter new password
   - Save

2. **After Password Change:**
   - Logout from `/admin/login` if logged in
   - Login again with new password
   - Verify admin access still works

---

**Remember:** Passwords are stored securely in `auth.users` table and cannot be accessed or modified via SQL for security reasons.

