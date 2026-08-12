import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronDown,
  Search,
  HelpCircle,
  MessageSquare,
  Calendar,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Shield,
  FileText,
  Clock,
  PhoneCall,
  X
} from 'lucide-react';

export interface FaqItem {
  id: string;
  category: 'general' | 'booking' | 'fees' | 'court' | 'urgent' | 'portal';
  categoryLabel: string;
  question: string;
  answer: string;
  highlights?: string[];
}

const FAQ_DATA: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'court',
    categoryLabel: 'Court & Practice Areas',
    question: 'What legal practice areas does Advocate Abdullah specialize in?',
    answer: 'Advocate Abdullah provides expert legal representation across multiple domains in District & High Courts:',
    highlights: [
      'Criminal Defense: Pre-arrest & post-arrest bail, FIR quashment petitions, trials, and criminal appeals.',
      'Civil Litigation: Property disputes, land possession, stay orders, injunctions, and financial recovery suits.',
      'Family Law: Khula, dissolution of marriage, child custody, guardianship, and maintenance claims.',
      'Corporate & Tax: Contract drafting, business legal compliance, and tax advisory.'
    ]
  },
  {
    id: 'faq-2',
    category: 'booking',
    categoryLabel: 'Consultation & Booking',
    question: 'How do I schedule an appointment with Advocate Abdullah?',
    answer: 'Scheduling a legal consultation is simple and convenient:',
    highlights: [
      'Online Appointment Form: Scroll to our Appointment section, choose your case category, select a date & time, and submit your details.',
      'Direct Phone Line: Call our chamber office directly at 03430277466 during business hours.',
      'In-Person Chamber Visit: Visit our chamber at Eid Gaah Road, D.I. Khan during consultation hours (4:00 PM – 9:00 PM).'
    ]
  },
  {
    id: 'faq-3',
    category: 'booking',
    categoryLabel: 'Consultation & Booking',
    question: 'What documents should I bring to my initial legal consultation?',
    answer: 'To ensure Advocate Abdullah can conduct a thorough evaluation of your legal matter, please bring:',
    highlights: [
      'Original valid CNIC or identity document.',
      'Copies of any Police FIRs, notices, or court summons received.',
      'Property deeds, registry documents, or contracts relevant to civil disputes.',
      'Previous court orders, pleadings, or legal notices sent by opposing parties.'
    ]
  },
  {
    id: 'faq-4',
    category: 'fees',
    categoryLabel: 'Fees & Billing',
    question: 'How are legal fees and payment structures determined?',
    answer: 'We maintain complete transparency in all financial arrangements with zero hidden charges:',
    highlights: [
      'Initial Consultation Fee: Fixed upfront fee for in-person or online legal assessment.',
      'Stage-Based Retainers: Case fees are structured around milestones (e.g., Notice Stage, Bail Stage, Trial Arguments, Appeals).',
      'Flexible Payment Options: Installment plans are available for lengthy civil and family litigation.'
    ]
  },
  {
    id: 'faq-5',
    category: 'urgent',
    categoryLabel: 'Urgent Legal Help',
    question: 'What should I do if I require emergency legal help or urgent bail?',
    answer: 'Emergency situations receive top priority at Abdullah Law Firm:',
    highlights: [
      'Immediate Call Hotline: Contact 03430277466 immediately for emergency police custody or arrest situations.',
      'Urgent Bail Filings: Pre-arrest bail petitions can be prepared and submitted to court on an expedited basis.',
      'Priority Callback: Mark your online booking or contact form message as "Urgent" for immediate attorney response.'
    ]
  },
  {
    id: 'faq-6',
    category: 'portal',
    categoryLabel: 'Client Portal & Case Updates',
    question: 'How can I track the progress and status of my ongoing court case?',
    answer: 'Clients enjoy real-time digital access to their case records:',
    highlights: [
      'Client Portal Access: Log in securely using the "Sign In" button on the navigation bar.',
      'Case Dashboard: View next hearing dates, court room bench details, and case history.',
      'Document Downloads: Download interim court orders and legal notices directly from your portal.'
    ]
  },
  {
    id: 'faq-7',
    category: 'general',
    categoryLabel: 'General & Confidentiality',
    question: 'Is my legal consultation and case information kept strictly confidential?',
    answer: 'Yes. All client disclosures, documents, and discussions are strictly protected under Attorney-Client Privilege in accordance with Pakistan Legal Practitioners Code of Conduct. Your privacy and case strategy remain 100% secure.',
    highlights: []
  },
  {
    id: 'faq-8',
    category: 'court',
    categoryLabel: 'Court & Practice Areas',
    question: 'Do you represent clients outside Dera Ismail Khan (D.I. Khan)?',
    answer: 'While our central chamber is located in D.I. Khan, Advocate Abdullah regularly represents clients across KP and federal jurisdictions including Peshawar High Court (Peshawar, Bannu, and Abbottabad benches) as well as Islamabad / Rawalpindi Courts.',
    highlights: []
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All Questions' },
  { id: 'booking', label: 'Booking & Consult' },
  { id: 'court', label: 'Practice & Courts' },
  { id: 'fees', label: 'Fees & Billing' },
  { id: 'urgent', label: 'Urgent Legal Help' },
  { id: 'portal', label: 'Client Portal' },
  { id: 'general', label: 'General Info' },
];

interface FaqSectionProps {
  onNavigateToContact?: () => void;
  onNavigateToAppointment?: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({
  onNavigateToContact,
  onNavigateToAppointment,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(['faq-1', 'faq-2']));
  const [feedback, setFeedback] = useState<Record<string, 'yes' | 'no'>>({});

  const toggleFaq = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    const allIds = new Set(filteredFaqs.map((f) => f.id));
    setOpenIds(allIds);
  };

  const collapseAll = () => {
    setOpenIds(new Set());
  };

  const handleFeedback = (id: string, val: 'yes' | 'no') => {
    setFeedback((prev) => ({ ...prev, [id]: val }));
  };

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const qLower = item.question.toLowerCase();
      const aLower = item.answer.toLowerCase();
      const sLower = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !sLower ||
        qLower.includes(sLower) ||
        aLower.includes(sLower) ||
        (item.highlights && item.highlights.some((h) => h.toLowerCase().includes(sLower)));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section id="faq" className="py-20 bg-[#07111e] text-white relative border-t border-[#d4af37]/20">
      {/* Decorative ambient background blur */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#d4af37]/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#0e274d]/40 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#d4af37] font-semibold bg-[#d4af37]/10 px-3.5 py-1.5 rounded-full border border-[#d4af37]/30 mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-wide">
            Common Legal Inquiries Answered
          </h2>
          <p className="text-gray-300 text-sm sm:text-base mt-3 leading-relaxed">
            Find immediate answers to questions regarding legal consultations, case categories, fee structures, emergency bail petitions, and court processes.
          </p>
        </div>

        {/* Search & Filter Controls Bar */}
        <div className="bg-[#0a192f] border border-[#d4af37]/30 rounded-2xl p-4 sm:p-6 mb-10 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Search Box */}
            <div className="relative w-full md:flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="faq-search-input"
                type="text"
                placeholder="Search questions (e.g., bail, documents, fees, custody)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#07111e] border border-gray-700 focus:border-[#d4af37] rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Expand / Collapse All */}
            <div className="flex items-center gap-2 self-end md:self-auto shrink-0 text-xs">
              <button
                id="faq-expand-all-btn"
                onClick={expandAll}
                className="px-3 py-2 rounded-lg bg-[#081426] border border-gray-700/80 text-gray-300 hover:text-[#d4af37] hover:border-[#d4af37]/50 transition-all cursor-pointer font-medium"
              >
                Expand All
              </button>
              <button
                id="faq-collapse-all-btn"
                onClick={collapseAll}
                className="px-3 py-2 rounded-lg bg-[#081426] border border-gray-700/80 text-gray-300 hover:text-white hover:border-gray-500 transition-all cursor-pointer font-medium"
              >
                Collapse All
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                id={`faq-cat-btn-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#d4af37] text-slate-950 shadow-md font-bold'
                    : 'bg-[#07111e] text-gray-300 border border-gray-800 hover:border-[#d4af37]/40 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 bg-[#0a192f]/60 border border-gray-800 rounded-2xl p-8">
            <HelpCircle className="w-12 h-12 text-[#d4af37]/50 mx-auto mb-3" />
            <h3 className="text-lg font-serif font-bold text-white">No Matching Questions Found</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
              We couldn't find any FAQs matching "{searchQuery}". You can contact Advocate Abdullah's chamber directly for custom inquiries.
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#d4af37] text-xs font-semibold rounded-lg hover:bg-[#d4af37] hover:text-slate-950 transition-all"
              >
                Reset Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => {
              const isOpen = openIds.has(faq.id);
              const userFb = feedback[faq.id];

              return (
                <div
                  key={faq.id}
                  className={`bg-[#0a192f] border transition-all duration-300 rounded-2xl overflow-hidden shadow-lg ${
                    isOpen
                      ? 'border-[#d4af37]/60 ring-1 ring-[#d4af37]/20 bg-[#0d203b]'
                      : 'border-gray-800/80 hover:border-[#d4af37]/40'
                  }`}
                >
                  <button
                    id={`faq-accordion-header-${faq.id}`}
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-start gap-3.5">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#d4af37]/10 text-[#d4af37] text-xs font-bold font-mono shrink-0 mt-0.5 border border-[#d4af37]/20">
                        {index + 1}
                      </span>
                      <div>
                        <div className="text-xs text-[#d4af37] font-medium tracking-wider uppercase mb-1 flex items-center gap-1">
                          <span>{faq.categoryLabel}</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-serif font-semibold text-white leading-snug">
                          {faq.question}
                        </h3>
                      </div>
                    </div>

                    <div
                      className={`w-8 h-8 rounded-full bg-[#07111e] border border-gray-700/80 flex items-center justify-center text-[#d4af37] shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 bg-[#d4af37] text-slate-950 border-[#d4af37]' : ''
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-5 pb-6 sm:px-6 sm:pb-6 pt-0 border-t border-[#d4af37]/15">
                          <p className="text-sm text-gray-300 leading-relaxed mt-4">
                            {faq.answer}
                          </p>

                          {faq.highlights && faq.highlights.length > 0 && (
                            <ul className="mt-3.5 space-y-2 text-xs sm:text-sm text-gray-300 bg-[#07111e]/80 p-4 rounded-xl border border-gray-800/80">
                              {faq.highlights.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] shrink-0 mt-2" />
                                  <span className="leading-normal">{item}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          {/* Interactive Helpful Feedback */}
                          <div className="mt-5 pt-4 border-t border-gray-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400">
                            <span className="flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                              Was this legal answer helpful?
                            </span>
                            {userFb ? (
                              <span className="text-[#d4af37] font-medium bg-[#d4af37]/10 px-2.5 py-1 rounded-md border border-[#d4af37]/30">
                                {userFb === 'yes' ? '👍 Thank you for your feedback!' : '👍 Thanks! We will improve our guidelines.'}
                              </span>
                            ) : (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleFeedback(faq.id, 'yes')}
                                  className="px-2.5 py-1 rounded-md bg-[#07111e] border border-gray-700 text-gray-300 hover:text-[#d4af37] hover:border-[#d4af37]/50 transition-all flex items-center gap-1 cursor-pointer"
                                >
                                  <ThumbsUp className="w-3 h-3" />
                                  <span>Yes</span>
                                </button>
                                <button
                                  onClick={() => handleFeedback(faq.id, 'no')}
                                  className="px-2.5 py-1 rounded-md bg-[#07111e] border border-gray-700 text-gray-300 hover:text-red-400 hover:border-red-500/50 transition-all flex items-center gap-1 cursor-pointer"
                                >
                                  <ThumbsDown className="w-3 h-3" />
                                  <span>No</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}

        {/* Contact Reduction Callout Banner */}
        <div className="mt-14 bg-gradient-to-r from-[#0b1d3a] via-[#0e274d] to-[#0b1d3a] border border-[#d4af37]/40 rounded-2xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/10 rounded-full blur-2xl pointer-events-none" />
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mb-2">
            Have a specific case question not covered above?
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mx-auto mb-6">
            Our legal team at Advocate Abdullah Law Firm is ready to evaluate your legal matter directly. Book an official chamber appointment or drop a confidential direct message.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {onNavigateToAppointment && (
              <button
                id="faq-cta-book-btn"
                onClick={onNavigateToAppointment}
                className="px-6 py-3 rounded-xl bg-[#d4af37] text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-[#e2bd46] transition-all flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Legal Consultation</span>
              </button>
            )}
            {onNavigateToContact && (
              <button
                id="faq-cta-contact-btn"
                onClick={onNavigateToContact}
                className="px-6 py-3 rounded-xl bg-[#07111e] border border-[#d4af37]/50 text-[#d4af37] font-bold text-xs uppercase tracking-wider hover:bg-[#d4af37] hover:text-slate-950 transition-all flex items-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send Direct Message</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
