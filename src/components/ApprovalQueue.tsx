import React, { useState } from 'react';
import { 
  BellRing, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Send, 
  Edit3, 
  ShieldCheck, 
  AlertCircle,
  RefreshCw,
  User,
  Phone,
  Sparkles,
  Heart
} from 'lucide-react';
import { FollowUpDraft } from '../types/admissions';

interface ApprovalQueueProps {
  drafts: FollowUpDraft[];
  onRefreshData: () => void;
  currentUser?: any;
}

export const ApprovalQueue: React.FC<ApprovalQueueProps> = ({ drafts, onRefreshData, currentUser }) => {
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const pendingDrafts = drafts.filter(d => d.status === 'pending_approval');
  const pastDrafts = drafts.filter(d => d.status !== 'pending_approval');

  const handleStartEdit = (draft: FollowUpDraft) => {
    setEditingDraftId(draft.id);
    setEditedText(draft.message);
  };

  const handleScanLeads = async () => {
    setIsScanning(true);
    setActionFeedback(null);
    try {
      const res = await fetch('/api/followups/scan', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setActionFeedback(data.message);
        onRefreshData();
      }
    } catch (err) {
      console.error('Error scanning leads:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleApprove = async (draftId: string, customMessage?: string) => {
    setIsProcessing(true);
    setActionFeedback(null);
    try {
      const res = await fetch(`/api/followups/${draftId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          editedMessage: customMessage || (editingDraftId === draftId ? editedText : undefined),
          staffName: currentUser?.name ? `${currentUser.name} (Counselor)` : 'Zahid Khan (Senior Counselor)'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setActionFeedback(data.message);
        setEditingDraftId(null);
        onRefreshData();
      }
    } catch (err) {
      console.error('Error approving draft:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (draftId: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/followups/${draftId}/reject`, { method: 'POST' });
      if (res.ok) {
        setActionFeedback('Draft discarded.');
        setEditingDraftId(null);
        onRefreshData();
      }
    } catch (err) {
      console.error('Error rejecting draft:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Office Policy Notice Banner */}
      <div className="bg-white border border-purple-200 rounded-3xl p-6 text-purple-950 shadow-xl shadow-purple-950/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-56 h-56 bg-purple-300/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="flex items-start space-x-3.5">
            <div className="p-3 rounded-2xl bg-purple-100 text-purple-700 border border-purple-200 shrink-0 shadow-sm">
              <ShieldCheck className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-purple-950 flex items-center gap-2">
                <span className="purple-gradient-text">Human-in-the-Loop Follow-Up Authorization</span>
                <Sparkles className="w-4 h-4 text-purple-600" />
              </h3>
              <p className="text-xs sm:text-sm text-purple-800/80 mt-1 max-w-2xl leading-relaxed">
                Strict Office Policy: The Reminder Agent monitors quiet students (e.g., Hamza Iqbal, 4 days inactive) and drafts messages, but <strong>no message is ever sent without explicit staff approval</strong>. Once you approve, it is dispatched once and logged in their chat history.
              </p>
            </div>
          </div>

          <button
            onClick={handleScanLeads}
            disabled={isScanning}
            className="self-start md:self-center flex items-center space-x-2 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 hover:from-purple-400 hover:to-indigo-400 disabled:opacity-50 text-white font-bold px-5 py-3 rounded-2xl text-xs transition shadow-lg shadow-purple-400/25"
          >
            <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning Inactive Students...' : 'Run Reminder Agent Scan'}</span>
          </button>
        </div>
      </div>

      {actionFeedback && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-2xl text-xs flex items-center space-x-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Pending Approval Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-serif font-bold text-purple-950">Pending Approval Queue</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
              {pendingDrafts.length} Waiting
            </span>
          </div>
          <span className="text-xs text-purple-700/80">Review, modify, or approve messages before dispatch</span>
        </div>

        {pendingDrafts.length === 0 ? (
          <div className="bg-white border border-purple-200 rounded-3xl p-8 text-center text-purple-700/80 shadow-lg shadow-purple-950/5">
            <CheckCircle2 className="w-10 h-10 text-purple-500 mx-auto mb-2 opacity-80" />
            <h4 className="text-purple-950 font-serif font-semibold text-base">All Follow-Up Reminders Processed</h4>
            <p className="text-xs text-purple-700 mt-1 max-w-sm mx-auto">
              No messages waiting for approval. Click "Run Reminder Agent Scan" to check for newly inactive students.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingDrafts.map((draft) => {
              const isEditing = editingDraftId === draft.id;

              return (
                <div
                  key={draft.id}
                  className="bg-white border border-purple-200 hover:border-purple-300 rounded-3xl p-6 shadow-xl shadow-purple-950/5 relative overflow-hidden transition"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-purple-500 to-indigo-600"></div>

                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <User className="w-4 h-4 text-purple-600" />
                        <h4 className="font-serif font-bold text-purple-950 text-base">{draft.studentName}</h4>
                        <span className="text-xs font-mono text-purple-600 flex items-center space-x-1">
                          <Phone className="w-3 h-3" />
                          <span>{draft.studentPhone}</span>
                        </span>
                        <span className="text-xs bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full font-medium border border-purple-200">
                          Target: {draft.targetCountry}
                        </span>
                      </div>
                      <div className="text-xs text-purple-700 mt-1.5 flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-purple-500" />
                        <span>AI Trigger Reason: {draft.reason}</span>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200 self-start">
                      Pending Staff Approval
                    </span>
                  </div>

                  {/* Message Body or Editor */}
                  {isEditing ? (
                    <div className="space-y-2 mt-3">
                      <label className="text-xs font-semibold text-purple-900">Edit Proposed WhatsApp Message:</label>
                      <textarea
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        rows={4}
                        className="w-full bg-purple-50/60 border border-purple-200 rounded-2xl p-3.5 text-xs text-purple-950 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setEditingDraftId(null)}
                          className="px-3 py-1.5 rounded-xl text-xs text-purple-700 hover:text-purple-950"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleApprove(draft.id, editedText)}
                          disabled={isProcessing}
                          className="px-4 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 text-white shadow-md shadow-purple-400/20"
                        >
                          Save & Approve
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-purple-50/70 border border-purple-100 rounded-2xl p-4 mt-2">
                      <p className="text-xs text-purple-950 leading-relaxed font-sans">{draft.message}</p>
                    </div>
                  )}

                  {/* Actions Footer */}
                  {!isEditing && (
                    <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3.5 border-t border-purple-100">
                      <span className="text-[11px] text-purple-600/80">
                        Drafted: {new Date(draft.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Not dispatched yet
                      </span>

                      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => handleStartEdit(draft)}
                          className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-medium border border-purple-200 transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleReject(draft.id)}
                          disabled={isProcessing}
                          className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-medium border border-rose-200 transition"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Discard</span>
                        </button>

                        <button
                          onClick={() => handleApprove(draft.id)}
                          disabled={isProcessing}
                          className="w-full sm:w-auto flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 hover:from-purple-400 hover:to-indigo-400 text-white text-xs font-bold shadow-lg shadow-purple-400/25 transition"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve & Send Once</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Past Follow-ups / Sent Log */}
      {pastDrafts.length > 0 && (
        <div className="mt-8 pt-6 border-t border-purple-200">
          <h4 className="text-sm font-serif font-bold text-purple-950 mb-3">Recently Dispatched / Approved Reminders</h4>
          <div className="space-y-3">
            {pastDrafts.map((draft) => (
              <div
                key={draft.id}
                className="bg-white border border-purple-200 rounded-2xl p-4 text-xs text-purple-950 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-purple-950">{draft.studentName}</span>
                    <span className="text-purple-600 font-mono">({draft.studentPhone})</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                      SENT (APPROVED ONCE)
                    </span>
                  </div>
                  <p className="text-purple-700 text-[11px] mt-1 line-clamp-1 italic">"{draft.message}"</p>
                </div>
                <div className="text-right text-[11px] text-purple-600 shrink-0">
                  <div>Approved by: <strong className="text-purple-950">{draft.approvedBy || 'Staff'}</strong></div>
                  <div>Sent: {draft.sentAt ? new Date(draft.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
