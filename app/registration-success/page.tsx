'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, Home, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RegistrationSuccessPage() {
  const searchParams = useSearchParams();
  const studentId = searchParams.get('id');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-2xl">
          <CardHeader className="text-center pb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center"
            >
              <CheckCircle className="w-12 h-12 text-green-600" />
            </motion.div>
            <CardTitle className="text-3xl lg:text-4xl text-gray-900">
              Registration Successful!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-lg text-gray-700">
                Thank you for registering your child with Art Class!
              </p>
              <div className="bg-blue-50 p-6 rounded-lg space-y-3">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-left flex-1">
                    <p className="font-medium text-gray-900">What's Next?</p>
                    <ul className="text-sm text-gray-600 space-y-2 mt-2">
                      <li>• You will receive a confirmation email shortly</li>
                      <li>• Our team will contact you within 24 hours</li>
                      <li>• We'll schedule a brief orientation session</li>
                      <li>• Payment instructions will be provided via email</li>
                    </ul>
                  </div>
                </div>
              </div>

              {studentId && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Registration ID: <span className="font-mono font-medium">{studentId}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Please save this ID for your records
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full" size="lg">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Link href="/login" className="flex-1">
                <Button className="w-full" size="lg">
                  View My Registrations
                </Button>
              </Link>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <p className="text-center text-sm text-gray-600">
                Questions? Contact us at{' '}
                <a href="mailto:info@artclass.com" className="text-blue-600 hover:underline">
                  info@artclass.com
                </a>{' '}
                or call{' '}
                <a href="tel:+919876543210" className="text-blue-600 hover:underline">
                  +91 98765 43210
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
