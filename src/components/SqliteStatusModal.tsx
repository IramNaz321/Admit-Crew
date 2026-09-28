import React, { useState, useEffect } from 'react';
import { Database, X, RefreshCw, HardDrive, CheckCircle2, Table, ShieldCheck, Sparkles } from 'lucide-react';

interface SqliteStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SqliteStatusModal: React.FC<SqliteStatusModalProps> = ({ isOpen, onClose }) => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/sqlite/status');
      const data = await res.json();
      if (res.ok && data.success) {
        setStats(data.stats);
      } else {
        setError(data.error || 'Failed to load SQLite3 stats.');
      }
    } catch (err: any) {
      setError('Network error connecting to SQLite3 endpoint.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStats();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#08030a]/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border border-purple-200 rounded-3xl max-w-md w-full p-6 shadow-2xl shadow-purple-950/20 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-purple-300/20 rounded-full blur-2xl pointer-events-none"></div>

        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-purple-600 hover:text-purple-950 p-1 rounded-xl hover:bg-purple-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-400/30">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-purple-950 flex items-center space-x-2">
              <span className="purple-gradient-text">SQLite 3 Database</span>
              <span className="text-[10px] bg-purple-100 text-purple-800 font-semibold px-2.5 py-0.5 rounded-full border border-purple-200">
                ACTIVE
              </span>
            </h3>
            <p className="text-xs text-purple-600">Embedded Disk-Persisted Relational Database</p>
          </div>
        </div>

        {error ? (
          <div className="p-3 bg-rose-50 border border-rose-300 rounded-2xl text-rose-900 text-xs mb-4">
            {error}
          </div>
        ) : isLoading ? (
          <div className="py-8 text-center text-purple-600 text-xs flex flex-col items-center space-y-2">
            <RefreshCw className="w-5 h-5 animate-spin text-purple-600" />
            <span>Reading SQLite3 database headers...</span>
          </div>
        ) : stats ? (
          <div className="space-y-4 text-xs">
            {/* Database Meta Box */}
            <div className="bg-purple-50/70 p-3.5 rounded-2xl border border-purple-100 space-y-2">
              <div className="flex items-center justify-between text-purple-700">
                <span className="flex items-center space-x-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-purple-600" />
                  <span>File Location:</span>
                </span>
                <span className="font-mono text-[11px] text-purple-950">data/admissions.sqlite3</span>
              </div>

              <div className="flex items-center justify-between text-purple-700">
                <span>Database File Size:</span>
                <span className="font-mono font-semibold text-purple-900">{stats.fileSizeFormatted}</span>
              </div>

              <div className="flex items-center justify-between text-purple-700">
                <span>Engine / Driver:</span>
                <span className="text-purple-950">{stats.engine}</span>
              </div>
            </div>

            {/* Table Row Counts */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-purple-950 font-semibold flex items-center space-x-1.5">
                  <Table className="w-3.5 h-3.5 text-purple-600" />
                  <span>Stored Tables & Row Counts</span>
                </span>
                <button
                  onClick={fetchStats}
                  className="text-purple-700 hover:text-purple-950 flex items-center space-x-1 text-[11px]"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Refresh</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {Object.entries(stats.tables || {}).map(([table, count]) => (
                  <div key={table} className="bg-purple-50/60 p-3 rounded-2xl border border-purple-100 flex items-center justify-between">
                    <span className="text-purple-800 font-mono text-[11px] capitalize truncate">
                      {table.replace(/_/g, ' ')}
                    </span>
                    <span className="bg-purple-100 text-purple-900 px-2 py-0.5 rounded-full font-mono font-bold text-xs border border-purple-200">
                      {String(count)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl flex items-start space-x-2 text-[11px] text-purple-900">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-purple-600 mt-0.5" />
              <span>
                All user accounts, student intake leads, verified catalog programs, audit documents, and chat messages are persisted into <strong>data/admissions.sqlite3</strong>.
              </span>
            </div>
          </div>
        ) : null}

        <div className="mt-5 pt-3.5 border-t border-purple-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 hover:from-purple-400 hover:to-indigo-400 text-white font-semibold text-xs shadow-md shadow-purple-400/25 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
