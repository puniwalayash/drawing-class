// lib/firebase/students.ts
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  QueryConstraint,
  DocumentSnapshot,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./config";
import { Student, RegistrationFormData } from "@/types";

/**
 * CREATE STUDENT - Improved with better error handling
 */
export const createStudent = async (
  data: RegistrationFormData,
  artworkFile?: File | null
): Promise<string> => {
  try {
    console.log('Starting student creation with data:', data);
    
    let artworkUrl: string | null = null;

    // Upload artwork if provided
    if (artworkFile) {
      console.log('Uploading artwork file...');
      const storageRef = ref(
        storage,
        `artworks/${Date.now()}_${artworkFile.name}`
      );
      await uploadBytes(storageRef, artworkFile);
      artworkUrl = await getDownloadURL(storageRef);
      console.log('Artwork uploaded successfully:', artworkUrl);
    }

    // Prepare student data with proper validation
    const studentData: Omit<Student, "id"> = {
      // Child Information
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      dateOfBirth: data.dateOfBirth || "",
      age: data.age || "",
      grade: data.grade || "",
      gender: data.gender || "",
      sampleArtworkUrl: artworkUrl,
      medicalNotes: data.medicalNotes || "",

      // Parent Information
      parentName: data.parentName || "",
      parentEmail: data.parentEmail || "",
      parentPhone: data.parentPhone || "",
      address: data.address || "",

      // Class Preferences
      preferredTiming: data.preferredTiming || "",
      referralSource: data.referralSource || "",

      // Fees
      totalFee: Number(data.totalFee) || 5000,
      feeType: data.feeType || "single",
      amountPaid: 0,

      // Status
      status: "registered",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      createdBy: "system",

      // Soft delete
      deletedAt: null,
    };

    console.log('Adding student to Firestore...');
    const docRef = await addDoc(collection(db, "students"), studentData);
    console.log('Student created successfully with ID:', docRef.id);
    
    return docRef.id;
  } catch (error: any) {
    console.error('Error creating student:', error);
    throw new Error(`Failed to create student: ${error.message}`);
  }
};

/**
 * UPDATE STUDENT
 */
export const updateStudent = async (
  id: string,
  data: Partial<Student>
): Promise<void> => {
  const docRef = doc(db, "students", id);

  const payload: Partial<Student> = {
    ...data,
    sampleArtworkUrl: data.sampleArtworkUrl ?? null,
    updatedAt: Timestamp.now(),
  };

  await updateDoc(docRef, payload);
};

/**
 * DELETE STUDENT (SOFT or HARD)
 */
export const deleteStudent = async (
  id: string,
  soft: boolean = true
): Promise<void> => {
  const docRef = doc(db, "students", id);

  if (soft) {
    await updateDoc(docRef, {
      deletedAt: Timestamp.now(),
      status: "inactive",
    });
  } else {
    await deleteDoc(docRef);
  }
};

/**
 * GET SINGLE STUDENT
 */
export const getStudent = async (id: string): Promise<Student | null> => {
  const docRef = doc(db, "students", id);
  const snap = await getDoc(docRef);

  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Student;
};

/**
 * FILTERS
 */
export interface StudentFilters {
  status?: string;
  preferredTiming?: string;
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: "createdAt" | "firstName" | "amountPaid";
  sortOrder?: "asc" | "desc";
}

/**
 * GET STUDENTS + FILTERS + PAGINATION
 */
export const getStudents = async (
  filters: StudentFilters = {},
  pageSize: number = 20,
  lastDoc?: DocumentSnapshot
): Promise<{ students: Student[]; lastDoc: DocumentSnapshot | null }> => {
  const constraints: QueryConstraint[] = [];

  // MUST exist in documents → always true now
  constraints.push(where("deletedAt", "==", null));

  // Status
  if (filters.status) {
    constraints.push(where("status", "==", filters.status));
  }

  // Timing
  if (filters.preferredTiming) {
    constraints.push(where("preferredTiming", "==", filters.preferredTiming));
  }

  // Date Range
  if (filters.startDate) {
    constraints.push(
      where("createdAt", ">=", Timestamp.fromDate(new Date(filters.startDate)))
    );
  }
  if (filters.endDate) {
    constraints.push(
      where("createdAt", "<=", Timestamp.fromDate(new Date(filters.endDate)))
    );
  }

  // Sorting
  constraints.push(
    orderBy(filters.sortBy ?? "createdAt", filters.sortOrder ?? "desc")
  );

  // Pagination
  constraints.push(limit(pageSize));
  if (lastDoc) constraints.push(startAfter(lastDoc));

  const q = query(collection(db, "students"), ...constraints);
  const snapshot = await getDocs(q);

  const students = snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Student)
  );

  const lastVisible =
    snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;

  // Client-side search
  let filtered = students;

  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    filtered = students.filter(
      (s) =>
        s.firstName.toLowerCase().includes(term) ||
        s.lastName.toLowerCase().includes(term) ||
        s.parentEmail.toLowerCase().includes(term) ||
        s.parentPhone.includes(term)
    );
  }

  return { students: filtered, lastDoc: lastVisible };
};

/**
 * GET STATS
 */
export const getStudentStats = async () => {
  const q = query(collection(db, "students"), where("deletedAt", "==", null));
  const snap = await getDocs(q);

  const students = snap.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Student)
  );

  const total = students.length;
  const totalPaid = students.reduce((sum, s) => sum + (s.amountPaid ?? 0), 0);
  const totalPending = students.reduce(
    (sum, s) => sum + ((s.totalFee ?? 0) - (s.amountPaid ?? 0)),
    0
  );

  // Date calculations
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTS = Timestamp.fromDate(today);

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekTS = Timestamp.fromDate(weekAgo);

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthTS = Timestamp.fromDate(monthStart);

  return {
    total,
    totalPaid,
    totalPending,

    todayCount: students.filter(
      (s) => (s.createdAt as Timestamp).toMillis() >= todayTS.toMillis()
    ).length,

    weekCount: students.filter(
      (s) => (s.createdAt as Timestamp).toMillis() >= weekTS.toMillis()
    ).length,

    monthCount: students.filter(
      (s) => (s.createdAt as Timestamp).toMillis() >= monthTS.toMillis()
    ).length,
  };
};
