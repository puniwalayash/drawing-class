# Firestore Data Structure Examples

This document provides example documents for each collection in the Art Class Management System.

## Collections Overview

```
artclass-firestore/
├── students/           # Student registrations
├── payments/           # Payment records
├── roles/              # Admin role assignments
├── logs/               # Activity audit trail
├── notifications/      # Admin notifications
└── settings/           # App configuration (future)
```

---

## students Collection

### Example Document
```javascript
// Document ID: "abc123xyz789" (auto-generated)
{
  // Child Information
  "firstName": "Priya",
  "lastName": "Sharma",
  "dateOfBirth": "2015-03-15",
  "age": 9,
  "grade": "Grade 4",
  "gender": "female",
  "sampleArtworkUrl": "https://firebasestorage.googleapis.com/.../artwork.jpg",
  "medicalNotes": "Mild peanut allergy",

  // Parent Information
  "parentName": "Rajesh Sharma",
  "parentEmail": "rajesh.sharma@example.com",
  "parentPhone": "9876543210",
  "address": "123 MG Road, Bandra West, Mumbai - 400050, Maharashtra",
  "preferredTiming": "Saturday (10:00 AM - 12:00 PM)",
  "referralSource": "Friend/Family Reference",

  // Fee & Payment
  "totalFee": 5000,
  "feeType": "installments",
  "amountPaid": 2500,
  "status": "active",

  // Metadata
  "createdAt": Timestamp(2024, 1, 15, 10, 30, 0),
  "updatedAt": Timestamp(2024, 1, 20, 14, 15, 0),
  "createdBy": "system",
  "deletedAt": null
}
```

### Field Explanations

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `firstName` | string | Child's first name | Yes |
| `lastName` | string | Child's last name | Yes |
| `dateOfBirth` | string | ISO date format | Yes |
| `age` | number | Child's age (3-18) | Yes |
| `grade` | string | School grade/class | Yes |
| `gender` | string | 'male', 'female', 'other', or '' | No |
| `sampleArtworkUrl` | string | Firebase Storage URL | No |
| `medicalNotes` | string | Health information | No |
| `parentName` | string | Full name | Yes |
| `parentEmail` | string | Contact email | Yes |
| `parentPhone` | string | 10-digit number | Yes |
| `address` | string | Full address | Yes |
| `preferredTiming` | string | Class schedule choice | Yes |
| `referralSource` | string | How they heard about us | Yes |
| `totalFee` | number | Total fee amount | Yes |
| `feeType` | string | 'single' or 'installments' | Yes |
| `amountPaid` | number | Amount paid so far | Yes |
| `status` | string | 'registered', 'active', 'inactive', 'completed' | Yes |
| `createdAt` | Timestamp | When created | Auto |
| `updatedAt` | Timestamp | Last update | Auto |
| `createdBy` | string | Who created (email or 'system') | Yes |
| `deletedAt` | Timestamp/null | Soft delete timestamp | No |

---

## payments Collection

### Example Document
```javascript
// Document ID: "pay123abc456" (auto-generated)
{
  "studentId": "abc123xyz789",
  "amount": 2500,
  "date": Timestamp(2024, 1, 20, 14, 15, 0),
  "method": "upi",
  "notes": "First installment payment received",
  "recordedBy": "nandinipuniwala@gmail.com",
  "createdAt": Timestamp(2024, 1, 20, 14, 15, 0)
}
```

### Field Explanations

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `studentId` | string | Reference to student document ID | Yes |
| `amount` | number | Payment amount | Yes |
| `date` | Timestamp | When payment was received | Yes |
| `method` | string | 'cash', 'card', 'bank-transfer', 'upi', 'other' | Yes |
| `notes` | string | Additional information | No |
| `recordedBy` | string | Admin email who recorded | Yes |
| `createdAt` | Timestamp | Record creation time | Auto |

### Query Examples
```javascript
// Get all payments for a student
payments.where('studentId', '==', 'abc123xyz789').orderBy('date', 'desc')

// Get recent payments
payments.orderBy('date', 'desc').limit(10)
```

---

## roles Collection

### Example Document
```javascript
// Document ID: "role_abc123" (auto-generated)
{
  "email": "nandinipuniwala@gmail.com",
  "role": "admin",
  "addedBy": "system",
  "createdAt": Timestamp(2024, 1, 1, 10, 0, 0)
}
```

### Field Explanations

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `email` | string | Admin email (lowercase) | Yes |
| `role` | string | Always 'admin' for now | Yes |
| `addedBy` | string | Email of admin who added, or 'system' | Yes |
| `createdAt` | Timestamp | When role was granted | Auto |

### Important Notes
- **First Admin**: Automatically created for `nandinipuniwala@gmail.com` on first login
- **Case Insensitive**: Email stored in lowercase
- **Unique**: One document per email
- **Check**: Auth system queries this collection to verify admin status

---

## logs Collection

### Example Documents

#### Student Created
```javascript
{
  "action": "created",
  "entityType": "student",
  "entityId": "abc123xyz789",
  "performedBy": "admin@example.com",
  "details": {
    "studentName": "Priya Sharma",
    "parentEmail": "rajesh.sharma@example.com"
  },
  "timestamp": Timestamp(2024, 1, 15, 10, 30, 0)
}
```

#### Payment Added
```javascript
{
  "action": "payment-added",
  "entityType": "payment",
  "entityId": "pay123abc456",
  "performedBy": "admin@example.com",
  "details": {
    "studentId": "abc123xyz789",
    "amount": 2500,
    "studentName": "Priya Sharma"
  },
  "timestamp": Timestamp(2024, 1, 20, 14, 15, 0)
}
```

#### Role Added
```javascript
{
  "action": "role-added",
  "entityType": "role",
  "entityId": "role_xyz789",
  "performedBy": "nandinipuniwala@gmail.com",
  "details": {
    "email": "teacher@example.com"
  },
  "timestamp": Timestamp(2024, 1, 10, 9, 0, 0)
}
```

### Field Explanations

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `action` | string | Action performed | Yes |
| `entityType` | string | Type of entity | Yes |
| `entityId` | string | ID of affected entity | Yes |
| `performedBy` | string | Admin email | Yes |
| `details` | object | Additional context | No |
| `timestamp` | Timestamp | When action occurred | Auto |

### Action Types
- `created` - Entity created
- `updated` - Entity modified
- `deleted` - Entity deleted
- `role-added` - Admin role granted
- `role-removed` - Admin role revoked
- `payment-added` - Payment recorded

---

## notifications Collection

### Example Documents

#### New Registration
```javascript
{
  "type": "new-registration",
  "title": "New Student Registration",
  "message": "Priya Sharma has been registered",
  "studentId": "abc123xyz789",
  "read": false,
  "createdAt": Timestamp(2024, 1, 15, 10, 30, 0)
}
```

#### Payment Pending
```javascript
{
  "type": "payment-pending",
  "title": "Payment Due",
  "message": "Priya Sharma has ₹2,500 pending",
  "studentId": "abc123xyz789",
  "read": false,
  "createdAt": Timestamp(2024, 2, 1, 9, 0, 0)
}
```

#### Payment Received
```javascript
{
  "type": "payment-received",
  "title": "Payment Received",
  "message": "₹2,500 received from Priya Sharma",
  "studentId": "abc123xyz789",
  "read": true,
  "createdAt": Timestamp(2024, 1, 20, 14, 15, 0)
}
```

### Field Explanations

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `type` | string | Notification category | Yes |
| `title` | string | Short heading | Yes |
| `message` | string | Notification text | Yes |
| `studentId` | string | Related student (if applicable) | No |
| `read` | boolean | Read status | Yes |
| `createdAt` | Timestamp | When created | Auto |

---

## settings Collection (Future Use)

### Example Document
```javascript
// Document ID: "app_settings"
{
  "defaultFee": 5000,
  "timingOptions": [
    "Monday - Friday (4:00 PM - 6:00 PM)",
    "Saturday (10:00 AM - 12:00 PM)",
    "Saturday (2:00 PM - 4:00 PM)",
    "Sunday (10:00 AM - 12:00 PM)"
  ],
  "referralSources": [
    "Google Search",
    "Facebook",
    "Instagram",
    "Friend/Family Reference",
    "School",
    "Other"
  ],
  "updatedAt": Timestamp(2024, 1, 1, 10, 0, 0),
  "updatedBy": "nandinipuniwala@gmail.com"
}
```

---

## Indexes Required

### Composite Indexes

Create these in Firebase Console → Firestore → Indexes:

#### students collection
1. **Status and Date Filter**
   - Collection: `students`
   - Fields:
     - `deletedAt` - Ascending
     - `status` - Ascending
     - `createdAt` - Descending

2. **Timing Filter**
   - Collection: `students`
   - Fields:
     - `deletedAt` - Ascending
     - `preferredTiming` - Ascending
     - `createdAt` - Descending

3. **Parent Email Lookup**
   - Collection: `students`
   - Fields:
     - `parentEmail` - Ascending
     - `deletedAt` - Ascending

#### payments collection
1. **Student Payments**
   - Collection: `payments`
   - Fields:
     - `studentId` - Ascending
     - `date` - Descending

### Single Field Indexes

These are auto-created by Firebase:
- `students.createdAt`
- `students.status`
- `students.parentEmail`
- `payments.date`
- `logs.timestamp`
- `notifications.read`

---

## Data Migration Script (Example)

If you need to seed initial data for testing:

```javascript
// seed-data.js
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function seedData() {
  // Create initial admin role
  await db.collection('roles').add({
    email: 'nandinipuniwala@gmail.com',
    role: 'admin',
    addedBy: 'system',
    createdAt: admin.firestore.Timestamp.now()
  });

  // Create sample student
  await db.collection('students').add({
    firstName: 'Test',
    lastName: 'Student',
    dateOfBirth: '2015-01-01',
    age: 9,
    grade: 'Grade 4',
    gender: 'female',
    parentName: 'Test Parent',
    parentEmail: 'test@example.com',
    parentPhone: '9999999999',
    address: 'Test Address',
    preferredTiming: 'Saturday (10:00 AM - 12:00 PM)',
    referralSource: 'Testing',
    totalFee: 5000,
    feeType: 'single',
    amountPaid: 0,
    status: 'registered',
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
    createdBy: 'system',
    deletedAt: null
  });

  console.log('Data seeded successfully');
}

seedData().then(() => process.exit());
```

---

## Backup Strategy

### Manual Export
```bash
# Install gcloud CLI
gcloud auth login

# Export all collections
gcloud firestore export gs://your-bucket/backups/$(date +%Y%m%d)
```

### Scheduled Backups
Set up in Google Cloud Console → Firestore → Schedule backups

---

*This document should be kept up-to-date as the data model evolves.*
