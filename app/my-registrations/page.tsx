'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Palette, User, Calendar, DollarSign, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthContext } from '@/contexts/AuthContext';
import { signOut } from '@/lib/firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Student } from '@/types';
import { Timestamp } from 'firebase/firestore';

export default function MyRegistrationsPage() {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user) {
      if (user.isAdmin) {
        router.push('/admin');
      } else {
        loadStudents();
      }
    }
  }, [user, loading, router]);

  const loadStudents = async () => {
    if (!user?.email) return;

    try {
      const q = query(
        collection(db, 'students'),
        where('parentEmail', '==', user.email),
        where('deletedAt', '==', null)
      );
      const querySnapshot = await getDocs(q);
      const data: Student[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Student);
      });
      setStudents(data);
    } catch (error) {
      console.error('Failed to load students:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading || loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Art Class</span>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="text-right mr-4">
                <p className="text-sm font-medium text-gray-900">{user?.displayName}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <Button onClick={handleSignOut} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Registrations</h1>
          <p className="text-lg text-gray-600">
            View and manage your child's enrollments
          </p>
        </motion.div>

        {students.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="text-center py-12">
              <CardContent>
                <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Registrations Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  You haven't registered any children yet. Start your creative journey today!
                </p>
                <Link href="/register">
                  <Button size="lg">Register Your Child</Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student, index) => {
              const balance = student.totalFee - student.amountPaid;
              const createdAt = student.createdAt as Timestamp;

              return (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow h-full">
                    <CardHeader>
                      <CardTitle className="text-xl">
                        {student.firstName} {student.lastName}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="w-4 h-4 mr-2" />
                        <span>Age: {student.age} years, Grade: {student.grade}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{student.preferredTiming}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2" />
                        <div className="flex-1">
                          <div>Paid: ₹{student.amountPaid.toLocaleString()}</div>
                          {balance > 0 && (
                            <div className="text-orange-600 font-medium">
                              Balance: ₹{balance.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="pt-3 border-t border-gray-200">
                        <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          {student.status}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Registered on {createdAt.toDate().toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {students.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="py-6">
                <p className="text-gray-700 mb-4">
                  Want to register another child?
                </p>
                <Link href="/register">
                  <Button variant="default">Register Another Child</Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                If you have questions about your registration, payments, or class schedules,
                please contact us:
              </p>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Email:</strong>{' '}
                  <a href="mailto:info@artclass.com" className="text-blue-600 hover:underline">
                    info@artclass.com
                  </a>
                </p>
                <p>
                  <strong>Phone:</strong>{' '}
                  <a href="tel:+919876543210" className="text-blue-600 hover:underline">
                    +91 98765 43210
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
