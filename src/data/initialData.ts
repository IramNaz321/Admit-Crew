import { UniversityProgram, StudentLead, DocumentVerification, FollowUpDraft, StaffEscalation, AppUser } from '../types/admissions';

export const INITIAL_PROGRAMS: UniversityProgram[] = [
  // 1. Given in prompt
  {
    id: 'prog-1',
    university: 'University of Manchester',
    country: 'UK',
    program: 'BSc Computer Science',
    feePerYear: '£32,000',
    deadline: '15 Jan 2027',
    minMarks: '75%',
    minIelts: '6.5',
    documentsNeeded: ['Passport', 'Transcript', 'IELTS'],
    intakeTerm: 'Fall 2027'
  },
  // 2. Given in prompt
  {
    id: 'prog-2',
    university: 'University of Leeds',
    country: 'UK',
    program: 'BSc Business Management',
    feePerYear: '£27,000',
    deadline: '31 Jan 2027',
    minMarks: '70%',
    minIelts: '6.5',
    documentsNeeded: ['Passport', 'Transcript', 'IELTS', 'Personal Statement'],
    intakeTerm: 'Fall 2027'
  },
  // 3. Given in prompt
  {
    id: 'prog-3',
    university: 'University of Toronto',
    country: 'Canada',
    program: 'BSc Computer Science',
    feePerYear: 'CAD 60,000',
    deadline: '15 Jan 2027',
    minMarks: '80%',
    minIelts: '6.5',
    documentsNeeded: ['Passport', 'Transcript', 'IELTS'],
    intakeTerm: 'Fall 2027'
  },
  // 4. Given in prompt
  {
    id: 'prog-4',
    university: 'TU Munich',
    country: 'Germany',
    program: 'BSc Informatics',
    feePerYear: 'No tuition (about €150 a term)',
    deadline: '15 Jul 2027',
    minMarks: '70%',
    minIelts: '6.5',
    documentsNeeded: ['Passport', 'Transcript', 'IELTS'],
    intakeTerm: 'Winter 2027'
  },
  // 5. Given in prompt
  {
    id: 'prog-5',
    university: 'Monash University',
    country: 'Australia',
    program: 'Bachelor of IT',
    feePerYear: 'AUD 48,000',
    deadline: '30 Nov 2026',
    minMarks: '70%',
    minIelts: '6.0',
    documentsNeeded: ['Passport', 'Transcript', 'IELTS'],
    intakeTerm: 'Sem 1 2027'
  },
  // 6. Added UK program
  {
    id: 'prog-6',
    university: 'University of Edinburgh',
    country: 'UK',
    program: 'MSc Data Science',
    feePerYear: '£38,500',
    deadline: '15 Feb 2027',
    minMarks: '75%',
    minIelts: '7.0',
    documentsNeeded: ['Passport', 'Transcript', 'IELTS', '2 Academic References'],
    intakeTerm: 'Fall 2027'
  },
  // 7. Added UK program
  {
    id: 'prog-7',
    university: 'University of Bristol',
    country: 'UK',
    program: 'BEng Mechanical Engineering',
    feePerYear: '£29,500',
    deadline: '25 Jan 2027',
    minMarks: '72%',
    minIelts: '6.5',
    documentsNeeded: ['Passport', 'Transcript', 'IELTS'],
    intakeTerm: 'Fall 2027'
  },
  // 8. Added UK program
  {
    id: 'prog-8',
    university: 'Imperial College London',
    country: 'UK',
    program: 'MSc Artificial Intelligence',
    feePerYear: '£41,000',
    deadline: '10 Jan 2027',
    minMarks: '80%',
    minIelts: '7.0',
    documentsNeeded: ['Passport', 'Transcript', 'IELTS', 'Personal Statement'],
    intakeTerm: 'Fall 2027'
  },
  // 9. Added Canada program
  {
    id: 'prog-9',
    university: 'University of British Columbia',
    country: 'Canada',
    program: 'BBA Management',
    feePerYear: 'CAD 56,000',
    deadline: '15 Jan 2027',
    minMarks: '78%',
    minIelts: '6.5',
    documentsNeeded: ['Passport', 'Transcript', 'IELTS'],
    intakeTerm: 'Fall 2027'
  },
  // 10. Added Canada program
  {
    id: 'prog-10',
    university: 'McGill University',
    country: 'Canada',
    program: 'BSc Software Engineering',
    feePerYear: 'CAD 63,000',
    deadline: '01 Feb 2027',
    minMarks: '82%',
    minIelts: '7.0',
    documentsNeeded: ['Passport', 'Transcript', 'IELTS', 'Recommendation Letters'],
    intakeTerm: 'Fall 2027'
  },
  // 11. Added Canada program
  {
    id: 'prog-11',
    university: 'University of Waterloo',
    country: 'Canada',
    program: 'Bachelor of Computer Science',
    feePerYear: 'CAD 66,000',
    deadline: '15 Feb 2027',
    minMarks: '85%',
    minIelts: '7.0',
    documentsNeeded: ['Passport', 'Transcript', 'IELTS', 'Math Contest Record'],
    intakeTerm: 'Fall 2027'
  },
  // 12. Added Germany program
  {
    id: 'prog-12',
    university: 'RWTH Aachen University',
    country: 'Germany',
    program: 'BSc Mechanical Engineering',
    feePerYear: 'No tuition (€320/term admin fee)',
    deadline: '15 Jul 2027',
    minMarks: '75%',
    minIelts: '6.5',
    documentsNeeded: ['Passport', 'Transcript', 'IELTS', 'APS Certificate'],
    intakeTerm: 'Winter 2027'
  },
  // 13. Added Germany program
  {
    id: 'prog-13',
    university: 'Heidelberg University',
    country: 'Germany',
    program: 'BSc Biosciences',
    feePerYear: '€1,500 per semester',
    deadline: '15 Jul 2027',
    minMarks: '75%',
    minIelts: '6.5',
    documentsNeeded: ['Passport', 'Transcript', 'IELTS'],
    intakeTerm: 'Winter 2027'
  },
  // 14. Added Germany program
  {
    id: 'prog-14',
    university: 'University of Freiburg',
    country: 'Germany',
    program: 'MSc Environmental Governance',
    feePerYear: '€1,500 per semester',
    deadline: '01 Jun 2027',
    minMarks: '72%',
    minIelts: '7.0',
    documentsNeeded: ['Passport', 'Transcript', 'IELTS', 'CV'],
    intakeTerm: 'Winter 2027'
  },
  // 15. Added Australia program
  {
    id: 'prog-15',
    university: 'University of Melbourne',
    country: 'Australia',
    program: 'Bachelor of Commerce',
    feePerYear: 'AUD 51,000',
    deadline: '30 Nov 2026',
    minMarks: '75%',
    minIelts: '6.5',
    documentsNeeded: ['Passport', 'Transcript', 'IELTS'],
    intakeTerm: 'Sem 1 2027'
  },
  // 16. Added Australia program
  {
    id: 'prog-16',
    university: 'University of Sydney',
    country: 'Australia',
    program: 'Bachelor of Science (Cybersecurity)',
    feePerYear: 'AUD 53,000',
    deadline: '15 Dec 2026',
    minMarks: '72%',
    minIelts: '6.5',
    documentsNeeded: ['Passport', 'Transcript', 'IELTS'],
    intakeTerm: 'Sem 1 2027'
  }
];

export const INITIAL_LEADS: StudentLead[] = [
  {
    id: 'lead-1',
    name: 'Ali Khan',
    phone: '0301 2345678',
    country: 'UK',
    marks: '78%',
    ielts: '6.5',
    budget: '£30,000 / year',
    lastReply: 'Today',
    lastReplyDaysAgo: 0,
    status: 'active',
    createdAt: '2026-09-26T08:30:00Z',
    updatedAt: '2026-09-26T09:45:00Z',
    documentsCount: 1,
    notes: 'Interested in BSc Computer Science at Leeds or Manchester.'
  },
  {
    id: 'lead-2',
    name: 'Ayesha Noor',
    phone: '0333 9876543',
    country: 'Canada',
    marks: '85%',
    ielts: '7.0',
    budget: 'CAD 65,000 / year',
    lastReply: 'Today',
    lastReplyDaysAgo: 0,
    status: 'documents_submitted',
    createdAt: '2026-09-26T07:15:00Z',
    updatedAt: '2026-09-26T09:20:00Z',
    documentsCount: 1,
    notes: 'Targeting University of Toronto or Waterloo CS.'
  },
  {
    id: 'lead-3',
    name: 'Hamza Iqbal',
    phone: '0346 2223344',
    country: 'UK',
    marks: '69%',
    ielts: 'Not taken yet',
    budget: '£25,000 / year',
    lastReply: '4 days ago',
    lastReplyDaysAgo: 4,
    status: 'quiet',
    createdAt: '2026-09-22T10:00:00Z',
    updatedAt: '2026-09-22T14:10:00Z',
    documentsCount: 0,
    notes: 'Quiet student for reminder test. Approaching UK Jan 2027 deadlines and needs IELTS prep counseling.'
  }
];

export const TEST_DOCUMENTS_SPEC = [
  {
    id: 'test-doc-1',
    code: 'Passport A',
    title: 'Passport A (Valid)',
    studentName: 'Ali Khan',
    documentType: 'Passport' as const,
    nameOnDoc: 'Ali Khan',
    details: 'Expires 10 Mar 2030',
    expectedStatus: 'OK' as const,
    expectedReason: 'OK',
    previewText: 'REPUBLIC PASSPORT\nSurname: KHAN\nGiven Names: ALI\nNationality: PAKISTAN\nDate of Expiry: 10 MAR 2030\nStatus: Active'
  },
  {
    id: 'test-doc-2',
    code: 'Passport B',
    title: 'Passport B (Expired)',
    studentName: 'Ali Khan',
    documentType: 'Passport' as const,
    nameOnDoc: 'Ali Khan',
    details: 'Expired on 1 Jan 2025',
    expectedStatus: 'PROBLEM' as const,
    expectedReason: 'expired',
    previewText: 'REPUBLIC PASSPORT\nSurname: KHAN\nGiven Names: ALI\nNationality: PAKISTAN\nDate of Expiry: 01 JAN 2025\nStatus: EXPIRED (Current date is Sept 2026)'
  },
  {
    id: 'test-doc-3',
    code: 'Transcript',
    title: 'High School Transcript (Name Mismatch)',
    studentName: 'Ali Khan',
    documentType: 'Transcript' as const,
    nameOnDoc: 'Ali Ahmed',
    details: 'Marks 78%',
    expectedStatus: 'PROBLEM' as const,
    expectedReason: "name doesn't match Ali Khan",
    previewText: 'HIGHER SECONDARY SCHOOL CERTIFICATE\nCandidate Name: ALI AHMED\nFather Name: Muhammad Ahmed\nOverall Marks: 78% (Grade A)\nMajor: Pre-Engineering'
  },
  {
    id: 'test-doc-4',
    code: 'IELTS result',
    title: 'IELTS Test Report Form',
    studentName: 'Ayesha Noor',
    documentType: 'IELTS result' as const,
    nameOnDoc: 'Ayesha Noor',
    details: 'Overall score 7.0',
    expectedStatus: 'OK' as const,
    expectedReason: 'OK',
    previewText: 'INTERNATIONAL ENGLISH LANGUAGE TESTING SYSTEM (IELTS)\nCandidate Name: AYESHA NOOR\nTest Date: 12 AUG 2026\nListening: 7.5 | Reading: 7.0 | Writing: 6.5 | Speaking: 7.0\nOverall Band Score: 7.0 (CEFR C1)'
  }
];

export const INITIAL_VERIFIED_DOCUMENTS: DocumentVerification[] = [
  {
    id: 'verif-1',
    leadId: 'lead-1',
    studentName: 'Ali Khan',
    documentType: 'Passport',
    label: 'Passport A',
    nameOnDoc: 'Ali Khan',
    details: 'Expires 10 Mar 2030',
    status: 'OK',
    reason: 'OK (Valid until 10 Mar 2030, name matches applicant)',
    verifiedAt: '2026-09-26T08:35:00Z',
    verifiedBy: 'AI Document Auditor',
    previewText: 'REPUBLIC PASSPORT - ALI KHAN - EXP: 10 MAR 2030'
  },
  {
    id: 'verif-2',
    leadId: 'lead-2',
    studentName: 'Ayesha Noor',
    documentType: 'IELTS result',
    label: 'IELTS result',
    nameOnDoc: 'Ayesha Noor',
    details: 'Overall score 7.0',
    status: 'OK',
    reason: 'OK (Score 7.0 meets all Canada university requirements)',
    verifiedAt: '2026-09-26T09:25:00Z',
    verifiedBy: 'AI Document Auditor',
    previewText: 'IELTS TRF - AYESHA NOOR - OVERALL 7.0'
  }
];

export const INITIAL_FOLLOWUPS: FollowUpDraft[] = [
  {
    id: 'draft-hamza-1',
    leadId: 'lead-3',
    studentName: 'Hamza Iqbal',
    studentPhone: '0346 2223344',
    targetCountry: 'UK',
    reason: 'Quiet for 4 days; UK Jan 2027 university deadlines approaching and needs IELTS guidance (current 69%).',
    message: 'Assalam-o-Alaikum Hamza! This is Nowshera Study Abroad Consultants checking in. We noticed you were interested in UK undergraduate programs (like Leeds BSc Business Management requiring 70%). Since UK Jan 2027 deadlines are approaching and you still need to schedule your IELTS, would you like our counseling team to arrange a free IELTS test-prep session or review foundation year pathways? Let us know if you need any assistance!',
    status: 'pending_approval',
    createdAt: '2026-09-26T09:00:00Z'
  }
];

export const INITIAL_ESCALATIONS: StaffEscalation[] = [
  {
    id: 'esc-1',
    studentPhone: '0301 2345678',
    studentName: 'Ali Khan',
    question: 'Do you offer direct placement at Stanford University in California?',
    reason: 'University "Stanford University" is not in Nowshera partner catalog.',
    status: 'pending',
    createdAt: '2026-09-26T09:12:00Z'
  }
];

export const INITIAL_USERS: (AppUser & { password: string })[] = [
  {
    id: 'user-staff-1',
    name: 'Zahid Khan',
    email: 'zahid@nowshera.com',
    phone: '0300 1234567',
    role: 'staff',
    title: 'Senior Admissions Counselor',
    password: 'admin',
    createdAt: '2026-01-15T00:00:00Z'
  },
  {
    id: 'user-staff-2',
    name: 'Ayesha Tariq',
    email: 'staff@nowshera.com',
    phone: '0300 7654321',
    role: 'staff',
    title: 'Admissions Officer',
    password: 'admin',
    createdAt: '2026-02-01T00:00:00Z'
  },
  {
    id: 'user-student-1',
    name: 'Ali Khan',
    email: 'ali@example.com',
    phone: '0301 2345678',
    role: 'student',
    title: 'UK Applicant (Active Lead)',
    targetCountry: 'UK',
    marks: '78%',
    ielts: '6.5',
    password: 'password',
    createdAt: '2026-09-26T08:30:00Z'
  },
  {
    id: 'user-student-2',
    name: 'Ayesha Noor',
    email: 'ayesha@example.com',
    phone: '0333 9876543',
    role: 'student',
    title: 'Canada Applicant',
    targetCountry: 'Canada',
    marks: '85%',
    ielts: '7.0',
    password: 'password',
    createdAt: '2026-09-26T07:15:00Z'
  },
  {
    id: 'user-student-3',
    name: 'Hamza Iqbal',
    email: 'hamza@example.com',
    phone: '0346 2223344',
    role: 'student',
    title: 'UK Applicant (Quiet)',
    targetCountry: 'UK',
    marks: '69%',
    ielts: 'Not taken yet',
    password: 'password',
    createdAt: '2026-09-22T10:00:00Z'
  }
];

