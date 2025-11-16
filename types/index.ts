import { Timestamp } from 'firebase/firestore';

export interface Student {
  id: string;
  // Child details
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age: number;
  grade: string;
  gender?: 'male' | 'female' | 'other' | '';
  sampleArtworkUrl?: string;
  medicalNotes?: string;

  // Parent details
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  address: string;
  preferredTiming: string;
  referralSource: string;

  // Fee & status
  totalFee: number;
  feeType: 'single' | 'installments';
  amountPaid: number;
  status: 'registered' | 'active' | 'inactive' | 'completed';

  // Metadata
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  createdBy?: string; // 'system' or admin email
  deletedAt?: Timestamp | Date | null;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  date: Timestamp | Date;
  method: 'cash' | 'card' | 'bank-transfer' | 'upi' | 'other';
  notes?: string;
  recordedBy: string;
  createdAt: Timestamp | Date;
}

export interface Role {
  id: string;
  email: string;
  role: 'admin';
  addedBy: string;
  createdAt: Timestamp | Date;
}

export interface ActivityLog {
  id: string;
  action: 'created' | 'updated' | 'deleted' | 'role-added' | 'role-removed' | 'payment-added';
  entityType: 'student' | 'role' | 'payment';
  entityId: string;
  performedBy: string;
  details?: Record<string, any>;
  timestamp: Timestamp | Date;
}

export interface Notification {
  id: string;
  type: 'new-registration' | 'payment-pending' | 'payment-received';
  title: string;
  message: string;
  studentId?: string;
  read: boolean;
  createdAt: Timestamp | Date;
}

export interface Settings {
  id: string;
  defaultFee: number;
  timingOptions: string[];
  referralSources: string[];
  updatedAt: Timestamp | Date;
  updatedBy: string;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAdmin: boolean;
}

export interface RegistrationFormData {
  // Child
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age: number;
  grade: string;
  gender?: 'male' | 'female' | 'other' | '';
  medicalNotes?: string;

  // Parent
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  address: string;
  preferredTiming: string;
  referralSource: string;

  // Fee
  feeType: 'single' | 'installments';
  totalFee: number;
}
