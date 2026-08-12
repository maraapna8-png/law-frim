import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'abdullah_law_firm_secure_jwt_key_2026';
const LAWYER_PORTAL_PASSCODE = '00000';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());

// Extend express request to hold decoded user & lawyer auth
export interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string; role?: string };
  isLawyerAuthenticated?: boolean;
}

// User Authentication Middleware
const authenticateUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role?: string };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session token. Please log in again.' });
  }
};

// Lawyer Portal Passcode Middleware
const authenticateLawyerPortal = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const portalToken = req.headers['x-lawyer-token'] as string || req.cookies.lawyerToken;

  if (!portalToken) {
    return res.status(403).json({ error: 'Lawyer portal locked. Correct passcode required.' });
  }

  try {
    const decoded = jwt.verify(portalToken, JWT_SECRET) as { portalAccess: boolean };
    if (decoded.portalAccess) {
      req.isLawyerAuthenticated = true;
      return next();
    }
  } catch (err) {
    // fallthrough
  }

  return res.status(403).json({ error: 'Lawyer portal session invalid. Passcode required.' });
};

// --- AUTH API ROUTES ---

// 1. User Register
app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { fullName, email, phone, password, confirmPassword } = req.body;

    if (!fullName || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({ error: 'All registration fields are required.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const newUser = db.createUser({ fullName, email, phone, password });
    return res.status(201).json({
      message: 'Registration successful! Please log in with your email and password.',
      user: newUser,
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Failed to register user.' });
  }
});

// 2. User Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const userInDb = db.getUserByEmail(email);
    if (!userInDb) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const passwordMatch = bcrypt.compareSync(password, userInDb.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: userInDb.id, email: userInDb.email, role: userInDb.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { passwordHash, ...safeUser } = userInDb;

    return res.json({
      message: 'Login successful.',
      token,
      user: safeUser,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Internal server error during login.' });
  }
});

// 3. Current Authenticated User (Me)
app.get('/api/auth/me', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  const user = db.getUserById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User profile not found.' });
  return res.json({ user });
});

// 4. User Logout
app.post('/api/auth/logout', (req: Request, res: Response) => {
  res.clearCookie('token');
  res.clearCookie('lawyerToken');
  return res.json({ message: 'Logged out successfully.' });
});

// 5. Forgot Password Reset
app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email and new password are required.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters.' });
    }

    db.updateUserPassword(email, newPassword);
    return res.json({ message: 'Password updated successfully. You can now log in.' });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Failed to update password.' });
  }
});

// --- APPOINTMENT ROUTES ---

// Get user appointments
app.get('/api/appointments', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  const appointments = db.getAppointments(req.user!.id);
  return res.json({ appointments });
});

// Create new appointment
app.post('/api/appointments', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { fullName, email, phone, appointmentDate, appointmentTime, caseType, message } = req.body;

    if (!fullName || !email || !phone || !appointmentDate || !appointmentTime || !caseType) {
      return res.status(400).json({ error: 'Please fill in all required appointment fields.' });
    }

    // Date check: no past dates
    const selectedDate = new Date(appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({ error: 'Appointment date cannot be in the past.' });
    }

    const appointment = db.createAppointment({
      userId: req.user!.id,
      fullName,
      email,
      phone,
      appointmentDate,
      appointmentTime,
      caseType,
      message: message || '',
    });

    return res.status(201).json({
      message: 'Appointment booked successfully!',
      appointment,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to book appointment.' });
  }
});

// --- PROTECTED LAWYER PORTAL ROUTES ---

// Passcode Verification
app.post('/api/lawyer-portal/verify-passcode', (req: Request, res: Response) => {
  const { passcode } = req.body;

  if (passcode !== LAWYER_PORTAL_PASSCODE) {
    return res.status(401).json({ error: 'Incorrect Passcode. Portal remains locked.' });
  }

  const lawyerToken = jwt.sign({ portalAccess: true, time: Date.now() }, JWT_SECRET, {
    expiresIn: '12h',
  });

  res.cookie('lawyerToken', lawyerToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 12 * 60 * 60 * 1000,
  });

  return res.json({
    message: 'Passcode verified. Lawyer Portal unlocked.',
    lawyerToken,
  });
});

// Get all appointments (Lawyer Portal)
app.get('/api/lawyer-portal/appointments', authenticateLawyerPortal, (req: AuthenticatedRequest, res: Response) => {
  const appointments = db.getAllAppointmentsForLawyer();
  return res.json({ appointments });
});

// Update appointment status and notes
app.patch('/api/lawyer-portal/appointments/:id/status', authenticateLawyerPortal, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const updated = db.updateAppointmentStatus(id, status, notes);
    return res.json({ message: `Appointment status updated to ${status}.`, appointment: updated });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Failed to update status.' });
  }
});

// Delete appointment
app.delete('/api/lawyer-portal/appointments/:id', authenticateLawyerPortal, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    db.deleteAppointment(id);
    return res.json({ message: 'Appointment deleted successfully.' });
  } catch (err: any) {
    return res.status(400).json({ error: 'Failed to delete appointment.' });
  }
});

// Lawyer Notes
app.get('/api/lawyer-portal/notes', authenticateLawyerPortal, (req: AuthenticatedRequest, res: Response) => {
  const notes = db.getNotes();
  return res.json({ notes });
});

app.post('/api/lawyer-portal/notes', authenticateLawyerPortal, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, content, appointmentId } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required for notes.' });
    }
    const newNote = db.createNote({ title, content, appointmentId });
    return res.status(201).json({ message: 'Note added successfully.', note: newNote });
  } catch (err: any) {
    return res.status(400).json({ error: 'Failed to add note.' });
  }
});

app.delete('/api/lawyer-portal/notes/:id', authenticateLawyerPortal, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    db.deleteNote(id);
    return res.json({ message: 'Note deleted successfully.' });
  } catch (err: any) {
    return res.status(400).json({ error: 'Failed to delete note.' });
  }
});

// Contact Form Endpoint
app.post('/api/contact', (req: Request, res: Response) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }
  return res.json({
    message: 'Thank you for reaching out to Abdullah Law Firm. We will respond shortly.',
  });
});

// SEO Endpoints (Sitemap & Robots)
app.get('/sitemap.xml', (req: Request, res: Response) => {
  res.header('Content-Type', 'application/xml');
  const filePath = path.join(process.cwd(), process.env.NODE_ENV === 'production' ? 'dist/sitemap.xml' : 'public/sitemap.xml');
  res.sendFile(filePath);
});

app.get('/robots.txt', (req: Request, res: Response) => {
  res.header('Content-Type', 'text/plain');
  const filePath = path.join(process.cwd(), process.env.NODE_ENV === 'production' ? 'dist/robots.txt' : 'public/robots.txt');
  res.sendFile(filePath);
});

// Google Search Console Site Verification
app.get('/googlec8150da76f89cd8b.html', (req: Request, res: Response) => {
  res.header('Content-Type', 'text/html');
  const filePath = path.join(process.cwd(), process.env.NODE_ENV === 'production' ? 'dist/googlec8150da76f89cd8b.html' : 'public/googlec8150da76f89cd8b.html');
  res.sendFile(filePath);
});

// --- VITE MIDDLEWARE / PRODUCTION STATIC SERVING ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Abdullah Law Firm Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
