import mongoose, { Schema } from 'mongoose';

// User Schema
const UserSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    role: { type: String, required: true, enum: ['student', 'tpo', 'recruiter', 'admin'] },
    avatar: { type: String },
    organization: { type: String, required: true },
    department: { type: String },
    title: { type: String },
    bio: { type: String },
    phone: { type: String },
    linkedin: { type: String },
    github: { type: String },
    website: { type: String },
    skills: { type: [String], default: [] },
    targetRoles: { type: [String], default: [] },
    gpa: { type: Number },
    graduationYear: { type: Number },
    degree: { type: String },
    verified: { type: Boolean, default: false },
    resumeText: { type: String },
    passwordHash: { type: String, required: true }
  },
  { timestamps: true, toJSON: { transform: (_doc, ret) => { delete ret._id; delete ret.__v; return ret; } } }
);

// Job Schema
const JobSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    recruiterId: { type: String, required: true, index: true },
    companyName: { type: String, required: true },
    companyLogo: { type: String },
    title: { type: String, required: true },
    roleType: { type: String, required: true },
    department: { type: String, default: 'Engineering' },
    location: { type: String, default: 'Hybrid' },
    workMode: { type: String, default: 'hybrid' },
    stipendOrSalary: { type: String, required: true },
    duration: { type: String, default: '6 Months' },
    requiredSkills: { type: [String], default: [] },
    preferredSkills: { type: [String], default: [] },
    minGpa: { type: Number, default: 6.0 },
    eligibleBatches: { type: [String], default: [] },
    deadline: { type: String, default: '2026-12-31' },
    openings: { type: Number, default: 5 },
    applicantsCount: { type: Number, default: 0 },
    description: { type: String, default: '' },
    responsibilities: { type: [String], default: [] },
    perks: { type: [String], default: [] },
    status: { type: String, default: 'active' },
    createdAt: { type: String, default: () => new Date().toISOString() }
  },
  { timestamps: true, toJSON: { transform: (_doc, ret) => { delete ret._id; delete ret.__v; return ret; } } }
);

// Application Schema
const ApplicationSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    jobId: { type: String, required: true, index: true },
    studentId: { type: String, required: true, index: true },
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true },
    studentUniversity: { type: String, default: '' },
    studentDegree: { type: String, default: '' },
    studentGpa: { type: Number, default: 0 },
    studentSkills: { type: [String], default: [] },
    jobTitle: { type: String, default: '' },
    companyName: { type: String, default: '' },
    roleType: { type: String, default: 'internship' },
    appliedDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
    status: { type: String, default: 'applied' },
    aiMatchScore: { type: Number, default: 75 },
    aiMatchRationale: { type: String, default: '' },
    coverNote: { type: String, default: '' },
    resumeSnippet: { type: String, default: '' },
    interviewDate: { type: String },
    interviewTime: { type: String },
    interviewMode: { type: String },
    notes: { type: String }
  },
  { timestamps: true, toJSON: { transform: (_doc, ret) => { delete ret._id; delete ret.__v; return ret; } } }
);

// Partnership (MoU) Schema
const PartnershipSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    universityName: { type: String, required: true },
    companyName: { type: String, required: true },
    mouTitle: { type: String, required: true },
    signedDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
    validUntil: { type: String, default: '2028-12-31' },
    focusAreas: { type: [String], default: [] },
    studentInternshipsCommitted: { type: Number, default: 10 },
    researchBudget: { type: String, default: '$100,000' },
    status: { type: String, default: 'active' },
    keyContact: { type: String, default: '' },
    highlights: { type: [String], default: [] }
  },
  { timestamps: true, toJSON: { transform: (_doc, ret) => { delete ret._id; delete ret.__v; return ret; } } }
);

// Placement Drive Schema
const DriveSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    companyName: { type: String, required: true },
    driveTitle: { type: String, required: true },
    date: { type: String, default: () => new Date().toISOString().split('T')[0] },
    targetDepartments: { type: [String], default: ['Computer Science'] },
    eligibleCount: { type: Number, default: 100 },
    registeredCount: { type: Number, default: 50 },
    rounds: { type: [String], default: ['Written Test', 'Technical Round', 'HR'] },
    venue: { type: String, default: 'Campus Auditorium' },
    status: { type: String, default: 'upcoming' },
    packageOffered: { type: String, default: '₹12 LPA - ₹18 LPA' }
  },
  { timestamps: true, toJSON: { transform: (_doc, ret) => { delete ret._id; delete ret.__v; return ret; } } }
);

// Portal Stats Schema
const StatsSchema = new Schema(
  {
    id: { type: String, default: 'portal_stats', unique: true, index: true },
    totalStudentsRegistered: { type: Number, default: 0 },
    placementPercentage: { type: Number, default: 0 },
    avgPackageLPA: { type: Number, default: 0 },
    highestPackageLPA: { type: Number, default: 0 },
    activeHiringPartners: { type: Number, default: 0 },
    totalOffersExtended: { type: Number, default: 0 },
    totalActiveMoUs: { type: Number, default: 0 },
    internshipsCompleted: { type: Number, default: 0 }
  },
  { timestamps: true, toJSON: { transform: (_doc, ret) => { delete ret._id; delete ret.__v; return ret; } } }
);

export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
export const JobModel = mongoose.models.Job || mongoose.model('Job', JobSchema);
export const ApplicationModel = mongoose.models.Application || mongoose.model('Application', ApplicationSchema);
export const PartnershipModel = mongoose.models.Partnership || mongoose.model('Partnership', PartnershipSchema);
export const DriveModel = mongoose.models.Drive || mongoose.model('Drive', DriveSchema);
export const StatsModel = mongoose.models.Stats || mongoose.model('Stats', StatsSchema);
