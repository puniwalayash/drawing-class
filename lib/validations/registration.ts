import * as yup from 'yup';

export const registrationSchema = yup.object().shape({
  // Child details
  firstName: yup.string().required('First name is required').min(2, 'Minimum 2 characters'),
  lastName: yup.string().required('Last name is required').min(2, 'Minimum 2 characters'),
  dateOfBirth: yup.string().required('Date of birth is required'),
  age: yup.number().required('Age is required').min(3, 'Minimum age is 3').max(18, 'Maximum age is 18'),
  grade: yup.string().required('Grade is required'),
  gender: yup.string().oneOf(['male', 'female', 'other', ''], 'Invalid gender'),
  medicalNotes: yup.string(),

  // Parent details
  parentName: yup.string().required('Parent name is required').min(3, 'Minimum 3 characters'),
  parentEmail: yup.string().email('Invalid email').required('Email is required'),
  parentPhone: yup
    .string()
    .required('Phone number is required')
    .matches(/^[0-9]{10}$/, 'Phone must be 10 digits'),
  address: yup.string().required('Address is required').min(10, 'Minimum 10 characters'),
  preferredTiming: yup.string().required('Preferred timing is required'),
  referralSource: yup.string().required('Please tell us how you heard about us'),

  // Fee
  feeType: yup.string().oneOf(['single', 'installments'], 'Invalid fee type').required('Fee type is required'),
  totalFee: yup.number().required('Total fee is required').min(100, 'Minimum fee is 100'),
});
