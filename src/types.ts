export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
  role?: 'client' | 'lawyer';
}

export type CaseType =
  | 'Civil Law'
  | 'Criminal Law'
  | 'Family Law'
  | 'Property Cases'
  | 'Corporate Law'
  | 'Legal Consultation'
  | 'Documentation'
  | 'Court Representation';

export type AppointmentStatus = 'pending' | 'approved' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  appointmentDate: string;
  appointmentTime: string;
  caseType: CaseType;
  message: string;
  status: AppointmentStatus;
  createdAt: string;
  notes?: string;
}

export interface LawyerNote {
  id: string;
  appointmentId?: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface ServiceItem {
  id: string;
  title: CaseType;
  description: string;
  iconName: string;
  features: string[];
}
