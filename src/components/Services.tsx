import React from 'react';
import { motion } from 'motion/react';
import { CaseType } from '../types';
import {
  Scale,
  ShieldAlert,
  Users,
  Home,
  Briefcase,
  HelpCircle,
  FileText,
  Gavel,
  ArrowRight,
} from 'lucide-react';

interface ServicesProps {
  onSelectService: (serviceType: CaseType) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectService }) => {
  const serviceCards: {
    title: CaseType;
    description: string;
    icon: React.ReactNode;
    features: string[];
  }[] = [
    {
      title: 'Civil Law',
      description:
        'Handling contractual disputes, recovery suits, injunctions, torts, and civil rights protection in lower & higher courts.',
      icon: <Scale className="w-6 h-6 text-[#d4af37]" />,
      features: ['Contract Disputes', 'Injunction Suits', 'Recovery & Compensation'],
    },
    {
      title: 'Criminal Law',
      description:
        'Robust defense representation for bail matters, trial defense, FIR quashing, appeals, and police procedures.',
      icon: <ShieldAlert className="w-6 h-6 text-[#d4af37]" />,
      features: ['Pre-Arrest & Post-Bail', 'Trial Litigation', 'Appeals & Revisions'],
    },
    {
      title: 'Family Law',
      description:
        'Sensitive & expert advocacy in custody, maintenance, dower disputes, khula/divorce, and inheritance partition.',
      icon: <Users className="w-6 h-6 text-[#d4af37]" />,
      features: ['Guardianship & Custody', 'Maintenance Claims', 'Inheritance Disputes'],
    },
    {
      title: 'Property Cases',
      description:
        'Verification of land titles, possession suits, land revenue matters, tenant disputes, and mutation deeds.',
      icon: <Home className="w-6 h-6 text-[#d4af37]" />,
      features: ['Title Verification', 'Possession Suits', 'Revenue & Partition'],
    },
    {
      title: 'Corporate Law',
      description:
        'Business registration, commercial contracts, partnership deeds, compliance, and corporate dispute resolution.',
      icon: <Briefcase className="w-6 h-6 text-[#d4af37]" />,
      features: ['Partnership Deeds', 'Commercial Contracts', 'Company Compliance'],
    },
    {
      title: 'Legal Consultation',
      description:
        'In-depth legal opinion, risk analysis, rights advisory, and pre-litigation settlement strategies.',
      icon: <HelpCircle className="w-6 h-6 text-[#d4af37]" />,
      features: ['Written Opinions', 'Pre-Litigation Strategy', 'Rights Advisory'],
    },
    {
      title: 'Documentation',
      description:
        'Precise drafting of legal notices, sale agreements, power of attorney, affidavits, and wills.',
      icon: <FileText className="w-6 h-6 text-[#d4af37]" />,
      features: ['Sale Deeds & Power of Attorney', 'Legal Notices', 'Contracts & Affidavits'],
    },
    {
      title: 'Court Representation',
      description:
        'Forceful, persuasive argument presentation in District Courts, Sessions Court, and High Court Benches.',
      icon: <Gavel className="w-6 h-6 text-[#d4af37]" />,
      features: ['District Court Defense', 'High Court Writs', 'Appellate Advocacy'],
    },
  ];

  return (
    <section id="services" className="py-20 bg-[#0a192f] text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold bg-[#d4af37]/10 px-3 py-1 rounded-full border border-[#d4af37]/30">
            Legal Specializations
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-3">
            Comprehensive Practice Areas
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mt-3">
            Professional legal solutions tailored to protect your constitutional rights, financial interests, and peace of mind.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceCards.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-[#081426] border border-gray-800 hover:border-[#d4af37]/70 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 shadow-xl hover:shadow-2xl hover:shadow-[#d4af37]/5"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#0a192f] border border-[#d4af37]/30 flex items-center justify-center mb-4 group-hover:bg-[#d4af37]/20 group-hover:border-[#d4af37] transition-all">
                  {service.icon}
                </div>

                <h3 className="font-serif font-bold text-lg text-white group-hover:text-[#d4af37] transition-colors mb-2">
                  {service.title}
                </h3>

                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  {service.description}
                </p>

                <ul className="space-y-1.5 mb-6">
                  {service.features.map((feat) => (
                    <li key={feat} className="text-[11px] text-gray-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]"></span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                id={`service-book-btn-${service.title.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => onSelectService(service.title)}
                className="w-full py-2.5 px-3 rounded-lg bg-[#0a192f] border border-gray-700 text-xs font-semibold text-[#d4af37] group-hover:bg-[#d4af37] group-hover:text-slate-950 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Schedule Consultation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
