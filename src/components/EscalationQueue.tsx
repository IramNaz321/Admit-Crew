import React, { useState } from 'react';
import { 
  AlertCircle, 
  Send, 
  CheckCircle2, 
  HelpCircle, 
  User, 
  Phone, 
  Clock,
  Sparkles,
  Heart
} from 'lucide-react';
import { StaffEscalation } from '../types/admissions';

interface EscalationQueueProps {
  escalations: StaffEscalation[];
  onRefreshData: () => void;
  currentUser?: any;
}

export const EscalationQueue: React.FC<EscalationQueueProps> = ({ escalations, onRefreshData, currentUser }) => {
  const [selectedEscalationId, setSelectedEscalationId] = useState<string | null>(null);
  const [staffReplyText, setStaffReplyText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const pendingEscalations = escalations.filter(e => e.status === 'pending');
  const answeredEscalations = escalations.filter(e => e.status === 'answered');

  const handleReply = async (id: string) => {
    if (!staffReplyText.trim()) return;

    setIsSubmitting(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/escalations/${id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answer: staffReplyText,
          staffName: currentUser?.name ? `${currentUser.name} (Admissions)` : 'Zahid Khan (Head of Admissions)'
        })
      });

      if (res.ok) {
        setFeedback('Response sent directly to student chat.');
        setSelectedEscalationId(null);
        setStaffReplyText('');
        onRefreshData();
      }
    } catch (err) {
      console.error('Error replying to escalation:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white border border-purple-200 rounded-3xl p-6 shadow-xl shadow-purple-950/5 flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-56 h-56 bg-purple-300/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Human Escalation Desk</span>
            </span>
            <span className="text-xs text-purple-600/80 font-medium">Strict Knowledge Boundary Fail-Safe</span>
          </div>
          <h3 className="text-2xl font-serif font-bold text-purple-950 mt-2 flex items-center gap-2">
            <span className="purple-gradient-text">Unlisted Inquiries & Escalations</span>
            <Heart className="w-4 h-4 text-purple-500 fill-purple-500/20 hidden sm:inline" />
          </h3>
          <p className="text-xs sm:text-sm text-purple-800/80 mt-1 max-w-2xl leading-relaxed">
            When students ask about universities outside Nowshera's partner catalog (e.g. Harvard, Stanford, Oxford), the AI agent refuses to hallucinate, informs the student, and generates an escalation ticket here for human counselors to resolve.
          </p>
        </div>

        <div className="text-right self-start md:self-center shrink-0 relative z-10">
          <div className="text-3xl font-serif font-bold text-purple-800">{pendingEscalations.length}</div>
          <div className="text-xs text-purple-600 font-medium">Pending Escalations</div>
        </div>
      </div>

      {feedback && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-2xl text-xs flex items-center space-x-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Pending Escalations */}
      <div className="space-y-4">
        <h4 className="text-lg font-serif font-bold text-purple-950">Pending Student Questions ({pendingEscalations.length})</h4>

        {pendingEscalations.length === 0 ? (
          <div className="bg-white border border-purple-200 rounded-3xl p-8 text-center text-purple-700/80 shadow-lg shadow-purple-950/5">
            <CheckCircle2 className="w-10 h-10 text-purple-500 mx-auto mb-2 opacity-80" />
            <h5 className="text-purple-950 font-serif font-semibold text-base">All Escalated Inquiries Handled</h5>
            <p className="text-xs text-purple-700 mt-1">
              No questions waiting for human staff.
            </p>
          </div>
        ) : (
          pendingEscalations.map((esc) => {
            const isReplying = selectedEscalationId === esc.id;

            return (
              <div
                key={esc.id}
                className="bg-white border border-purple-200 hover:border-purple-300 rounded-3xl p-6 shadow-xl shadow-purple-950/5 transition"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-2">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-purple-600" />
                    <span className="font-serif font-bold text-purple-950 text-base">{esc.studentName}</span>
                    <span className="text-xs font-mono text-purple-600">({esc.studentPhone})</span>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200 self-start">
                    Needs Staff Response
                  </span>
                </div>

                <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-100 text-xs text-purple-950 mt-2">
                  <div className="text-[11px] text-purple-700 font-semibold mb-1">Student Inquiry:</div>
                  <p className="font-sans text-sm italic leading-relaxed">"{esc.question}"</p>
                  <div className="text-[10px] text-purple-600 mt-2 font-mono">
                    Trigger: {esc.reason}
                  </div>
                </div>

                {isReplying ? (
                  <div className="mt-3.5 space-y-2">
                    <label className="text-xs font-semibold text-purple-900">
                      Counselor Official Response (will be posted to student WhatsApp):
                    </label>
                    <textarea
                      value={staffReplyText}
                      onChange={(e) => setStaffReplyText(e.target.value)}
                      placeholder="e.g. Nowshera Consultants can arrange bespoke direct applications to this university. Please schedule a 1-on-1 session with our team..."
                      rows={3}
                      className="w-full bg-purple-50/60 border border-purple-200 rounded-2xl p-3.5 text-xs text-purple-950 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setSelectedEscalationId(null)}
                        className="px-3.5 py-1.5 rounded-xl text-xs text-purple-700 hover:text-purple-950"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleReply(esc.id)}
                        disabled={isSubmitting || !staffReplyText.trim()}
                        className="px-4 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 hover:from-purple-400 hover:to-indigo-400 text-white flex items-center space-x-1.5 shadow-md shadow-purple-400/20"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send to Student</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-purple-100">
                    <span className="text-[11px] text-purple-600">
                      Received: {new Date(esc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedEscalationId(esc.id);
                        setStaffReplyText(`Nowshera Study Abroad Consultants can assist you with special applications for this university. Our senior counselor is available for a personalized consultation.`);
                      }}
                      className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 hover:from-purple-400 hover:to-indigo-400 text-white font-semibold text-xs shadow-md shadow-purple-400/20 transition"
                    >
                      Answer Question
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Answered Escalations */}
      {answeredEscalations.length > 0 && (
        <div className="mt-8 pt-6 border-t border-purple-200">
          <h4 className="text-sm font-serif font-bold text-purple-950 mb-3">Resolved Escalations</h4>
          <div className="space-y-3">
            {answeredEscalations.map((esc) => (
              <div key={esc.id} className="bg-white border border-purple-200 rounded-2xl p-4 text-xs text-purple-950 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-purple-950 text-sm">{esc.studentName} ({esc.studentPhone})</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                    RESOLVED BY STAFF
                  </span>
                </div>
                <div className="text-purple-700 mt-1 italic">Q: "{esc.question}"</div>
                <div className="text-purple-900 mt-2 bg-purple-50/70 p-3 rounded-xl border border-purple-100">
                  Staff Reply: {esc.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
