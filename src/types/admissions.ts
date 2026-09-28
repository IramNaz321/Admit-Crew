export interface UniversityProgram {
  id: string;
  university: string;
  country: 'UK' | 'Canada' | 'Germany' | 'Australia' | 'USA';
  program: string;
  feePerYear: string;
  deadline: string;
  minMarks: string;
  minIelts: string;
  documentsNeeded: string[];
  intakeTerm?: string;
}

export interface StudentLead {
  id: string;
  name: string;
  phone: string;
  country: string;
  marks: string;
  ielts: string;
  budget?: string;
  lastReply: string;
  lastReplyDaysAgo: number;
  status: 'new' | 'active' | 'quiet' | 'documents_submitted' | 'under_review' | 'ready_to_apply';
  createdAt: string;
  updatedAt: string;
  documentsCount?: number;
  notes?: string;
}

export interface DocumentVerification {
  id: string;
  leadId?: string;
  studentName: string;
  documentType: 'Passport' | 'Transcript' | 'IELTS result' | 'Personal Statement' | 'Other';
  label: string;
  fileName?: string;
  nameOnDoc: string;
  details: string;
  status: 'OK' | 'PROBLEM';
  reason: string;
  verifiedAt: string;
  verifiedBy: 'AI Document Auditor' | 'Staff Manual Override';
  fileUrl?: string;
  previewText?: string;
}

export interface FollowUpDraft {
  id: string;
  leadId: string;
  studentName: string;
  studentPhone: string;
  targetCountry: string;
  reason: string;
  message: string;
  status: 'pending_approval' | 'approved' | 'rejected';
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
  sentAt?: string;
}

export interface ChatMessage {
  id: string;
  studentPhone: string;
  studentName?: string;
  sender: 'student' | 'agent' | 'staff';
  agentRole?: 'Intake Agent' | 'Admissions Advisor' | 'Doc Auditor' | 'Follow-up Agent' | 'Staff';
  text: string;
  timestamp: string;
  thoughtProcess?: string;
  escalatedToStaff?: boolean;
}

export interface StaffEscalation {
  id: string;
  studentPhone: string;
  studentName: string;
  question: string;
  reason: string;
  status: 'pending' | 'answered';
  answer?: string;
  createdAt: string;
  answeredAt?: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'staff' | 'student';
  title?: string;
  targetCountry?: string;
  marks?: string;
  ielts?: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AppUser;
  token?: string;
  message?: string;
  lead?: StudentLead;
}

