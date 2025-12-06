# How to Run the Web Application

## Prerequisites

Make sure you have installed:
- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)

## Step-by-Step Instructions

### Step 1: Install Dependencies

Open your terminal/command prompt in the project directory and run:

```bash
npm install
```

This will install all required packages (React, Vite, Supabase, etc.)

### Step 2: Start the Development Server

Run the development server:

```bash
npm run dev
```

Or:

```bash
npm start
```

### Step 3: Open in Browser

Once the server starts, you should see output like:

```
  VITE v7.0.3  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.x.x:3000/
```

Open your browser and go to:
**http://localhost:3000**

---

## Available Scripts

### Development
```bash
npm run dev
```
Starts the development server on port 3000

### Build for Production
```bash
npm run build
```
Creates an optimized production build in the `out` folder

### Preview Production Build
```bash
npm run preview
```
Previews the production build locally

---

## Troubleshooting

### Port 3000 Already in Use

If port 3000 is already in use, you can:

1. **Kill the process using port 3000:**
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   
   # Mac/Linux
   lsof -ti:3000 | xargs kill
   ```

2. **Or change the port in `vite.config.ts`:**
   ```typescript
   server: {
     port: 3001,  // Change to any available port
     host: '0.0.0.0',
   }
   ```

### Dependencies Not Installing

If `npm install` fails:

1. Delete `node_modules` folder and `package-lock.json`
2. Clear npm cache:
   ```bash
   npm cache clean --force
   ```
3. Try again:
   ```bash
   npm install
   ```

### Supabase Connection Issues

The app uses Supabase with fallback values configured. If you need to set custom values:

1. Create a `.env` file in the root directory (optional):
   ```env
   VITE_PUBLIC_SUPABASE_URL=your_supabase_url
   VITE_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   ```

2. Or update `src/constants/supabase_config.ts` with your values

---

## First Time Setup

Before using the app, make sure you:

1. **Set up the database:**
   - Run `database/create_profiles_first.sql` in Supabase SQL Editor
   - Run `database/schema.sql` in Supabase SQL Editor

2. **Create an admin user:**
   - Sign up at `/auth/register`
   - In Supabase Dashboard, update `profiles` table:
     - Set `user_type = 'admin'` for your user

3. **Start posting books:**
   - Login as admin
   - Go to `/books/post`
   - Post your first book!

---

## Quick Start Commands

```bash
# Install dependencies (first time only)
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## Access Points

Once running, you can access:

- **Home Page:** http://localhost:3000/
- **Login:** http://localhost:3000/auth/login
- **Register:** http://localhost:3000/auth/register
- **Book Catalog:** http://localhost:3000/books/marketplace
- **Post Book (Admin):** http://localhost:3000/books/post
- **Admin Portal:** http://localhost:3000/admin/login

---

**That's it! Your web application should now be running.** 🚀

