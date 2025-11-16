
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
  createdAt: string | Date;
  updatedAt: string | Date;
  createdBy?: string; // 'system' or admin email
  deletedAt?: string | Date | null;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  date: string | Date;
  method: 'cash' | 'card' | 'bank-transfer' | 'upi' | 'other';
  notes?: string;
  recordedBy: string;
  createdAt: string | Date;
}

export interface Role {
  id: string;
  email: string;
  role: 'admin';
  addedBy: string;
  createdAt: string | Date;
}

export interface ActivityLog {
  id: string;
  action: 'created' | 'updated' | 'deleted' | 'role-added' | 'role-removed' | 'payment-added';
  entityType: 'student' | 'role' | 'payment';
  entityId: string;
  performedBy: string;
  details?: Record<string, any>;
  timestamp: string | Date;
}

export interface Notification {
  id: string;
  type: 'new-registration' | 'payment-pending' | 'payment-received';
  title: string;
  message: string;
  studentId?: string;
  read: boolean;
  createdAt: string | Date;
}

export interface Settings {
  id: string;
  defaultFee: number;
  timingOptions: string[];
  referralSources: string[];
  updatedAt: string | Date;
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
