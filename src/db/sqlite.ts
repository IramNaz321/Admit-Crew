import initSqlJs, { Database } from 'sql.js';
import path from 'path';
import fs from 'fs';
import {
  UniversityProgram,
  StudentLead,
  DocumentVerification,
  FollowUpDraft,
  StaffEscalation,
  ChatMessage,
  AppUser
} from '../types/admissions';
import {
  INITIAL_PROGRAMS,
  INITIAL_LEADS,
  INITIAL_VERIFIED_DOCUMENTS,
  INITIAL_FOLLOWUPS,
  INITIAL_ESCALATIONS,
  INITIAL_USERS
} from '../data/initialData';

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const DB_PATH = path.join(dataDir, 'admissions.sqlite3');

let db: Database;
let SQL: any;

// Helper to write changes to SQLite3 database file on disk
export function persistSqlite(): void {
  if (!db) return;
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  } catch (err) {
    console.error('Failed to persist SQLite3 database to disk:', err);
  }
}

// Helper query wrappers
export function dbRun(sql: string, params: any[] = []): void {
  db.run(sql, params);
  persistSqlite();
}

export function dbGet<T = any>(sql: string, params: any[] = []): T | undefined {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  if (stmt.step()) {
    const row = stmt.getAsObject() as T;
    stmt.free();
    return row;
  }
  stmt.free();
  return undefined;
}

export function dbAll<T = any>(sql: string, params: any[] = []): T[] {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows: T[] = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject() as T);
  }
  stmt.free();
  return rows;
}

// Initialize tables and seed initial verified state if empty
export async function initSqliteDb(): Promise<void> {
  SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    try {
      const fileBuffer = fs.readFileSync(DB_PATH);
      db = new SQL.Database(fileBuffer);
      console.log(`Loaded existing SQLite3 database from: ${DB_PATH}`);
    } catch (loadErr) {
      console.warn('Could not read existing SQLite3 file, creating new:', loadErr);
      db = new SQL.Database();
    }
  } else {
    db = new SQL.Database();
    console.log(`Created new SQLite3 database at: ${DB_PATH}`);
  }

  // 1. Users Table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT NOT NULL,
      role TEXT NOT NULL,
      title TEXT,
      target_country TEXT,
      marks TEXT,
      ielts TEXT,
      password TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);

  // 2. Leads Table
  db.run(`
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      country TEXT NOT NULL,
      marks TEXT NOT NULL,
      ielts TEXT NOT NULL,
      budget TEXT,
      last_reply TEXT NOT NULL,
      last_reply_days_ago INTEGER NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      documents_count INTEGER DEFAULT 0,
      notes TEXT
    )
  `);

  // 3. University Programs Catalog
  db.run(`
    CREATE TABLE IF NOT EXISTS university_programs (
      id TEXT PRIMARY KEY,
      university TEXT NOT NULL,
      country TEXT NOT NULL,
      program TEXT NOT NULL,
      fee_per_year TEXT NOT NULL,
      deadline TEXT NOT NULL,
      min_marks TEXT NOT NULL,
      min_ielts TEXT NOT NULL,
      documents_needed TEXT NOT NULL,
      intake_term TEXT
    )
  `);

  // 4. Verified Documents Audit Table
  db.run(`
    CREATE TABLE IF NOT EXISTS verified_documents (
      id TEXT PRIMARY KEY,
      lead_id TEXT,
      student_name TEXT NOT NULL,
      document_type TEXT NOT NULL,
      label TEXT NOT NULL,
      name_on_doc TEXT NOT NULL,
      details TEXT NOT NULL,
      status TEXT NOT NULL,
      reason TEXT NOT NULL,
      verified_at TEXT NOT NULL,
      verified_by TEXT NOT NULL,
      preview_text TEXT
    )
  `);

  // 5. Follow-Up Drafts Queue
  db.run(`
    CREATE TABLE IF NOT EXISTS followup_drafts (
      id TEXT PRIMARY KEY,
      lead_id TEXT,
      student_name TEXT NOT NULL,
      student_phone TEXT NOT NULL,
      target_country TEXT NOT NULL,
      reason TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL,
      approved_at TEXT,
      approved_by TEXT,
      sent_at TEXT
    )
  `);

  // 6. Staff Escalations Table
  db.run(`
    CREATE TABLE IF NOT EXISTS staff_escalations (
      id TEXT PRIMARY KEY,
      student_phone TEXT NOT NULL,
      student_name TEXT NOT NULL,
      question TEXT NOT NULL,
      reason TEXT NOT NULL,
      status TEXT NOT NULL,
      answer TEXT,
      created_at TEXT NOT NULL,
      answered_at TEXT
    )
  `);

  // 7. Chat Messages Transcript Table
  db.run(`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id TEXT PRIMARY KEY,
      student_phone TEXT NOT NULL,
      sender TEXT NOT NULL,
      text TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      agent_role TEXT,
      student_name TEXT,
      thought_process TEXT,
      escalated_to_staff INTEGER DEFAULT 0
    )
  `);

  // Indexes
  db.run(`CREATE INDEX IF NOT EXISTS idx_chat_phone ON chat_messages(student_phone)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);

  persistSqlite();

  // Check if seeding is required
  const userCount = dbGet<{ count: number }>('SELECT count(*) as count FROM users');
  if (!userCount || userCount.count === 0) {
    await seedSqliteData();
  }
}

// Seed or Re-seed initial verified dataset
export async function seedSqliteData(): Promise<void> {
  // Clear all tables
  db.run('DELETE FROM users');
  db.run('DELETE FROM leads');
  db.run('DELETE FROM university_programs');
  db.run('DELETE FROM verified_documents');
  db.run('DELETE FROM followup_drafts');
  db.run('DELETE FROM staff_escalations');
  db.run('DELETE FROM chat_messages');

  // Seed Users
  for (const u of INITIAL_USERS) {
    db.run(
      `INSERT INTO users (id, name, email, phone, role, title, target_country, marks, ielts, password, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        u.id,
        u.name,
        u.email.toLowerCase(),
        u.phone,
        u.role,
        u.title || '',
        u.targetCountry || '',
        u.marks || '',
        u.ielts || '',
        u.password,
        u.createdAt || new Date().toISOString()
      ]
    );
  }

  // Seed Leads
  for (const l of INITIAL_LEADS) {
    db.run(
      `INSERT INTO leads (id, name, phone, country, marks, ielts, budget, last_reply, last_reply_days_ago, status, created_at, updated_at, documents_count, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        l.id,
        l.name,
        l.phone,
        l.country,
        l.marks,
        l.ielts,
        l.budget || '',
        l.lastReply,
        l.lastReplyDaysAgo,
        l.status,
        l.createdAt,
        l.updatedAt,
        l.documentsCount || 0,
        l.notes || ''
      ]
    );
  }

  // Seed Programs
  for (const p of INITIAL_PROGRAMS) {
    db.run(
      `INSERT INTO university_programs (id, university, country, program, fee_per_year, deadline, min_marks, min_ielts, documents_needed, intake_term)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        p.id,
        p.university,
        p.country,
        p.program,
        p.feePerYear,
        p.deadline,
        p.minMarks,
        p.minIelts,
        JSON.stringify(p.documentsNeeded),
        p.intakeTerm || ''
      ]
    );
  }

  // Seed Documents
  for (const d of INITIAL_VERIFIED_DOCUMENTS) {
    db.run(
      `INSERT INTO verified_documents (id, lead_id, student_name, document_type, label, name_on_doc, details, status, reason, verified_at, verified_by, preview_text)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        d.id,
        d.leadId || '',
        d.studentName,
        d.documentType,
        d.label,
        d.nameOnDoc,
        d.details,
        d.status,
        d.reason,
        d.verifiedAt,
        d.verifiedBy,
        d.previewText || ''
      ]
    );
  }

  // Seed Followup Drafts
  for (const f of INITIAL_FOLLOWUPS) {
    db.run(
      `INSERT INTO followup_drafts (id, lead_id, student_name, student_phone, target_country, reason, message, status, created_at, approved_at, approved_by, sent_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        f.id,
        f.leadId,
        f.studentName,
        f.studentPhone,
        f.targetCountry,
        f.reason,
        f.message,
        f.status,
        f.createdAt,
        f.approvedAt || null,
        f.approvedBy || null,
        f.sentAt || null
      ]
    );
  }

  // Seed Escalations
  for (const e of INITIAL_ESCALATIONS) {
    db.run(
      `INSERT INTO staff_escalations (id, student_phone, student_name, question, reason, status, answer, created_at, answered_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        e.id,
        e.studentPhone,
        e.studentName,
        e.question,
        e.reason,
        e.status,
        e.answer || null,
        e.createdAt,
        e.answeredAt || null
      ]
    );
  }

  // Seed sample initial chats
  const sampleChats = [
    {
      id: 'chat-ali-1',
      studentPhone: '0301 2345678',
      studentName: 'Ali Khan',
      sender: 'agent',
      agentRole: 'Intake Agent',
      text: 'Assalam-o-Alaikum Ali Khan! Welcome to Nowshera Study Abroad Consultants. I have your profile registered for UK universities. How can I help with your application today?',
      timestamp: '2026-09-26T08:30:00Z',
      thoughtProcess: 'Intake Agent recognized returning lead with phone 0301 2345678. Loaded existing records without duplication.'
    },
    {
      id: 'chat-ayesha-1',
      studentPhone: '0333 9876543',
      studentName: 'Ayesha Noor',
      sender: 'agent',
      agentRole: 'Doc Auditor',
      text: 'Hello Ayesha! Your IELTS report (Band 7.0) has been verified and meets the admission criteria for Canadian universities like University of Toronto and UBC.',
      timestamp: '2026-09-26T09:20:00Z',
      thoughtProcess: 'Doc Auditor verified IELTS Band 7.0 matches lead name Ayesha Noor.'
    },
    {
      id: 'chat-hamza-1',
      studentPhone: '0346 2223344',
      studentName: 'Hamza Iqbal',
      sender: 'student',
      text: 'Hi, I want to know about UK study options with 69% marks.',
      timestamp: '2026-09-22T14:10:00Z'
    },
    {
      id: 'chat-hamza-2',
      studentPhone: '0346 2223344',
      studentName: 'Hamza Iqbal',
      sender: 'agent',
      agentRole: 'Admissions Advisor',
      text: 'Hello Hamza! For the UK, programs like University of Leeds require 70% and IELTS 6.5. Since your marks are 69%, we can explore foundation year pathways or Leeds/Bristol with an English proficiency waiver if eligible.',
      timestamp: '2026-09-22T14:12:00Z',
      thoughtProcess: 'Advisor recommended foundation pathway due to 69% vs 70% threshold.'
    }
  ];

  for (const m of sampleChats) {
    db.run(
      `INSERT INTO chat_messages (id, student_phone, sender, text, timestamp, agent_role, student_name, thought_process, escalated_to_staff)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        m.id,
        m.studentPhone,
        m.sender,
        m.text,
        m.timestamp,
        m.agentRole || null,
        m.studentName || null,
        m.thoughtProcess || null,
        0
      ]
    );
  }

  persistSqlite();
  console.log('SQLite3 admissions database initialized & seeded.');
}

// -------------------------------------------------------------
// DATA ACCESS METHODS
// -------------------------------------------------------------

// USERS
export async function getSqliteUsers(): Promise<(AppUser & { password: string })[]> {
  const rows = dbAll<any>('SELECT * FROM users ORDER BY created_at DESC');
  return rows.map(r => ({
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone,
    role: r.role as 'staff' | 'student',
    title: r.title || undefined,
    targetCountry: r.target_country || undefined,
    marks: r.marks || undefined,
    ielts: r.ielts || undefined,
    password: r.password,
    createdAt: r.created_at
  }));
}

export async function insertSqliteUser(user: AppUser & { password: string }): Promise<void> {
  dbRun(
    `INSERT INTO users (id, name, email, phone, role, title, target_country, marks, ielts, password, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      user.id,
      user.name,
      user.email.toLowerCase(),
      user.phone,
      user.role,
      user.title || '',
      user.targetCountry || '',
      user.marks || '',
      user.ielts || '',
      user.password,
      user.createdAt || new Date().toISOString()
    ]
  );
}

// LEADS
export async function getSqliteLeads(): Promise<StudentLead[]> {
  const rows = dbAll<any>('SELECT * FROM leads ORDER BY updated_at DESC');
  return rows.map(r => ({
    id: r.id,
    name: r.name,
    phone: r.phone,
    country: r.country,
    marks: r.marks,
    ielts: r.ielts,
    budget: r.budget || undefined,
    lastReply: r.last_reply,
    lastReplyDaysAgo: r.last_reply_days_ago,
    status: r.status as any,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    documentsCount: r.documents_count || 0,
    notes: r.notes || undefined
  }));
}

export async function upsertSqliteLead(lead: StudentLead): Promise<void> {
  const existing = dbGet<any>('SELECT id FROM leads WHERE id = ? OR phone = ?', [lead.id, lead.phone]);
  if (existing) {
    dbRun(
      `UPDATE leads 
       SET name = ?, country = ?, marks = ?, ielts = ?, budget = ?, last_reply = ?, 
           last_reply_days_ago = ?, status = ?, updated_at = ?, documents_count = ?, notes = ?
       WHERE id = ?`,
      [
        lead.name,
        lead.country,
        lead.marks,
        lead.ielts,
        lead.budget || '',
        lead.lastReply,
        lead.lastReplyDaysAgo,
        lead.status,
        lead.updatedAt,
        lead.documentsCount || 0,
        lead.notes || '',
        existing.id
      ]
    );
  } else {
    dbRun(
      `INSERT INTO leads (id, name, phone, country, marks, ielts, budget, last_reply, last_reply_days_ago, status, created_at, updated_at, documents_count, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        lead.id,
        lead.name,
        lead.phone,
        lead.country,
        lead.marks,
        lead.ielts,
        lead.budget || '',
        lead.lastReply,
        lead.lastReplyDaysAgo,
        lead.status,
        lead.createdAt,
        lead.updatedAt,
        lead.documentsCount || 0,
        lead.notes || ''
      ]
    );
  }
}

// PROGRAMS
export async function getSqlitePrograms(): Promise<UniversityProgram[]> {
  const rows = dbAll<any>('SELECT * FROM university_programs');
  return rows.map(r => ({
    id: r.id,
    university: r.university,
    country: r.country as any,
    program: r.program,
    feePerYear: r.fee_per_year,
    deadline: r.deadline,
    minMarks: r.min_marks,
    minIelts: r.min_ielts,
    documentsNeeded: JSON.parse(r.documents_needed || '[]'),
    intakeTerm: r.intake_term || undefined
  }));
}

// DOCUMENTS
export async function getSqliteDocuments(): Promise<DocumentVerification[]> {
  const rows = dbAll<any>('SELECT * FROM verified_documents ORDER BY verified_at DESC');
  return rows.map(r => ({
    id: r.id,
    leadId: r.lead_id || undefined,
    studentName: r.student_name,
    documentType: r.document_type as any,
    label: r.label,
    nameOnDoc: r.name_on_doc,
    details: r.details,
    status: r.status as 'OK' | 'PROBLEM',
    reason: r.reason,
    verifiedAt: r.verified_at,
    verifiedBy: r.verified_by as any,
    previewText: r.preview_text || undefined
  }));
}

export async function insertSqliteDocument(doc: DocumentVerification): Promise<void> {
  dbRun(
    `INSERT INTO verified_documents (id, lead_id, student_name, document_type, label, name_on_doc, details, status, reason, verified_at, verified_by, preview_text)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      doc.id,
      doc.leadId || '',
      doc.studentName,
      doc.documentType,
      doc.label,
      doc.nameOnDoc,
      doc.details,
      doc.status,
      doc.reason,
      doc.verifiedAt,
      doc.verifiedBy,
      doc.previewText || ''
    ]
  );
}

export async function updateSqliteDocumentStatus(id: string, newStatus: 'OK' | 'PROBLEM', reason: string): Promise<void> {
  dbRun(
    `UPDATE verified_documents
     SET status = ?, reason = ?, verified_by = 'Staff Manual Override', verified_at = ?
     WHERE id = ?`,
    [newStatus, reason, new Date().toISOString(), id]
  );
}

// FOLLOWUP DRAFTS
export async function getSqliteFollowups(): Promise<FollowUpDraft[]> {
  const rows = dbAll<any>('SELECT * FROM followup_drafts ORDER BY created_at DESC');
  return rows.map(r => ({
    id: r.id,
    leadId: r.lead_id || '',
    studentName: r.student_name,
    studentPhone: r.student_phone,
    targetCountry: r.target_country,
    reason: r.reason,
    message: r.message,
    status: r.status as 'pending_approval' | 'approved' | 'rejected',
    createdAt: r.created_at,
    approvedAt: r.approved_at || undefined,
    approvedBy: r.approved_by || undefined,
    sentAt: r.sent_at || undefined
  }));
}

export async function insertSqliteFollowup(draft: FollowUpDraft): Promise<void> {
  dbRun(
    `INSERT INTO followup_drafts (id, lead_id, student_name, student_phone, target_country, reason, message, status, created_at, approved_at, approved_by, sent_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      draft.id,
      draft.leadId,
      draft.studentName,
      draft.studentPhone,
      draft.targetCountry,
      draft.reason,
      draft.message,
      draft.status,
      draft.createdAt,
      draft.approvedAt || null,
      draft.approvedBy || null,
      draft.sentAt || null
    ]
  );
}

export async function updateSqliteFollowup(draft: FollowUpDraft): Promise<void> {
  dbRun(
    `UPDATE followup_drafts
     SET status = ?, message = ?, approved_at = ?, approved_by = ?, sent_at = ?
     WHERE id = ?`,
    [
      draft.status,
      draft.message,
      draft.approvedAt || null,
      draft.approvedBy || null,
      draft.sentAt || null,
      draft.id
    ]
  );
}

// ESCALATIONS
export async function getSqliteEscalations(): Promise<StaffEscalation[]> {
  const rows = dbAll<any>('SELECT * FROM staff_escalations ORDER BY created_at DESC');
  return rows.map(r => ({
    id: r.id,
    studentPhone: r.student_phone,
    studentName: r.student_name,
    question: r.question,
    reason: r.reason,
    status: r.status as 'pending' | 'answered',
    answer: r.answer || undefined,
    createdAt: r.created_at,
    answeredAt: r.answered_at || undefined
  }));
}

export async function insertSqliteEscalation(esc: StaffEscalation): Promise<void> {
  dbRun(
    `INSERT INTO staff_escalations (id, student_phone, student_name, question, reason, status, answer, created_at, answered_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      esc.id,
      esc.studentPhone,
      esc.studentName,
      esc.question,
      esc.reason,
      esc.status,
      esc.answer || null,
      esc.createdAt,
      esc.answeredAt || null
    ]
  );
}

export async function resolveSqliteEscalation(id: string, answer: string): Promise<void> {
  dbRun(
    `UPDATE staff_escalations
     SET status = 'answered', answer = ?, answered_at = ?
     WHERE id = ?`,
    [answer, new Date().toISOString(), id]
  );
}

// CHAT MESSAGES
export async function getSqliteChatHistory(phone: string): Promise<ChatMessage[]> {
  const rows = dbAll<any>(
    'SELECT * FROM chat_messages WHERE student_phone = ? ORDER BY timestamp ASC',
    [phone]
  );
  return rows.map(r => ({
    id: r.id,
    sender: r.sender as 'student' | 'agent' | 'staff',
    text: r.text,
    timestamp: r.timestamp,
    agentRole: r.agent_role || undefined,
    studentPhone: r.student_phone,
    studentName: r.student_name || undefined,
    thoughtProcess: r.thought_process || undefined,
    escalatedToStaff: Boolean(r.escalated_to_staff)
  }));
}

export async function insertSqliteChatMessage(msg: ChatMessage): Promise<void> {
  dbRun(
    `INSERT INTO chat_messages (id, student_phone, sender, text, timestamp, agent_role, student_name, thought_process, escalated_to_staff)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      msg.id,
      msg.studentPhone,
      msg.sender,
      msg.text,
      msg.timestamp,
      msg.agentRole || null,
      msg.studentName || null,
      msg.thoughtProcess || null,
      msg.escalatedToStaff ? 1 : 0
    ]
  );
}

// GET DATABASE STATUS & STATS
export async function getSqliteStats() {
  const usersCount = dbGet<{ count: number }>('SELECT count(*) as count FROM users');
  const leadsCount = dbGet<{ count: number }>('SELECT count(*) as count FROM leads');
  const programsCount = dbGet<{ count: number }>('SELECT count(*) as count FROM university_programs');
  const documentsCount = dbGet<{ count: number }>('SELECT count(*) as count FROM verified_documents');
  const draftsCount = dbGet<{ count: number }>('SELECT count(*) as count FROM followup_drafts');
  const escalationsCount = dbGet<{ count: number }>('SELECT count(*) as count FROM staff_escalations');
  const chatsCount = dbGet<{ count: number }>('SELECT count(*) as count FROM chat_messages');

  let fileSizeBytes = 0;
  if (fs.existsSync(DB_PATH)) {
    const stats = fs.statSync(DB_PATH);
    fileSizeBytes = stats.size;
  }

  return {
    engine: 'SQLite 3 (Official WebAssembly & Disk Persisted)',
    databaseFile: DB_PATH,
    fileSizeBytes,
    fileSizeFormatted: `${(fileSizeBytes / 1024).toFixed(1)} KB`,
    tables: {
      users: usersCount?.count || 0,
      leads: leadsCount?.count || 0,
      university_programs: programsCount?.count || 0,
      verified_documents: documentsCount?.count || 0,
      followup_drafts: draftsCount?.count || 0,
      staff_escalations: escalationsCount?.count || 0,
      chat_messages: chatsCount?.count || 0
    },
    status: 'ACTIVE & PERSISTED TO DISK'
  };
}
