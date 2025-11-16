# Deployment Guide

Complete guide to deploying your Art Class Management System to production.

## Pre-Deployment Checklist

### Code Quality
- [x] TypeScript compiles without errors (`npm run typecheck`)
- [x] Build succeeds (`npm run build`)
- [x] No console errors in development
- [x] All environment variables documented

### Firebase Setup
- [ ] Firebase project created
- [ ] Authentication enabled (Google)
- [ ] Firestore database created
- [ ] Security rules published
- [ ] Storage bucket created
- [ ] Storage rules published
- [ ] Initial admin email configured

### Testing
- [ ] Landing page loads correctly
- [ ] Registration form works
- [ ] File upload successful
- [ ] Admin login works
- [ ] Admin dashboard displays data
- [ ] Student list loads
- [ ] Payments can be recorded
- [ ] CSV export works
- [ ] Mobile responsive verified

## Deployment Options

### Option 1: Vercel (Recommended)

#### Prerequisites
- GitHub/GitLab account
- Code pushed to repository

#### Steps

1. **Push Code to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Deploy on Vercel**
- Visit [vercel.com](https://vercel.com)
- Click "Import Project"
- Select your repository
- Vercel auto-detects Next.js

3. **Add Environment Variables**
In Vercel dashboard:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your-actual-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_INITIAL_ADMIN_EMAIL=nandinipuniwala@gmail.com
```

4. **Deploy**
- Click "Deploy"
- Wait 2-3 minutes
- Note your deployment URL

5. **Update Firebase**
- Go to Firebase Console
- Authentication → Settings → Authorized domains
- Add: `your-app.vercel.app`
- Save

#### Post-Deployment
- Test sign-in on production
- Verify admin access
- Test registration form
- Check file uploads work

---

### Option 2: Netlify

#### Steps

1. **Push to Git** (same as Vercel)

2. **Deploy on Netlify**
- Visit [netlify.com](https://netlify.com)
- Click "Add new site"
- Import from Git
- Select repository

3. **Build Settings**
```
Build command: npm run build
Publish directory: out
```

4. **Environment Variables**
Same as Vercel (in Netlify dashboard)

5. **Deploy & Update Firebase**
Same as Vercel

---

### Option 3: Firebase Hosting

#### Prerequisites
```bash
npm install -g firebase-tools
firebase login
```

#### Steps

1. **Initialize Firebase Hosting**
```bash
firebase init hosting
```

Settings:
- Public directory: `out`
- Single-page app: Yes
- GitHub auto-deploy: Optional

2. **Build**
```bash
npm run build
```

3. **Deploy**
```bash
firebase deploy --only hosting
```

4. **Update Auth Domains**
Your app is already on a Firebase domain, so authorized domains are auto-configured.

---

## Environment Variables

### Required Variables

```env
# Firebase Configuration (Get from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Admin Configuration
NEXT_PUBLIC_INITIAL_ADMIN_EMAIL=nandinipuniwala@gmail.com
```

### Optional Variables (for future features)

```env
# Email Service (SendGrid)
SENDGRID_API_KEY=
EMAIL_FROM=

# SMS Service (Twilio)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Analytics
NEXT_PUBLIC_GA_TRACKING_ID=
```

---

## Post-Deployment Steps

### 1. Verify Deployment

Visit your deployed URL and check:
- [ ] Landing page loads
- [ ] All images display
- [ ] Navigation works
- [ ] Registration form loads
- [ ] Sign in button works

### 2. First Admin Login

1. Go to `/login`
2. Sign in with `nandinipuniwala@gmail.com`
3. Should redirect to `/admin`
4. Verify role created in Firestore

### 3. Test Complete Flow

#### Test Registration
1. Open `/register` in incognito window
2. Fill form with test data:
   - Name: Test Student
   - Age: 8
   - Email: test@example.com
   - Phone: 9999999999
3. Upload test image (< 5MB)
4. Submit
5. Should redirect to success page

#### Test Admin Functions
1. Sign in as admin
2. Go to Students page
3. Verify test student appears
4. Try search/filter
5. Record a payment
6. Export CSV
7. Check notifications

### 4. Configure Custom Domain (Optional)

#### On Vercel
1. Settings → Domains
2. Add your domain
3. Follow DNS instructions
4. Add domain to Firebase authorized domains

#### On Netlify
1. Domain settings → Add custom domain
2. Follow DNS instructions
3. Add domain to Firebase

---

## Monitoring & Maintenance

### Firebase Console

Monitor daily:
1. **Authentication**
   - Active users
   - Sign-in methods
   - Any errors

2. **Firestore**
   - Document reads/writes
   - Storage size
   - Index performance

3. **Storage**
   - Total storage used
   - Bandwidth
   - File count

### Set Up Alerts

#### Firebase Alerts
1. Firebase Console → Budget & alerts
2. Set alert at 80% of free tier
3. Add email: nandinipuniwala@gmail.com

#### Vercel Alerts
1. Project → Settings → Integrations
2. Connect to Slack/Discord (optional)
3. Get deployment notifications

---

## Backup Strategy

### Manual Backup

```bash
# Install gcloud CLI
gcloud auth login

# Export Firestore
gcloud firestore export gs://your-bucket/backups/$(date +%Y%m%d)

# Download
gsutil -m cp -r gs://your-bucket/backups/20240115 ./backups/
```

### Scheduled Backups

1. Google Cloud Console
2. Firestore → Import/Export
3. Schedule automated exports
4. Choose frequency: Weekly
5. Destination: Cloud Storage bucket

### What to Backup

- ✅ Firestore data (all collections)
- ✅ Firebase Storage (artwork uploads)
- ✅ Configuration files (.env)
- ❌ No need: Code (in Git)

---

## Rollback Plan

### If Deployment Fails

**On Vercel:**
1. Go to Deployments
2. Find last working deployment
3. Click "Promote to Production"

**On Netlify:**
1. Deploys → Select previous deploy
2. Click "Publish deploy"

**On Firebase:**
```bash
firebase hosting:rollback
```

### If Data Issues

1. Stop accepting registrations (disable form)
2. Restore from last backup
3. Verify data integrity
4. Re-enable form

---

## Performance Optimization

### After Deployment

1. **Check Lighthouse Score**
```bash
# In Chrome DevTools
Lighthouse → Generate report
Target: 90+ Performance
```

2. **Optimize Images**
- Already using external images (Pexels)
- User uploads optimized on upload

3. **Enable Caching**
Already configured in Next.js:
- Static assets: 1 year
- Dynamic content: Appropriate cache

4. **CDN**
Vercel/Netlify use CDN by default

---

## Security Checklist

Post-deployment security:

- [ ] HTTPS enabled (automatic on Vercel/Netlify)
- [ ] Firestore rules published and verified
- [ ] Storage rules published and verified
- [ ] No API keys in client code (all NEXT_PUBLIC_)
- [ ] Admin roles working correctly
- [ ] Test unauthorized access (should redirect)
- [ ] File upload size limits enforced
- [ ] CORS configured correctly

---

## Troubleshooting

### Common Deployment Issues

**Build fails with Firebase error**
- Solution: Check environment variables set correctly
- Solution: Verify all `NEXT_PUBLIC_` prefixes present

**Sign-in doesn't work on production**
- Solution: Add domain to Firebase authorized domains
- Solution: Wait 5 minutes for DNS propagation

**Images don't load**
- Solution: Check image URLs are absolute
- Solution: Verify CORS settings on image hosts

**500 errors on production**
- Solution: Check Vercel/Netlify logs
- Solution: Verify environment variables
- Solution: Check Firebase quotas

---

## Custom Domain Setup

### Example with Vercel

1. **Purchase Domain** (GoDaddy, Namecheap, etc.)

2. **Add to Vercel**
   - Project → Settings → Domains
   - Add domain: `artclass.com`
   - Note DNS instructions

3. **Update DNS** (at your registrar)
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

4. **Update Firebase**
   - Add `artclass.com` to authorized domains
   - Add `www.artclass.com` to authorized domains

5. **Wait for Propagation** (up to 48 hours)

---

## Go Live Checklist

Before announcing:

- [ ] All features tested on production
- [ ] Admin can sign in
- [ ] Registrations working
- [ ] Payments can be recorded
- [ ] Mobile responsive verified
- [ ] Load testing done (optional)
- [ ] Backup configured
- [ ] Monitoring set up
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Error tracking enabled (optional)

---

## Support After Deployment

### For Technical Issues

1. Check Vercel/Netlify logs
2. Check Firebase Console errors
3. Check browser console
4. Review recent changes in Git

### For User Issues

1. Check Firebase Authentication logs
2. Verify Firestore rules
3. Check recent activity logs
4. Review user permissions

---

## Costs

### Expected Monthly Costs

**Free Tier (First 6 months)**
- Vercel: $0 (Hobby plan)
- Firebase: $0 (free tier)
- Total: **$0/month**

**Growing (500+ students)**
- Vercel: $0 or $20 (Pro optional)
- Firebase: $5-25 (pay-as-you-go)
- Total: **$5-45/month**

### Firebase Free Tier Limits
- Storage: 1 GB
- Network: 10 GB/month
- Reads: 50,000/day
- Writes: 20,000/day
- Deletes: 20,000/day

Should be sufficient for ~5,000 students.

---

## Success Metrics

Post-deployment metrics to track:

1. **User Metrics**
   - Total registrations
   - Daily new registrations
   - Active parent users

2. **Technical Metrics**
   - Page load time (< 2s)
   - Uptime (> 99.9%)
   - Error rate (< 0.1%)

3. **Business Metrics**
   - Total revenue collected
   - Payment completion rate
   - Pending payments

---

**Deployment Status**: Ready to deploy ✅

**Estimated Deployment Time**: 15-30 minutes

**Difficulty**: Beginner-friendly

**Cost**: Free tier sufficient

---

*Follow this guide and your Art Class Management System will be live and production-ready!*
