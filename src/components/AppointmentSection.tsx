import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Appointment, CaseType } from '../types';
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  Tag,
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AppointmentSectionProps {
  selectedCaseType?: CaseType;
}

export const AppointmentSection: React.FC<AppointmentSectionProps> = ({ selectedCaseType }) => {
  const { user, token } = useAuth();

  // Form states
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('10:00 AM');
  const [caseType, setCaseType] = useState<CaseType>('Civil Law');
  const [message, setMessage] = useState('');

  // UI & List states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successBooking, setSuccessBooking] = useState<Appointment | null>(null);
  const [userAppointments, setUserAppointments] = useState<Appointment[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Sync logged in user details if available
  useEffect(() => {
    if (user) {
      if (!fullName) setFullName(user.fullName);
      if (!email) setEmail(user.email);
      if (!phone) setPhone(user.phone);
    }
  }, [user]);

  // Sync selected case type from prop
  useEffect(() => {
    if (selectedCaseType) {
      setCaseType(selectedCaseType);
    }
  }, [selectedCaseType]);

  // Set default minimum date to today
  const todayStr = new Date().toISOString().split('T')[0];

  // Fetch user's appointment history
  const fetchUserAppointments = async () => {
    setIsLoadingHistory(true);
    try {
      const res = await fetch('/api/appointments', {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        const data = await res.json();
        setUserAppointments(data.appointments || []);
      }
    } catch (err) {
      console.error('Failed to fetch user appointments', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchUserAppointments();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName || !email || !phone || !appointmentDate || !appointmentTime || !caseType) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    // Past date check
    const selectedDate = new Date(appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setErrorMsg('Appointment date cannot be in the past. Please select today or a future date.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          appointmentDate,
          appointmentTime,
          caseType,
          message,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to submit appointment.');
        setIsSubmitting(false);
        return;
      }

      setSuccessBooking(data.appointment);
      setMessage('');
      fetchUserAppointments();
    } catch (err) {
      setErrorMsg('Connection error. Could not book appointment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'approved':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            Approved
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/30">
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-red-500/10 text-red-400 border border-red-500/30">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
            Pending Review
          </span>
        );
    }
  };

  return (
    <section id="appointment" className="py-20 bg-[#07111e] text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold bg-[#d4af37]/10 px-3 py-1 rounded-full border border-[#d4af37]/30">
            Schedule Session
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-3">
            Lawyer Appointment Booking
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mt-3">
            Schedule an in-person or virtual legal consultation directly with Advocate Abdullah.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Booking Form (7 Cols) */}
          <div className="lg:col-span-7 bg-[#0a192f] border border-[#d4af37]/40 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <h3 className="text-xl font-serif font-bold text-white mb-2 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#d4af37]" />
              <span>Book Your Legal Consultation</span>
            </h3>
            <p className="text-xs text-gray-300 mb-6">
              All appointments are subject to confirmation by Advocate Abdullah's legal office.
            </p>

            {errorMsg && (
              <div className="mb-6 p-3.5 bg-red-950/80 border border-red-500/50 rounded-xl text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Full Name <span className="text-[#d4af37]">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4af37]" />
                    <input
                      id="appointment-fullname-input"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Muhammad Tariq"
                      className="w-full pl-10 pr-3 py-2.5 bg-[#081426] border border-gray-700 rounded-lg text-sm text-white focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Email Address <span className="text-[#d4af37]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4af37]" />
                    <input
                      id="appointment-email-input"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. tariq@example.com"
                      className="w-full pl-10 pr-3 py-2.5 bg-[#081426] border border-gray-700 rounded-lg text-sm text-white focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Phone Number <span className="text-[#d4af37]">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4af37]" />
                    <input
                      id="appointment-phone-input"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 03430277466"
                      className="w-full pl-10 pr-3 py-2.5 bg-[#081426] border border-gray-700 rounded-lg text-sm text-white focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Case Type / Practice Area <span className="text-[#d4af37]">*</span>
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4af37]" />
                    <select
                      id="appointment-casetype-select"
                      value={caseType}
                      onChange={(e) => setCaseType(e.target.value as CaseType)}
                      className="w-full pl-10 pr-3 py-2.5 bg-[#081426] border border-gray-700 rounded-lg text-sm text-white focus:border-[#d4af37] focus:outline-none cursor-pointer"
                    >
                      <option value="Civil Law">Civil Law</option>
                      <option value="Criminal Law">Criminal Law</option>
                      <option value="Family Law">Family Law</option>
                      <option value="Property Cases">Property Cases</option>
                      <option value="Corporate Law">Corporate Law</option>
                      <option value="Legal Consultation">Legal Consultation</option>
                      <option value="Documentation">Documentation</option>
                      <option value="Court Representation">Court Representation</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Appointment Date <span className="text-[#d4af37]">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4af37]" />
                    <input
                      id="appointment-date-input"
                      type="date"
                      required
                      min={todayStr}
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-[#081426] border border-gray-700 rounded-lg text-sm text-white focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Preferred Time Slot <span className="text-[#d4af37]">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4af37]" />
                    <select
                      id="appointment-time-select"
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-[#081426] border border-gray-700 rounded-lg text-sm text-white focus:border-[#d4af37] focus:outline-none cursor-pointer"
                    >
                      <option value="09:30 AM">09:30 AM (Morning Session)</option>
                      <option value="10:30 AM">10:30 AM (Morning Session)</option>
                      <option value="11:30 AM">11:30 AM (Morning Session)</option>
                      <option value="02:00 PM">02:00 PM (Afternoon Session)</option>
                      <option value="03:30 PM">03:30 PM (Afternoon Session)</option>
                      <option value="05:00 PM">05:00 PM (Evening Consultation)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Case Brief / Message
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-[#d4af37]" />
                  <textarea
                    id="appointment-message-input"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Briefly describe your case or legal inquiry..."
                    className="w-full pl-10 pr-3 py-2 bg-[#081426] border border-gray-700 rounded-lg text-sm text-white focus:border-[#d4af37] focus:outline-none"
                  ></textarea>
                </div>
              </div>

              <button
                id="appointment-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-[#c59b27] via-[#d4af37] to-[#c59b27] text-slate-950 font-extrabold rounded-xl shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer mt-4"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Confirming Booking...</span>
                  </>
                ) : (
                  <>
                    <FileCheck2 className="w-4 h-4" />
                    <span>Submit Appointment Request</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: User's Booked Appointments List (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#081426] border border-gray-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-3">
                <h4 className="font-serif font-bold text-white text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#d4af37]" />
                  <span>My Scheduled Appointments</span>
                </h4>
                <button
                  onClick={fetchUserAppointments}
                  className="text-xs text-[#d4af37] hover:underline"
                >
                  Refresh
                </button>
              </div>

              {isLoadingHistory ? (
                <div className="py-8 text-center text-gray-400 text-xs flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#d4af37]" />
                  <span>Loading appointment history...</span>
                </div>
              ) : userAppointments.length === 0 ? (
                <div className="py-8 text-center text-gray-400 text-xs">
                  <Calendar className="w-8 h-8 text-gray-600 mx-auto mb-2 opacity-50" />
                  <p>You haven't scheduled any appointments yet.</p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Fill the form on the left to request a session.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {userAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="p-4 bg-[#0a192f] border border-gray-800 rounded-xl hover:border-gray-700 transition"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className="text-xs font-bold text-[#d4af37]">
                            {apt.caseType}
                          </span>
                          <span className="text-[10px] text-gray-400 block mt-0.5">
                            ID: {apt.id}
                          </span>
                        </div>
                        {getStatusBadge(apt.status)}
                      </div>

                      <div className="text-xs text-gray-300 space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>
                            {apt.appointmentDate} at {apt.appointmentTime}
                          </span>
                        </div>
                        {apt.message && (
                          <p className="text-[11px] text-gray-400 italic line-clamp-2 mt-1 bg-[#081426] p-2 rounded border border-gray-800/80">
                            "{apt.message}"
                          </p>
                        )}
                        {apt.notes && (
                          <div className="mt-2 text-[11px] text-[#d4af37] bg-[#d4af37]/10 p-2 rounded border border-[#d4af37]/20">
                            <strong>Lawyer Note:</strong> {apt.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Office Timing Card */}
            <div className="bg-[#0b1d3a] border border-[#d4af37]/30 rounded-2xl p-5 text-xs text-gray-300">
              <h5 className="font-serif font-bold text-white text-sm text-[#d4af37] mb-2">
                Chamber Hours & Location
              </h5>
              <ul className="space-y-1.5">
                <li>• Monday – Saturday: 09:00 AM – 06:00 PM</li>
                <li>• Friday Break: 01:00 PM – 02:30 PM</li>
                <li>• Address: Eid Gaah Road, Dera Ismail Khan</li>
                <li>• Direct Helpline: 03430277466</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Success Confirmation Modal */}
      <AnimatePresence>
        {successBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9 }}
              className="bg-[#0a192f] border-2 border-[#d4af37] rounded-2xl p-6 max-w-md w-full shadow-2xl text-center relative"
            >
              <div className="w-16 h-16 rounded-full bg-[#d4af37]/20 border-2 border-[#d4af37] mx-auto flex items-center justify-center text-[#d4af37] mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <h3 className="text-2xl font-serif font-bold text-white">
                Appointment Requested!
              </h3>
              <p className="text-xs text-[#d4af37] font-semibold uppercase tracking-wider mt-1 mb-4">
                Ref ID: {successBooking.id}
              </p>

              <div className="bg-[#081426] border border-gray-800 rounded-xl p-4 text-left text-xs space-y-2 mb-6">
                <div className="flex justify-between border-b border-gray-800 pb-1">
                  <span className="text-gray-400">Client Name:</span>
                  <span className="font-semibold text-white">{successBooking.fullName}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-1">
                  <span className="text-gray-400">Case Type:</span>
                  <span className="font-semibold text-[#d4af37]">
                    {successBooking.caseType}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-1">
                  <span className="text-gray-400">Date & Time:</span>
                  <span className="font-semibold text-white">
                    {successBooking.appointmentDate} ({successBooking.appointmentTime})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Phone:</span>
                  <span className="font-semibold text-white">{successBooking.phone}</span>
                </div>
              </div>

              <p className="text-xs text-gray-300 mb-6">
                Your consultation request has been received. Our team will review the details and contact you via phone or email for final scheduling.
              </p>

              <button
                id="appointment-success-close-btn"
                onClick={() => setSuccessBooking(null)}
                className="w-full py-3 bg-[#d4af37] text-slate-950 font-bold rounded-xl hover:bg-[#e2bd46] transition cursor-pointer"
              >
                Close Confirmation
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
