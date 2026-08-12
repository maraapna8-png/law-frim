import React from 'react';
import { motion } from 'motion/react';
import { Scale, Calendar, Shield, Award, MapPin, Phone, ArrowRight } from 'lucide-react';

interface HeroProps {
  onBookClick: () => void;
  onContactClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBookClick, onContactClick }) => {
  return (
    <section
      id="hero"
      className="relative pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-b from-[#0a192f] via-[#081426] to-[#0a192f] text-white overflow-hidden"
    >
      {/* Background Decorative Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-20">
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#d4af37]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#002b5b]/40 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Prominent Lawyer Photo at Top Center */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center mb-8"
        >
          <div className="relative group">
            {/* Gold Ring Frame */}
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#c59b27] blur-sm opacity-90 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>

            <div className="relative w-44 h-44 sm:w-52 sm:h-52 md:w-60 md:h-60 rounded-full overflow-hidden border-4 border-[#d4af37] bg-[#07111e] shadow-2xl">
              <img
                src="/src/assets/images/advocate_abdullah_portrait_1784805234381.jpg"
                alt="Advocate Abdullah"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* High Court Advocate Badge */}
            <div className="absolute -bottom-2 bg-[#d4af37] text-slate-950 px-4 py-1 rounded-full font-bold text-xs shadow-xl uppercase tracking-wider border border-white/20 flex items-center gap-1.5 whitespace-nowrap">
              <Award className="w-3.5 h-3.5" />
              <span>Advocate High Court</span>
            </div>
          </div>
        </motion.div>

        {/* Headlines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/40 text-[#d4af37] text-xs font-semibold uppercase tracking-widest mb-4">
            <Scale className="w-4 h-4" />
            <span>Dedicated Legal Representation in Pakistan</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white tracking-tight leading-tight">
            Advocate Abdullah
          </h1>

          <p className="text-xl sm:text-2xl font-serif text-[#d4af37] font-medium mt-2 mb-4 tracking-wide">
            Professional Legal Services
          </p>

          <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-light mb-8 max-w-2xl mx-auto">
            Providing expert legal defense, civil litigation, family law counseling, and corporate consultation with unwavering commitment to justice in District & High Courts of Dera Ismail Khan, Pakistan.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="hero-book-appointment-btn"
              onClick={onBookClick}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#c59b27] via-[#d4af37] to-[#c59b27] text-slate-950 font-extrabold rounded-xl shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-base cursor-pointer group"
            >
              <Calendar className="w-5 h-5" />
              <span>Book Appointment Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="hero-contact-btn"
              onClick={onContactClick}
              className="w-full sm:w-auto px-8 py-4 bg-[#081426] text-white font-bold rounded-xl border border-[#d4af37]/50 hover:bg-[#d4af37]/10 hover:border-[#d4af37] transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
            >
              <Phone className="w-4 h-4 text-[#d4af37]" />
              <span>Contact Law Firm</span>
            </button>
          </div>
        </motion.div>

        {/* Feature Highlights Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto text-left"
        >
          <div className="p-5 rounded-2xl bg-[#081426]/90 border border-gray-800 hover:border-[#d4af37]/50 transition-all flex items-start gap-4 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-white text-base">Trusted Legal Expertise</h3>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Extensive experience handling complex court litigations & disputes.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#081426]/90 border border-gray-800 hover:border-[#d4af37]/50 transition-all flex items-start gap-4 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-white text-base">Prime D.I. Khan Office</h3>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Conveniently located at Eid Gaah Road, Dera Ismail Khan.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#081426]/90 border border-gray-800 hover:border-[#d4af37]/50 transition-all flex items-start gap-4 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-white text-base">Direct Consultation</h3>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Call 03430277466 for immediate inquiry & consultation scheduling.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
