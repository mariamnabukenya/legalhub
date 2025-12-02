# Legal Hub Admin Web Portal - Documentation

## Project Overview

This is the admin web portal for Legal Hub, a comprehensive legal document management and case tracking system. The admin portal allows administrators to manage users, cases, documents, appointments, and payments.

---

## 1. Technology Stack

### Frontend
- **Framework:** React 19 with TypeScript
- **Routing:** React Router v6
- **Styling:** Tailwind CSS
- **Icons:** Font Awesome & Remix Icons
- **Build Tool:** Vite

### Backend
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage
- **Edge Functions:** Supabase Functions

---

## 2. Project Structure

```
legal-hub-admin/
├── src/
│   ├── components/          # Reusable components
│   ├── contexts/           # React contexts (Auth)
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Libraries (Supabase client)
│   ├── pages/
│   │   ├── admin/          # Admin portal pages
│   │   │   ├── components/ # Admin-specific components
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── UserManagement.tsx
│   │   │   │   ├── CaseManagement.tsx
│   │   │   │   ├── AppointmentManagement.tsx
│   │   │   │   ├── LegalLibrary.tsx
│   │   │   │   ├── PaymentsReports.tsx
│   │   │   │   ├── Notifications.tsx
│   │   │   │   └── Sidebar.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   └── page.tsx
│   │   ├── auth/           # Authentication pages
│   │   │   ├── LoginPage.tsx
│   │   │   └── SignupPage.tsx
│   │   ├── home/           # Landing page
│   │   │   └── page.tsx
│   │   └── NotFound.tsx
│   ├── router/             # Routing configuration
│   ├── App.tsx
│   └── main.tsx
├── supabase/
│   └── functions/          # Edge functions
│       └── process-payment/
├── .env                    # Environment variables
├── index.html
├── package.json
└── vite.config.ts
```

---

## 3. Environment Setup

### Required Environment Variables

Create a `.env` file in the root directory:

```env
VITE_PUBLIC_SUPABASE_URL=your_supabase_project_url
VITE_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 4. Authentication System

### Admin Access Control

The admin portal is restricted to users with `user_type = 'admin'` in the profiles table.

**Admin Login Flow:**
1. User enters credentials at `/admin/login`
2. System authenticates with Supabase Auth
3. System checks user's `user_type` in profiles table
4. If user is admin, grant access to dashboard
5. If not admin, sign out and show error

**Protected Routes:**
- `/admin` - Main admin dashboard (requires admin role)
- `/admin/login` - Admin login page (public)

### Creating Admin Users

Admins cannot be created through signup. To create an admin:

1. User signs up normally at `/auth/signup`
2. Admin manually updates the user's `user_type` to `'admin'` in Supabase dashboard
3. User can now access admin portal

---

## 5. Admin Portal Features

### 5.1 Dashboard
**Route:** `/admin` (default view)

**Features:**
- Overview statistics:
  - Total users count
  - Active cases count
  - Total revenue
  - Pending appointments
- Recent activity feed
- Quick action buttons
- System health indicators

**Components Used:**
- `Dashboard.tsx`

### 5.2 User Management
**Features:**
- View all users in a table
- Search and filter users
- View user details:
  - Full name
  - Email
  - Phone
  - User type (client/lawyer/admin)
  - Registration date
- Edit user information
- Change user roles
- Deactivate/activate users

**Components Used:**
- `UserManagement.tsx`

**Database Table:** `profiles`

### 5.3 Case Management
**Features:**
- View all cases across all users
- Filter by status (pending/active/closed)
- Filter by priority (low/medium/high)
- Search cases by case number or title
- View case details:
  - Case information
  - Client details
  - Assigned lawyer
  - Timeline of events
  - Next hearing date
- Assign lawyers to cases
- Update case status
- Add timeline events
- Close cases

**Components Used:**
- `CaseManagement.tsx`

**Database Tables:** 
- `cases`
- `case_timeline`
- `profiles` (for client and lawyer info)

### 5.4 Appointment Management
**Features:**
- View all appointments
- Calendar view and list view
- Filter by status (scheduled/completed/cancelled)
- Search appointments
- View appointment details:
  - Client and lawyer information
  - Date and time
  - Meeting type
  - Location
  - Description
- Reschedule appointments
- Cancel appointments
- Mark as completed

**Components Used:**
- `AppointmentManagement.tsx`

**Database Table:** `appointments`

### 5.5 Legal Library
**Features:**
- View all legal documents
- Add new documents
- Edit document information:
  - Title
  - Description
  - Category
  - Price
  - File upload
  - Thumbnail upload
- Delete documents
- View download statistics
- Manage document categories

**Components Used:**
- `LegalLibrary.tsx`

**Database Table:** `legal_documents`
**Storage Bucket:** `documents`

### 5.6 Payments & Reports
**Features:**
- View all payment transactions
- Filter by date range
- Search by payment reference
- View payment details:
  - User information
  - Document purchased
  - Amount paid
  - Payment method
  - Transaction date
  - Payment reference
- Export payment reports
- Revenue analytics
- Payment method statistics

**Components Used:**
- `PaymentsReports.tsx`

**Database Table:** `user_purchases`

### 5.7 Notifications
**Features:**
- Send notifications to users
- View notification history
- Filter by notification type
- Bulk notifications
- Notification templates

**Components Used:**
- `Notifications.tsx`

**Database Table:** `notifications`

---

## 6. Database Schema Reference

### profiles
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  user_type TEXT DEFAULT 'client', -- 'client', 'lawyer', 'admin'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### legal_documents
```sql
CREATE TABLE legal_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  price NUMERIC(10,2),
  file_url TEXT,
  thumbnail_url TEXT,
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### cases
```sql
CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  case_number TEXT UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'active', 'closed'
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high'
  assigned_lawyer_id UUID REFERENCES profiles(id),
  next_hearing TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### case_timeline
```sql
CREATE TABLE case_timeline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  event_type TEXT,
  title TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### appointments
```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  lawyer_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  appointment_date TIMESTAMP NOT NULL,
  duration INTEGER DEFAULT 60, -- in minutes
  status TEXT DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled'
  meeting_type TEXT, -- 'in-person', 'video', 'phone'
  location TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### user_purchases
```sql
CREATE TABLE user_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  document_id UUID REFERENCES legal_documents(id),
  amount_paid NUMERIC(10,2),
  payment_method TEXT,
  payment_reference TEXT,
  purchased_at TIMESTAMP DEFAULT NOW()
);
```

### notifications
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  message TEXT,
  type TEXT, -- 'case', 'appointment', 'payment', 'document'
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### payment_methods
```sql
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  method_type TEXT, -- 'mobile_money', 'card', 'bank'
  provider TEXT, -- 'MTN', 'Vodafone', 'AirtelTigo', etc.
  account_number TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 7. Key Components

### AuthContext
**File:** `src/contexts/AuthContext.tsx`

Provides authentication state and methods throughout the app:
- `user` - Current authenticated user
- `profile` - User profile data
- `loading` - Authentication loading state
- `signIn(email, password)` - Sign in method
- `signUp(email, password, fullName)` - Sign up method
- `signOut()` - Sign out method

**Usage:**
```typescript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, profile, signOut } = useAuth();
  
  return (
    <div>
      <p>Welcome, {profile?.full_name}</p>
      <button onClick={signOut}>Logout</button>
    </div>
  );
}
```

### Sidebar Navigation
**File:** `src/pages/admin/components/Sidebar.tsx`

Admin portal navigation menu with sections:
- Dashboard
- User Management
- Case Management
- Appointments
- Legal Library
- Payments & Reports
- Notifications

### Protected Admin Route
**File:** `src/pages/admin/page.tsx`

Main admin layout that:
- Checks if user is authenticated
- Verifies user has admin role
- Redirects to login if not authenticated
- Shows error if user is not admin
- Renders admin dashboard with sidebar navigation

---

## 8. Supabase Queries Examples

### Fetch All Users
```typescript
const { data: users, error } = await supabase
  .from('profiles')
  .select('*')
  .order('created_at', { ascending: false });
```

### Fetch All Cases with Client and Lawyer Info
```typescript
const { data: cases, error } = await supabase
  .from('cases')
  .select(`
    *,
    client:profiles!user_id(full_name, email, phone),
    lawyer:profiles!assigned_lawyer_id(full_name, email, phone)
  `)
  .order('created_at', { ascending: false });
```

### Fetch Case Timeline
```typescript
const { data: timeline, error } = await supabase
  .from('case_timeline')
  .select(`
    *,
    created_by_user:profiles!created_by(full_name)
  `)
  .eq('case_id', caseId)
  .order('created_at', { ascending: false });
```

### Fetch All Appointments
```typescript
const { data: appointments, error } = await supabase
  .from('appointments')
  .select(`
    *,
    client:profiles!user_id(full_name, email, phone),
    lawyer:profiles!lawyer_id(full_name, email, phone)
  `)
  .order('appointment_date', { ascending: true });
```

### Fetch Payment Transactions
```typescript
const { data: payments, error } = await supabase
  .from('user_purchases')
  .select(`
    *,
    user:profiles!user_id(full_name, email),
    document:legal_documents!document_id(title, category)
  `)
  .order('purchased_at', { ascending: false });
```

### Update User Role
```typescript
const { error } = await supabase
  .from('profiles')
  .update({ user_type: 'lawyer' })
  .eq('id', userId);
```

### Assign Lawyer to Case
```typescript
const { error } = await supabase
  .from('cases')
  .update({ 
    assigned_lawyer_id: lawyerId,
    status: 'active',
    updated_at: new Date().toISOString()
  })
  .eq('id', caseId);
```

### Add Case Timeline Event
```typescript
const { error } = await supabase
  .from('case_timeline')
  .insert({
    case_id: caseId,
    event_type: 'status_change',
    title: 'Case Status Updated',
    description: 'Case status changed to active',
    created_by: adminUserId
  });
```

---

## 9. File Upload (Documents)

### Upload Document File
```typescript
const file = event.target.files[0];
const fileName = `${Date.now()}_${file.name}`;

const { data, error } = await supabase.storage
  .from('documents')
  .upload(fileName, file);

if (!error) {
  const { data: { publicUrl } } = supabase.storage
    .from('documents')
    .getPublicUrl(fileName);
  
  // Save publicUrl to legal_documents table
}
```

### Upload Thumbnail
```typescript
const { data, error } = await supabase.storage
  .from('thumbnails')
  .upload(`${documentId}_thumb.jpg`, thumbnailFile);
```

---

## 10. Row Level Security (RLS) Policies

### Admin Access Policies

For admin portal, you may want to disable RLS on certain tables or create admin-specific policies:

```sql
-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND user_type = 'admin'
  )
);

-- Allow admins to update all profiles
CREATE POLICY "Admins can update all profiles"
ON profiles FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND user_type = 'admin'
  )
);

-- Similar policies for cases, appointments, etc.
```

---

## 11. Deployment

### Build for Production
```bash
npm run build
```

This creates a `dist` folder with optimized production files.

### Deploy to Hosting Platforms

**Vercel:**
```bash
npm install -g vercel
vercel
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

**Custom Server:**
- Upload `dist` folder contents
- Configure web server to serve `index.html` for all routes
- Set environment variables

---

## 12. Environment Variables for Production

Ensure these are set in your hosting platform:

```
VITE_PUBLIC_SUPABASE_URL=your_production_supabase_url
VITE_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
```

---

## 13. Security Best Practices

1. **Never expose Supabase service role key** - Only use anon key in frontend
2. **Use Row Level Security (RLS)** - Protect all tables with appropriate policies
3. **Validate admin role** - Always check user_type before granting admin access
4. **Secure file uploads** - Validate file types and sizes
5. **Use HTTPS** - Always use secure connections in production
6. **Environment variables** - Never commit `.env` file to version control
7. **Input validation** - Validate all user inputs on both client and server
8. **Rate limiting** - Implement rate limiting for API calls

---

## 14. Common Admin Tasks

### Create a New Admin User
1. User signs up at `/auth/signup`
2. Go to Supabase Dashboard → Table Editor → profiles
3. Find the user by email
4. Change `user_type` from `'client'` to `'admin'`
5. User can now access admin portal

### Add a New Legal Document
1. Navigate to Legal Library section
2. Click "Add New Document"
3. Fill in document details
4. Upload PDF file
5. Upload thumbnail image
6. Set price and category
7. Save document

### Assign Lawyer to Case
1. Navigate to Case Management
2. Find the case
3. Click "Assign Lawyer"
4. Select lawyer from dropdown (users with user_type='lawyer')
5. Case status automatically changes to 'active'

### Process Refund (Manual)
1. Navigate to Payments & Reports
2. Find the transaction
3. Note payment reference
4. Process refund through payment provider
5. Update transaction status in database

---

## 15. Troubleshooting

### Issue: Cannot access admin portal after login
**Solution:** Check that user's `user_type` is set to `'admin'` in profiles table

### Issue: Documents not uploading
**Solution:** 
- Check Supabase Storage bucket exists
- Verify bucket permissions
- Check file size limits

### Issue: RLS policies blocking admin access
**Solution:** 
- Review RLS policies in Supabase
- Ensure admin policies are created
- Temporarily disable RLS for testing (not recommended for production)

### Issue: Authentication errors
**Solution:**
- Verify Supabase URL and anon key in `.env`
- Check Supabase Auth settings
- Clear browser cache and cookies

---

## 16. Future Enhancements

Potential features to add:
- [ ] Advanced analytics dashboard
- [ ] Email notifications system
- [ ] Document version control
- [ ] Bulk user import/export
- [ ] Advanced search and filtering
- [ ] Activity logs and audit trail
- [ ] Two-factor authentication
- [ ] Custom report generation
- [ ] Integration with payment gateways
- [ ] Video consultation integration
- [ ] Mobile app for admins

---

## 17. Support & Resources

### Documentation
- [React Documentation](https://react.dev)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Router Documentation](https://reactrouter.com)

### Supabase Dashboard
Access your Supabase project dashboard to:
- View and edit database tables
- Manage storage buckets
- Configure authentication
- View logs and analytics
- Manage API keys

---

**Last Updated:** January 2024
**Version:** 1.0
