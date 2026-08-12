import React, { useState } from 'react';
import { Scale, Phone, MapPin, Mail, ShieldCheck, FileText, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Footer: React.FC<{ onNavigate: (sectionId: string) => void }> = ({ onNavigate }) => {
  const [modalType, setModalType] = useState<'privacy' | 'terms' | null>(null);

  return (
    <footer className="bg-[#060e1a] border-t border-[#d4af37]/30 text-gray-300 py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Firm Overview */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#d4af37] text-slate-950 flex items-center justify-center font-bold">
                <Scale className="w-5 h-5" />
              </div>
              <span className="font-serif font-bold text-lg text-white">Abdullah Law Firm</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Advocate Abdullah provides high-caliber legal representation in Civil, Criminal, Family, Property, and Corporate law in Dera Ismail Khan, Pakistan.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider mb-3 text-[#d4af37]">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('hero')} className="hover:text-[#d4af37] transition">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#d4af37] transition">
                  About Advocate Abdullah
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-[#d4af37] transition">
                  Practice Areas & Services
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('appointment')} className="hover:text-[#d4af37] transition">
                  Book Appointment
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-[#d4af37] transition">
                  Frequently Asked Questions (FAQ)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-[#d4af37] transition">
                  Contact Chamber
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Chamber Info */}
          <div>
            <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider mb-3 text-[#d4af37]">
              Chamber Address
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>Eid Gaah Road, Dera Ismail Khan (D.I. Khan), Pakistan</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#d4af37] shrink-0" />
                <a href="tel:03430277466" className="font-mono text-[#d4af37] hover:underline">
                  03430277466
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>info@abdullahlawfirm.pk</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Policy */}
          <div>
            <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider mb-3 text-[#d4af37]">
              Legal Notices
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setModalType('privacy')}
                  className="hover:text-[#d4af37] transition flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setModalType('terms')}
                  className="hover:text-[#d4af37] transition flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-[#d4af37]" />
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 text-center text-xs text-gray-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Abdullah Law Firm. All Rights Reserved.</p>
          <p className="text-[11px] text-gray-400">
            Dera Ismail Khan High Court & District Court Legal Practice
          </p>
        </div>
      </div>

      {/* Privacy / Terms Modal */}
      <AnimatePresence>
        {modalType && (
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
              className="bg-[#0a192f] border border-[#d4af37] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-white"
            >
              <button
                onClick={() => setModalType(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-serif font-bold text-xl text-[#d4af37] mb-3">
                {modalType === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
              </h3>

              <div className="text-xs text-gray-300 space-y-3 max-h-80 overflow-y-auto pr-2 leading-relaxed">
                {modalType === 'privacy' ? (
                  <>
                    <p>
                      <strong>1. Confidentiality of Client Data:</strong> Abdullah Law Firm is committed to preserving attorney-client privilege. All information supplied during registration or appointment booking is kept strictly confidential.
                    </p>
                    <p>
                      <strong>2. Secure Storage:</strong> Contact details and appointment records are encrypted and stored solely for scheduling and case management purposes in accordance with legal ethics.
                    </p>
                    <p>
                      <strong>3. No Unsolicited Sharing:</strong> Your email address and telephone number will never be sold, rented, or distributed to third parties.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      <strong>1. Appointment Confirmation:</strong> Submitting an appointment request online does not constitute an immediate attorney-client agreement until formally confirmed by Advocate Abdullah's office.
                    </p>
                    <p>
                      <strong>2. Consultation Terms:</strong> Scheduled session dates and times are subject to court schedule availability in District and High Courts.
                    </p>
                    <p>
                      <strong>3. Chamber Rules:</strong> Clients are requested to bring all relevant court documents, CNIC copies, and previous legal notices for preliminary review.
                    </p>
                  </>
                )}
              </div>

              <button
                onClick={() => setModalType(null)}
                className="mt-6 w-full py-2 bg-[#d4af37] text-slate-950 font-bold rounded-xl hover:bg-[#e2bd46] text-xs transition"
              >
                I Understand
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
};
