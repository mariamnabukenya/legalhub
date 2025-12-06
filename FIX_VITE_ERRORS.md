# Fix Vite Dependency Optimization Errors

## Problem

You're seeing errors like:
- `504 (Outdated Optimize Dep)`
- `Failed to load resource`

This happens when Vite's pre-bundled dependencies are out of sync.

## Solution

### Step 1: Stop the Dev Server

Press `Ctrl + C` in the terminal where the dev server is running.

### Step 2: Clear Vite Cache

**Option A: Using PowerShell (Windows)**
```powershell
Remove-Item -Path "node_modules\.vite" -Recurse -Force -ErrorAction SilentlyContinue
```

**Option B: Using Command Prompt (Windows)**
```cmd
rmdir /s /q node_modules\.vite
```

**Option C: Manual**
1. Navigate to `node_modules` folder
2. Delete the `.vite` folder if it exists

### Step 3: Restart Dev Server

```bash
npm run dev
```

## Alternative: Force Re-optimization

The `vite.config.ts` has been updated to force dependency optimization. If errors persist:

1. **Delete node_modules and reinstall:**
   ```bash
   # Delete node_modules
   Remove-Item -Path "node_modules" -Recurse -Force
   
   # Delete package-lock.json (optional)
   Remove-Item -Path "package-lock.json" -Force
   
   # Reinstall
   npm install
   
   # Start dev server
   npm run dev
   ```

2. **Clear npm cache:**
   ```bash
   npm cache clean --force
   npm install
   npm run dev
   ```

## Quick Fix Commands

Run these in order:

```bash
# 1. Stop server (Ctrl+C if running)

# 2. Clear Vite cache
Remove-Item -Path "node_modules\.vite" -Recurse -Force -ErrorAction SilentlyContinue

# 3. Restart
npm run dev
```

## If Still Not Working

1. **Check Node.js version:**
   ```bash
   node --version
   ```
   Should be 16 or higher.

2. **Update dependencies:**
   ```bash
   npm update
   ```

3. **Try different port:**
   Edit `vite.config.ts` and change port from 3000 to 3001

---

**The vite.config.ts has been updated to force optimization. Try restarting the dev server now!**

