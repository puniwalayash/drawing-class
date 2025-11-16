'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Palette, Users, Award, Clock, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: Palette,
    title: 'Creative Expression',
    description: 'Nurture your child\'s creativity through various art forms and techniques.',
  },
  {
    icon: Users,
    title: 'Small Class Sizes',
    description: 'Personalized attention with maximum 8 students per class.',
  },
  {
    icon: Award,
    title: 'Expert Instructors',
    description: 'Learn from experienced art educators passionate about teaching.',
  },
  {
    icon: Clock,
    title: 'Flexible Timings',
    description: 'Weekend and weekday batches available to suit your schedule.',
  },
];

const timings = [
  { day: 'Monday - Friday', time: '4:00 PM - 6:00 PM' },
  { day: 'Saturday', time: '10:00 AM - 12:00 PM, 2:00 PM - 4:00 PM' },
  { day: 'Sunday', time: '10:00 AM - 12:00 PM' },
];
console.log("API KEY:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
console.log("AUTH DOMAIN:", process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Art Class</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/register">
                <Button>Register Now</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Unlock Your Child's
              <span className="block text-blue-600">Creative Potential</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Professional art classes designed for children aged 3-18. Expert guidance, small
              groups, and a nurturing environment where creativity flourishes.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/register">
                <Button size="lg" className="text-lg px-8">
                  Enroll Your Child
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="#schedule">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  View Schedule
                </Button>
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 overflow-hidden">
              <img
                src="https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Children painting"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide a comprehensive art education experience that goes beyond just techniques.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section id="schedule" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Class Schedule</h2>
            <p className="text-xl text-gray-600">Choose a timing that works best for your family</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {timings.map((timing, index) => (
              <motion.div
                key={timing.day}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{timing.day}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 font-medium">{timing.time}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Flexible Pricing</h2>
            <p className="text-xl text-gray-600">Choose the payment plan that suits you best</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 hover:border-blue-500 transition-colors">
              <CardHeader>
                <CardTitle className="text-2xl">Single Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-gray-900 mb-4">₹5,000</div>
                <p className="text-gray-600 mb-6">Per month, full payment</p>
                <ul className="space-y-2 text-gray-600">
                  <li>✓ All materials included</li>
                  <li>✓ 8 sessions per month</li>
                  <li>✓ Progress reports</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-500 shadow-lg">
              <CardHeader>
                <div className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-2">
                  Popular
                </div>
                <CardTitle className="text-2xl">Installments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-gray-900 mb-4">₹2,500</div>
                <p className="text-gray-600 mb-6">Per month, split into 2 payments</p>
                <ul className="space-y-2 text-gray-600">
                  <li>✓ All materials included</li>
                  <li>✓ 8 sessions per month</li>
                  <li>✓ Progress reports</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">Get in Touch</h2>
              <p className="text-gray-300 mb-8 text-lg">
                Have questions? We're here to help. Contact us or register your child today.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="w-6 h-6 text-blue-400 mt-1" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-300">info@artclass.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="w-6 h-6 text-blue-400 mt-1" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-gray-300">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-6 h-6 text-blue-400 mt-1" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-gray-300">Mumbai, Maharashtra, India</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 w-full">
                <h3 className="text-2xl font-bold mb-4">Ready to Start?</h3>
                <p className="text-gray-300 mb-6">
                  Register your child today and watch their creativity bloom.
                </p>
                <Link href="/register">
                  <Button size="lg" className="w-full" variant="secondary">
                    Register Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Art Class. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
