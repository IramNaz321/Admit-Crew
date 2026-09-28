import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  GraduationCap, 
  Mail, 
  Lock, 
  Phone, 
  User, 
  MapPin, 
  Award, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  ArrowRight,
  Heart
} from 'lucide-react';
import { AppUser } from '../types/admissions';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: AppUser, token: string) => void;
  initialMode?: 'login' | 'signup';
  defaultRole?: 'student' | 'staff';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'login',
  defaultRole = 'student'
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [role, setRole] = useState<'student' | 'staff'>(defaultRole);
  const [emailOrPhone, setEmailOrPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // Signup fields
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [staffCode, setStaffCode] = useState<string>('');
  const [targetCountry, setTargetCountry] = useState<string>('UK');
  const [marks, setMarks] = useState<string>('78%');
  const [ielts, setIelts] = useState<string>('6.5');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim() || !password.trim()) {
      setErrorMsg('Please enter both your email/phone and password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone, password, role })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg(data.message);
        setTimeout(() => {
          onAuthSuccess(data.user, data.token);
          onClose();
        }, 500);
      } else {
        setErrorMsg(data.error || 'Login failed. Please verify credentials.');
      }
    } catch (err: any) {
      setErrorMsg('Network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setErrorMsg('All marked fields are required.');
      return;
    }

    if (role === 'staff' && !staffCode.trim()) {
      setErrorMsg('Please enter the Staff Office Access Code (e.g. NOWSHERA2027).');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password,
          role,
          staffCode: staffCode.trim(),
          targetCountry,
          marks,
          ielts
        })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg(data.message);
        setTimeout(() => {
          onAuthSuccess(data.user, data.token);
          onClose();
        }, 500);
      } else {
        setErrorMsg(data.error || 'Registration failed.');
      }
    } catch (err: any) {
      setErrorMsg('Network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (userId: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/auth/quick-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onAuthSuccess(data.user, data.token);
        onClose();
      }
    } catch (err) {
      setErrorMsg('Failed quick login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#08030a]/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-purple-200 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl shadow-purple-950/20 relative my-auto overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-300/20 rounded-full blur-2xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-purple-600 hover:text-purple-950 p-1 rounded-xl hover:bg-purple-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-400/30 text-white font-bold">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-xl text-purple-950 flex items-center gap-1.5">
              <span className="purple-gradient-text">{mode === 'login' ? 'Sign In to AdmitCrew' : 'Create an Account'}</span>
              <Sparkles className="w-4 h-4 text-purple-500" />
            </h3>
            <p className="text-xs text-purple-600">Nowshera Study Abroad Consultants</p>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex bg-purple-100/70 p-1 rounded-2xl border border-purple-200 mb-4">
          <button
            onClick={() => { setMode('login'); setErrorMsg(null); }}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition ${
              mode === 'login' 
                ? 'bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 text-white shadow-md shadow-purple-400/25' 
                : 'text-purple-700 hover:text-purple-950'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            onClick={() => { setMode('signup'); setErrorMsg(null); }}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition ${
              mode === 'signup' 
                ? 'bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 text-white shadow-md shadow-purple-400/25' 
                : 'text-purple-700 hover:text-purple-950'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Sign Up</span>
          </button>
        </div>

        {/* Role Toggle */}
        <div className="flex items-center justify-between bg-purple-50 p-1.5 rounded-2xl border border-purple-200 mb-4 text-xs">
          <span className="text-purple-800 font-medium px-2">Account Role:</span>
          <div className="flex space-x-1">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`px-3 py-1.5 rounded-xl font-medium transition ${
                role === 'student' 
                  ? 'bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 text-white shadow-sm' 
                  : 'text-purple-700 hover:text-purple-950'
              }`}
            >
              Student Applicant
            </button>
            <button
              type="button"
              onClick={() => setRole('staff')}
              className={`px-3 py-1.5 rounded-xl font-medium transition ${
                role === 'staff' 
                  ? 'bg-gradient-to-r from-amber-500 to-purple-600 text-white font-bold shadow-sm' 
                  : 'text-purple-700 hover:text-purple-950'
              }`}
            >
              Counselor / Staff
            </button>
          </div>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="mb-4 bg-rose-50 border border-rose-300 text-rose-900 px-3.5 py-2.5 rounded-2xl text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 bg-emerald-50 border border-emerald-300 text-emerald-900 px-3.5 py-2.5 rounded-2xl text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-purple-900 font-semibold mb-1">
                Email Address or Phone:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-purple-400" />
                <input
                  type="text"
                  required
                  placeholder={role === 'staff' ? 'zahid@nowshera.com' : '0301 2345678 or ali@example.com'}
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="w-full bg-purple-50/60 border border-purple-200 rounded-2xl pl-10 pr-4 py-2.5 text-purple-950 placeholder-purple-400 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-purple-900 font-semibold mb-1">Password:</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-purple-400" />
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-purple-50/60 border border-purple-200 rounded-2xl pl-10 pr-4 py-2.5 text-purple-950 placeholder-purple-400 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 hover:from-purple-400 hover:to-indigo-400 text-white font-bold py-3 rounded-2xl shadow-lg shadow-purple-400/25 transition disabled:opacity-50 flex items-center justify-center space-x-2 mt-2"
            >
              <span>{isLoading ? 'Signing In...' : `Sign In as ${role === 'staff' ? 'Counselor Staff' : 'Student'}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* SIGN UP FORM */
          <form onSubmit={handleSignupSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-purple-900 font-semibold mb-1">Full Name:</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3 text-purple-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariq Mehmood"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-purple-50/60 border border-purple-200 rounded-2xl pl-10 pr-4 py-2.5 text-purple-950 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-purple-900 font-semibold mb-1">Email:</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-purple-400" />
                  <input
                    type="email"
                    required
                    placeholder="tariq@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-purple-50/60 border border-purple-200 rounded-2xl pl-10 pr-4 py-2.5 text-purple-950 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-purple-900 font-semibold mb-1">Phone:</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-3 text-purple-400" />
                  <input
                    type="text"
                    required
                    placeholder="0300 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-purple-50/60 border border-purple-200 rounded-2xl pl-10 pr-4 py-2.5 text-purple-950 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {role === 'staff' ? (
              <div>
                <label className="block text-amber-800 font-semibold mb-1">
                  Staff Office Access Code:
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-3 text-amber-600" />
                  <input
                    type="text"
                    required
                    placeholder="Enter code: NOWSHERA2027"
                    value={staffCode}
                    onChange={(e) => setStaffCode(e.target.value)}
                    className="w-full bg-purple-50/60 border border-amber-400 rounded-2xl pl-10 pr-4 py-2.5 text-purple-950 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <span className="text-[10px] text-purple-600 mt-1 block">
                  Office passkey: <code className="text-amber-700 font-mono font-bold">NOWSHERA2027</code>
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-purple-900 font-semibold mb-1">Target:</label>
                  <select
                    value={targetCountry}
                    onChange={(e) => setTargetCountry(e.target.value)}
                    className="w-full bg-purple-50/60 border border-purple-200 rounded-2xl px-2.5 py-2.5 text-purple-950"
                  >
                    <option value="UK">UK</option>
                    <option value="Canada">Canada</option>
                    <option value="Germany">Germany</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>

                <div>
                  <label className="block text-purple-900 font-semibold mb-1">Marks (%/GPA):</label>
                  <input
                    type="text"
                    placeholder="e.g. 80%"
                    value={marks}
                    onChange={(e) => setMarks(e.target.value)}
                    className="w-full bg-purple-50/60 border border-purple-200 rounded-2xl px-3 py-2.5 text-purple-950"
                  />
                </div>

                <div>
                  <label className="block text-purple-900 font-semibold mb-1">IELTS:</label>
                  <input
                    type="text"
                    placeholder="e.g. 6.5"
                    value={ielts}
                    onChange={(e) => setIelts(e.target.value)}
                    className="w-full bg-purple-50/60 border border-purple-200 rounded-2xl px-3 py-2.5 text-purple-950"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-purple-900 font-semibold mb-1">Password:</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-purple-400" />
                <input
                  type="password"
                  required
                  placeholder="Create password (min 4 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-purple-50/60 border border-purple-200 rounded-2xl pl-10 pr-4 py-2.5 text-purple-950 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 hover:from-purple-400 hover:to-indigo-400 text-white font-bold py-3 rounded-2xl shadow-lg shadow-purple-400/25 transition disabled:opacity-50 flex items-center justify-center space-x-2 mt-2"
            >
              <span>{isLoading ? 'Creating Account...' : `Register ${role === 'staff' ? 'Counselor Staff' : 'Student Account'}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* 1-Click Demo Login Shortcuts */}
        <div className="mt-5 pt-4 border-t border-purple-200">
          <div className="flex items-center space-x-1 text-[11px] font-semibold text-purple-700 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            <span>1-Click Test Accounts:</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-left">
            <button
              type="button"
              onClick={() => handleQuickLogin('user-staff-1')}
              className="p-2.5 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-left transition"
            >
              <div className="text-amber-800 font-bold text-xs truncate">Zahid Khan (Staff)</div>
              <div className="text-[10px] text-purple-600">Head of Admissions</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('user-student-1')}
              className="p-2.5 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-left transition"
            >
              <div className="text-purple-900 font-bold text-xs truncate">Ali Khan (Student)</div>
              <div className="text-[10px] text-purple-600">Active UK Lead • 78%</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('user-student-2')}
              className="p-2.5 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-left transition"
            >
              <div className="text-purple-900 font-bold text-xs truncate">Ayesha Noor (Student)</div>
              <div className="text-[10px] text-purple-600">Canada CS • IELTS 7.0</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('user-student-3')}
              className="p-2.5 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-left transition"
            >
              <div className="text-indigo-900 font-bold text-xs truncate">Hamza Iqbal (Student)</div>
              <div className="text-[10px] text-purple-600">Quiet • Reminder Test</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
