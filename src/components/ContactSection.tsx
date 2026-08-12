import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Building } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [isSending, setIsSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name || !email || !message) {
      setErrorMsg('Please fill in required fields.');
      return;
    }

    setIsSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, subject, message }),
      });

      if (res.ok) {
        setSubmitted(true);
        setName('');
        setEmail('');
        setPhone('');
        setSubject('');
        setMessage('');
      } else {
        setErrorMsg('Failed to send message. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Connection error.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-[#0a192f] text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold bg-[#d4af37]/10 px-3 py-1 rounded-full border border-[#d4af37]/30">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-3">
            Contact Abdullah Law Firm
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mt-3">
            Reach out directly to our chamber in Dera Ismail Khan for urgent legal inquiries, advice, or case evaluations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#081426] border border-[#d4af37]/30 rounded-2xl p-6 sm:p-8 shadow-xl">
              <h3 className="font-serif font-bold text-xl text-[#d4af37] mb-6 flex items-center gap-2">
                <Building className="w-5 h-5" />
                <span>Chamber Contact Info</span>
              </h3>

              <div className="space-y-6 text-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] shrink-0 mt-1">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-white text-base">Lawyer Name & Address</h4>
                    <p className="text-gray-300 mt-1">Advocate Abdullah</p>
                    <p className="text-gray-400 text-xs">
                      Eid Gaah Road, Dera Ismail Khan (D.I. Khan), Khyber Pakhtunkhwa, Pakistan
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] shrink-0 mt-1">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-white text-base">Direct Phone Line</h4>
                    <a
                      href="tel:03430277466"
                      className="text-[#d4af37] font-mono font-bold text-base hover:underline block mt-0.5"
                    >
                      03430277466
                    </a>
                    <p className="text-gray-400 text-xs mt-0.5">
                      Available for appointment inquiries & client calls.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] shrink-0 mt-1">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-white text-base">Official Email</h4>
                    <p className="text-gray-300 text-xs mt-0.5">info@abdullahlawfirm.pk</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] shrink-0 mt-1">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-white text-base">Working Hours</h4>
                    <p className="text-gray-300 text-xs mt-0.5">Mon – Sat: 09:00 AM – 06:00 PM</p>
                    <p className="text-gray-400 text-xs">Sunday: By Special Appointment Only</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="bg-[#081426] border border-gray-800 rounded-2xl overflow-hidden shadow-xl h-64 relative">
              <iframe
                title="Abdullah Law Firm Location Map"
                src="https://maps.google.com/maps?q=Eid%20Gaah%20Road,%20Dera%20Ismail%20Khan,%20Pakistan&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Contact Form (7 Cols) */}
          <div className="lg:col-span-7 bg-[#081426] border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="font-serif font-bold text-xl text-white mb-2">
                Send a Direct Message
              </h3>
              <p className="text-xs text-gray-400 mb-6">
                Fill out the contact form below and Advocate Abdullah's legal office will respond promptly.
              </p>

              {submitted ? (
                <div className="p-6 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-center text-emerald-200 space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h4 className="text-lg font-serif font-bold text-white">Message Sent!</h4>
                  <p className="text-xs text-gray-300">
                    Thank you for contacting Abdullah Law Firm. We will review your message and reach out shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-2 text-xs text-[#d4af37] underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 bg-red-950 border border-red-500 text-xs text-red-200 rounded">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        Your Name <span className="text-[#d4af37]">*</span>
                      </label>
                      <input
                        id="contact-name-input"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name"
                        className="w-full px-3 py-2.5 bg-[#0a192f] border border-gray-700 rounded-lg text-sm text-white focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        Email Address <span className="text-[#d4af37]">*</span>
                      </label>
                      <input
                        id="contact-email-input"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        className="w-full px-3 py-2.5 bg-[#0a192f] border border-gray-700 rounded-lg text-sm text-white focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        Phone Number
                      </label>
                      <input
                        id="contact-phone-input"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0300 0000000"
                        className="w-full px-3 py-2.5 bg-[#0a192f] border border-gray-700 rounded-lg text-sm text-white focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        Subject
                      </label>
                      <input
                        id="contact-subject-input"
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Subject / Case Reference"
                        className="w-full px-3 py-2.5 bg-[#0a192f] border border-gray-700 rounded-lg text-sm text-white focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Message / Legal Details <span className="text-[#d4af37]">*</span>
                    </label>
                    <textarea
                      id="contact-message-input"
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your inquiry here..."
                      className="w-full px-3 py-2.5 bg-[#0a192f] border border-gray-700 rounded-lg text-sm text-white focus:border-[#d4af37] focus:outline-none"
                    ></textarea>
                  </div>

                  <button
                    id="contact-submit-btn"
                    type="submit"
                    disabled={isSending}
                    className="w-full py-3 bg-gradient-to-r from-[#c59b27] via-[#d4af37] to-[#c59b27] text-slate-950 font-bold rounded-xl shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                  >
                    {isSending ? (
                      <span className="inline-block w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
