import React from 'react';
import { motion } from 'motion/react';
import { Scale, CheckCircle2, Award, Building2, Gavel, HeartHandshake } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-[#07111e] text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold bg-[#d4af37]/10 px-3 py-1 rounded-full border border-[#d4af37]/30">
            About Legal Practice
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-3">
            Dedication, Professionalism & Client Commitment
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mt-3 leading-relaxed">
            Advocate Abdullah leads the firm with a steadfast pledge to protect constitutional rights, safeguard assets, and deliver strategic legal solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Office Banner & Badges */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-2xl overflow-hidden border-2 border-[#d4af37]/40 shadow-2xl bg-[#0a192f]">
              <img
                src="/src/assets/images/law_firm_banner_1784801513239.jpg"
                alt="Abdullah Law Firm Office"
                referrerPolicy="no-referrer"
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-transparent"></div>

              <div className="p-6 relative z-10 -mt-16">
                <div className="bg-[#081426]/95 border border-[#d4af37]/40 p-4 rounded-xl shadow-xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#d4af37]/15 flex items-center justify-center text-[#d4af37] shrink-0">
                    <Gavel className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-white text-sm">Legal Excellence</h4>
                    <p className="text-xs text-gray-300">
                      High Court & District Court Practitioner, D.I. Khan
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Experience Pill */}
            <div className="absolute -top-4 -right-2 bg-[#d4af37] text-slate-950 font-bold p-4 rounded-xl shadow-2xl border border-white/30 text-center">
              <span className="block text-2xl font-serif font-extrabold leading-none">10+</span>
              <span className="text-[10px] uppercase tracking-wider block font-sans mt-0.5">
                Years Legal Practice
              </span>
            </div>
          </motion.div>

          {/* Right Column: Bio & Values */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="space-y-4">
              <h3 className="text-2xl font-serif font-bold text-[#d4af37]">
                Advocate Abdullah — Senior Legal Practitioner
              </h3>

              <p className="text-gray-300 text-sm leading-relaxed">
                Advocate Abdullah is a highly respected legal professional based in Dera Ismail Khan (D.I. Khan), Khyber Pakhtunkhwa, Pakistan. With comprehensive expertise in Civil, Criminal, Family, and Corporate matters, Advocate Abdullah provides personalized attention to every legal dispute.
              </p>

              <p className="text-gray-300 text-sm leading-relaxed">
                Our chamber believes in thorough legal research, transparent communication, and resolute court representation. Whether navigating intricate property inheritance disputes or defending complex criminal charges, we fight to secure optimal legal remedies.
              </p>
            </div>

            {/* Key Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-[#0a192f] border border-gray-800 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif font-bold text-white text-sm">Transparent Strategy</h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Clear assessment of merits, legal risks, and realistic timelines.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#0a192f] border border-gray-800 rounded-xl flex items-start gap-3">
                <HeartHandshake className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif font-bold text-white text-sm">Client Confidentiality</h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Strict ethical standards protecting all sensitive information.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#0a192f] border border-gray-800 rounded-xl flex items-start gap-3">
                <Award className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif font-bold text-white text-sm">Rigorous Preparation</h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Meticulous case drafting and case law precedents.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#0a192f] border border-gray-800 rounded-xl flex items-start gap-3">
                <Building2 className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif font-bold text-white text-sm">District & High Court</h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Authorized practice across trial courts & High Court benches.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
