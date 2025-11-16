# Setup Checklist

Complete these steps in order to set up your Art Class Management System.

## ✅ Pre-Development Setup

### 1. Firebase Project Creation
- [ ] Go to [Firebase Console](https://console.firebase.google.com/)
- [ ] Create new project named "art-class"
- [ ] Note your Project ID: `__________________`

### 2. Firebase Authentication
- [ ] Navigate to Authentication → Get Started
- [ ] Enable "Google" sign-in provider
- [ ] Add support email
- [ ] Save settings

### 3. Firestore Database
- [ ] Navigate to Firestore Database
- [ ] Click "Create database"
- [ ] Select "Start in test mode"
- [ ] Choose location: `__________________`
- [ ] Click "Enable"

### 4. Firestore Security Rules
- [ ] Go to Firestore → Rules tab
- [ ] Copy rules from README.md
- [ ] Publish rules
- [ ] Verify "Last updated" timestamp changed

### 5. Firebase Storage
- [ ] Navigate to Storage
- [ ] Click "Get started"
- [ ] Start in test mode
- [ ] Copy Storage rules from README.md
- [ ] Publish rules

### 6. Get Firebase Config
- [ ] Go to Project Settings (gear icon)
- [ ] Scroll to "Your apps"
- [ ] Click web icon `</>`
- [ ] Register app: "art-class-web"
- [ ] Copy configuration values:
  ```
  apiKey: _________________________
  authDomain: _________________________
  projectId: _________________________
  storageBucket: _________________________
  messagingSenderId: _________________________
  appId: _________________________
  ```

## ✅ Local Development Setup

### 7. Clone and Install
```bash
# Clone repository
cd art-class-app

# Install dependencies
npm install
```
- [ ] Repository cloned
- [ ] Dependencies installed successfully

### 8. Environment Configuration
```bash
# Create environment file
cp .env.local.example .env.local

# Edit with your values
```
- [ ] `.env.local` created
- [ ] All Firebase values added
- [ ] Initial admin email set to: `nandinipuniwala@gmail.com`

### 9. First Run
```bash
npm run dev
```
- [ ] Development server starts without errors
- [ ] Visit http://localhost:3000
- [ ] Landing page loads correctly

### 10. Initial Admin Setup
- [ ] Click "Sign In" on homepage
- [ ] Sign in with Google using `nandinipuniwala@gmail.com`
- [ ] Should redirect to `/admin` dashboard
- [ ] Verify admin role created in Firestore:
  - [ ] Go to Firebase Console → Firestore
  - [ ] Check `roles` collection exists
  - [ ] Verify document with email `nandinipuniwala@gmail.com`

## ✅ Verification Tests

### 11. Public Features
- [ ] Landing page displays correctly
- [ ] All sections visible (Hero, Features, Schedule, Pricing, Contact)
- [ ] Navigation works
- [ ] "Register Now" button works

### 12. Registration Flow
- [ ] Click "Register" from homepage
- [ ] Fill out registration form
- [ ] Upload sample artwork (test with small image)
- [ ] Submit form
- [ ] Redirects to success page
- [ ] Check Firestore `students` collection for new document
- [ ] Check Firebase Storage for uploaded artwork

### 13. Admin Dashboard
- [ ] Sign in as admin
- [ ] Dashboard shows statistics
- [ ] All navigation items accessible:
  - [ ] Dashboard
  - [ ] Students
  - [ ] Payments
  - [ ] Notifications
  - [ ] Activity Log
  - [ ] Roles
  - [ ] Settings

### 14. Student Management
- [ ] View students list
- [ ] Search for student
- [ ] Filter students
- [ ] View student details
- [ ] Edit student information
- [ ] Manual student entry works

### 15. Payment Tracking
- [ ] Navigate to Payments
- [ ] Record a payment for a student
- [ ] Verify payment appears in list
- [ ] Check student's `amountPaid` updated
- [ ] View payment history

### 16. Role Management
- [ ] Navigate to Roles page
- [ ] Add a new admin email
- [ ] Sign out
- [ ] Sign in with new admin email
- [ ] Verify admin access granted
- [ ] Remove admin role
- [ ] Verify access revoked

### 17. Parent Dashboard
- [ ] Sign out as admin
- [ ] Register a student with your personal email
- [ ] Sign in with that email
- [ ] Should see "My Registrations" page
- [ ] Verify your registration appears
- [ ] Cannot access admin routes

## ✅ Production Deployment

### 18. Pre-Deployment
- [ ] All tests passing
- [ ] No console errors
- [ ] Type check passes: `npm run typecheck`
- [ ] Build succeeds: `npm run build`

### 19. Vercel Deployment
- [ ] Push code to GitHub/GitLab
- [ ] Import project in Vercel
- [ ] Add all environment variables
- [ ] Deploy
- [ ] Note deployment URL: `__________________`

### 20. Post-Deployment
- [ ] Add Vercel domain to Firebase authorized domains:
  - [ ] Firebase Console → Authentication → Settings
  - [ ] Add domain to "Authorized domains"
- [ ] Test sign-in on production
- [ ] Test registration on production
- [ ] Test admin access on production

## ✅ Optional Enhancements

### 21. Email Notifications (Optional)
- [ ] Set up SendGrid/Resend account
- [ ] Add API key to environment variables
- [ ] Implement email sending in registration
- [ ] Test confirmation emails

### 22. Firestore Indexes (As Needed)
- [ ] Monitor Firestore console for index creation prompts
- [ ] Create suggested indexes
- [ ] Or create manually via Firebase Console

### 23. Monitoring Setup
- [ ] Set up Firebase budget alerts
- [ ] Enable Firebase Analytics (optional)
- [ ] Set up error tracking (Sentry, etc.)

## 🎉 Completion

When all items are checked:
- [ ] Document any custom configurations
- [ ] Share credentials with team (securely)
- [ ] Schedule training session for admins
- [ ] Create backup/export procedure

---

**Setup Started**: _______________
**Setup Completed**: _______________
**Performed By**: _______________

## Troubleshooting Reference

### Common Issues

**Issue**: "Permission denied" in Firestore
- **Solution**: Check security rules are published
- **Solution**: Verify user is authenticated
- **Solution**: For admin operations, verify role exists

**Issue**: Image upload fails
- **Solution**: Check file size < 5MB
- **Solution**: Verify Storage rules published
- **Solution**: Ensure file type is image

**Issue**: Admin not recognized after sign-in
- **Solution**: Sign out completely and sign back in
- **Solution**: Check `roles` collection in Firestore
- **Solution**: Verify email matches exactly

**Issue**: Build fails
- **Solution**: Run `npm run typecheck`
- **Solution**: Delete `.next` folder
- **Solution**: Reinstall: `rm -rf node_modules && npm install`

**Issue**: Environment variables not loading
- **Solution**: Restart dev server after changing `.env.local`
- **Solution**: Verify all `NEXT_PUBLIC_` prefixes present
- **Solution**: Check for typos in variable names

## Support Contacts

**Firebase Issues**: Firebase Support Console
**Vercel Issues**: Vercel Support
**Code Issues**: Check README.md troubleshooting section

---

*Keep this checklist for future reference and team onboarding.*
