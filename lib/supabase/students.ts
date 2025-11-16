import { supabase } from './config';
import { Student, RegistrationFormData } from '@/types';

export const createStudent = async (
  data: RegistrationFormData,
  artworkFile?: File | null
): Promise<string> => {
  try {
    console.log('Starting student creation with data:', data);

    let artworkUrl: string | null = null;

    if (artworkFile) {
      console.log('Uploading artwork file...');
      const fileExt = artworkFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `artworks/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('artworks')
        .upload(filePath, artworkFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('artworks')
        .getPublicUrl(filePath);

      artworkUrl = publicUrl;
      console.log('Artwork uploaded successfully:', artworkUrl);
    }

    const studentData = {
      first_name: data.firstName || '',
      last_name: data.lastName || '',
      date_of_birth: data.dateOfBirth || '',
      age: data.age || 0,
      grade: data.grade || '',
      gender: data.gender || '',
      sample_artwork_url: artworkUrl,
      medical_notes: data.medicalNotes || '',
      parent_name: data.parentName || '',
      parent_email: data.parentEmail || '',
      parent_phone: data.parentPhone || '',
      address: data.address || '',
      preferred_timing: data.preferredTiming || '',
      referral_source: data.referralSource || '',
      total_fee: Number(data.totalFee) || 5000,
      fee_type: data.feeType || 'single',
      amount_paid: 0,
      status: 'registered',
      created_by: 'system',
    };

    console.log('Adding student to Supabase...');
    const { data: result, error } = await supabase
      .from('students')
      .insert([studentData])
      .select()
      .single();

    if (error) throw error;

    console.log('Student created successfully with ID:', result.id);
    return result.id;
  } catch (error: any) {
    console.error('Error creating student:', error);
    throw new Error(`Failed to create student: ${error.message}`);
  }
};

export const updateStudent = async (
  id: string,
  data: Partial<Student>
): Promise<void> => {
  const updateData: any = {};

  if (data.firstName !== undefined) updateData.first_name = data.firstName;
  if (data.lastName !== undefined) updateData.last_name = data.lastName;
  if (data.dateOfBirth !== undefined) updateData.date_of_birth = data.dateOfBirth;
  if (data.age !== undefined) updateData.age = data.age;
  if (data.grade !== undefined) updateData.grade = data.grade;
  if (data.gender !== undefined) updateData.gender = data.gender;
  if (data.sampleArtworkUrl !== undefined) updateData.sample_artwork_url = data.sampleArtworkUrl;
  if (data.medicalNotes !== undefined) updateData.medical_notes = data.medicalNotes;
  if (data.parentName !== undefined) updateData.parent_name = data.parentName;
  if (data.parentEmail !== undefined) updateData.parent_email = data.parentEmail;
  if (data.parentPhone !== undefined) updateData.parent_phone = data.parentPhone;
  if (data.address !== undefined) updateData.address = data.address;
  if (data.preferredTiming !== undefined) updateData.preferred_timing = data.preferredTiming;
  if (data.referralSource !== undefined) updateData.referral_source = data.referralSource;
  if (data.totalFee !== undefined) updateData.total_fee = data.totalFee;
  if (data.feeType !== undefined) updateData.fee_type = data.feeType;
  if (data.amountPaid !== undefined) updateData.amount_paid = data.amountPaid;
  if (data.status !== undefined) updateData.status = data.status;

  updateData.updated_at = new Date().toISOString();

  const { error } = await supabase
    .from('students')
    .update(updateData)
    .eq('id', id);

  if (error) throw error;
};

export const deleteStudent = async (
  id: string,
  soft: boolean = true
): Promise<void> => {
  if (soft) {
    const { error } = await supabase
      .from('students')
      .update({
        deleted_at: new Date().toISOString(),
        status: 'inactive'
      })
      .eq('id', id);

    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

export const getStudent = async (id: string): Promise<Student | null> => {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return convertToStudent(data);
};

export interface StudentFilters {
  status?: string;
  preferredTiming?: string;
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'created_at' | 'first_name' | 'amount_paid';
  sortOrder?: 'asc' | 'desc';
}

export const getStudents = async (
  filters: StudentFilters = {},
  pageSize: number = 100
): Promise<{ students: Student[]; lastDoc: null }> => {
  let query = supabase
    .from('students')
    .select('*')
    .is('deleted_at', null);

  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  if (filters.preferredTiming) {
    query = query.eq('preferred_timing', filters.preferredTiming);
  }

  if (filters.startDate) {
    query = query.gte('created_at', filters.startDate);
  }

  if (filters.endDate) {
    query = query.lte('created_at', filters.endDate);
  }

  const sortBy = filters.sortBy || 'created_at';
  const sortOrder = filters.sortOrder || 'desc';
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });

  query = query.limit(pageSize);

  const { data, error } = await query;

  if (error) throw error;

  let students = (data || []).map(convertToStudent);

  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    students = students.filter(
      (s) =>
        s.firstName.toLowerCase().includes(term) ||
        s.lastName.toLowerCase().includes(term) ||
        s.parentEmail.toLowerCase().includes(term) ||
        s.parentPhone.includes(term)
    );
  }

  return { students, lastDoc: null };
};

export const getStudentStats = async () => {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .is('deleted_at', null);

  if (error) throw error;

  const students = (data || []).map(convertToStudent);
  const total = students.length;
  const totalPaid = students.reduce((sum, s) => sum + (s.amountPaid || 0), 0);
  const totalPending = students.reduce(
    (sum, s) => sum + ((s.totalFee || 0) - (s.amountPaid || 0)),
    0
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  return {
    total,
    totalPaid,
    totalPending,
    todayCount: students.filter(
      (s) => new Date(s.createdAt).getTime() >= today.getTime()
    ).length,
    weekCount: students.filter(
      (s) => new Date(s.createdAt).getTime() >= weekAgo.getTime()
    ).length,
    monthCount: students.filter(
      (s) => new Date(s.createdAt).getTime() >= monthStart.getTime()
    ).length,
  };
};

function convertToStudent(data: any): Student {
  return {
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    dateOfBirth: data.date_of_birth,
    age: data.age,
    grade: data.grade,
    gender: data.gender,
    sampleArtworkUrl: data.sample_artwork_url,
    medicalNotes: data.medical_notes,
    parentName: data.parent_name,
    parentEmail: data.parent_email,
    parentPhone: data.parent_phone,
    address: data.address,
    preferredTiming: data.preferred_timing,
    referralSource: data.referral_source,
    totalFee: data.total_fee,
    feeType: data.fee_type,
    amountPaid: data.amount_paid,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    createdBy: data.created_by,
    deletedAt: data.deleted_at,
  };
}
