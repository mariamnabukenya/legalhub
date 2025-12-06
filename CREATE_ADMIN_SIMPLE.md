# Create Admin User - Simple Guide

## ✅ Automatic Method (No SQL, No User ID!)

### Step 1: Create User in Dashboard

1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Click **"Add User"**
3. Enter:
   - **Email:** `admin@legalhub.com`
   - **Password:** `Admin@123456`
   - **Auto Confirm:** ✅
   - **User Metadata:** Add this JSON:
     ```json
     {
       "full_name": "Admin User",
       "user_type": "admin",
       "subscription_tier": "premium"
     }
     ```
4. Click **"Create User"**

### ✅ Done!

- User ID generated automatically ✅
- Profile created automatically ✅
- Admin privileges set automatically ✅

### Step 2: Login

Go to `/admin/login` and use your credentials.

---

## If You Already Created User (Make Admin)

Just run this SQL (no User ID needed):

```sql
SELECT make_user_admin('admin@legalhub.com');
```

---

**That's it! No User ID copying, no manual INSERT needed!**

