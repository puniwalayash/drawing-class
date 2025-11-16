'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Palette, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthContext } from '@/contexts/AuthContext';
import { signInWithGoogle } from '@/lib/firebase/auth';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && user) {
      if (user.isAdmin) {
        router.push('/admin');
      } else {
        router.push('/my-registrations');
      }
    }
  }, [user, loading, router]);

  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      toast({
        title: 'Success',
        description: `Welcome ${user.displayName}!`,
      });

      if (user.isAdmin) {
        router.push('/admin');
      } else {
        router.push('/my-registrations');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to sign in',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col">
      <header className="p-4">
        <Link href="/" className="flex items-center space-x-2 inline-flex">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900">Art Class</span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Welcome Back</CardTitle>
              <CardDescription className="text-lg">
                Sign in to access your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button
                onClick={handleGoogleSignIn}
                className="w-full h-12 text-lg"
                size="lg"
              >
                <LogIn className="mr-2 w-5 h-5" />
                Sign in with Google
              </Button>

              <div className="text-center text-sm text-gray-600">
                <p>
                  Don't have an account?{' '}
                  <Link href="/register" className="text-blue-600 hover:underline font-medium">
                    Register your child
                  </Link>
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
                <p>Admins: Sign in with your authorized Google account</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
