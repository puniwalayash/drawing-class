'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, UserPlus, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { getStudents, StudentFilters } from '@/lib/supabase/students';
import { exportStudentsToCSV, downloadCSV } from '@/lib/utils/export';
import { Student } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [timingFilter, setTimingFilter] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    loadStudents();
  }, [statusFilter, timingFilter]);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const filters: StudentFilters = {
        searchTerm,
        status: statusFilter || undefined,
        preferredTiming: timingFilter || undefined,
      };
      const { students: data } = await getStudents(filters, 100);
      setStudents(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load students',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadStudents();
  };

  const handleExport = () => {
    const csv = exportStudentsToCSV(students);
    downloadCSV(csv, `students-${new Date().toISOString().split('T')[0]}.csv`);
    toast({
      title: 'Success',
      description: 'Students exported to CSV',
    });
  };

  const filteredStudents = students.filter((student) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      student.firstName.toLowerCase().includes(term) ||
      student.lastName.toLowerCase().includes(term) ||
      student.parentEmail.toLowerCase().includes(term) ||
      student.parentPhone.includes(term)
    );
  });

  return (
    <ProtectedRoute requireAdmin>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header Actions */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Students</h2>
              <p className="text-gray-600">Manage student registrations</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleExport} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Add Student
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Search by name, email, or phone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button onClick={handleSearch}>
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    <SelectItem value="registered">Registered</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={timingFilter} onValueChange={setTimingFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Timings" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Timings</SelectItem>
                    <SelectItem value="Monday - Friday (4:00 PM - 6:00 PM)">
                      Mon-Fri (4-6 PM)
                    </SelectItem>
                    <SelectItem value="Saturday (10:00 AM - 12:00 PM)">
                      Sat (10 AM-12 PM)
                    </SelectItem>
                    <SelectItem value="Saturday (2:00 PM - 4:00 PM)">
                      Sat (2-4 PM)
                    </SelectItem>
                    <SelectItem value="Sunday (10:00 AM - 12:00 PM)">
                      Sun (10 AM-12 PM)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Students Table */}
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">No students found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Age / Grade</TableHead>
                        <TableHead>Parent</TableHead>
                        <TableHead>Timing</TableHead>
                        <TableHead>Fee Status</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Registered</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((student, index) => {
                        const balance = student.totalFee - student.amountPaid;
                        const createdAt = new Date(student.createdAt);

                        return (
                          <motion.tr
                            key={student.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-gray-50"
                          >
                            <TableCell>
                              <div className="font-medium">
                                {student.firstName} {student.lastName}
                              </div>
                            </TableCell>
                            <TableCell>
                              {student.age} yrs / {student.grade}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div className="font-medium">{student.parentName}</div>
                                <div className="text-gray-500">{student.parentEmail}</div>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">{student.preferredTiming}</TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>₹{student.amountPaid.toLocaleString()} paid</div>
                                {balance > 0 && (
                                  <div className="text-orange-600 font-medium">
                                    ₹{balance.toLocaleString()} due
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span
                                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                  student.status === 'active'
                                    ? 'bg-green-100 text-green-700'
                                    : student.status === 'registered'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {student.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {createdAt.toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </Button>
                              </div>
                            </TableCell>
                          </motion.tr>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-gray-600">Total Students</div>
                <div className="text-3xl font-bold text-gray-900">{filteredStudents.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-gray-600">Total Paid</div>
                <div className="text-3xl font-bold text-green-600">
                  ₹
                  {filteredStudents
                    .reduce((sum, s) => sum + s.amountPaid, 0)
                    .toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-gray-600">Total Pending</div>
                <div className="text-3xl font-bold text-orange-600">
                  ₹
                  {filteredStudents
                    .reduce((sum, s) => sum + (s.totalFee - s.amountPaid), 0)
                    .toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
