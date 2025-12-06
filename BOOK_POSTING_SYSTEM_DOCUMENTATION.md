# Book Posting System Documentation

## Overview

This website is a **content management system** for posting books/documents. Books posted here will be available for purchase in the **mobile app**. Users do NOT purchase books on this website - all purchases happen in the mobile app.

---

## System Architecture

### Flow

```
1. Admin Posts Book → legal_documents table
2. Book Appears in Catalog → Available for viewing
3. Mobile App Syncs → Fetches books from database
4. Users Purchase in App → Payment processed in app
5. user_purchases table updated → By mobile app
```

### Key Points

- **This Website:** Admin posts books, users can view catalog
- **Mobile App:** Users browse, purchase, and access books
- **Database:** Shared between website and mobile app

---

## Database Schema

### legal_documents Table

Stores all books/documents posted by admins.

```sql
CREATE TABLE IF NOT EXISTS legal_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  author TEXT,
  description TEXT,
  category TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  cover_image_url TEXT,
  file_url TEXT NOT NULL,  -- PDF link
  downloads INTEGER DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 0,
  year INTEGER,
  created_by UUID,  -- Foreign key to profiles(id) added after profiles table exists
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Important:** The `profiles` table must exist before creating this table. See setup instructions in the "Setup Instructions" section below.

**Key Fields:**
- `file_url`: Direct URL to the PDF file (used by mobile app)
- `cover_image_url`: Book cover image URL
- `price`: Price in GHS (Ghana Cedis)
- `category`: Book category (Fiction, Programming, etc.)

### user_purchases Table

Tracks purchases made in the mobile app.

```sql
CREATE TABLE user_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES legal_documents(id) ON DELETE CASCADE,
  amount_paid NUMERIC(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_reference TEXT,
  purchased_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, document_id)  -- Prevents duplicate purchases
);
```

**Note:** This table is updated by the mobile app when users make purchases.

---

## Pages

### 1. Post Book Page (`/books/post`)

**Purpose:** Admin interface for posting new books

**Access:** Admin only (`user_type = 'admin'`)

**Features:**
- Form to enter book details
- Title, Author, Description, Category, Price
- Cover Image URL and PDF Link
- Validation and error handling

**What Happens:**
- Book is saved to `legal_documents` table
- Immediately available in catalog
- Mobile app can fetch and display it

### 2. Book Catalog Page (`/books/marketplace`)

**Purpose:** View all posted books

**Access:** Public (no login required)

**Features:**
- Display all books in grid layout
- Search functionality
- Filter by category
- Shows book details (title, author, price, etc.)

**What It Shows:**
- Book cover image
- Title and author
- Description
- Category
- Price
- Message: "Purchase in mobile app"

**Note:** No purchase functionality on this page - it's just for viewing/reference.

---

## User Flow

### Admin Flow (Posting Books)

1. Admin logs in
2. Navigates to `/books/post`
3. Fills in book details:
   - Title (required)
   - Author (optional)
   - Description (optional)
   - Category (required)
   - Price (required)
   - Cover Image URL (optional)
   - PDF Link (required)
4. Submits form
5. Book saved to database
6. Book appears in catalog immediately
7. Mobile app can fetch and display it

### User Flow (Viewing Catalog)

1. User visits `/books/marketplace`
2. Sees all available books
3. Can search/filter books
4. Sees book details and price
5. Message indicates purchase is in mobile app

---

## Mobile App Integration

### How Mobile App Accesses Books

The mobile app should:

1. **Fetch Books:**
   ```sql
   SELECT * FROM legal_documents 
   ORDER BY created_at DESC;
   ```

2. **Check User Purchases:**
   ```sql
   SELECT document_id FROM user_purchases 
   WHERE user_id = :userId;
   ```

3. **Process Purchase:**
   - User selects book in app
   - Payment processed in app
   - Insert record into `user_purchases` table
   - User can now access the book

### API Endpoints (For Mobile App)

The mobile app can use Supabase client to:
- Query `legal_documents` table
- Query `user_purchases` table
- Insert into `user_purchases` when purchase is made

---

## Setup Instructions

### 1. Database Setup

**IMPORTANT:** The `profiles` table must exist before running the main schema.

**Option A: If profiles table doesn't exist:**
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Run `database/create_profiles_first.sql` first
4. Then run `database/schema.sql`
5. Verify tables are created:
   - `profiles`
   - `legal_documents`
   - `user_purchases`
   - `notifications`

**Option B: If profiles table already exists:**
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Run `database/schema.sql` directly
4. Verify tables are created

### 2. Create Admin User

1. Sign up at `/auth/register`
2. In Supabase Dashboard, go to `profiles` table
3. Find your user record
4. Update `user_type` to `'admin'`
5. Now you can post books

### 3. Post Your First Book

1. Login as admin
2. Go to `/books/post`
3. Fill in book details
4. Submit
5. Book appears in catalog

---

## What Changed from Previous Version

### Removed:
- ❌ Payment processing on website
- ❌ PaymentModal component
- ❌ MyLibraryPage (purchases happen in app)
- ❌ Purchase buttons on marketplace

### Kept:
- ✅ Post Book page (admin posts books)
- ✅ Book Catalog page (view books)
- ✅ Database schema (shared with mobile app)

---

## Security Considerations

### Access Control

- **Posting Books:** Only admins can post (checked in `PostBookPage`)
- **Viewing Catalog:** Public access (no login required)
- **Database:** RLS policies protect data

### Row Level Security (RLS)

- **legal_documents:** Everyone can read, only admins can write
- **user_purchases:** Users can only see their own purchases (for mobile app)

---

## Testing

### Test Admin Posting

1. Login as admin
2. Navigate to `/books/post`
3. Fill in book details
4. Submit form
5. Verify book appears in `/books/marketplace`

### Test Catalog View

1. Visit `/books/marketplace` (no login needed)
2. Verify all books are displayed
3. Test search functionality
4. Test category filter
5. Verify "Purchase in mobile app" message appears

---

## Troubleshooting

### Issue: Cannot post book (Access Denied)

**Solution:**
- Check user has `user_type = 'admin'` in profiles table
- Verify you're logged in

### Issue: Books not appearing in catalog

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

## Files Structure

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
  │       └── RegisterPage.tsx     # User registration
  └── router/
      └── config.tsx                # Routes configuration
```

---

## Next Steps

1. **Post Books:** Use `/books/post` to add books to catalog
2. **Mobile App Development:** 
   - Configure Supabase client in mobile app
   - Fetch books from `legal_documents` table
   - Implement purchase flow
   - Update `user_purchases` table on purchase
3. **Monitor:** Check database for posted books and purchases

---

**Summary:** This website is for **posting books only**. The mobile app handles all purchases and user access to purchased books.

---

**Last Updated:** 2024
**Version:** 2.0.0

