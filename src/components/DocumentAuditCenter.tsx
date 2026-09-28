import React, { useState } from 'react';
import { 
  FileCheck2, 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  ShieldAlert, 
  User, 
  Calendar, 
  Upload, 
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  Heart
} from 'lucide-react';
import { DocumentVerification } from '../types/admissions';
import { TEST_DOCUMENTS_SPEC } from '../data/initialData';

interface DocumentAuditCenterProps {
  documents: DocumentVerification[];
  onRefreshData: () => void;
}

export const DocumentAuditCenter: React.FC<DocumentAuditCenterProps> = ({ documents, onRefreshData }) => {
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'OK' | 'PROBLEM'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<DocumentVerification | null>(null);

  const filteredDocs = documents.filter(d => {
    const matchesFilter = filterStatus === 'ALL' || d.status === filterStatus;
    const matchesSearch = 
      d.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleQuickUploadTestDoc = async (specCode: string) => {
    setIsVerifying(true);
    try {
      const res = await fetch('/api/documents/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docCode: specCode })
      });
      if (res.ok) {
        onRefreshData();
      }
    } catch (err) {
      console.error('Error verifying document:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleStaffOverride = async (docId: string, newStatus: 'OK' | 'PROBLEM') => {
    try {
      const res = await fetch(`/api/documents/${docId}/override`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newStatus,
          overrideReason: newStatus === 'OK' ? 'Manually approved by Senior Counselor after sponsor verification.' : 'Staff flagged for re-issue.'
        })
      });
      if (res.ok) {
        onRefreshData();
      }
    } catch (err) {
      console.error('Error overriding status:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Audit Triggers */}
      <div className="bg-white border border-purple-200 rounded-3xl p-6 shadow-xl shadow-purple-950/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-56 h-56 bg-purple-300/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>AI Document Auditor</span>
              </span>
              <span className="text-xs text-purple-600/80 font-medium">Passport Expiry, Name Integrity & Marks Check</span>
            </div>
            <h3 className="text-2xl font-serif font-bold text-purple-950 mt-2 flex items-center gap-2">
              <span className="purple-gradient-text">Document Audit & Verification Center</span>
              <Heart className="w-4 h-4 text-purple-500 fill-purple-500/20 hidden sm:inline" />
            </h3>
            <p className="text-xs sm:text-sm text-purple-800/80 mt-1 max-w-2xl leading-relaxed">
              Inspect submitted applicant credentials. The AI agent flags expired passports, mismatching transcript names, and insufficient language bands before university submission.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-purple-700">Run Test Docs:</span>
            {TEST_DOCUMENTS_SPEC.map(spec => (
              <button
                key={spec.id}
                onClick={() => handleQuickUploadTestDoc(spec.code)}
                disabled={isVerifying}
                className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-medium border border-purple-200 flex items-center space-x-1.5 transition disabled:opacity-50 shadow-sm"
                title={`Audit ${spec.title}`}
              >
                <Upload className="w-3 h-3 text-purple-600" />
                <span>{spec.code}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-5 border-t border-purple-200">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-purple-400" />
            <input
              type="text"
              placeholder="Search by student, reason, or document..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-purple-200 rounded-2xl pl-10 pr-4 py-2 text-xs text-purple-950 placeholder-purple-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-medium transition text-center ${
                filterStatus === 'ALL' 
                  ? 'bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 text-white shadow-md shadow-purple-400/25' 
                  : 'bg-white text-purple-700 hover:text-purple-950 hover:bg-purple-50 border border-purple-200'
              }`}
            >
              All ({documents.length})
            </button>
            <button
              onClick={() => setFilterStatus('OK')}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-medium transition text-center ${
                filterStatus === 'OK' 
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md' 
                  : 'bg-white text-purple-700 hover:text-purple-950 hover:bg-purple-50 border border-purple-200'
              }`}
            >
              OK ({documents.filter(d => d.status === 'OK').length})
            </button>
            <button
              onClick={() => setFilterStatus('PROBLEM')}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-medium transition text-center ${
                filterStatus === 'PROBLEM' 
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md' 
                  : 'bg-white text-purple-700 hover:text-purple-950 hover:bg-purple-50 border border-purple-200'
              }`}
            >
              Problems ({documents.filter(d => d.status === 'PROBLEM').length})
            </button>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredDocs.map((doc) => {
          const isProblem = doc.status === 'PROBLEM';

          return (
            <div
              key={doc.id}
              className={`rounded-3xl border p-6 transition shadow-xl shadow-purple-950/5 bg-white ${
                isProblem ? 'border-rose-300 hover:border-rose-400' : 'border-purple-200 hover:border-purple-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start space-x-3.5">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                      isProblem ? 'bg-rose-100 text-rose-600 shadow-sm' : 'bg-purple-100 text-purple-700 shadow-sm'
                    }`}
                  >
                    {isProblem ? <AlertTriangle className="w-5 h-5 text-rose-500" /> : <FileCheck2 className="w-5 h-5 text-purple-600" />}
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-purple-950 text-base">{doc.label}</h4>
                    <p className="text-xs text-purple-700 mt-0.5">
                      Applicant: <strong className="text-purple-950">{doc.studentName}</strong> • Type: {doc.documentType}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border shrink-0 ${
                    isProblem
                      ? 'bg-rose-100 text-rose-700 border-rose-200'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  }`}
                >
                  {doc.status}
                </span>
              </div>

              {/* Status Reason Box */}
              <div
                className={`mt-4 p-3.5 rounded-2xl border text-xs ${
                  isProblem ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-purple-50/70 border-purple-200 text-purple-950'
                }`}
              >
                <div className="font-semibold mb-0.5">Verification Verdict:</div>
                <div className="text-xs font-mono">{doc.reason}</div>
              </div>

              {/* Detailed Breakdown */}
              <div className="mt-3.5 grid grid-cols-2 gap-2.5 text-[11px] text-purple-800/80 bg-purple-50/50 p-3 rounded-2xl border border-purple-100">
                <div>
                  <span className="text-purple-600">Name on Document:</span>{' '}
                  <strong className={doc.nameOnDoc !== doc.studentName ? 'text-rose-600' : 'text-purple-950'}>
                    {doc.nameOnDoc}
                  </strong>
                </div>
                <div>
                  <span className="text-purple-600">Details:</span>{' '}
                  <strong className="text-purple-950">{doc.details}</strong>
                </div>
                <div>
                  <span className="text-purple-600">Audited By:</span>{' '}
                  <span className="text-purple-900">{doc.verifiedBy}</span>
                </div>
                <div>
                  <span className="text-purple-600">Timestamp:</span>{' '}
                  <span className="text-purple-900">{new Date(doc.verifiedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              {/* Document Text Snippet */}
              {doc.previewText && (
                <div className="mt-3.5">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-purple-700 mb-1.5">
                    Document Text Excerpt:
                  </div>
                  <pre className="bg-purple-50/70 text-purple-950 p-3 rounded-2xl text-[10px] font-mono whitespace-pre-wrap border border-purple-200">
                    {doc.previewText}
                  </pre>
                </div>
              )}

              {/* Staff Action Footer */}
              <div className="mt-4 pt-3.5 border-t border-purple-100 flex items-center justify-between text-xs">
                <span className="text-purple-600 text-[11px]">Staff Intervention:</span>
                <div className="flex items-center space-x-2">
                  {isProblem ? (
                    <button
                      onClick={() => handleStaffOverride(doc.id, 'OK')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-600 hover:text-white text-emerald-800 border border-emerald-200 font-medium transition"
                    >
                      Override to OK
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStaffOverride(doc.id, 'PROBLEM')}
                      className="px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-600 hover:text-white text-rose-700 border border-rose-200 font-medium transition"
                    >
                      Flag Problem
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
