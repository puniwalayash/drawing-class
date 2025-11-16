import { Student } from '@/types';

export const exportStudentsToCSV = (students: Student[]): string => {
  const headers = [
    'First Name',
    'Last Name',
    'Age',
    'Grade',
    'Gender',
    'Date of Birth',
    'Parent Name',
    'Parent Email',
    'Parent Phone',
    'Address',
    'Preferred Timing',
    'Referral Source',
    'Total Fee',
    'Amount Paid',
    'Balance',
    'Fee Type',
    'Status',
    'Created At',
    'Medical Notes',
  ];

  const rows = students.map((student) => {
    const createdAt = new Date(student.createdAt);
    const balance = student.totalFee - student.amountPaid;

    return [
      student.firstName,
      student.lastName,
      student.age,
      student.grade,
      student.gender || 'N/A',
      student.dateOfBirth,
      student.parentName,
      student.parentEmail,
      student.parentPhone,
      student.address,
      student.preferredTiming,
      student.referralSource,
      student.totalFee,
      student.amountPaid,
      balance,
      student.feeType,
      student.status,
      createdAt.toLocaleDateString(),
      student.medicalNotes || 'N/A',
    ];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  return csvContent;
};

export const downloadCSV = (csvContent: string, filename: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
