# Database Setup Instructions

## Important: Read This First!

The database schema has dependencies between tables. Follow these steps in order:

## Setup Steps

### Step 1: Create Profiles Table First

If the `profiles` table doesn't exist, run this first:

```sql
-- Run: create_profiles_first.sql
```

Or manually create the profiles table:

```sql
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  user_type TEXT DEFAULT 'client' CHECK (user_type IN ('client', 'lawyer', 'admin')),
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'premium')),
  storage_used_mb NUMERIC(10,2) DEFAULT 0,
  avatar_url TEXT,
  subscription_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Step 2: Run Main Schema

After the profiles table exists, run:

```sql
-- Run: schema.sql
```

This will create:
- `legal_documents` table
- `user_purchases` table
- `notifications` table
- Indexes
- RLS policies
- Functions

## Alternative: Run All at Once

If you're sure the `profiles` table already exists, you can run `schema.sql` directly. The schema will:
- Create tables without foreign key constraints first
- Add foreign key constraints only if the referenced tables exist

## Troubleshooting

### Error: "relation profiles does not exist"

**Solution:** Run `create_profiles_first.sql` first, then run `schema.sql`

### Error: "foreign key constraint fails"

**Solution:** Make sure you run the scripts in order:
1. First: `create_profiles_first.sql`
2. Then: `schema.sql`

## Files

- `create_profiles_first.sql` - Creates profiles table (run first)
- `schema.sql` - Main schema (run after profiles exists)
- `README.md` - This file

---

**Note:** The schema.sql file has been updated to handle missing tables gracefully, but it's still recommended to create the profiles table first.

