'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'framer-motion';
import { Palette, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { registrationSchema } from '@/lib/validations/registration';
import { createStudent } from '@/lib/supabase/students';
import { createNotification } from '@/lib/supabase/notifications';
import { RegistrationFormData } from '@/types';
import { useToast } from '@/hooks/use-toast';

const timingOptions = [
  'Monday - Friday (4:00 PM - 6:00 PM)',
  'Saturday (10:00 AM - 12:00 PM)',
  'Saturday (2:00 PM - 4:00 PM)',
  'Sunday (10:00 AM - 12:00 PM)',
];

const referralOptions = [
  'Google Search',
  'Facebook',
  'Instagram',
  'Friend/Family Reference',
  'School',
  'Other',
];

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [artworkFile, setArtworkFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: yupResolver(registrationSchema) as any,
    defaultValues: {
      feeType: 'single',
      totalFee: 5000,
    },
  });

  const feeType = watch('feeType');

 const onSubmit = async (data: RegistrationFormData) => {
  setIsSubmitting(true);
  console.log('Form submitted with data:', data);
  
  try {
    console.log('Calling createStudent...');
    const studentId = await createStudent(data, artworkFile || undefined);
    console.log('Student created with ID:', studentId);

    // Create notification for admin
    try {
      await createNotification(
        'new-registration',
        'New Student Registration',
        `${data.firstName} ${data.lastName} has been registered`,
        studentId
      );
      console.log('Notification created successfully');
    } catch (notificationError) {
      console.warn('Failed to create notification:', notificationError);
      // Don't fail the whole registration if notification fails
    }

    toast({
      title: 'Registration Successful!',
      description: 'Your child has been registered. We will contact you soon.',
    });

    console.log('Redirecting to success page...');
    router.push(`/registration-success?id=${studentId}`);
    
  } catch (error: any) {
    console.error('Registration error:', error);
    toast({
      title: 'Registration Failed',
      description: error.message || 'Please try again later.',
      variant: 'destructive',
    });
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="flex items-center space-x-2 inline-flex">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Art Class</span>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Register Your Child</h1>
            <p className="text-lg text-gray-600">
              Join our creative community and watch your child's talents flourish
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Registration Form</CardTitle>
              <CardDescription>Please fill in all required information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Child Information */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">Child Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input id="firstName" {...register('firstName')} />
                      {errors.firstName && (
                        <p className="text-sm text-red-600 mt-1">{errors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" {...register('lastName')} />
                      {errors.lastName && (
                        <p className="text-sm text-red-600 mt-1">{errors.lastName.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                      <Input id="dateOfBirth" type="date" {...register('dateOfBirth')} />
                      {errors.dateOfBirth && (
                        <p className="text-sm text-red-600 mt-1">{errors.dateOfBirth.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="age">Age *</Label>
                      <Input id="age" type="number" min="3" max="18" {...register('age')} />
                      {errors.age && (
                        <p className="text-sm text-red-600 mt-1">{errors.age.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="grade">Grade/Class *</Label>
                      <Input id="grade" {...register('grade')} placeholder="e.g., Grade 3" />
                      {errors.grade && (
                        <p className="text-sm text-red-600 mt-1">{errors.grade.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Select onValueChange={(value) => setValue('gender', value as any)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label htmlFor="sampleArtwork">Sample Artwork (Optional)</Label>
                    <div className="mt-2 flex items-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('artwork-upload')?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Image
                      </Button>
                      {artworkFile && <span className="text-sm text-gray-600">{artworkFile.name}</span>}
                    </div>
                    <input
                      id="artwork-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setArtworkFile(file);
                      }}
                    />
                  </div>

                  <div className="mt-4">
                    <Label htmlFor="medicalNotes">Medical Notes (Optional)</Label>
                    <Textarea
                      id="medicalNotes"
                      {...register('medicalNotes')}
                      placeholder="Any allergies, medical conditions, or special needs we should know about"
                    />
                  </div>
                </div>

                {/* Parent Information */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">Parent Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="parentName">Parent/Guardian Name *</Label>
                      <Input id="parentName" {...register('parentName')} />
                      {errors.parentName && (
                        <p className="text-sm text-red-600 mt-1">{errors.parentName.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="parentEmail">Email *</Label>
                      <Input id="parentEmail" type="email" {...register('parentEmail')} />
                      {errors.parentEmail && (
                        <p className="text-sm text-red-600 mt-1">{errors.parentEmail.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="parentPhone">Phone Number *</Label>
                      <Input
                        id="parentPhone"
                        {...register('parentPhone')}
                        placeholder="10 digit number"
                      />
                      {errors.parentPhone && (
                        <p className="text-sm text-red-600 mt-1">{errors.parentPhone.message}</p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Address *</Label>
                      <Textarea id="address" {...register('address')} />
                      {errors.address && (
                        <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Class Preferences */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">Class Preferences</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="preferredTiming">Preferred Class Timing *</Label>
                      <Select onValueChange={(value) => setValue('preferredTiming', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timing" />
                        </SelectTrigger>
                        <SelectContent>
                          {timingOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.preferredTiming && (
                        <p className="text-sm text-red-600 mt-1">{errors.preferredTiming.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="referralSource">How did you hear about us? *</Label>
                      <Select onValueChange={(value) => setValue('referralSource', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent>
                          {referralOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.referralSource && (
                        <p className="text-sm text-red-600 mt-1">{errors.referralSource.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Fee Selection */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">Fee Details</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Payment Type *</Label>
                      <RadioGroup
                        value={feeType}
                        onValueChange={(value) => {
                          setValue('feeType', value as 'single' | 'installments');
                          setValue('totalFee', value === 'single' ? 5000 : 5000);
                        }}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2 p-4 border rounded-lg">
                          <RadioGroupItem value="single" id="single" />
                          <Label htmlFor="single" className="flex-1 cursor-pointer">
                            <div className="font-medium">Single Payment - ₹5,000</div>
                            <div className="text-sm text-gray-500">Pay full amount upfront</div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-4 border rounded-lg">
                          <RadioGroupItem value="installments" id="installments" />
                          <Label htmlFor="installments" className="flex-1 cursor-pointer">
                            <div className="font-medium">Installments - ₹2,500 x 2</div>
                            <div className="text-sm text-gray-500">Pay in two installments</div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-900">
                        <strong>Note:</strong> Registration fee includes all art materials, weekly
                        progress reports, and access to our annual art exhibition.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" size="lg" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Complete Registration'
                    )}
                  </Button>
                  <Link href="/">
                    <Button type="button" size="lg" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
