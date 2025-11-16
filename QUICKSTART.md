# Quick Start Guide

Get your Art Class Management System up and running in 30 minutes.

## Prerequisites

- Node.js 18+ installed
- Google account
- 30 minutes of time

## Step 1: Firebase Setup (15 minutes)

### Create Project
1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it "art-class"
4. Disable Analytics (optional)
5. Click "Create"

### Enable Authentication
1. Click "Authentication" → "Get started"
2. Select "Google" provider
3. Enable it and add your support email
4. Click "Save"

### Create Firestore
1. Click "Firestore Database" → "Create database"
2. Select "Start in test mode"
3. Choose closest location
4. Click "Enable"

### Update Firestore Rules
1. Go to "Rules" tab
2. Replace content with:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return exists(/databases/$(database)/documents/roles/{roleId})
        where get(/databases/$(database)/documents/roles/$(roleId)).data.email == request.auth.token.email;
    }

    match /students/{studentId} {
      allow read: if isAdmin();
      allow create: if request.auth != null;
      allow update, delete: if isAdmin();
    }

    match /payments/{paymentId} {
      allow read, write: if isAdmin();
    }

    match /roles/{roleId} {
      allow read, write: if isAdmin();
    }

    match /logs/{logId} {
      allow read, write: if isAdmin();
    }

    match /notifications/{notificationId} {
      allow read, write: if isAdmin();
    }
  }
}
```
3. Click "Publish"

### Create Storage
1. Click "Storage" → "Get started"
2. Start in test mode
3. Click "Done"

### Get Configuration
1. Click gear icon → "Project settings"
2. Scroll to "Your apps"
3. Click web icon `</>`
4. Register app: "art-class-web"
5. Copy the config object

## Step 2: Local Setup (10 minutes)

### Install Dependencies
```bash
cd art-class-app
npm install
```

### Configure Environment
```bash
cp .env.local.example .env.local
nano .env.local  # or use your editor
```

Add your Firebase values:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-actual-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_INITIAL_ADMIN_EMAIL=nandinipuniwala@gmail.com
```

### Start Development Server
```bash
npm run dev
```

Visit: `http://localhost:3000`

## Step 3: First Login (5 minutes)

### Create Admin Account
1. Click "Sign In" button
2. Sign in with Google using: `nandinipuniwala@gmail.com`
3. You'll be redirected to admin dashboard
4. This automatically creates your admin role

### Verify Setup
1. Go to Firebase Console → Firestore
2. You should see a `roles` collection
3. With one document containing your email

## Success!

You're now ready to:
- ✅ Add more admins (Admin → Roles)
- ✅ Manually add students (Admin → Students)
- ✅ Accept registrations (share the /register page)
- ✅ Track payments
- ✅ Export data

## Common First-Time Issues

### "Permission denied" error
**Solution**: Wait 1 minute after publishing Firestore rules, then refresh

### Can't sign in
**Solution**: Verify your email matches exactly: `nandinipuniwala@gmail.com`

### Admin dashboard not showing
**Solution**:
1. Sign out completely
2. Close browser
3. Sign in again
4. Check Firestore `roles` collection exists

### Images won't upload
**Solution**: Make sure you created Firebase Storage

## Next Steps

### Add More Admins
1. Go to Admin → Roles
2. Enter admin email
3. Click "Add Admin"
4. They can now sign in with Google

### Test Registration
1. Open `/register` in incognito window
2. Fill out form with test data
3. Submit
4. Check admin notifications
5. View student in Students page

### Customize
1. Update logo/branding in `app/page.tsx`
2. Change colors in `tailwind.config.ts`
3. Update contact info throughout
4. Modify fee amounts in registration

## Production Deployment

### Quick Deploy to Vercel
```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git push origin main

# Deploy on Vercel
1. Visit vercel.com
2. Import repository
3. Add environment variables
4. Deploy
```

### Update Firebase
1. Add Vercel domain to Firebase:
   - Authentication → Settings → Authorized domains
   - Add: `your-app.vercel.app`

## Support

### Get Help
- Check `README.md` for detailed docs
- Review `SETUP_CHECKLIST.md` for complete setup
- See `FIRESTORE_EXAMPLE.md` for data structure

### Test Data
Use these for testing:
- **Student Name**: Test Student
- **Age**: 8
- **Parent Email**: test@example.com
- **Phone**: 9999999999

---

**Time to complete**: ~30 minutes
**Difficulty**: Beginner-friendly
**Cost**: Free (Firebase free tier)

Enjoy your Art Class Management System! 🎨
