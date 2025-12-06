# Check Your Supabase Configuration

## Current Configuration

Your config file shows:
- **URL:** `https://guquwpfadpujzzclrdkc.supabase.co`
- **Key:** (configured in `src/constants/supabase_config.ts`)

## Error Shows Different URL

The error shows:
- **URL:** `https://ffmovimhqgyajsrterxv.supabase.co`

**This means you might be using a different Supabase project!**

---

## How to Fix

### Step 1: Get Your Correct Supabase Details

1. Go to **Supabase Dashboard**
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (long JWT token)

### Step 2: Update Configuration

**Option A: Update Config File**

Edit `src/constants/supabase_config.ts`:

```typescript
// Replace with your actual values
SUPABASE_URL_ENV = 'https://ffmovimhqgyajsrterxv.supabase.co'; // Your actual URL
SUPABASE_ANON_KEY_ENV = 'your_actual_anon_key_here'; // Your actual key
```

**Option B: Use Environment Variables (Recommended)**

Create `.env` file in root directory:

```env
VITE_PUBLIC_SUPABASE_URL=https://ffmovimhqgyajsrterxv.supabase.co
VITE_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

### Step 3: Restart Dev Server

```bash
# Stop server (Ctrl+C)
# Then restart
npm run dev
```

---

## Verify Configuration

After updating, check:

1. **Browser Console:** Should not show 400 errors
2. **Network Tab:** Requests should go to correct URL
3. **Login:** Should work with correct credentials

---

**Make sure the Supabase URL in your config matches the one in your Supabase Dashboard!**

