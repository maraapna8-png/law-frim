import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { User, Appointment, LawyerNote } from '../src/types.js';

interface DatabaseSchema {
  users: (User & { passwordHash: string })[];
  appointments: Appointment[];
  notes: LawyerNote[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed data if DB doesn't exist
function getInitialData(): DatabaseSchema {
  const salt = bcrypt.genSaltSync(10);
  const clientPasswordHash = bcrypt.hashSync('password123', salt);
  const lawyerPasswordHash = bcrypt.hashSync('lawyer123', salt);

  const initialUsers: (User & { passwordHash: string })[] = [
    {
      id: 'usr_lawyer',
      fullName: 'Advocate Abdullah',
      email: 'lawyer@abdullahlawfirm.pk',
      phone: '03430277466',
      createdAt: new Date().toISOString(),
      role: 'lawyer',
      passwordHash: lawyerPasswordHash,
    },
    {
      id: 'usr_client1',
      fullName: 'Muhammad Tariq',
      email: 'tariq@example.com',
      phone: '03001234567',
      createdAt: new Date().toISOString(),
      role: 'client',
      passwordHash: clientPasswordHash,
    },
  ];

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0];

  const initialAppointments: Appointment[] = [
    {
      id: 'apt_1001',
      userId: 'usr_client1',
      fullName: 'Muhammad Tariq',
      email: 'tariq@example.com',
      phone: '03001234567',
      appointmentDate: tomorrow,
      appointmentTime: '10:30 AM',
      caseType: 'Property Cases',
      message: 'Urgent consultation regarding land dispute deed verification in D.I. Khan District Court.',
      status: 'pending',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      notes: 'Client requested morning slot.',
    },
    {
      id: 'apt_1002',
      userId: 'usr_client1',
      fullName: 'Sajid Khan',
      email: 'sajid.khan@gmail.com',
      phone: '03339876543',
      appointmentDate: nextWeek,
      appointmentTime: '02:00 PM',
      caseType: 'Civil Law',
      message: 'Need help filing a suit for injunction regarding commercial property near Eid Gaah Road.',
      status: 'approved',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      notes: 'Initial documents reviewed. Court fee calculated.',
    },
    {
      id: 'apt_1003',
      userId: 'usr_client1',
      fullName: 'Farhana Bibi',
      email: 'farhana.bibi@yahoo.com',
      phone: '03125554321',
      appointmentDate: today,
      appointmentTime: '11:00 AM',
      caseType: 'Family Law',
      message: 'Legal consultation regarding maintenance and custody agreement.',
      status: 'completed',
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      notes: 'Mutual agreement terms drafted.',
    },
  ];

  const initialNotes: LawyerNote[] = [
    {
      id: 'note_1',
      appointmentId: 'apt_1002',
      title: 'D.I. Khan District Court Schedule',
      content: 'Hearing scheduled for next Tuesday at Court Room #3. Prepare preliminary arguments and affidavit.',
      createdAt: new Date().toISOString(),
    },
  ];

  return {
    users: initialUsers,
    appointments: initialAppointments,
    notes: initialNotes,
  };
}

function readDB(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialData();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading database file, resetting to initial', err);
    const initial = getInitialData();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
}

function writeDB(data: DatabaseSchema): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to database file', err);
  }
}

export const db = {
  // Users
  getUserByEmail: (email: string) => {
    const data = readDB();
    return data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },
  getUserById: (id: string) => {
    const data = readDB();
    const user = data.users.find((u) => u.id === id);
    if (!user) return null;
    const { passwordHash, ...rest } = user;
    return rest;
  },
  createUser: (userData: { fullName: string; email: string; phone: string; password: string }) => {
    const data = readDB();
    const existing = data.users.find((u) => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      throw new Error('User with this email already exists');
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(userData.password, salt);

    const newUser: User & { passwordHash: string } = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      createdAt: new Date().toISOString(),
      role: 'client',
      passwordHash,
    };

    data.users.push(newUser);
    writeDB(data);

    const { passwordHash: _, ...safeUser } = newUser;
    return safeUser;
  },
  updateUserPassword: (email: string, newPassword: string) => {
    const data = readDB();
    const index = data.users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
    if (index === -1) {
      throw new Error('User email not found');
    }
    const salt = bcrypt.genSaltSync(10);
    data.users[index].passwordHash = bcrypt.hashSync(newPassword, salt);
    writeDB(data);
    return true;
  },

  // Appointments
  getAppointments: (userId?: string) => {
    const data = readDB();
    if (userId) {
      return data.appointments.filter((a) => a.userId === userId);
    }
    return data.appointments;
  },
  getAllAppointmentsForLawyer: () => {
    const data = readDB();
    return data.appointments.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },
  createAppointment: (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => {
    const data = readDB();
    const newAppointment: Appointment = {
      ...appointmentData,
      id: 'apt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    data.appointments.unshift(newAppointment);
    writeDB(data);
    return newAppointment;
  },
  updateAppointmentStatus: (id: string, status: Appointment['status'], notes?: string) => {
    const data = readDB();
    const index = data.appointments.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Appointment not found');
    data.appointments[index].status = status;
    if (notes !== undefined) {
      data.appointments[index].notes = notes;
    }
    writeDB(data);
    return data.appointments[index];
  },
  deleteAppointment: (id: string) => {
    const data = readDB();
    data.appointments = data.appointments.filter((a) => a.id !== id);
    writeDB(data);
    return true;
  },

  // Notes
  getNotes: () => {
    const data = readDB();
    return data.notes;
  },
  createNote: (noteData: Omit<LawyerNote, 'id' | 'createdAt'>) => {
    const data = readDB();
    const newNote: LawyerNote = {
      ...noteData,
      id: 'note_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    data.notes.unshift(newNote);
    writeDB(data);
    return newNote;
  },
  deleteNote: (id: string) => {
    const data = readDB();
    data.notes = data.notes.filter((n) => n.id !== id);
    writeDB(data);
    return true;
  },
};
