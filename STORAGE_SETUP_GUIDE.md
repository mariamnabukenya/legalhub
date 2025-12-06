# Supabase Storage Setup Guide

## Issue: "Bucket not found" Error

If you're getting a `StorageApiError: Bucket not found` error when uploading documents, you need to create the storage bucket in Supabase.

## Solution: Create Storage Bucket

### Step 1: Go to Supabase Dashboard

1. Open your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar

### Step 2: Create New Bucket

1. Click **"New bucket"** or **"Create bucket"** button
2. Enter bucket name: `legal-documents`
3. Set bucket to **Public** (so files can be accessed via public URLs)
4. Click **"Create bucket"**

### Step 3: Configure Bucket Policies (Optional but Recommended)

1. Click on the `legal-documents` bucket
2. Go to **Policies** tab
3. Add policies for:
   - **Upload**: Allow authenticated users to upload
   - **Read**: Allow public read access (if you want public access)
   - **Delete**: Allow admins to delete

### Alternative: Use File URLs Instead

If you don't want to use Supabase Storage, you can:

1. **Use Bulk Upload** with `file_url` and `cover_image_url` fields
2. Upload files to another service (AWS S3, Cloudinary, etc.)
3. Provide the URLs in your JSON data

Example:
```json
[
  {
    "title": "Book Title",
    "category": "Constitutional Law",
    "price": 150,
    "file_url": "https://your-cdn.com/book.pdf",
    "cover_image_url": "https://your-cdn.com/cover.jpg"
  }
]
```

## Quick Fix

If you just need to upload books quickly without setting up storage:

1. Use the **Bulk Upload** feature
2. Include `file_url` and `cover_image_url` in your JSON
3. Skip the file upload modal (it requires the bucket)

The bulk upload feature works without storage - it just inserts records with URLs you provide.

