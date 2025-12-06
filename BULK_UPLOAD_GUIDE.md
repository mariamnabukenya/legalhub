# Bulk Book Upload Guide

## Overview

The Legal Library component now supports **bulk uploading** of books using JSON data. This allows you to upload multiple books at once instead of adding them one by one.

## How to Use Bulk Upload

### Step 1: Access the Legal Library

1. Log in as an admin user
2. Navigate to **Admin Portal** → **Legal Library**

### Step 2: Open Bulk Upload Modal

1. Click the **"Bulk Upload"** button (green button) at the top right
2. A modal will open with a text area for JSON data

### Step 3: Prepare Your Book Data

Your book data should be a **JSON array** where each object represents a book. Here's the format:

```json
[
  {
    "title": "Book Title",
    "author": "Author Name",
    "description": "Book description",
    "category": "Constitutional Law",
    "price": 150.00,
    "year": 2024,
    "file_url": "https://example.com/book.pdf",
    "cover_image_url": "https://example.com/cover.jpg"
  }
]
```

### Required Fields

- **title** (required): The book title
- **category** (required): One of the legal categories
- **price** (required): Price in GHS (Ghana Cedis)

### Optional Fields

- **author**: Author name
- **description**: Book description
- **year**: Publication year (defaults to current year)
- **file_url**: URL to the PDF file
- **cover_image_url**: URL to the cover image

### Available Categories

- Constitutional Law
- Criminal Law
- Family Law
- Corporate Law
- Property Law
- Labour Law
- Commercial Law
- Civil Law

### Step 4: Paste and Upload

1. Copy your JSON data
2. Paste it into the text area in the modal
3. Click **"Upload Books"**
4. Wait for the upload to complete
5. You'll see a success message with the number of books uploaded

## Example Book Data

See `data/sample_books.json` for a complete example with 10 sample books.

## Tips

1. **Validate JSON First**: Make sure your JSON is valid before uploading. You can use an online JSON validator.

2. **Batch Processing**: Books are uploaded in batches of 10 to avoid overwhelming the database.

3. **Error Handling**: If some books fail to upload, you'll see an error count in the success message.

4. **File URLs**: Make sure your `file_url` and `cover_image_url` are publicly accessible URLs.

5. **Price Format**: Use numbers (e.g., `150.00`) not strings (e.g., `"150.00"`).

## Troubleshooting

### "Invalid JSON format"
- Check that your JSON is properly formatted
- Ensure all strings are in double quotes
- Make sure there are no trailing commas

### "Data must be an array of books"
- Your data should start with `[` and end with `]`
- Each book should be an object `{}` inside the array

### Upload Fails
- Check the browser console for detailed error messages
- Verify that required fields (title, category, price) are present
- Ensure price is a number, not a string

## Sample JSON Structure

```json
[
  {
    "title": "Constitutional Law of Ghana",
    "author": "Prof. Kwame Asante",
    "description": "Comprehensive guide to Ghana's constitutional framework",
    "category": "Constitutional Law",
    "price": 150.00,
    "year": 2023,
    "file_url": "https://example.com/book.pdf",
    "cover_image_url": "https://example.com/cover.jpg"
  },
  {
    "title": "Criminal Law and Procedure",
    "author": "Justice Mensah",
    "category": "Criminal Law",
    "price": 180.00,
    "year": 2024
  }
]
```

## Notes

- Books are uploaded in batches to prevent database timeouts
- The upload process shows a loading indicator
- After successful upload, the documents list automatically refreshes
- Failed uploads are logged to the console for debugging

