import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  User, 
  Bot, 
  Send, 
  Info, 
  Phone, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2,
  Heart
} from 'lucide-react';
import { StudentLead, ChatMessage } from '../types/admissions';

interface ChatAuditViewerProps {
  leads: StudentLead[];
  onRefreshData?: () => void;
  initialPhone?: string;
  currentUser?: any;
}

export const ChatAuditViewer: React.FC<ChatAuditViewerProps> = ({
  leads,
  onRefreshData,
  initialPhone
}) => {
  const [selectedPhone, setSelectedPhone] = useState<string>(
    initialPhone || (leads[0]?.phone || '0301 2345678')
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [staffInput, setStaffInput] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);

  useEffect(() => {
    if (initialPhone) {
      setSelectedPhone(initialPhone);
    }
  }, [initialPhone]);

  const fetchChat = async (phone: string) => {
    try {
      const res = await fetch(`/api/chats/${encodeURIComponent(phone)}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.history || []);
      }
    } catch (err) {
      console.error('Error fetching chat:', err);
    }
  };

  useEffect(() => {
    fetchChat(selectedPhone);
  }, [selectedPhone]);

  const activeLead = leads.find(l => l.phone.replace(/\s+/g, '') === selectedPhone.replace(/\s+/g, ''));

  const handleStaffSend = async () => {
    if (!staffInput.trim()) return;

    setIsSending(true);
    try {
      // Send directly as staff message
      await fetch(`/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `[STAFF COUNSELOR NOTE]: ${staffInput}`,
          studentPhone: selectedPhone,
          studentName: activeLead?.name || 'Applicant'
        })
      });

      setStaffInput('');
      await fetchChat(selectedPhone);
      onRefreshData?.();
    } catch (err) {
      console.error('Error sending staff message:', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6 lg:h-[720px]">
      {/* Mobile Horizontal Student Switcher (< lg) */}
      <div className="lg:hidden bg-white border border-purple-200 rounded-3xl p-3.5 shadow-md">
        <div className="text-xs font-semibold text-purple-700 mb-2">Select Student to Audit:</div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {leads.map((lead) => {
            const isSelected = lead.phone.replace(/\s+/g, '') === selectedPhone.replace(/\s+/g, '');
            return (
              <button
                key={lead.id}
                onClick={() => setSelectedPhone(lead.phone)}
                className={`px-3 py-2 rounded-2xl text-left shrink-0 transition border ${
                  isSelected
                    ? 'bg-purple-100 border-purple-400 text-purple-950 shadow-sm'
                    : 'bg-purple-50/60 border-purple-200 text-purple-700'
                }`}
              >
                <div className="font-serif font-bold text-xs">{lead.name}</div>
                <div className="text-[10px] text-purple-600 font-mono">{lead.country} • {lead.marks}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop Student List (4 cols) */}
      <div className="hidden lg:flex lg:col-span-4 bg-white border border-purple-200 rounded-3xl flex-col overflow-hidden shadow-xl shadow-purple-950/5 h-full">
        <div className="p-4 sm:p-5 bg-purple-50/80 border-b border-purple-200">
          <h4 className="font-serif font-bold text-purple-950 text-base">Active Student Conversations</h4>
          <p className="text-xs text-purple-700 mt-0.5">Click to audit chat history</p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-purple-100 p-2 space-y-1">
          {leads.map((lead) => {
            const isSelected = lead.phone.replace(/\s+/g, '') === selectedPhone.replace(/\s+/g, '');

            return (
              <button
                key={lead.id}
                onClick={() => setSelectedPhone(lead.phone)}
                className={`w-full text-left p-3.5 rounded-2xl transition ${
                  isSelected
                    ? 'bg-purple-100/80 border border-purple-400 shadow-sm'
                    : 'hover:bg-purple-50/70 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-purple-950 text-sm">{lead.name}</span>
                  <span className="text-[10px] bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full font-mono border border-purple-200">
                    {lead.country}
                  </span>
                </div>
                <div className="text-xs text-purple-700 flex items-center space-x-1 mt-1">
                  <Phone className="w-3 h-3 text-purple-500" />
                  <span className="font-mono">{lead.phone}</span>
                </div>
                <div className="text-[11px] text-purple-600/90 mt-1 flex items-center justify-between">
                  <span>Marks: {lead.marks} • IELTS: {lead.ielts}</span>
                  <span className={lead.lastReplyDaysAgo >= 2 ? 'text-amber-700 font-semibold' : 'text-purple-600/70'}>
                    {lead.lastReply}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Transcript (8 cols) */}
      <div className="lg:col-span-8 bg-white border border-purple-200 rounded-3xl flex flex-col overflow-hidden shadow-xl shadow-purple-950/5 h-[540px] sm:h-[620px] lg:h-full">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-purple-50/80 border-b border-purple-200 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-serif font-bold text-purple-950 text-base">{activeLead?.name || 'Selected Student'}</h4>
              <span className="text-xs font-mono bg-purple-100 text-purple-900 px-2 py-0.5 rounded-md border border-purple-200">
                {selectedPhone}
              </span>
            </div>
            <p className="text-xs text-purple-700 mt-0.5">
              Target: <strong className="text-purple-950">{activeLead?.country}</strong> • Status:{' '}
              <strong className="text-purple-800 uppercase">{activeLead?.status}</strong>
            </p>
          </div>

          <div className="text-xs text-purple-800 flex items-center space-x-1.5 bg-white px-3 py-1.5 rounded-xl border border-purple-200 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
            <span>Staff Audit Mode</span>
          </div>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-gradient-to-b from-[#faf5ff]/80 to-[#f5edfd]/50">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-purple-700/60 text-xs">
              No chat messages found for this phone number.
            </div>
          ) : (
            messages.map((msg) => {
              const isStudent = msg.sender === 'student';
              const isStaff = msg.sender === 'staff';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isStudent ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center space-x-1.5 mb-1.5 text-[11px] text-purple-700/70 px-1">
                    {isStudent ? (
                      <>
                        <User className="w-3 h-3 text-purple-600" />
                        <span className="font-semibold text-purple-900">{msg.studentName || 'Student'}</span>
                      </>
                    ) : isStaff ? (
                      <span className="px-2 py-0.5 rounded-md bg-purple-200 text-purple-950 font-bold border border-purple-300">
                        HUMAN COUNSELOR
                      </span>
                    ) : (
                      <>
                        <Bot className="w-3.5 h-3.5 text-purple-600" />
                        <span className="font-semibold text-purple-800">
                          AdmitCrew AI ({msg.agentRole || 'Advisor'})
                        </span>
                      </>
                    )}
                    <span>•</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <div
                    className={`max-w-[85%] rounded-3xl px-4 sm:px-5 py-3.5 text-sm leading-relaxed shadow-md whitespace-pre-line ${
                      isStudent
                        ? 'bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 text-white rounded-tr-none shadow-purple-400/20'
                        : isStaff
                        ? 'bg-purple-100 text-purple-950 border border-purple-300 rounded-tl-none'
                        : 'bg-white text-purple-950 border border-purple-200 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Staff Direct Intervention Input */}
        <div className="p-3.5 sm:p-4 bg-purple-50/80 border-t border-purple-200 flex items-center space-x-2.5">
          <input
            type="text"
            value={staffInput}
            onChange={(e) => setStaffInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleStaffSend()}
            placeholder="Intervene as Human Staff Counselor (send directly to student)..."
            className="flex-1 bg-white border border-purple-200 text-purple-950 placeholder-purple-400 text-xs px-4 py-3 rounded-2xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          />
          <button
            onClick={handleStaffSend}
            disabled={isSending || !staffInput.trim()}
            className="bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 hover:from-purple-400 hover:to-indigo-400 disabled:opacity-50 text-white font-semibold text-xs px-5 py-3 rounded-2xl flex items-center space-x-2 transition shadow-lg shadow-purple-400/25"
          >
            <span>Intervene</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
