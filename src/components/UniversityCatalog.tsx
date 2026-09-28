import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Calendar, 
  FileText, 
  CheckCircle, 
  HelpCircle,
  GraduationCap,
  Sparkles,
  MapPin,
  Heart
} from 'lucide-react';
import { UniversityProgram } from '../types/admissions';

interface UniversityCatalogProps {
  programs: UniversityProgram[];
  onAskAboutProgram?: (prog: UniversityProgram) => void;
}

export const UniversityCatalog: React.FC<UniversityCatalogProps> = ({ programs, onAskAboutProgram }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');

  const filteredPrograms = programs.filter(p => {
    const matchesCountry = selectedCountry === 'ALL' || p.country.toUpperCase() === selectedCountry.toUpperCase();
    const matchesSearch =
      p.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.program.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCountry && matchesSearch;
  });

  const countries = ['ALL', 'UK', 'Canada', 'Germany', 'Australia'];

  return (
    <div className="space-y-6">
      {/* Knowledge Base Header */}
      <div className="bg-white border border-purple-200 rounded-3xl p-6 shadow-xl shadow-purple-950/5 flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-56 h-56 bg-purple-300/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Verified Partner Knowledge Base</span>
            </span>
            <span className="text-xs text-purple-600/80 font-medium">{programs.length} Programs Across 4 Countries</span>
          </div>
          <h3 className="text-2xl font-serif font-bold text-purple-950 mt-2 flex items-center gap-2">
            <span className="purple-gradient-text">University & Program Catalog</span>
            <Heart className="w-4 h-4 text-purple-500 fill-purple-500/20 hidden sm:inline" />
          </h3>
          <p className="text-xs sm:text-sm text-purple-800/80 mt-1 max-w-2xl leading-relaxed">
            Strict Office Constraint: The Admissions Advisor AI answers questions <strong>only from this verified list</strong>. Every fee, deadline, and mark threshold matches exactly. Unlisted universities are escalated to staff.
          </p>
        </div>

        <div className="text-right self-start md:self-center shrink-0 relative z-10">
          <div className="text-3xl font-serif font-bold text-purple-800">{programs.length}</div>
          <div className="text-xs text-purple-600 font-medium">Approved Programs</div>
        </div>
      </div>

      {/* Search & Country Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-purple-400" />
          <input
            type="text"
            placeholder="Search university, program (e.g. Manchester, Leeds)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-purple-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-purple-950 placeholder-purple-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 shadow-sm transition"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 max-w-full w-full sm:w-auto">
          {countries.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCountry(c)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium shrink-0 whitespace-nowrap transition ${
                selectedCountry === c 
                  ? 'bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 text-white font-semibold shadow-md shadow-purple-400/25' 
                  : 'bg-white text-purple-700 hover:text-purple-950 hover:bg-purple-50 border border-purple-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPrograms.map((prog) => {
          return (
            <div
              key={prog.id}
              className="bg-white border border-purple-200 hover:border-purple-300 rounded-3xl p-5 sm:p-6 shadow-xl shadow-purple-950/5 flex flex-col justify-between transition-all duration-200 group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-purple-600" />
                    <span>{prog.country}</span>
                  </span>
                  <span className="text-[10px] text-purple-600 font-mono">
                    Term: {prog.intakeTerm || 'Fall 2027'}
                  </span>
                </div>

                <h4 className="font-serif font-bold text-purple-950 text-lg group-hover:text-purple-700 transition">
                  {prog.university}
                </h4>
                <div className="text-xs font-medium text-purple-700 mt-0.5">
                  {prog.program}
                </div>

                {/* Key Numbers */}
                <div className="mt-4 grid grid-cols-2 gap-2.5 text-xs bg-purple-50/70 p-3.5 rounded-2xl border border-purple-100 shadow-sm">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-purple-600 block">Fee per Year</span>
                    <strong className="text-purple-950 font-mono text-xs">{prog.feePerYear}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-purple-600 block">Deadline</span>
                    <strong className="text-amber-800 font-mono text-xs flex items-center space-x-1 mt-0.5">
                      <Calendar className="w-3 h-3 text-amber-600" />
                      <span>{prog.deadline}</span>
                    </strong>
                  </div>
                  <div className="mt-1">
                    <span className="text-[10px] uppercase font-semibold text-purple-600 block">Min. Marks</span>
                    <strong className="text-purple-900 font-mono text-xs">{prog.minMarks}</strong>
                  </div>
                  <div className="mt-1">
                    <span className="text-[10px] uppercase font-semibold text-purple-600 block">Min. IELTS</span>
                    <strong className="text-purple-900 font-mono text-xs">{prog.minIelts}</strong>
                  </div>
                </div>

                {/* Required Documents */}
                <div className="mt-3.5">
                  <span className="text-[11px] text-purple-700 font-semibold block mb-1.5">
                    Documents Needed:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {prog.documentsNeeded.map((doc, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-lg text-[10px] bg-purple-100 text-purple-800 border border-purple-200"
                      >
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {onAskAboutProgram && (
                <div className="mt-5 pt-3.5 border-t border-purple-100">
                  <button
                    onClick={() => onAskAboutProgram(prog)}
                    className="w-full text-center text-xs text-purple-800 hover:text-white font-semibold py-2 rounded-xl bg-purple-50 hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-500 transition shadow-sm border border-purple-200"
                  >
                    Ask Agent about this Program →
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
