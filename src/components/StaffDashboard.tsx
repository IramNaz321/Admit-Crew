import React, { useState } from 'react';
import { 
  Users, 
  FileCheck2, 
  BellRing, 
  GraduationCap, 
  MessageSquare, 
  AlertCircle, 
  CheckSquare2,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Heart
} from 'lucide-react';
import { StudentLead, DocumentVerification, FollowUpDraft, StaffEscalation, UniversityProgram, AppUser } from '../types/admissions';
import { LeadsCRM } from './LeadsCRM';
import { ApprovalQueue } from './ApprovalQueue';
import { DocumentAuditCenter } from './DocumentAuditCenter';
import { UniversityCatalog } from './UniversityCatalog';
import { EscalationQueue } from './EscalationQueue';
import { ChatAuditViewer } from './ChatAuditViewer';
import { AutomatedTestRunner } from './AutomatedTestRunner';

interface StaffDashboardProps {
  leads: StudentLead[];
  documents: DocumentVerification[];
  drafts: FollowUpDraft[];
  escalations: StaffEscalation[];
  programs: UniversityProgram[];
  onRefreshData: () => void;
  initialTab?: string;
  currentUser?: AppUser | null;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  leads,
  documents,
  drafts,
  escalations,
  programs,
  onRefreshData,
  initialTab = 'leads',
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [selectedLeadPhoneForChat, setSelectedLeadPhoneForChat] = useState<string | undefined>(undefined);

  const pendingApprovalsCount = drafts.filter(d => d.status === 'pending_approval').length;
  const problemDocsCount = documents.filter(d => d.status === 'PROBLEM').length;
  const pendingEscalationsCount = escalations.filter(e => e.status === 'pending').length;

  const handleOpenChat = (phone: string) => {
    setSelectedLeadPhoneForChat(phone);
    setActiveTab('chats');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Office Command Header with Dreamy Light Purple Styling */}
      <div className="bg-white border border-purple-200 rounded-3xl p-6 shadow-xl shadow-purple-950/5 relative overflow-hidden">
        {/* Glow orb */}
        <div className="absolute top-0 right-10 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Counselor Control Center</span>
              </span>
              <span className="text-xs text-purple-600/80 font-medium">Nowshera Study Abroad Consultants</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-purple-950 mt-2 tracking-tight flex items-center gap-2">
              <span className="purple-gradient-text">Admissions Command & CRM</span>
              <Heart className="w-5 h-5 text-purple-500 fill-purple-500/20 hidden sm:inline" />
            </h2>
            <p className="text-xs sm:text-sm text-purple-800/80 mt-1 max-w-2xl leading-relaxed">
              Monitor everything the AI agents do 24/7. Review newly captured leads, inspect document verification verdicts, authorize follow-up reminders, and resolve questions passed by the agents.
            </p>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
            <div className="bg-purple-50/70 p-3.5 rounded-2xl border border-purple-100 text-center shadow-sm">
              <div className="text-xl font-serif font-bold text-purple-950">{leads.length}</div>
              <div className="text-[10px] text-purple-700/80 uppercase font-semibold tracking-wider mt-0.5">Saved Leads</div>
            </div>

            <div className="bg-purple-50/70 p-3.5 rounded-2xl border border-purple-100 text-center shadow-sm">
              <div className="text-xl font-serif font-bold text-amber-700">{pendingApprovalsCount}</div>
              <div className="text-[10px] text-amber-800/80 uppercase font-semibold tracking-wider mt-0.5">Approvals Due</div>
            </div>

            <div className="bg-purple-50/70 p-3.5 rounded-2xl border border-purple-100 text-center shadow-sm">
              <div className="text-xl font-serif font-bold text-rose-600">{problemDocsCount}</div>
              <div className="text-[10px] text-rose-700/80 uppercase font-semibold tracking-wider mt-0.5">Doc Problems</div>
            </div>

            <div className="bg-purple-50/70 p-3.5 rounded-2xl border border-purple-100 text-center shadow-sm">
              <div className="text-xl font-serif font-bold text-indigo-700">{pendingEscalationsCount}</div>
              <div className="text-[10px] text-indigo-700/80 uppercase font-semibold tracking-wider mt-0.5">Escalations</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-6 pt-5 border-t border-purple-200/80 text-xs font-semibold overflow-x-auto no-scrollbar pb-1 max-w-full">
          <button
            onClick={() => setActiveTab('leads')}
            className={`flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl shrink-0 whitespace-nowrap transition ${
              activeTab === 'leads'
                ? 'bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 text-white shadow-md shadow-purple-400/25'
                : 'text-purple-700 hover:text-purple-950 hover:bg-purple-50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Leads CRM ({leads.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('approval')}
            className={`relative flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl shrink-0 whitespace-nowrap transition ${
              activeTab === 'approval'
                ? 'bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 text-white font-bold shadow-md shadow-purple-400/25'
                : 'text-purple-700 hover:text-purple-950 hover:bg-purple-50'
            }`}
          >
            <BellRing className="w-4 h-4" />
            <span>Approval Queue</span>
            {pendingApprovalsCount > 0 && (
              <span className="px-1.5 py-0.2 bg-purple-200 text-purple-900 font-bold text-[10px] rounded-full">
                {pendingApprovalsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl shrink-0 whitespace-nowrap transition ${
              activeTab === 'documents'
                ? 'bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 text-white shadow-md shadow-purple-400/25'
                : 'text-purple-700 hover:text-purple-950 hover:bg-purple-50'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Document Audit ({documents.length})</span>
            {problemDocsCount > 0 && (
              <span className="px-1.5 py-0.2 bg-rose-500 text-white font-bold text-[10px] rounded-full shadow-sm">
                {problemDocsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('chats')}
            className={`flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl shrink-0 whitespace-nowrap transition ${
              activeTab === 'chats'
                ? 'bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 text-white shadow-md shadow-purple-400/25'
                : 'text-purple-700 hover:text-purple-950 hover:bg-purple-50'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Live Chats & Agent Audit</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl shrink-0 whitespace-nowrap transition ${
              activeTab === 'catalog'
                ? 'bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 text-white shadow-md shadow-purple-400/25'
                : 'text-purple-700 hover:text-purple-950 hover:bg-purple-50'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>University Catalog ({programs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('escalations')}
            className={`flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl shrink-0 whitespace-nowrap transition ${
              activeTab === 'escalations'
                ? 'bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 text-white shadow-md shadow-purple-400/25'
                : 'text-purple-700 hover:text-purple-950 hover:bg-purple-50'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            <span>Escalations ({pendingEscalationsCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('tests')}
            className={`flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl shrink-0 whitespace-nowrap ml-auto transition ${
              activeTab === 'tests'
                ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white font-bold shadow-md shadow-purple-400/30'
                : 'text-purple-700 hover:text-purple-950 hover:bg-purple-50 border border-purple-200'
            }`}
          >
            <CheckSquare2 className="w-4 h-4" />
            <span>Automated 7-Test Suite</span>
          </button>
        </div>
      </div>

      {/* Main Tab View Content */}
      <div className="transition-all">
        {activeTab === 'leads' && (
          <LeadsCRM leads={leads} onRefreshData={onRefreshData} onOpenChatWithLead={handleOpenChat} />
        )}

        {activeTab === 'approval' && (
          <ApprovalQueue
            drafts={drafts}
            onRefreshData={onRefreshData}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'documents' && (
          <DocumentAuditCenter
            documents={documents}
            onRefreshData={onRefreshData}
          />
        )}

        {activeTab === 'chats' && (
          <ChatAuditViewer
            leads={leads}
            initialPhone={selectedLeadPhoneForChat}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'catalog' && (
          <UniversityCatalog programs={programs} />
        )}

        {activeTab === 'escalations' && (
          <EscalationQueue
            escalations={escalations}
            onRefreshData={onRefreshData}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'tests' && (
          <AutomatedTestRunner
            leads={leads}
            documents={documents}
            drafts={drafts}
            escalations={escalations}
            onRefreshData={onRefreshData}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}
      </div>
    </div>
  );
};
