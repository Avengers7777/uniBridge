export type UserRole = 'student' | 'tpo' | 'recruiter' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  organization: string; // University Name or Company Name
  department?: string;
  title?: string;
  bio?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  skills: string[];
  targetRoles: string[];
  gpa?: number;
  graduationYear?: number;
  degree?: string;
  verified: boolean;
  resumeText?: string;
}

export type JobType = 'internship' | 'placement' | 'research_coop';
export type WorkMode = 'onsite' | 'hybrid' | 'remote';
export type ApplicationStatus = 
  | 'applied'
  | 'screening'
  | 'shortlisted'
  | 'interview_scheduled'
  | 'offer_extended'
  | 'accepted'
  | 'rejected';

export interface JobPosting {
  id: string;
  recruiterId: string;
  companyName: string;
  companyLogo?: string;
  title: string;
  roleType: JobType;
  department: string;
  location: string;
  workMode: WorkMode;
  stipendOrSalary: string;
  duration: string;
  requiredSkills: string[];
  preferredSkills: string[];
  minGpa: number;
  eligibleBatches: string[];
  deadline: string;
  openings: number;
  applicantsCount: number;
  description: string;
  responsibilities: string[];
  perks: string[];
  status: 'active' | 'closed' | 'reviewing';
  createdAt: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentUniversity: string;
  studentDegree: string;
  studentGpa: number;
  studentSkills: string[];
  jobTitle: string;
  companyName: string;
  roleType: JobType;
  appliedDate: string;
  status: ApplicationStatus;
  aiMatchScore: number;
  aiMatchRationale: string;
  coverNote?: string;
  resumeSnippet?: string;
  interviewDate?: string;
  interviewTime?: string;
  interviewMode?: string;
  notes?: string;
}

export interface SkillPathway {
  skill: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  courses: string[];
  estimatedWeeks: number;
  practicalProject: string;
}

export interface ExtractedResumeSkills {
  candidateName?: string;
  technicalSkills: string[];
  softSkills: string[];
  domainAreas: string[];
  suggestedRoles: string[];
  summary: string;
  experienceLevel: string;
}

export interface SkillGapReport {
  studentId?: string;
  targetRole: string;
  currentSkills: string[];
  matchingSkills: string[];
  missingSkills: string[];
  matchPercentage: number;
  analysisSummary: string;
  recommendedPathways: SkillPathway[];
  marketDemandScore: number; // 0 - 100
  careerAdvice: string;
  generatedAt: string;
}

export interface IndustryPartnership {
  id: string;
  universityName: string;
  companyName: string;
  mouTitle: string;
  signedDate: string;
  validUntil: string;
  focusAreas: string[];
  studentInternshipsCommitted: number;
  researchBudget: string;
  status: 'active' | 'in_negotiation' | 'renewed';
  keyContact: string;
  highlights: string[];
}

export interface PlacementDrive {
  id: string;
  companyName: string;
  driveTitle: string;
  date: string;
  targetDepartments: string[];
  eligibleCount: number;
  registeredCount: number;
  rounds: string[];
  venue: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  packageOffered: string;
}

export interface CurriculumAnalysisReport {
  department: string;
  semester: string;
  currentModules: string[];
  emergingIndustryDemands: string[];
  alignmentScore: number; // 0 - 100
  recommendedUpdates: {
    moduleName: string;
    gapIdentified: string;
    suggestedAdditions: string[];
    partnerCompaniesInvolved: string[];
  }[];
  generatedAt: string;
}

export interface PortalStats {
  totalStudentsRegistered: number;
  placementPercentage: number;
  avgPackageLPA: number;
  highestPackageLPA: number;
  activeHiringPartners: number;
  totalOffersExtended: number;
  totalActiveMoUs: number;
  internshipsCompleted: number;
}
