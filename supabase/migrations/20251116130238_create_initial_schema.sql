/*
  # Create Art Class Management System Schema
  
  ## Tables Created
  
  ### 1. students
  Student registration and information table
  - id (uuid, primary key)
  - first_name, last_name (text)
  - date_of_birth (date), age (integer), grade (text), gender (text)
  - sample_artwork_url (text)
  - medical_notes (text)
  - parent_name, parent_email, parent_phone (text)
  - address (text)
  - preferred_timing, referral_source (text)
  - total_fee, amount_paid (integer)
  - fee_type (text: 'single' or 'installments')
  - status (text: 'registered', 'active', 'inactive', 'completed')
  - created_at, updated_at, deleted_at (timestamptz)
  - created_by (text)
  
  ### 2. payments
  Payment transaction records
  - id (uuid, primary key)
  - student_id (uuid, foreign key)
  - amount (integer)
  - date (timestamptz)
  - method (text: 'cash', 'card', 'bank-transfer', 'upi', 'other')
  - notes (text)
  - recorded_by (text)
  - created_at (timestamptz)
  
  ### 3. roles
  Admin role assignments
  - id (uuid, primary key)
  - email (text, unique)
  - role (text: 'admin')
  - added_by (text)
  - created_at (timestamptz)
  
  ### 4. logs
  Activity audit trail
  - id (uuid, primary key)
  - action (text)
  - entity_type (text)
  - entity_id (text)
  - performed_by (text)
  - details (jsonb)
  - timestamp (timestamptz)
  
  ### 5. notifications
  Admin notification system
  - id (uuid, primary key)
  - type (text)
  - title (text)
  - message (text)
  - student_id (uuid)
  - read (boolean)
  - created_at (timestamptz)
  
  ## Security
  - Enable RLS on all tables
  - Create policies for authenticated users and admins
*/

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  date_of_birth text NOT NULL,
  age integer NOT NULL,
  grade text NOT NULL,
  gender text DEFAULT '',
  sample_artwork_url text,
  medical_notes text DEFAULT '',
  parent_name text NOT NULL,
  parent_email text NOT NULL,
  parent_phone text NOT NULL,
  address text NOT NULL,
  preferred_timing text NOT NULL,
  referral_source text NOT NULL,
  total_fee integer NOT NULL DEFAULT 5000,
  fee_type text NOT NULL DEFAULT 'single',
  amount_paid integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'registered',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by text DEFAULT 'system',
  deleted_at timestamptz
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  date timestamptz DEFAULT now(),
  method text NOT NULL,
  notes text,
  recorded_by text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'admin',
  added_by text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create logs table
CREATE TABLE IF NOT EXISTS logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text NOT NULL,
  performed_by text NOT NULL,
  details jsonb,
  timestamp timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  student_id uuid,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create artworks storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('artworks', 'artworks', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on all tables
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_email text)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM roles
    WHERE email = user_email AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Students table policies
CREATE POLICY "Admins can view all students"
  ON students FOR SELECT
  TO authenticated
  USING (is_admin(auth.jwt()->>'email'));

CREATE POLICY "Users can view own registrations"
  ON students FOR SELECT
  TO authenticated
  USING (parent_email = auth.jwt()->>'email');

CREATE POLICY "Anyone can create students"
  ON students FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update students"
  ON students FOR UPDATE
  TO authenticated
  USING (is_admin(auth.jwt()->>'email'))
  WITH CHECK (is_admin(auth.jwt()->>'email'));

CREATE POLICY "Admins can delete students"
  ON students FOR DELETE
  TO authenticated
  USING (is_admin(auth.jwt()->>'email'));

-- Payments table policies
CREATE POLICY "Admins can view all payments"
  ON payments FOR SELECT
  TO authenticated
  USING (is_admin(auth.jwt()->>'email'));

CREATE POLICY "Admins can create payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (is_admin(auth.jwt()->>'email'));

CREATE POLICY "Admins can update payments"
  ON payments FOR UPDATE
  TO authenticated
  USING (is_admin(auth.jwt()->>'email'))
  WITH CHECK (is_admin(auth.jwt()->>'email'));

CREATE POLICY "Admins can delete payments"
  ON payments FOR DELETE
  TO authenticated
  USING (is_admin(auth.jwt()->>'email'));

-- Roles table policies
CREATE POLICY "Admins can view all roles"
  ON roles FOR SELECT
  TO authenticated
  USING (is_admin(auth.jwt()->>'email'));

CREATE POLICY "Admins can create roles"
  ON roles FOR INSERT
  TO authenticated
  WITH CHECK (is_admin(auth.jwt()->>'email'));

CREATE POLICY "Admins can delete roles"
  ON roles FOR DELETE
  TO authenticated
  USING (is_admin(auth.jwt()->>'email'));

-- Logs table policies
CREATE POLICY "Admins can view all logs"
  ON logs FOR SELECT
  TO authenticated
  USING (is_admin(auth.jwt()->>'email'));

CREATE POLICY "Admins can create logs"
  ON logs FOR INSERT
  TO authenticated
  WITH CHECK (is_admin(auth.jwt()->>'email'));

-- Notifications table policies
CREATE POLICY "Admins can view all notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (is_admin(auth.jwt()->>'email'));

CREATE POLICY "Admins can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (is_admin(auth.jwt()->>'email'));

CREATE POLICY "Admins can update notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (is_admin(auth.jwt()->>'email'))
  WITH CHECK (is_admin(auth.jwt()->>'email'));

-- Storage policies for artworks bucket
CREATE POLICY "Anyone can upload artworks"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'artworks');

CREATE POLICY "Anyone can view artworks"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'artworks');

CREATE POLICY "Admins can delete artworks"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'artworks' AND is_admin(auth.jwt()->>'email'));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_parent_email ON students(parent_email);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
CREATE INDEX IF NOT EXISTS idx_students_created_at ON students(created_at);
CREATE INDEX IF NOT EXISTS idx_payments_student_id ON payments(student_id);
CREATE INDEX IF NOT EXISTS idx_roles_email ON roles(email);
CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
