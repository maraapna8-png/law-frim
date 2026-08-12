import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Scale, Lock, Mail, User, Phone, Eye, EyeOff, ShieldCheck, KeyRound, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthModalProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccess, onClose }) => {
  const { login, register, forgotPassword, authError, clearError, isLoading } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Forgot password form states
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSuccessMsg('');
    if (!email || !password) return;
    const ok = await login(email, password);
    if (ok) {
      if (onSuccess) onSuccess();
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSuccessMsg('');

    if (password !== confirmPassword) {
      return;
    }

    const ok = await register(fullName, email, phone, password, confirmPassword);
    if (ok) {
      setSuccessMsg('Account created successfully! Switching to login...');
      setTimeout(() => {
        setMode('login');
        setSuccessMsg('');
      }, 1500);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setResetSuccess('');
    if (!resetEmail || !newPassword) return;

    const ok = await forgotPassword(resetEmail, newPassword);
    if (ok) {
      setResetSuccess('Password updated successfully! You can now log in.');
      setTimeout(() => {
        setShowForgotPassword(false);
        setResetSuccess('');
        setEmail(resetEmail);
      }, 2000);
    }
  };

  const fillDemoAccount = (role: 'client' | 'lawyer') => {
    if (role === 'client') {
      setEmail('tariq@example.com');
      setPassword('password123');
    } else {
      setEmail('lawyer@abdullahlawfirm.pk');
      setPassword('lawyer123');
    }
    setMode('login');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#07111e]/90 backdrop-blur-md p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-[#0a192f] border border-[#d4af37]/40 rounded-2xl shadow-2xl overflow-hidden my-8 relative"
      >
        {onClose && (
          <button
            id="auth-modal-close-btn"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-[#0b1d3a] via-[#0e274d] to-[#0b1d3a] p-6 text-center border-b border-[#d4af37]/30 relative">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#d4af37]/10 border border-[#d4af37] mb-3 text-[#d4af37] shadow-lg">
            <Scale className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-white tracking-wide">
            Abdullah Law Firm
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold mt-1">
            Advocate Abdullah • D.I. Khan, Pakistan
          </p>
          <p className="text-xs text-gray-300 mt-2">
            Client Authentication & Portal Login
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-gray-800 bg-[#081426]">
          <button
            id="login-tab-btn"
            type="button"
            onClick={() => {
              setMode('login');
              clearError();
              setSuccessMsg('');
            }}
            className={`flex-1 py-3 text-sm font-medium transition-all ${
              mode === 'login'
                ? 'text-[#d4af37] border-b-2 border-[#d4af37] bg-[#0a192f]'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Sign In
          </button>
          <button
            id="register-tab-btn"
            type="button"
            onClick={() => {
              setMode('register');
              clearError();
              setSuccessMsg('');
            }}
            className={`flex-1 py-3 text-sm font-medium transition-all ${
              mode === 'register'
                ? 'text-[#d4af37] border-b-2 border-[#d4af37] bg-[#0a192f]'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Create New Account
          </button>
        </div>

        <div className="p-6">
          {/* Messages */}
          {authError && (
            <div className="mb-4 p-3 bg-red-950/80 border border-red-500/50 rounded-lg text-red-200 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              {authError}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-lg text-emerald-200 text-xs">
              {successMsg}
            </div>
          )}

          {mode === 'login' ? (
            /* LOGIN FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Email or Username
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4af37]" />
                  <input
                    id="login-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. tariq@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#081426] border border-gray-700 focus:border-[#d4af37] rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-gray-300">
                    Password
                  </label>
                  <button
                    id="forgot-password-link"
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-xs text-[#d4af37] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4af37]" />
                  <input
                    id="login-password-input"
                    type={showPass ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#081426] border border-gray-700 focus:border-[#d4af37] rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                id="login-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-[#c59b27] via-[#d4af37] to-[#c59b27] text-slate-950 font-bold rounded-lg shadow-md hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm mt-2 cursor-pointer"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    Sign In to Legal Portal
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Demo Accounts Quick Fill */}
              <div className="pt-3 border-t border-gray-800 text-center">
                <p className="text-[11px] text-gray-400 mb-2">Quick Demo Access:</p>
                <div className="flex gap-2">
                  <button
                    id="demo-client-btn"
                    type="button"
                    onClick={() => fillDemoAccount('client')}
                    className="flex-1 py-1.5 px-2 bg-gray-800/80 hover:bg-gray-700 text-gray-300 text-xs rounded border border-gray-700 transition"
                  >
                    Client Demo
                  </button>
                  <button
                    id="demo-lawyer-btn"
                    type="button"
                    onClick={() => fillDemoAccount('lawyer')}
                    className="flex-1 py-1.5 px-2 bg-[#d4af37]/10 hover:bg-[#d4af37]/20 text-[#d4af37] text-xs rounded border border-[#d4af37]/30 transition font-medium"
                  >
                    Lawyer Demo
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4af37]" />
                  <input
                    id="register-fullname-input"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Muhammad Tariq"
                    className="w-full pl-10 pr-4 py-2 bg-[#081426] border border-gray-700 focus:border-[#d4af37] rounded-lg text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4af37]" />
                  <input
                    id="register-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. tariq@example.com"
                    className="w-full pl-10 pr-4 py-2 bg-[#081426] border border-gray-700 focus:border-[#d4af37] rounded-lg text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4af37]" />
                  <input
                    id="register-phone-input"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 03001234567"
                    className="w-full pl-10 pr-4 py-2 bg-[#081426] border border-gray-700 focus:border-[#d4af37] rounded-lg text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Password
                  </label>
                  <input
                    id="register-password-input"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full px-3 py-2 bg-[#081426] border border-gray-700 focus:border-[#d4af37] rounded-lg text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Confirm Password
                  </label>
                  <input
                    id="register-confirmpassword-input"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full px-3 py-2 bg-[#081426] border border-gray-700 focus:border-[#d4af37] rounded-lg text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              {password && confirmPassword && password !== confirmPassword && (
                <p className="text-[11px] text-red-400">Passwords do not match.</p>
              )}

              <button
                id="register-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-gradient-to-r from-[#c59b27] via-[#d4af37] to-[#c59b27] text-slate-950 font-bold rounded-lg shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-2 text-sm mt-3 cursor-pointer"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="bg-[#060e1a] p-3 text-center border-t border-gray-800/60 text-[11px] text-gray-400 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>Protected Legal Consultation System</span>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotPassword && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-[#0a192f] border border-[#d4af37]/50 p-6 rounded-xl max-w-sm w-full relative text-white"
            >
              <div className="flex items-center gap-2 mb-3 text-[#d4af37]">
                <KeyRound className="w-5 h-5" />
                <h3 className="font-serif font-bold text-lg">Reset Password</h3>
              </div>
              <p className="text-xs text-gray-300 mb-4">
                Enter your registered email address and set your new account password.
              </p>

              {resetSuccess && (
                <div className="mb-3 p-2 bg-emerald-950 border border-emerald-500 rounded text-xs text-emerald-200">
                  {resetSuccess}
                </div>
              )}

              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    id="forgot-email-input"
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="w-full px-3 py-2 bg-[#081426] border border-gray-700 rounded text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    New Password
                  </label>
                  <input
                    id="forgot-newpassword-input"
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full px-3 py-2 bg-[#081426] border border-gray-700 rounded text-sm text-white"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="flex-1 py-2 bg-gray-800 text-xs rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    id="forgot-submit-btn"
                    type="submit"
                    className="flex-1 py-2 bg-[#d4af37] text-slate-950 text-xs font-bold rounded hover:bg-[#e2bd46]"
                  >
                    Reset Password
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
