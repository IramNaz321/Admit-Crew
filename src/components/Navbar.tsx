import React, { useState } from 'react';
import { 
  GraduationCap, 
  Bot, 
  ShieldCheck, 
  FileCheck2, 
  RotateCcw, 
  Users, 
  MessageSquareText, 
  LogIn,
  UserCheck,
  LogOut,
  ChevronDown,
  Database,
  Sparkles,
  Heart
} from 'lucide-react';
import { AppUser } from '../types/admissions';
import { SqliteStatusModal } from './SqliteStatusModal';

interface NavbarProps {
  currentView: 'student' | 'staff';
  onViewChange: (view: 'student' | 'staff') => void;
  pendingApprovalsCount: number;
  openEscalationsCount: number;
  onResetData: () => void;
  isResetting: boolean;
  currentUser: AppUser | null;
  onOpenAuth: (mode?: 'login' | 'signup', role?: 'student' | 'staff') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  pendingApprovalsCount,
  openEscalationsCount,
  onResetData,
  isResetting,
  currentUser,
  onOpenAuth,
  onLogout
}) => {
  const [isSqliteModalOpen, setIsSqliteModalOpen] = useState<boolean>(false);
  const isStaff = currentUser?.role === 'staff';

  const handleStaffViewClick = () => {
    if (!currentUser) {
      onOpenAuth('login', 'staff');
      return;
    }
    if (currentUser.role === 'student') {
      onOpenAuth('login', 'staff');
      return;
    }
    onViewChange('staff');
  };

  return (
    <header className="bg-white/90 backdrop-blur-xl text-purple-950 border-b border-purple-200/80 sticky top-0 z-50 shadow-sm shadow-purple-900/5">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo & Office Branding */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-purple-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-purple-400/25 text-white font-bold shrink-0">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="font-serif font-bold text-base sm:text-lg tracking-tight text-purple-950 flex items-center gap-1.5">
                  <span className="purple-gradient-text">AdmitCrew</span>
                  <Sparkles className="w-3.5 h-3.5 text-purple-500 fill-purple-500/20" />
                </span>
                <span className="text-[10px] sm:text-xs bg-purple-100 text-purple-700 font-semibold px-2.5 py-0.5 rounded-full border border-purple-200">
                  Admissions Concierge
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-purple-600/80 truncate max-w-[150px] sm:max-w-none">
                Nowshera Study Abroad Consultants
              </p>
            </div>
          </div>

          {/* Active AI Agent Status Badges (Desktop) */}
          <div className="hidden xl:flex items-center space-x-2 bg-purple-50/80 px-3.5 py-1.5 rounded-full border border-purple-200/70 text-xs">
            <div className="flex items-center space-x-1.5 text-purple-800">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
              <span className="font-medium text-purple-800">AI Agents:</span>
            </div>
            <span className="inline-flex items-center space-x-1 bg-white text-purple-700 px-2 py-0.5 rounded-md border border-purple-200/70">
              <Bot className="w-3 h-3 text-purple-500" />
              <span>Intake</span>
            </span>
            <span className="inline-flex items-center space-x-1 bg-white text-purple-700 px-2 py-0.5 rounded-md border border-purple-200/70">
              <GraduationCap className="w-3 h-3 text-purple-500" />
              <span>Catalog Advisor</span>
            </span>
            <span className="inline-flex items-center space-x-1 bg-white text-purple-700 px-2 py-0.5 rounded-md border border-purple-200/70">
              <FileCheck2 className="w-3 h-3 text-purple-500" />
              <span>Doc Auditor</span>
            </span>
            <span className="inline-flex items-center space-x-1 bg-purple-200/60 text-purple-900 px-2 py-0.5 rounded-md border border-purple-300">
              <ShieldCheck className="w-3 h-3 text-purple-600" />
              <span>Human Guardrail</span>
            </span>
          </div>

          {/* Dual Experience Switcher & User Account Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* View Switcher */}
            <div className="bg-purple-100/70 p-0.5 sm:p-1 rounded-2xl flex items-center border border-purple-200/80 shadow-inner">
              <button
                onClick={() => onViewChange('student')}
                className={`flex items-center space-x-1 sm:space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  currentView === 'student'
                    ? 'bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 text-white shadow-md shadow-purple-400/25'
                    : 'text-purple-700 hover:text-purple-950'
                }`}
              >
                <MessageSquareText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="inline">Chat</span>
                <span className="hidden sm:inline">Portal</span>
              </button>

              <button
                onClick={handleStaffViewClick}
                className={`relative flex items-center space-x-1 sm:space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  currentView === 'staff'
                    ? 'bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 text-white shadow-md shadow-purple-400/25'
                    : 'text-purple-700 hover:text-purple-950'
                }`}
                title={!isStaff ? 'Requires Counselor Staff login' : 'Staff Command CRM'}
              >
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="inline">Staff</span>
                <span className="hidden sm:inline">CRM</span>
                {pendingApprovalsCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 bg-purple-200 text-purple-900 font-bold text-[10px] rounded-full">
                    {pendingApprovalsCount}
                  </span>
                )}
                {openEscalationsCount > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.2 bg-purple-600 text-white font-bold text-[10px] rounded-full shadow-sm">
                    {openEscalationsCount}
                  </span>
                )}
              </button>
            </div>

            {/* Auth / User Pill */}
            {currentUser ? (
              <div className="flex items-center space-x-1 sm:space-x-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="flex items-center space-x-1.5 bg-purple-50 hover:bg-purple-100 px-2.5 sm:px-3 py-1.5 rounded-2xl border border-purple-200 text-xs transition text-purple-950"
                  title="Switch user account"
                >
                  <div className={`w-2 h-2 rounded-full ${currentUser.role === 'staff' ? 'bg-amber-500' : 'bg-purple-500'}`}></div>
                  <span className="font-semibold text-purple-950 hidden sm:inline truncate max-w-[100px]">
                    {currentUser.name}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full uppercase ${
                    currentUser.role === 'staff' ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {currentUser.role}
                  </span>
                </button>

                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 hover:text-purple-950 border border-purple-200 transition"
                  title="Log Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 hover:from-purple-400 hover:to-indigo-400 text-white text-xs font-bold transition shadow-md shadow-purple-400/25"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Log In</span>
                </button>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-semibold border border-purple-200 transition"
                >
                  <span>Sign Up</span>
                </button>
              </div>
            )}

            {/* SQLite3 Database Status Pill */}
            <button
              onClick={() => setIsSqliteModalOpen(true)}
              title="View SQLite 3 Database Status & Row Counts"
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 hover:text-purple-950 text-xs transition"
            >
              <Database className="w-3.5 h-3.5 text-purple-600" />
              <span className="hidden sm:inline font-mono font-bold text-[11px]">SQLite3</span>
            </button>

            {/* Reset data */}
            <button
              onClick={onResetData}
              disabled={isResetting}
              title="Reset data to initial test state in SQLite3"
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 hover:text-purple-950 text-xs transition"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* SQLite3 Status Modal */}
      <SqliteStatusModal
        isOpen={isSqliteModalOpen}
        onClose={() => setIsSqliteModalOpen(false)}
      />
    </header>
  );
};
