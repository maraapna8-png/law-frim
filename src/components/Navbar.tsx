import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Scale, Lock, LogOut, Menu, X, Phone, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  onOpenLawyerPortal: () => void;
  onOpenAuth: () => void;
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenLawyerPortal,
  onOpenAuth,
  onNavigate,
  activeSection,
}) => {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'appointment', label: 'Appointment' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0a192f]/95 backdrop-blur-md shadow-xl border-b border-[#d4af37]/20 py-2.5'
          : 'bg-[#0a192f]/80 backdrop-blur-sm border-b border-gray-800/50 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          id="nav-brand-logo"
          onClick={() => handleNavClick('hero')}
          className="flex items-center gap-3 group text-left cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37] to-[#8c6d12] flex items-center justify-center text-slate-950 shadow-md group-hover:scale-105 transition-transform">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="font-serif text-lg font-bold text-white tracking-wide leading-none group-hover:text-[#d4af37] transition-colors">
              Abdullah Law Firm
            </div>
            <div className="text-[10px] text-[#d4af37] tracking-widest uppercase font-semibold mt-0.5">
              Advocate Abdullah
            </div>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`nav-link-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`px-3 py-2 rounded-md text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                activeSection === item.id
                  ? 'text-[#d4af37] bg-[#d4af37]/10 border-b-2 border-[#d4af37]'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}

          {/* Lawyer Portal Button */}
          <button
            id="nav-lawyer-portal-btn"
            onClick={onOpenLawyerPortal}
            className="ml-2 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider bg-[#d4af37]/15 border border-[#d4af37]/50 text-[#d4af37] hover:bg-[#d4af37] hover:text-slate-950 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Lock className="w-3.5 h-3.5" />
            Lawyer Portal
          </button>
        </nav>

        {/* User Badge & Logout or Login */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-2 bg-[#081426] border border-gray-700/80 px-3 py-1.5 rounded-full text-xs">
                <UserIcon className="w-3.5 h-3.5 text-[#d4af37]" />
                <span className="text-gray-200 font-medium truncate max-w-[120px]">
                  {user.fullName}
                </span>
              </div>
              <button
                id="nav-logout-btn"
                onClick={logout}
                className="p-2 rounded-lg bg-gray-800/80 hover:bg-red-950 hover:text-red-300 text-gray-300 border border-gray-700 hover:border-red-500/50 transition-all cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              id="nav-signin-btn"
              onClick={onOpenAuth}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-[#d4af37] text-slate-950 hover:bg-[#e2bd46] transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <UserIcon className="w-3.5 h-3.5" />
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#07111e] border-b border-[#d4af37]/30 px-4 pt-3 pb-6 space-y-2 mt-2 shadow-2xl animate-fadeIn">
          {user && (
            <div className="flex items-center justify-between bg-[#0b1d3a] p-3 rounded-lg border border-gray-700 mb-3">
              <div className="flex items-center gap-2 text-xs text-gray-200">
                <UserIcon className="w-4 h-4 text-[#d4af37]" />
                <span className="font-semibold">{user.fullName}</span>
              </div>
              <span className="text-[10px] text-[#d4af37] uppercase font-bold px-2 py-0.5 bg-[#d4af37]/10 rounded border border-[#d4af37]/30">
                Logged In
              </span>
            </div>
          )}

          {navItems.map((item) => (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeSection === item.id
                  ? 'bg-[#d4af37] text-slate-950 font-bold'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              {item.label}
            </button>
          ))}

          <button
            id="mobile-lawyer-portal-btn"
            onClick={() => {
              onOpenLawyerPortal();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold bg-[#d4af37]/20 border border-[#d4af37] text-[#d4af37] flex items-center gap-2"
          >
            <Lock className="w-4 h-4" />
            Lawyer Portal (Protected)
          </button>

          {user ? (
            <button
              id="mobile-logout-btn"
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 bg-red-950/40 border border-red-900/50 flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Logout Account
            </button>
          ) : (
            <button
              id="mobile-signin-btn"
              onClick={() => {
                onOpenAuth();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold bg-[#d4af37] text-slate-950 flex items-center gap-2 cursor-pointer"
            >
              <UserIcon className="w-4 h-4" />
              Sign In / Register
            </button>
          )}

          <div className="pt-2 text-center text-xs text-gray-400 flex items-center justify-center gap-1">
            <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>03430277466 • D.I. Khan</span>
          </div>
        </div>
      )}
    </header>
  );
};
