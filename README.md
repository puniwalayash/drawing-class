# Art Class Management System

A complete, production-ready web application for managing a children's drawing class. Built with Next.js, TypeScript, Firebase, and Tailwind CSS.

## Features

### Public Features
- **Beautiful Landing Page**: Professional design with hero section, features, schedule, pricing, and contact information
- **Student Registration**: Comprehensive registration form with validation
- **Google Authentication**: Secure sign-in for parents and admins
- **My Registrations**: Parents can view their registered children

### Admin Features
- **Dashboard**: Real-time statistics, charts, and quick actions
- **Student Management**: Full CRUD operations with search, filter, and pagination
- **Payment Tracking**: Record and manage fee payments
- **Role Management**: Add/remove admin users
- **Activity Logs**: Audit trail of all admin actions
- **Notifications**: Real-time alerts for new registrations and pending payments
- **CSV Export**: Export student data for reporting
- **Manual Entry**: Teachers can add students directly

## Tech Stack

- **Framework**: Next.js 13+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (Google Sign-In)
- **Storage**: Firebase Storage (for artwork uploads)
- **Form Validation**: React Hook Form + Yup
- **Charts**: Recharts

## Project Structure

```
├── app/
│   ├── layout.tsx                 # Root layout with AuthProvider
│   ├── page.tsx                   # Landing page
│   ├── login/                     # Login page
│   ├── register/                  # Student registration
│   ├── registration-success/      # Success confirmation
│   ├── my-registrations/          # Parent dashboard
│   └── admin/                     # Admin section
│       ├── page.tsx               # Admin dashboard
│       ├── students/              # Student management
│       ├── payments/              # Payment tracking
│       ├── notifications/         # Notification center
│       ├── activity/              # Activity logs
│       ├── roles/                 # Role management
│       └── settings/              # App settings
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── admin/
│   │   └── AdminLayout.tsx        # Admin sidebar layout
│   └── ProtectedRoute.tsx         # Route protection HOC
├── contexts/
│   └── AuthContext.tsx            # Auth state management
├── hooks/
│   ├── useAuth.ts                 # Auth hook
│   └── use-toast.ts               # Toast notifications
├── lib/
│   ├── firebase/
│   │   ├── config.ts              # Firebase initialization
│   │   ├── auth.ts                # Auth helpers
│   │   ├── students.ts            # Student operations
│   │   ├── payments.ts            # Payment operations
│   │   ├── roles.ts               # Role management
│   │   ├── logs.ts                # Activity logging
│   │   └── notifications.ts       # Notification system
│   ├── validations/
│   │   └── registration.ts        # Form schemas
│   └── utils/
│       └── export.ts              # CSV export utility
├── types/
│   └── index.ts                   # TypeScript types
└── .env.local.example             # Environment template
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- A Google account
- Firebase account (free plan works)

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd art-class-app

# Install dependencies
npm install
```

### 2. Firebase Project Setup

1. **Create Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project"
   - Enter project name: "art-class" (or your preference)
   - Disable Google Analytics (optional)
   - Click "Create project"

2. **Enable Google Authentication**:
   - In Firebase Console, go to "Authentication"
   - Click "Get started"
   - Select "Google" from Sign-in providers
   - Enable Google sign-in
   - Add your support email
   - Click "Save"

3. **Create Firestore Database**:
   - Go to "Firestore Database"
   - Click "Create database"
   - Select "Start in test mode" (we'll set up rules later)
   - Choose your preferred location
   - Click "Enable"

4. **Set up Firestore Security Rules**:
   - In Firestore, go to "Rules" tab
   - Replace with these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is admin
    function isAdmin() {
      return exists(/databases/$(database)/documents/roles/$(request.auth.uid)) ||
             exists(/databases/$(database)/documents/roles/{roleId}) where
             get(/databases/$(database)/documents/roles/$(roleId)).data.email == request.auth.token.email;
    }

    // Students collection - admins can read/write, users can create
    match /students/{studentId} {
      allow read: if isAdmin();
      allow create: if request.auth != null;
      allow update, delete: if isAdmin();
    }

    // Payments collection - only admins
    match /payments/{paymentId} {
      allow read, write: if isAdmin();
    }

    // Roles collection - only admins can read/write
    match /roles/{roleId} {
      allow read, write: if isAdmin();
    }

    // Logs collection - only admins can read
    match /logs/{logId} {
      allow read: if isAdmin();
      allow write: if isAdmin();
    }

    // Notifications collection - only admins
    match /notifications/{notificationId} {
      allow read, write: if isAdmin();
    }

    // Settings collection - only admins
    match /settings/{settingId} {
      allow read, write: if isAdmin();
    }
  }
}
```

5. **Create Firebase Storage**:
   - Go to "Storage"
   - Click "Get started"
   - Choose "Start in test mode"
   - Click "Next" then "Done"

6. **Set Storage Security Rules**:
   - In Storage, go to "Rules" tab:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /artworks/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
                     request.resource.size < 5 * 1024 * 1024 &&
                     request.resource.contentType.matches('image/.*');
    }
  }
}
```

7. **Get Firebase Configuration**:
   - Go to Project Settings (gear icon)
   - Scroll to "Your apps"
   - Click the web icon (`</>`)
   - Register app with nickname "art-class-web"
   - Copy the configuration object

### 3. Environment Variables

Create `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_INITIAL_ADMIN_EMAIL=nandinipuniwala@gmail.com
```

### 4. Initial Admin Setup

The first admin (`nandinipuniwala@gmail.com`) will be automatically created when they first sign in with Google. The system checks if no roles exist in Firestore, and if this email signs in, it automatically creates an admin role.

**Important**: Make sure to:
1. Sign in with the Google account: `nandinipuniwala@gmail.com`
2. This will automatically create the first admin role
3. After this, you can add more admins through the Admin > Roles page

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

### 6. First Time Setup Flow

1. Visit the app
2. Click "Sign In"
3. Sign in with Google using `nandinipuniwala@gmail.com`
4. You'll be redirected to the admin dashboard
5. Now you can:
   - Add more admins via "Admin > Roles"
   - Configure settings
   - Add students manually
   - View registrations

## Firestore Collections Structure

### students
```typescript
{
  id: string (auto-generated)
  firstName: string
  lastName: string
  dateOfBirth: string
  age: number
  grade: string
  gender: 'male' | 'female' | 'other' | ''
  sampleArtworkUrl?: string
  medicalNotes?: string
  parentName: string
  parentEmail: string
  parentPhone: string
  address: string
  preferredTiming: string
  referralSource: string
  totalFee: number
  feeType: 'single' | 'installments'
  amountPaid: number
  status: 'registered' | 'active' | 'inactive' | 'completed'
  createdAt: Timestamp
  updatedAt: Timestamp
  createdBy: string
  deletedAt?: Timestamp | null
}
```

### payments
```typescript
{
  id: string (auto-generated)
  studentId: string
  amount: number
  date: Timestamp
  method: 'cash' | 'card' | 'bank-transfer' | 'upi' | 'other'
  notes?: string
  recordedBy: string
  createdAt: Timestamp
}
```

### roles
```typescript
{
  id: string (auto-generated)
  email: string (lowercase)
  role: 'admin'
  addedBy: string
  createdAt: Timestamp
}
```

### logs
```typescript
{
  id: string (auto-generated)
  action: 'created' | 'updated' | 'deleted' | 'role-added' | 'role-removed' | 'payment-added'
  entityType: 'student' | 'role' | 'payment'
  entityId: string
  performedBy: string
  details?: object
  timestamp: Timestamp
}
```

### notifications
```typescript
{
  id: string (auto-generated)
  type: 'new-registration' | 'payment-pending' | 'payment-received'
  title: string
  message: string
  studentId?: string
  read: boolean
  createdAt: Timestamp
}
```

## Required Firestore Indexes

Some queries require composite indexes. Firebase will prompt you to create them when needed, or create them manually:

1. **students collection**:
   - Fields: `deletedAt` (Ascending), `status` (Ascending), `createdAt` (Descending)
   - Fields: `deletedAt` (Ascending), `preferredTiming` (Ascending), `createdAt` (Descending)

2. **payments collection**:
   - Fields: `studentId` (Ascending), `date` (Descending)

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables from `.env.local`
5. Deploy

### Important: Update Firebase Configuration

After deploying, add your Vercel domain to Firebase:

1. Go to Firebase Console > Authentication > Settings
2. Add your Vercel domain to "Authorized domains"
3. Example: `your-app.vercel.app`

## Development Scripts

```bash
# Development server
npm run dev

# Type checking
npm run typecheck

# Build for production
npm run build

# Start production server
npm start

# Linting
npm run lint
```

## Email Integration (Future Enhancement)

The app is structured to support email notifications. To implement:

1. **Option A: Firebase Cloud Functions + SendGrid**
   ```bash
   # Install Firebase CLI
   npm install -g firebase-tools

   # Initialize functions
   firebase init functions
   ```

2. **Option B: Next.js API Route + Email Service**
   - Create `/app/api/send-email/route.ts`
   - Use SendGrid, Resend, or similar service
   - Call from registration form

3. **Environment Variables** (add to `.env.local`):
   ```env
   SENDGRID_API_KEY=your-key
   EMAIL_FROM=noreply@yourdomain.com
   ```

## Testing

The app includes basic structure for testing. To add tests:

```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Create test file
# Example: __tests__/hooks/useAuth.test.ts
```

## Security Best Practices

1. **Never commit `.env.local`** - It's in `.gitignore`
2. **Use Firestore Security Rules** - Already configured
3. **Validate on server-side** - All writes go through Firebase rules
4. **Regular backups** - Export Firestore data regularly
5. **Monitor usage** - Set up Firebase budget alerts

## Troubleshooting

### "Permission denied" errors
- Check Firestore security rules
- Ensure user is authenticated
- Verify admin role exists in `roles` collection

### Images not uploading
- Check Storage security rules
- Verify file size < 5MB
- Ensure file is an image type

### Admin not recognized
- Sign out and sign in again
- Check `roles` collection in Firestore
- Verify email matches exactly (case-insensitive)

### Build errors
- Run `npm run typecheck` to find TypeScript errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## Support & Contact

For questions or issues with this codebase:
- Check Firebase Console for errors
- Review browser console for client-side errors
- Check Vercel logs for server-side errors

## License

This is a proprietary application built for Art Class management.

---

**Initial Admin**: nandinipuniwala@gmail.com
**Version**: 1.0.0
**Last Updated**: 2024
