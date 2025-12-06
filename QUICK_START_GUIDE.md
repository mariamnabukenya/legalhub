# Quick Start Guide - Book Posting System

## Overview

This website is a **content management system** for posting books. Books posted here will be available for purchase in the **mobile app**. Users do NOT purchase books on this website.

---

## What Was Created

### 1. Database Schema
- **File:** `database/schema.sql`
- **Tables Created:**
  - `legal_documents` - Stores all books/documents
  - `user_purchases` - Tracks user purchases (updated by mobile app)
  - Indexes and RLS policies included

### 2. Pages Created

#### Post Book Page (`/books/post`)
- **File:** `src/pages/books/PostBookPage.tsx`
- **Access:** Admin only
- **Purpose:** Post new books to catalog
- **Fields:** Title, Author, Description, Category, Price, Cover Image URL, PDF Link

#### Book Catalog Page (`/books/marketplace`)
- **File:** `src/pages/books/MarketplacePage.tsx`
- **Access:** Public (no login required)
- **Purpose:** View all posted books
- **Features:** Search, filter by category, view book details
- **Note:** No purchase functionality - purchases happen in mobile app

### 3. Routes Added
- `/books/marketplace` - View book catalog
- `/books/post` - Post new book (admin only)

---

## Setup Steps

### Step 1: Run Database Schema

1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy and paste contents of `database/schema.sql`
4. Click "Run"
5. Verify tables are created

### Step 2: Create Admin User

**Option A: Automatic (Recommended)**
1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add User"
3. Enter email and password
4. Enable "Auto Confirm User"
5. Add metadata (optional):
   ```json
   {
     "full_name": "Admin User",
     "user_type": "admin"
   }
   ```
6. Click "Create User"
7. Profile is created automatically!

**Option B: Make Existing User Admin**
1. If you already signed up, just run this SQL:
   ```sql
   SELECT make_user_admin('your-email@example.com');
   ```

**Option C: Manual Update**
1. In Supabase Dashboard, go to `profiles` table
2. Find your user record
3. Update `user_type` to `'admin'`
4. Save

### Step 3: Post Your First Book

1. Login as admin
2. Go to `/books/post`
3. Fill in book details:
   - Title (required)
   - Author (optional)
   - Description (optional)
   - Category (required)
   - Price (required)
   - Cover Image URL (optional)
   - PDF Link (required)
4. Submit form
5. Book appears in catalog at `/books/marketplace`

---

## How It Works

### Admin Flow (Posting Books)

```
1. Admin Logs In → Must have user_type = 'admin'
2. Admin Goes to /books/post → Post Book page
3. Admin Fills Form → Book details
4. Admin Submits → Book saved to legal_documents table
5. Book Appears in Catalog → Immediately available
6. Mobile App Syncs → Fetches books from database
```

### User Flow (Viewing Catalog)

```
1. User Visits /books/marketplace → View catalog
2. User Sees All Books → Displayed in grid
3. User Can Search/Filter → Find specific books
4. User Sees Book Details → Title, author, price, etc.
5. Message Shows → "Purchase in mobile app"
```

### Mobile App Flow (Purchases)

```
1. Mobile App Fetches Books → From legal_documents table
2. User Browses in App → Sees available books
3. User Purchases in App → Payment processed in app
4. Purchase Recorded → Insert into user_purchases table
5. User Accesses Book → In mobile app
```

---

## Key Database Tables

### legal_documents
Stores all books. Key fields:
- `title` - Book title
- `author` - Author name
- `price` - Price in GHS
- `file_url` - PDF link (used by mobile app)
- `cover_image_url` - Cover image

### user_purchases
Tracks purchases (updated by mobile app). Key fields:
- `user_id` - Who bought it
- `document_id` - Which book
- `amount_paid` - Payment amount
- `purchased_at` - When purchased

**Important:** `UNIQUE(user_id, document_id)` prevents duplicate purchases.

---

## Access Control

- **Post Books:** Only `user_type = 'admin'` can post
- **View Catalog:** Public access (no login required)
- **RLS Policies:** Enforced at database level

---

## Troubleshooting

### Issue: Cannot post book (Access Denied)

**Solution:**
- Check user has `user_type = 'admin'` in profiles table
- Verify you're logged in

### Issue: Books not showing in catalog

**Solution:**
- Check `legal_documents` table has data
- Verify RLS policies allow SELECT for all users
- Check browser console for errors

### Issue: Mobile app cannot fetch books

**Solution:**
- Verify Supabase client is configured correctly in mobile app
- Check RLS policies allow SELECT on `legal_documents`
- Verify API keys are correct

---

## Files Summary

```
database/
  └── schema.sql                    # Database schema

src/
  ├── pages/
  │   ├── books/
  │   │   ├── PostBookPage.tsx      # Admin: Post books
  │   │   └── MarketplacePage.tsx   # View book catalog
  │   └── auth/
  │       ├── LoginPage.tsx         # User login
  │       └── RegisterPage.tsx      # User registration
  └── router/
      └── config.tsx                # Routes configuration

BOOK_POSTING_SYSTEM_DOCUMENTATION.md  # Full documentation
QUICK_START_GUIDE.md                  # This file
```

---

## What's NOT Included

- ❌ Payment processing (happens in mobile app)
- ❌ Purchase functionality (happens in mobile app)
- ❌ User library page (happens in mobile app)
- ❌ Payment hooks/components (not needed for website)

---

## Next Steps

1. **Post Books:** Use `/books/post` to add books to catalog
2. **Mobile App Development:** 
   - Configure Supabase client in mobile app
   - Fetch books from `legal_documents` table
   - Implement purchase flow
   - Update `user_purchases` table on purchase
3. **Monitor:** Check database for posted books

---

**Summary:** This website is for **posting books only**. The mobile app handles all purchases and user access to purchased books.

---

**Ready to use!** Follow the setup steps above to get started.
