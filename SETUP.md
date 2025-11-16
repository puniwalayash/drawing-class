# Art Class Management System Setup Guide

Complete setup guide for the Supabase-powered Art Class Management System with email/password authentication.

## Quick Setup

### 1. Environment Configuration

Create `.env.local` file:

```bash
cp .env.local.example .env.local
```

Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Admin Credentials
ADMIN_EMAIL=admin@artclass.com
ADMIN_PASSWORD=your-secure-password
```

### 2. Get Supabase Credentials

The Supabase project is already set up. Get your credentials:

1. The database schema has been created automatically
2. Get your credentials from the Supabase dashboard
3. Copy the Project URL and Anon Key to `.env.local`

### 3. Create Initial Admin User

In Supabase Dashboard:

1. Go to Authentication > Users
2. Click "Add user"
3. Email: `admin@artclass.com` (or your preferred email)
4. Password: Create a secure password
5. Confirm email: Enable
6. Click "Create user"

### 4. Add Admin Role

In Supabase SQL Editor, run:

```sql
INSERT INTO roles (email, role, added_by)
VALUES ('admin@artclass.com', 'admin', 'system');
```

Replace `admin@artclass.com` with the email you used above.

### 5. Install Dependencies & Run

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## Features

### Authentication
- **Email/Password Login**: Admin login with email and password
- **No Google OAuth**: Simple credential-based authentication
- **Role-Based Access**: Admin panel restricted to authorized users

### Admin Panel Access
- URL: `/login`
- Use the admin email and password you created
- Non-admin users cannot access admin routes

### Public Features
- Student registration form
- Landing page with class information
- Registration success confirmation

## Database Schema

### Tables Created

1. **students** - Student registrations
2. **payments** - Payment tracking
3. **roles** - Admin role management
4. **logs** - Activity audit trail
5. **notifications** - Admin notifications

### Storage
- **artworks** bucket - Student artwork uploads

## Security

All tables have Row Level Security (RLS) enabled:
- Admins can view/edit all data
- Users can register students
- Users can view their own registrations

## Adding More Admins

1. Have the person create an account through Supabase Auth
2. As an existing admin, go to Admin > Roles
3. Add their email address
4. They can now access the admin panel

## API Structure

### Students
- `POST /api/students` - Create student
- `GET /api/students` - List students (admin only)
- `PUT /api/students/:id` - Update student (admin only)
- `DELETE /api/students/:id` - Delete student (admin only)

### Payments
- `POST /api/payments` - Record payment (admin only)
- `GET /api/payments` - List payments (admin only)

### Authentication
- Sign in: `supabase.auth.signInWithPassword({ email, password })`
- Sign out: `supabase.auth.signOut()`

## Testing

### Test Registration
1. Go to `/register`
2. Fill out the form
3. Submit
4. Check admin dashboard for new registration

### Test Admin Login
1. Go to `/login`
2. Enter admin credentials
3. Should redirect to `/admin`

### Test Roles
1. Sign in as admin
2. Go to Roles page
3. Add another admin email
4. Test login with that email

## Troubleshooting

### Cannot sign in
- Verify user exists in Supabase Auth dashboard
- Check email/password are correct
- Ensure role exists in `roles` table

### Cannot access admin panel
- Check if email exists in `roles` table
- Verify RLS policies are enabled
- Check browser console for errors

### Images not uploading
- Verify `artworks` storage bucket exists
- Check storage policies are correct
- Ensure file is under 5MB

## Production Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import to Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

### Important: No public sign-up
- This system does NOT have public sign-up for admins
- Admins must be created manually in Supabase Dashboard
- Or added through the Admin > Roles interface

## Key Differences from Firebase Version

1. **Authentication**: Email/password only (no Google OAuth)
2. **Database**: PostgreSQL (Supabase) instead of Firestore
3. **Storage**: Supabase Storage instead of Firebase Storage
4. **Admin Setup**: Manual user creation + role assignment
5. **API**: Direct Supabase client calls instead of Firebase SDK

## Support

The system is fully functional with:
- Student registration
- Payment tracking
- Admin dashboard
- Role management
- Activity logging
- File uploads

All Firebase code has been removed and replaced with Supabase equivalents.
