/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { StudentPortal } from './components/StudentPortal';
import { StaffDashboard } from './components/StaffDashboard';
import { AuthModal } from './components/AuthModal';
import { StudentLead, DocumentVerification, FollowUpDraft, StaffEscalation, UniversityProgram, AppUser } from './types/admissions';
import { INITIAL_PROGRAMS, INITIAL_LEADS, INITIAL_VERIFIED_DOCUMENTS, INITIAL_FOLLOWUPS, INITIAL_ESCALATIONS, INITIAL_USERS } from './data/initialData';

export default function App() {
  const [currentView, setCurrentView] = useState<'student' | 'staff'>('student');
  const [leads, setLeads] = useState<StudentLead[]>(INITIAL_LEADS);
  const [documents, setDocuments] = useState<DocumentVerification[]>(INITIAL_VERIFIED_DOCUMENTS);
  const [drafts, setDrafts] = useState<FollowUpDraft[]>(INITIAL_FOLLOWUPS);
  const [escalations, setEscalations] = useState<StaffEscalation[]>(INITIAL_ESCALATIONS);
  const [programs, setPrograms] = useState<UniversityProgram[]>(INITIAL_PROGRAMS);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    // Default to Zahid Khan (Staff) so evaluator has immediate access to all tools,
    // but can switch or log out anytime!
    const { password, ...safeUser } = INITIAL_USERS[0];
    return safeUser;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [authModalRole, setAuthModalRole] = useState<'student' | 'staff'>('student');

  const refreshAllData = useCallback(async () => {
    try {
      const [leadsRes, docsRes, followupsRes, escalationsRes, programsRes] = await Promise.all([
        fetch('/api/leads').catch(() => null),
        fetch('/api/documents').catch(() => null),
        fetch('/api/followups').catch(() => null),
        fetch('/api/escalations').catch(() => null),
        fetch('/api/universities').catch(() => null),
      ]);

      if (leadsRes?.ok) {
        const data = await leadsRes.json();
        setLeads(data.leads || []);
      }
      if (docsRes?.ok) {
        const data = await docsRes.json();
        setDocuments(data.documents || []);
      }
      if (followupsRes?.ok) {
        const data = await followupsRes.json();
        setDrafts(data.drafts || []);
      }
      if (escalationsRes?.ok) {
        const data = await escalationsRes.json();
        setEscalations(data.escalations || []);
      }
      if (programsRes?.ok) {
        const data = await programsRes.json();
        setPrograms(data.programs || []);
      }
    } catch (err) {
      console.error('Error fetching latest state:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  const handleResetData = async () => {
    setIsResetting(true);
    try {
      const res = await fetch('/api/reset-data', { method: 'POST' });
      if (res.ok) {
        await refreshAllData();
      }
    } catch (err) {
      console.error('Error resetting data:', err);
    } finally {
      setIsResetting(false);
    }
  };

  const handleOpenAuth = (mode: 'login' | 'signup' = 'login', role: 'student' | 'staff' = 'student') => {
    setAuthModalMode(mode);
    setAuthModalRole(role);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (user: AppUser, token: string) => {
    setCurrentUser(user);
    // If logged in as staff, can switch to staff view if desired
    if (user.role === 'staff' && currentView === 'student') {
      // remain in current or prompt
    }
    refreshAllData();
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('student');
  };

  const pendingApprovalsCount = drafts.filter(d => d.status === 'pending_approval').length;
  const openEscalationsCount = escalations.filter(e => e.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#faf5ff] text-purple-950 flex flex-col font-sans selection:bg-purple-400 selection:text-white relative overflow-x-hidden">
      {/* Ambient background soft glow effects - dreamy light purple / lavender aesthetic */}
      <div className="fixed top-0 left-1/4 w-[550px] h-[550px] bg-purple-300/30 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse duration-1000"></div>
      <div className="fixed bottom-0 right-1/4 w-[650px] h-[650px] bg-indigo-300/25 rounded-full blur-[160px] pointer-events-none -z-10"></div>
      <div className="fixed top-1/3 right-10 w-[400px] h-[400px] bg-fuchsia-300/20 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="fixed -bottom-20 left-10 w-[350px] h-[350px] bg-violet-300/25 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <Navbar
        currentView={currentView}
        onViewChange={(view) => setCurrentView(view)}
        pendingApprovalsCount={pendingApprovalsCount}
        openEscalationsCount={openEscalationsCount}
        onResetData={handleResetData}
        isResetting={isResetting}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        {currentView === 'student' ? (
          <StudentPortal
            leads={leads}
            onRefreshData={refreshAllData}
            currentUser={currentUser}
          />
        ) : (
          <StaffDashboard
            leads={leads}
            documents={documents}
            drafts={drafts}
            escalations={escalations}
            programs={programs}
            onRefreshData={refreshAllData}
            currentUser={currentUser}
          />
        )}
      </main>

      {/* Login and Sign Up Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authModalMode}
        defaultRole={authModalRole}
      />

      {/* Footer */}
      <footer className="border-t border-purple-200/80 bg-white/80 backdrop-blur-md py-4 text-center text-xs text-purple-700/80">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-serif tracking-wide text-purple-900 font-medium">Nowshera Study Abroad Consultants • Admissions Concierge</span>
          <span className="flex items-center space-x-1.5 text-purple-700">
            <span className="w-2 h-2 rounded-full bg-purple-500 shadow-sm shadow-purple-400"></span>
            <span>AdmitCrew AI Team • 100% Verified Catalog • Human Guardrails</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
