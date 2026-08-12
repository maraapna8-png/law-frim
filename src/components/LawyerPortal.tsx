import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Appointment, LawyerNote, AppointmentStatus } from '../types';
import {
  Lock,
  KeyRound,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Search,
  Filter,
  FileText,
  User,
  Phone,
  Mail,
  Trash2,
  Plus,
  LogOut,
  X,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  LayoutDashboard,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LawyerPortalProps {
  onClosePortal: () => void;
}

export const LawyerPortal: React.FC<LawyerPortalProps> = ({ onClosePortal }) => {
  const { lawyerToken, verifyLawyerPasscode, logoutLawyerPortal, authError, clearError } = useAuth();

  // Passcode entry state
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Portal view states
  const [activeTab, setActiveTab] = useState<'dashboard' | 'appointments' | 'calendar' | 'notes'>('dashboard');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notes, setNotes] = useState<LawyerNote[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal details
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [statusNoteInput, setStatusNoteInput] = useState('');

  // Handle Passcode Submission
  const handlePasscodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeError('');
    clearError();

    if (!passcode) {
      setPasscodeError('Please enter passcode.');
      return;
    }

    setIsVerifying(true);
    const ok = await verifyLawyerPasscode(passcode);
    setIsVerifying(false);

    if (!ok) {
      setPasscodeError('Incorrect Passcode. Portal remains locked.');
    }
  };

  // Fetch Portal Data when lawyerToken is valid
  const fetchPortalData = async () => {
    if (!lawyerToken) return;
    setIsLoadingData(true);
    try {
      // Appointments
      const apptRes = await fetch('/api/lawyer-portal/appointments', {
        headers: { 'x-lawyer-token': lawyerToken },
      });
      if (apptRes.ok) {
        const data = await apptRes.json();
        setAppointments(data.appointments || []);
      }

      // Notes
      const notesRes = await fetch('/api/lawyer-portal/notes', {
        headers: { 'x-lawyer-token': lawyerToken },
      });
      if (notesRes.ok) {
        const data = await notesRes.json();
        setNotes(data.notes || []);
      }
    } catch (err) {
      console.error('Failed to fetch lawyer portal data', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (lawyerToken) {
      fetchPortalData();
    }
  }, [lawyerToken]);

  // Handle Appointment Status Update
  const handleUpdateStatus = async (id: string, newStatus: AppointmentStatus) => {
    if (!lawyerToken) return;
    try {
      const res = await fetch(`/api/lawyer-portal/appointments/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-lawyer-token': lawyerToken,
        },
        body: JSON.stringify({ status: newStatus, notes: statusNoteInput }),
      });

      if (res.ok) {
        setStatusNoteInput('');
        fetchPortalData();
        if (selectedAppointment && selectedAppointment.id === id) {
          setSelectedAppointment((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  // Handle Appointment Delete
  const handleDeleteAppointment = async (id: string) => {
    if (!lawyerToken || !window.confirm('Are you sure you want to delete this appointment record?')) return;
    try {
      const res = await fetch(`/api/lawyer-portal/appointments/${id}`, {
        method: 'DELETE',
        headers: { 'x-lawyer-token': lawyerToken },
      });
      if (res.ok) {
        fetchPortalData();
        if (selectedAppointment?.id === id) setSelectedAppointment(null);
      }
    } catch (err) {
      console.error('Failed to delete appointment', err);
    }
  };

  // Handle Add Note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lawyerToken || !noteTitle || !noteContent) return;

    try {
      const res = await fetch('/api/lawyer-portal/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-lawyer-token': lawyerToken,
        },
        body: JSON.stringify({
          title: noteTitle,
          content: noteContent,
          appointmentId: selectedAppointment?.id,
        }),
      });

      if (res.ok) {
        setNoteTitle('');
        setNoteContent('');
        fetchPortalData();
      }
    } catch (err) {
      console.error('Failed to save note', err);
    }
  };

  // Filtered Appointments List
  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.phone.includes(searchQuery) ||
      apt.caseType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate Dashboard Statistics
  const stats = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === 'pending').length,
    approved: appointments.filter((a) => a.status === 'approved').length,
    completed: appointments.filter((a) => a.status === 'completed').length,
    cancelled: appointments.filter((a) => a.status === 'cancelled').length,
  };

  // PASSCODE LOCK SCREEN IF UNLOCKED TOKEN NOT PRESENT
  if (!lawyerToken) {
    return (
      <div className="fixed inset-0 z-50 bg-[#07111e]/95 backdrop-blur-lg flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#0a192f] border-2 border-[#d4af37]/60 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative text-center"
        >
          <button
            onClick={onClosePortal}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-full bg-[#d4af37]/15 border border-[#d4af37] mx-auto flex items-center justify-center text-[#d4af37] mb-4 shadow-lg">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="font-serif font-bold text-2xl text-white">Lawyer Portal</h2>
          <p className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold mt-1 mb-4">
            Protected Access • Advocate Abdullah
          </p>

          {(passcodeError || authError) && (
            <div className="mb-4 p-2.5 bg-red-950 border border-red-500 rounded text-red-200 text-xs flex items-center justify-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{passcodeError || authError}</span>
            </div>
          )}

          <form onSubmit={handlePasscodeSubmit} className="space-y-4">
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4af37]" />
              <input
                id="portal-passcode-input"
                name="portal_access_code"
                type="password"
                maxLength={10}
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter Passcode"
                autoComplete="one-time-code"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                data-lpignore="true"
                data-1p-ignore="true"
                data-form-type="other"
                className="w-full pl-10 pr-4 py-3 bg-[#081426] border border-gray-700 focus:border-[#d4af37] rounded-xl text-center font-mono text-lg text-white tracking-widest focus:outline-none"
              />
            </div>

            <button
              id="portal-passcode-submit-btn"
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 bg-gradient-to-r from-[#c59b27] via-[#d4af37] to-[#c59b27] text-slate-950 font-bold rounded-xl shadow-lg hover:brightness-110 transition cursor-pointer text-sm"
            >
              {isVerifying ? 'Verifying...' : 'Unlock Portal'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // UNLOCKED LAWYER PORTAL DASHBOARD
  return (
    <div className="fixed inset-0 z-50 bg-[#07111e] text-white overflow-y-auto flex flex-col">
      {/* Top Header Bar */}
      <header className="bg-[#0a192f] border-b border-[#d4af37]/30 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 border border-[#d4af37] flex items-center justify-center text-[#d4af37]">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg text-white leading-none">
              Advocate Abdullah — Lawyer Portal
            </h1>
            <p className="text-[10px] text-[#d4af37] uppercase tracking-wider font-semibold mt-1">
              D.I. Khan Chamber Management System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              logoutLawyerPortal();
              onClosePortal();
            }}
            className="px-3.5 py-1.5 rounded-lg bg-red-950/60 border border-red-500/50 text-red-300 hover:bg-red-900 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Lock & Exit Portal
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-800 pb-3">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'dashboard'
                ? 'bg-[#d4af37] text-slate-950 shadow-lg'
                : 'bg-[#0a192f] text-gray-300 hover:bg-gray-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Dashboard Overview
          </button>

          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'appointments'
                ? 'bg-[#d4af37] text-slate-950 shadow-lg'
                : 'bg-[#0a192f] text-gray-300 hover:bg-gray-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Appointments Management ({stats.total})
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'notes'
                ? 'bg-[#d4af37] text-slate-950 shadow-lg'
                : 'bg-[#0a192f] text-gray-300 hover:bg-gray-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            Lawyer Notes ({notes.length})
          </button>
        </div>

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <div className="bg-[#0a192f] border border-gray-800 p-4 rounded-2xl shadow-lg">
                <span className="text-gray-400 text-xs block">Total Bookings</span>
                <span className="text-3xl font-serif font-bold text-white mt-1 block">
                  {stats.total}
                </span>
              </div>

              <div className="bg-[#0a192f] border border-amber-500/30 p-4 rounded-2xl shadow-lg">
                <span className="text-amber-400 text-xs block">Pending Review</span>
                <span className="text-3xl font-serif font-bold text-amber-400 mt-1 block">
                  {stats.pending}
                </span>
              </div>

              <div className="bg-[#0a192f] border border-emerald-500/30 p-4 rounded-2xl shadow-lg">
                <span className="text-emerald-400 text-xs block">Approved</span>
                <span className="text-3xl font-serif font-bold text-emerald-400 mt-1 block">
                  {stats.approved}
                </span>
              </div>

              <div className="bg-[#0a192f] border border-blue-500/30 p-4 rounded-2xl shadow-lg">
                <span className="text-blue-400 text-xs block">Completed</span>
                <span className="text-3xl font-serif font-bold text-blue-400 mt-1 block">
                  {stats.completed}
                </span>
              </div>

              <div className="bg-[#0a192f] border border-red-500/30 p-4 rounded-2xl shadow-lg col-span-2 sm:col-span-1">
                <span className="text-red-400 text-xs block">Cancelled</span>
                <span className="text-3xl font-serif font-bold text-red-400 mt-1 block">
                  {stats.cancelled}
                </span>
              </div>
            </div>

            {/* Recent Pending Requests Quick Action */}
            <div className="bg-[#0a192f] border border-[#d4af37]/30 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif font-bold text-lg text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#d4af37]" />
                  <span>Pending Client Requests</span>
                </h3>
                <button
                  onClick={() => {
                    setStatusFilter('pending');
                    setActiveTab('appointments');
                  }}
                  className="text-xs text-[#d4af37] hover:underline"
                >
                  View All Pending ({stats.pending})
                </button>
              </div>

              {appointments.filter((a) => a.status === 'pending').length === 0 ? (
                <div className="py-6 text-center text-xs text-gray-400">
                  No pending appointment requests currently.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {appointments
                    .filter((a) => a.status === 'pending')
                    .slice(0, 4)
                    .map((apt) => (
                      <div
                        key={apt.id}
                        className="p-4 bg-[#081426] border border-gray-800 rounded-xl flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-white text-sm">{apt.fullName}</span>
                            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase">
                              {apt.caseType}
                            </span>
                          </div>
                          <p className="text-xs text-gray-300">
                            <strong>Date:</strong> {apt.appointmentDate} at {apt.appointmentTime}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            <strong>Phone:</strong> {apt.phone}
                          </p>
                        </div>

                        <div className="flex gap-2 mt-4 pt-2 border-t border-gray-800">
                          <button
                            onClick={() => handleUpdateStatus(apt.id, 'approved')}
                            className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded transition flex items-center justify-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(apt.id, 'cancelled')}
                            className="flex-1 py-1.5 bg-red-900/60 hover:bg-red-800 text-red-200 text-xs rounded transition flex items-center justify-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Decline
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: APPOINTMENTS MANAGEMENT */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            {/* Search & Filter Toolbar */}
            <div className="bg-[#0a192f] border border-gray-800 p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4af37]" />
                <input
                  id="portal-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, phone, case..."
                  className="w-full pl-9 pr-3 py-2 bg-[#081426] border border-gray-700 rounded-xl text-xs text-white focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              {/* Status Filter Buttons */}
              <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                {['all', 'pending', 'approved', 'completed', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                      statusFilter === st
                        ? 'bg-[#d4af37] text-slate-950 font-bold'
                        : 'bg-[#081426] text-gray-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Appointments Table / Cards */}
            <div className="bg-[#0a192f] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-[#081426] text-[#d4af37] uppercase text-[10px] tracking-wider border-b border-gray-800 font-bold">
                    <tr>
                      <th className="p-4">Ref ID / Client</th>
                      <th className="p-4">Contact Info</th>
                      <th className="p-4">Case Type</th>
                      <th className="p-4">Schedule</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60">
                    {filteredAppointments.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-gray-400">
                          No matching appointments found.
                        </td>
                      </tr>
                    ) : (
                      filteredAppointments.map((apt) => (
                        <tr key={apt.id} className="hover:bg-[#081426]/60 transition">
                          <td className="p-4">
                            <div className="font-bold text-white text-sm">{apt.fullName}</div>
                            <div className="text-[10px] text-gray-400 font-mono">{apt.id}</div>
                          </td>

                          <td className="p-4">
                            <div className="text-gray-200">{apt.phone}</div>
                            <div className="text-gray-400 text-[11px]">{apt.email}</div>
                          </td>

                          <td className="p-4 font-semibold text-[#d4af37]">{apt.caseType}</td>

                          <td className="p-4">
                            <div className="text-white font-medium">{apt.appointmentDate}</div>
                            <div className="text-gray-400 text-[11px]">{apt.appointmentTime}</div>
                          </td>

                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                apt.status === 'approved'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                  : apt.status === 'completed'
                                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                                  : apt.status === 'cancelled'
                                  ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              }`}
                            >
                              {apt.status}
                            </span>
                          </td>

                          <td className="p-4 text-right space-x-1">
                            <button
                              onClick={() => setSelectedAppointment(apt)}
                              className="px-2.5 py-1.5 bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] rounded-lg text-xs font-semibold hover:bg-[#d4af37] hover:text-slate-950 transition"
                            >
                              Details
                            </button>

                            <button
                              onClick={() => handleDeleteAppointment(apt.id)}
                              className="p-1.5 text-gray-400 hover:text-red-400 transition"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 inline" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LAWYER NOTES */}
        {activeTab === 'notes' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Create Note Form */}
            <div className="lg:col-span-4 bg-[#0a192f] border border-[#d4af37]/30 rounded-2xl p-6 shadow-xl">
              <h3 className="font-serif font-bold text-lg text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#d4af37]" />
                <span>Add Lawyer Case Note</span>
              </h3>

              <form onSubmit={handleAddNote} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Note Title
                  </label>
                  <input
                    id="note-title-input"
                    type="text"
                    required
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="e.g. High Court Bench Hearing Precedents"
                    className="w-full px-3 py-2 bg-[#081426] border border-gray-700 rounded-lg text-xs text-white focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Note Details
                  </label>
                  <textarea
                    id="note-content-input"
                    rows={4}
                    required
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Enter case legal notes, evidence lists, arguments..."
                    className="w-full px-3 py-2 bg-[#081426] border border-gray-700 rounded-lg text-xs text-white focus:border-[#d4af37] focus:outline-none"
                  ></textarea>
                </div>

                <button
                  id="note-submit-btn"
                  type="submit"
                  className="w-full py-2.5 bg-[#d4af37] text-slate-950 font-bold text-xs rounded-lg hover:bg-[#e2bd46] transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Save Lawyer Note
                </button>
              </form>
            </div>

            {/* Notes List */}
            <div className="lg:col-span-8 space-y-4">
              <h3 className="font-serif font-bold text-lg text-white">Saved Notes Archive</h3>
              {notes.length === 0 ? (
                <div className="p-8 bg-[#0a192f] rounded-2xl border border-gray-800 text-center text-xs text-gray-400">
                  No saved notes found. Create your first note on the left.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {notes.map((n) => (
                    <div
                      key={n.id}
                      className="p-5 bg-[#0a192f] border border-gray-800 rounded-2xl shadow-lg relative"
                    >
                      <h4 className="font-serif font-bold text-white text-base text-[#d4af37]">
                        {n.title}
                      </h4>
                      <p className="text-gray-300 text-xs mt-2 leading-relaxed whitespace-pre-wrap">
                        {n.content}
                      </p>
                      <div className="mt-4 pt-3 border-t border-gray-800 flex justify-between items-center text-[10px] text-gray-400">
                        <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Appointment Detail & Status Update Modal */}
      <AnimatePresence>
        {selectedAppointment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-[#0a192f] border-2 border-[#d4af37] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-white"
            >
              <button
                onClick={() => setSelectedAppointment(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-[#d4af37] mb-2">
                <FileText className="w-5 h-5" />
                <h3 className="font-serif font-bold text-lg">Client Case Details</h3>
              </div>
              <p className="text-xs text-gray-400 mb-4 font-mono">Ref ID: {selectedAppointment.id}</p>

              <div className="space-y-3 text-xs bg-[#081426] p-4 rounded-xl border border-gray-800 mb-4">
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Client Name:</span>
                  <span className="font-bold text-white">{selectedAppointment.fullName}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Phone:</span>
                  <a href={`tel:${selectedAppointment.phone}`} className="text-[#d4af37] font-bold">
                    {selectedAppointment.phone}
                  </a>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Email:</span>
                  <span className="text-white">{selectedAppointment.email}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Case Type:</span>
                  <span className="font-bold text-[#d4af37]">{selectedAppointment.caseType}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Appointment Date:</span>
                  <span className="text-white">
                    {selectedAppointment.appointmentDate} ({selectedAppointment.appointmentTime})
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-1">Message / Detail:</span>
                  <p className="text-gray-200 bg-[#0a192f] p-2 rounded border border-gray-800 italic">
                    "{selectedAppointment.message || 'No message provided.'}"
                  </p>
                </div>
              </div>

              {/* Status Change Controls */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-[#d4af37]">
                  Update Appointment Status
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedAppointment.id, 'pending')}
                    className="py-2 px-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded text-xs font-bold hover:bg-amber-500/40"
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedAppointment.id, 'approved')}
                    className="py-2 px-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded text-xs font-bold hover:bg-emerald-500/40"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedAppointment.id, 'completed')}
                    className="py-2 px-2 bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded text-xs font-bold hover:bg-blue-500/40"
                  >
                    Complete
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedAppointment.id, 'cancelled')}
                    className="py-2 px-2 bg-red-500/20 text-red-300 border border-red-500/40 rounded text-xs font-bold hover:bg-red-500/40"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
