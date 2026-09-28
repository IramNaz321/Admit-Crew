import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  GraduationCap, 
  FileCheck, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  FileText,
  Heart
} from 'lucide-react';
import { StudentLead } from '../types/admissions';

interface LeadsCRMProps {
  leads: StudentLead[];
  onRefreshData: () => void;
  onOpenChatWithLead?: (phone: string) => void;
}

export const LeadsCRM: React.FC<LeadsCRMProps> = ({ leads, onRefreshData, onOpenChatWithLead }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCountry, setFilterCountry] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newLeadForm, setNewLeadForm] = useState({
    name: '',
    phone: '',
    country: 'UK',
    marks: '80%',
    ielts: '6.5',
    budget: '£30,000 / year',
    notes: ''
  });
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const filteredLeads = leads.filter(l => {
    const matchesCountry = filterCountry === 'ALL' || l.country.toUpperCase() === filterCountry.toUpperCase();
    const matchesSearch =
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.phone.includes(searchQuery) ||
      l.marks.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCountry && matchesSearch;
  });

  const handleSaveLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.name || !newLeadForm.phone) return;

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLeadForm)
      });

      if (res.ok) {
        const data = await res.json();
        setFeedbackMessage(data.message);
        setIsAddModalOpen(false);
        setNewLeadForm({
          name: '',
          phone: '',
          country: 'UK',
          marks: '80%',
          ielts: '6.5',
          budget: '£30,000 / year',
          notes: ''
        });
        onRefreshData();
      }
    } catch (err) {
      console.error('Error saving lead:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Deduplication Guarantee */}
      <div className="bg-white border border-purple-200 rounded-3xl p-6 shadow-xl shadow-purple-950/5 flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-56 h-56 bg-purple-300/20 rounded-full blur-3xl pointer-events-none"></div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Strict Deduplication Engine</span>
            </span>
            <span className="text-xs text-purple-600/80 font-medium">Unique Phone Primary Key</span>
          </div>
          <h3 className="text-2xl font-serif font-bold text-purple-950 mt-2 flex items-center gap-2">
            <span className="purple-gradient-text">Student Leads CRM</span>
            <Heart className="w-4 h-4 text-purple-500 fill-purple-500/20 hidden sm:inline" />
          </h3>
          <p className="text-xs sm:text-sm text-purple-800/80 mt-1 max-w-2xl leading-relaxed">
            Whenever a student reaches out via chat, their details (name, phone, marks, IELTS, budget) are saved once. If they start a second chat with the same phone, the system recognizes them without creating duplicate records.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="self-start md:self-center flex items-center space-x-2 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 hover:from-purple-400 hover:to-indigo-400 text-white font-semibold text-xs px-5 py-3 rounded-2xl shadow-lg shadow-purple-400/25 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Intake New Student</span>
        </button>
      </div>

      {feedbackMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-2xl text-xs flex items-center space-x-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-purple-400" />
          <input
            type="text"
            placeholder="Search leads by name, phone, or score..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-purple-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-purple-950 placeholder-purple-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 max-w-full w-full sm:w-auto">
          <span className="text-xs text-purple-700 mr-1 shrink-0 font-medium">Country:</span>
          {['ALL', 'UK', 'CANADA', 'GERMANY', 'AUSTRALIA'].map((c) => (
            <button
              key={c}
              onClick={() => setFilterCountry(c)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium shrink-0 whitespace-nowrap transition ${
                filterCountry === c 
                  ? 'bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 text-white font-semibold shadow-md shadow-purple-400/25' 
                  : 'bg-white text-purple-700 hover:text-purple-950 hover:bg-purple-50 border border-purple-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white border border-purple-200 rounded-3xl shadow-xl shadow-purple-950/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-purple-950">
            <thead className="bg-purple-50/80 text-purple-800 uppercase text-[10px] tracking-wider border-b border-purple-200">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Student Name & Contact</th>
                <th className="py-3.5 px-4 font-semibold">Target Country</th>
                <th className="py-3.5 px-4 font-semibold">Academic Marks</th>
                <th className="py-3.5 px-4 font-semibold">IELTS Status</th>
                <th className="py-3.5 px-4 font-semibold">Last Activity</th>
                <th className="py-3.5 px-4 font-semibold">Lead Status</th>
                <th className="py-3.5 px-4 font-semibold">Counselor Notes</th>
                <th className="py-3.5 px-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100">
              {filteredLeads.map((lead) => {
                const isQuiet = lead.lastReplyDaysAgo >= 2 || lead.status === 'quiet';

                return (
                  <tr key={lead.id} className="hover:bg-purple-50/60 transition">
                    <td className="py-4 px-4">
                      <div className="font-serif font-bold text-purple-950 text-sm">{lead.name}</div>
                      <div className="text-[11px] text-purple-600 font-mono flex items-center space-x-1 mt-0.5">
                        <Phone className="w-3 h-3 text-purple-500" />
                        <span>{lead.phone}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-purple-900">
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 font-medium">
                        {lead.country}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono font-medium text-purple-900">{lead.marks}</td>
                    <td className="py-4 px-4 font-mono font-medium">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] ${
                          lead.ielts.includes('Not')
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-purple-100 text-purple-800 border border-purple-200'
                        }`}
                      >
                        {lead.ielts}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1.5 text-purple-900">
                        <Clock className={`w-3.5 h-3.5 ${isQuiet ? 'text-amber-600' : 'text-purple-400'}`} />
                        <span className={isQuiet ? 'font-semibold text-amber-700' : ''}>{lead.lastReply}</span>
                      </div>
                      {isQuiet && (
                        <span className="text-[10px] text-amber-700 font-medium block mt-0.5">
                          Needs Follow-up ({lead.lastReplyDaysAgo}d quiet)
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          lead.status === 'active'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : lead.status === 'quiet'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-purple-700 max-w-xs truncate text-[11px]">
                      {lead.notes || 'Registered through AdmitCrew intake.'}
                    </td>
                    <td className="py-4 px-4 text-right">
                      {onOpenChatWithLead && (
                        <button
                          onClick={() => onOpenChatWithLead(lead.phone)}
                          className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-500 hover:text-white text-purple-800 text-xs font-medium border border-purple-200 transition shadow-sm"
                        >
                          View Chat
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-[#08030a]/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-purple-200 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-serif font-bold text-purple-950 mb-1">Intake New Student Lead</h3>
            <p className="text-xs text-purple-700 mb-4 leading-relaxed">
              Enter details. Note: If the phone number matches an existing lead (e.g. 0301 2345678), the deduplication engine will update the existing profile instead of creating a second lead.
            </p>

            <form onSubmit={handleSaveLead} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-purple-900 font-semibold mb-1">Student Name:</label>
                <input
                  type="text"
                  required
                  value={newLeadForm.name}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                  placeholder="e.g. Bilal Tariq"
                  className="w-full bg-purple-50/60 border border-purple-200 rounded-2xl p-3 text-purple-950 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-purple-900 font-semibold mb-1">Phone Number (Deduplication Key):</label>
                <input
                  type="text"
                  required
                  value={newLeadForm.phone}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                  placeholder="e.g. 0301 2345678 or 0300 1122334"
                  className="w-full bg-purple-50/60 border border-purple-200 rounded-2xl p-3 text-purple-950 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-purple-900 font-semibold mb-1">Target Country:</label>
                  <select
                    value={newLeadForm.country}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, country: e.target.value })}
                    className="w-full bg-purple-50/60 border border-purple-200 rounded-2xl p-3 text-purple-950 focus:outline-none focus:border-purple-500"
                  >
                    <option value="UK">UK</option>
                    <option value="Canada">Canada</option>
                    <option value="Germany">Germany</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>

                <div>
                  <label className="block text-purple-900 font-semibold mb-1">Marks (%):</label>
                  <input
                    type="text"
                    value={newLeadForm.marks}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, marks: e.target.value })}
                    placeholder="e.g. 78%"
                    className="w-full bg-purple-50/60 border border-purple-200 rounded-2xl p-3 text-purple-950 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-purple-900 font-semibold mb-1">IELTS Score:</label>
                  <input
                    type="text"
                    value={newLeadForm.ielts}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, ielts: e.target.value })}
                    placeholder="e.g. 6.5 or Not taken yet"
                    className="w-full bg-purple-50/60 border border-purple-200 rounded-2xl p-3 text-purple-950 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-purple-900 font-semibold mb-1">Annual Budget:</label>
                  <input
                    type="text"
                    value={newLeadForm.budget}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, budget: e.target.value })}
                    placeholder="e.g. £25,000"
                    className="w-full bg-purple-50/60 border border-purple-200 rounded-2xl p-3 text-purple-950 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-purple-900 font-semibold mb-1">Counselor Notes:</label>
                <textarea
                  value={newLeadForm.notes}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, notes: e.target.value })}
                  placeholder="e.g. Inquired about CS and Engineering pathways."
                  rows={2}
                  className="w-full bg-purple-50/60 border border-purple-200 rounded-2xl p-3 text-purple-950 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-purple-700 hover:text-purple-950"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl font-bold bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 hover:from-purple-400 hover:to-indigo-400 text-white shadow-lg shadow-purple-400/25"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
