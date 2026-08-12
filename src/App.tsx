import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { AppointmentSection } from './components/AppointmentSection';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { LawyerPortal } from './components/LawyerPortal';
import { Footer } from './components/Footer';
import { CaseType } from './types';
import { Scale } from 'lucide-react';

function MainApp() {
  const { user, isLoading } = useAuth();
  const [activeSection, setActiveSection] = useState('hero');
  const [showLawyerPortal, setShowLawyerPortal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [preSelectedCaseType, setPreSelectedCaseType] = useState<CaseType | undefined>(undefined);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('about')) {
      setTimeout(() => scrollToSection('about'), 200);
    } else if (path.includes('contact')) {
      setTimeout(() => scrollToSection('contact'), 200);
    } else if (path.includes('services') || path.includes('programs') || path.includes('links')) {
      setTimeout(() => scrollToSection('services'), 200);
    } else if (path.includes('appointment')) {
      setTimeout(() => scrollToSection('appointment'), 200);
    } else if (path.includes('faq')) {
      setTimeout(() => scrollToSection('faq'), 200);
    }
  }, []);

  const handleSelectService = (caseType: CaseType) => {
    setPreSelectedCaseType(caseType);
    scrollToSection('appointment');
  };

  // Loading state during session restoration
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07111e] text-white flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-full bg-[#d4af37]/20 border-2 border-[#d4af37] flex items-center justify-center text-[#d4af37] animate-pulse mb-4">
          <Scale className="w-8 h-8" />
        </div>
        <div className="text-lg font-serif font-bold text-white tracking-wide">
          Abdullah Law Firm
        </div>
        <p className="text-xs text-[#d4af37] uppercase tracking-widest mt-1">
          Loading Security Session...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07111e] text-gray-100 font-sans selection:bg-[#d4af37] selection:text-slate-950">
      <Navbar
        onOpenLawyerPortal={() => setShowLawyerPortal(true)}
        onOpenAuth={() => setShowAuthModal(true)}
        onNavigate={scrollToSection}
        activeSection={activeSection}
      />

      <main>
        <Hero
          onBookClick={() => scrollToSection('appointment')}
          onContactClick={() => scrollToSection('contact')}
        />

        <About />

        <Services onSelectService={handleSelectService} />

        <AppointmentSection selectedCaseType={preSelectedCaseType} />

        <FaqSection
          onNavigateToContact={() => scrollToSection('contact')}
          onNavigateToAppointment={() => scrollToSection('appointment')}
        />

        <ContactSection />
      </main>

      <Footer onNavigate={scrollToSection} />

      {/* Auth Modal when opened by user */}
      {showAuthModal && (
        <AuthModal
          onSuccess={() => setShowAuthModal(false)}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {/* Protected Lawyer Portal Overlay */}
      {showLawyerPortal && (
        <LawyerPortal onClosePortal={() => setShowLawyerPortal(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
