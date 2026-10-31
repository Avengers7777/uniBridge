import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { UserProfile, JobPosting, JobApplication, IndustryPartnership, PlacementDrive, PortalStats } from '../src/types/index.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'portal-database.json');

export interface DatabaseSchema {
  users: (UserProfile & { passwordHash: string })[];
  jobs: JobPosting[];
  applications: JobApplication[];
  partnerships: IndustryPartnership[];
  drives: PlacementDrive[];
  stats: PortalStats;
}

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + '_nexus_salt_2026').digest('hex');
}

// Initial realistic pre-seeded data for enterprise demonstration
const INITIAL_DB: DatabaseSchema = {
  users: [
    {
      id: 'usr_student_alex',
      name: 'Alex Chen',
      email: 'alex.chen@apex.edu',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      organization: 'Institute of Advanced Technology',
      department: 'Computer Science & Engineering',
      title: 'Senior Undergraduate Scholar',
      degree: 'B.Tech Computer Science & AI',
      gpa: 3.88,
      graduationYear: 2026,
      phone: '+1 (555) 234-5678',
      linkedin: 'https://linkedin.com/in/alexchen-dev',
      github: 'https://github.com/alexchen',
      skills: ['React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'Docker', 'RESTful APIs', 'Git', 'Data Structures & Algorithms', 'PyTorch'],
      targetRoles: ['Full-Stack Software Engineer', 'AI/ML Systems Specialist', 'Cloud Infrastructure Engineer'],
      bio: 'Honors student in CS with specialization in distributed systems and applied machine learning. Former president of Campus Open-Source Club.',
      verified: true,
      resumeText: `Alex Chen
Computer Science & Engineering, Institute of Advanced Technology (GPA 3.88/4.0)
Graduation: May 2026

TECHNICAL SKILLS:
- Languages: TypeScript, JavaScript, Python, C++, SQL, Go
- Frameworks & Libraries: React, Node.js, Express, PyTorch, Tailwind CSS, Next.js
- Cloud & Tools: Docker, Kubernetes, AWS (S3, EC2), PostgreSQL, Git, Linux, Redis

PROJECTS:
1. Distributed Cache Engine: Built a high-throughput in-memory LRU cache with Redis-compatible protocol using Node.js and TypeScript.
2. AI Document Summarizer: Fine-tuned open LLM for scientific paper parsing with 91% recall on PubMed citations.
3. Campus Hackathon First Prize: Automated peer-to-peer tutoring matching platform with 1,200 active student users.

EXPERIENCE:
- Research Assistant, University Distributed Systems Lab (Jan 2025 - Present)
- Software Engineering Intern, FinEdge Technologies (Summer 2024)`,
      passwordHash: hashPassword('demo123')
    },
    {
      id: 'usr_tpo_vance',
      name: 'Dr. Eleanor Vance',
      email: 'dr.vance@stanford-tech.edu',
      role: 'tpo',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      organization: 'Institute of Advanced Technology',
      department: 'Dean of Training & Placement',
      title: 'Director of Corporate Alliances & Placement',
      phone: '+1 (555) 987-6543',
      linkedin: 'https://linkedin.com/in/eleanor-vance-academic',
      skills: ['Curriculum Design', 'Corporate Partnerships', 'Accreditation Standards', 'Placement Strategy', 'Industry MoUs'],
      targetRoles: ['Institutional Placement Management'],
      bio: '20+ years driving academia-industry convergence, steering international research MoUs and placement for 4,500+ engineering graduates.',
      verified: true,
      passwordHash: hashPassword('demo123')
    },
    {
      id: 'usr_recruiter_marcus',
      name: 'Marcus Chen',
      email: 'marcus.chen@novatech.io',
      role: 'recruiter',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      organization: 'NovaTech Enterprise Solutions',
      department: 'University Talent Acquisition',
      title: 'Principal Campus Recruitment Lead',
      phone: '+1 (555) 456-7890',
      linkedin: 'https://linkedin.com/in/marcus-chen-recruiter',
      skills: ['Technical Sourcing', 'University Relations', 'Skill Benchmarking', 'Campus Hiring Drives', 'Talent Pipelines'],
      targetRoles: ['Corporate Recruitment'],
      bio: 'Leading strategic campus hiring programs across top tier engineering and business colleges. Partnering on sponsored capstone labs and internships.',
      verified: true,
      passwordHash: hashPassword('demo123')
    },
    {
      id: 'usr_admin_elena',
      name: 'Elena Rostova',
      email: 'admin@nexuscollab.org',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      organization: 'NexusCollab EdTech Consortium',
      department: 'Platform Governance & Standards',
      title: 'Platform Administrator & Chief Auditor',
      phone: '+1 (555) 321-7654',
      skills: ['Data Governance', 'Audit Compliance', 'API Integration', 'Placement Analytics'],
      targetRoles: ['Platform Governance'],
      bio: 'Overseeing consortium compliance, verified university accreditation, and enterprise trust agreements.',
      verified: true,
      passwordHash: hashPassword('demo123')
    }
  ],
  jobs: [
    {
      id: 'job_001',
      recruiterId: 'usr_recruiter_marcus',
      companyName: 'NovaTech Enterprise Solutions',
      companyLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&auto=format&fit=crop&q=80',
      title: 'Distributed Systems & Cloud Engineer (Summer Co-Op)',
      roleType: 'internship',
      department: 'Cloud Infrastructure & Core Services',
      location: 'San Francisco, CA / Hybrid',
      workMode: 'hybrid',
      stipendOrSalary: '$5,200 / month + Relocation Stipend',
      duration: '12 Weeks (Summer 2026)',
      requiredSkills: ['Node.js', 'TypeScript', 'Docker', 'PostgreSQL', 'Distributed Systems Basics', 'Git'],
      preferredSkills: ['Kubernetes', 'Go', 'Redis', 'CI/CD Pipelines'],
      minGpa: 3.5,
      eligibleBatches: ['2026', '2027'],
      deadline: '2026-11-20',
      openings: 8,
      applicantsCount: 24,
      description: 'Join our Core Cloud Infrastructure team to design resilient microservices, scale event streams, and build developer platforms used by Fortune 500 enterprises.',
      responsibilities: [
        'Design and deploy asynchronous event processing workers handling 50k+ events/sec',
        'Contribute to our internal developer CLI and container deployment automation',
        'Participate in architecture design reviews and write rigorous automated test suites',
        'Present your capstone project to executive engineering leadership'
      ],
      perks: ['Mentorship from Principal Staff Engineers', 'Full hardware workstation provision', 'Direct pre-placement offer (PPO) conversion opportunity'],
      status: 'active',
      createdAt: '2026-10-15T09:00:00Z'
    },
    {
      id: 'job_002',
      recruiterId: 'usr_recruiter_marcus',
      companyName: 'DeepLogic AI Labs',
      companyLogo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=80',
      title: 'Applied AI & LLM Systems Fellow',
      roleType: 'research_coop',
      department: 'Applied Generative Modeling',
      location: 'Boston, MA / Remote Available',
      workMode: 'remote',
      stipendOrSalary: '$6,000 / month + Research Publication Grants',
      duration: '6 Months (Jan - Jun 2026)',
      requiredSkills: ['Python', 'PyTorch', 'Vector Databases', 'Prompt Engineering', 'REST APIs', 'Data Structures & Algorithms'],
      preferredSkills: ['Hugging Face', 'LangChain/LlamaIndex', 'CUDA optimization', 'Fine-tuning LoRA'],
      minGpa: 3.6,
      eligibleBatches: ['2025', '2026'],
      deadline: '2026-11-25',
      openings: 4,
      applicantsCount: 38,
      description: 'Partner with senior AI research scientists to build enterprise retrieval-augmented generation (RAG) evaluation harnesses and multi-modal grounding engines.',
      responsibilities: [
        'Evaluate domain-specific LLM inference pipelines for latency and factual precision',
        'Implement automated synthetic dataset generation and automated evaluation metrics',
        'Co-author research whitepapers and open-source benchmarks',
        'Collaborate with university partner labs on joint academic research papers'
      ],
      perks: ['Co-authorship on peer-reviewed research', 'Access to high-capacity GPU cluster compute', 'PPO eligibility with top-tier compensation'],
      status: 'active',
      createdAt: '2026-10-18T11:30:00Z'
    },
    {
      id: 'job_003',
      recruiterId: 'usr_recruiter_marcus',
      companyName: 'CloudGrid Technologies',
      companyLogo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=120&auto=format&fit=crop&q=80',
      title: 'Full-Stack Software Development Engineer',
      roleType: 'placement',
      department: 'Enterprise Workspace Suite',
      location: 'Austin, TX / Onsite',
      workMode: 'onsite',
      stipendOrSalary: '$125,000 - $145,000 / year + Equity & Signing Bonus',
      duration: 'Full-Time Permanent',
      requiredSkills: ['React', 'TypeScript', 'Node.js', 'SQL', 'RESTful APIs', 'CSS/Tailwind'],
      preferredSkills: ['GraphQL', 'Cloud Architecture', 'System Design', 'Testing (Jest/Playwright)'],
      minGpa: 3.2,
      eligibleBatches: ['2026'],
      deadline: '2026-11-30',
      openings: 12,
      applicantsCount: 52,
      description: 'Looking for graduating engineers eager to create elegant, responsive web interfaces and resilient backend systems used daily by millions of professionals worldwide.',
      responsibilities: [
        'Build reactive, high-performance customer-facing interfaces in React and TypeScript',
        'Design modular API endpoints with secure role-based access control and caching',
        'Collaborate closely with Product Designers and Technical Program Managers',
        'Participate in on-call rotations and continuous integration deployments'
      ],
      perks: ['Comprehensive health, dental & vision', '401(k) matching up to 5%', 'Annual education and conference stipend'],
      status: 'active',
      createdAt: '2026-10-20T14:15:00Z'
    },
    {
      id: 'job_004',
      recruiterId: 'usr_recruiter_marcus',
      companyName: 'Apex Capital Quantitative Trading',
      companyLogo: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=120&auto=format&fit=crop&q=80',
      title: 'FinTech Quantitative Analytics & Systems Intern',
      roleType: 'internship',
      department: 'Quantitative Research & Execution Systems',
      location: 'New York, NY / Onsite',
      workMode: 'onsite',
      stipendOrSalary: '$8,500 / month + Housing Assistance',
      duration: '10 Weeks (Summer 2026)',
      requiredSkills: ['Python', 'SQL', 'Data Structures & Algorithms', 'Statistical Modeling'],
      preferredSkills: ['C++', 'NumPy/Pandas', 'Time Series Forecasting', 'Financial Markets Knowledge'],
      minGpa: 3.75,
      eligibleBatches: ['2026', '2027'],
      deadline: '2026-11-15',
      openings: 3,
      applicantsCount: 65,
      description: 'Work alongside quantitative researchers and algorithmic traders to analyze tick-level financial datasets and engineer low-latency telemetry pipelines.',
      responsibilities: [
        'Analyze large-scale transactional time-series data to discover market microstructure signals',
        'Build backtesting simulation harnesses validating risk metrics and portfolio execution',
        'Optimize compute performance on multi-threaded analysis jobs'
      ],
      perks: ['Catered gourmet dining daily', 'Full corporate housing in Manhattan', 'Industry-leading conversion offer rates'],
      status: 'active',
      createdAt: '2026-10-22T08:00:00Z'
    },
    {
      id: 'job_005',
      recruiterId: 'usr_recruiter_marcus',
      companyName: 'QuantumRobotics & Automation',
      companyLogo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=120&auto=format&fit=crop&q=80',
      title: 'Embedded Firmware & IoT Systems Engineer (Campus Drive)',
      roleType: 'placement',
      department: 'Hardware Systems & Robotics',
      location: 'San Jose, CA / Onsite',
      workMode: 'onsite',
      stipendOrSalary: '$118,000 - $132,000 / year + Stock Grants',
      duration: 'Full-Time Permanent',
      requiredSkills: ['C++', 'Embedded Systems', 'RTOS', 'Communication Protocols (SPI/I2C/CAN)', 'Git'],
      preferredSkills: ['Rust', 'PCB Layout Verification', 'Linux Kernel Driver development'],
      minGpa: 3.3,
      eligibleBatches: ['2026'],
      deadline: '2026-12-05',
      openings: 6,
      applicantsCount: 19,
      description: 'Architect low-level firmware and real-time control algorithms for next-generation automated warehousing robotic units and industrial autonomous guidance vehicles.',
      responsibilities: [
        'Develop deterministic control loops running on ARM Cortex-M microcontrollers',
        'Implement robust fault-tolerant communication pipelines over industrial bus networks',
        'Debug hardware-software interfaces with oscilloscopes and logic analyzers'
      ],
      perks: ['Onsite state-of-the-art makerspace and rapid prototyping fab', 'Annual wellness stipend', 'Flexible work scheduling'],
      status: 'active',
      createdAt: '2026-10-24T16:20:00Z'
    }
  ],
  applications: [
    {
      id: 'app_001',
      jobId: 'job_001',
      studentId: 'usr_student_alex',
      studentName: 'Alex Chen',
      studentEmail: 'alex.chen@apex.edu',
      studentUniversity: 'Institute of Advanced Technology',
      studentDegree: 'B.Tech Computer Science & AI',
      studentGpa: 3.88,
      studentSkills: ['React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'Docker', 'Distributed Systems Basics'],
      jobTitle: 'Distributed Systems & Cloud Engineer (Summer Co-Op)',
      companyName: 'NovaTech Enterprise Solutions',
      roleType: 'internship',
      appliedDate: '2026-10-25T10:14:00Z',
      status: 'interview_scheduled',
      aiMatchScore: 94,
      aiMatchRationale: 'Exceptional match. Student demonstrates verified proficiency in required Node.js, TypeScript, Docker, and PostgreSQL. Their distributed cache project directly aligns with NovaTech core cloud team tasks.',
      coverNote: 'I am deeply excited about NovaTech’s event-driven microservice architecture. My recent capstone project involved building a Redis-compatible distributed cache with high throughput, and I would love to bring this experience to your summer cohort.',
      resumeSnippet: 'Alex Chen (CS Senior, GPA 3.88). Built LRU distributed cache, assistant researcher in Distributed Systems Lab.',
      interviewDate: '2026-11-06',
      interviewTime: '14:00 EST',
      interviewMode: 'Virtual Video Conference (Google Meet)',
      notes: 'Technical round 1 completed with high recommendation. Scheduled for System Design & Coding review with Engineering Manager.'
    },
    {
      id: 'app_002',
      jobId: 'job_002',
      studentId: 'usr_student_alex',
      studentName: 'Alex Chen',
      studentEmail: 'alex.chen@apex.edu',
      studentUniversity: 'Institute of Advanced Technology',
      studentDegree: 'B.Tech Computer Science & AI',
      studentGpa: 3.88,
      studentSkills: ['Python', 'PyTorch', 'Data Structures & Algorithms', 'REST APIs', 'React'],
      jobTitle: 'Applied AI & LLM Systems Fellow',
      companyName: 'DeepLogic AI Labs',
      roleType: 'research_coop',
      appliedDate: '2026-10-26T15:30:00Z',
      status: 'shortlisted',
      aiMatchScore: 89,
      aiMatchRationale: 'Strong alignment. Student has proven PyTorch fundamentals and published open-source biomedical summarizer project. Recommended candidate for the LLM evaluation team.',
      coverNote: 'I have focused my elective coursework on generative modeling and fine-tuning. Looking forward to contributing to DeepLogic’s RAG evaluation frameworks.',
      resumeSnippet: 'Alex Chen (CS Senior, GPA 3.88). Fine-tuned open LLM with 91% recall on PubMed citations.'
    },
    {
      id: 'app_003',
      jobId: 'job_003',
      studentId: 'usr_student_alex',
      studentName: 'Alex Chen',
      studentEmail: 'alex.chen@apex.edu',
      studentUniversity: 'Institute of Advanced Technology',
      studentDegree: 'B.Tech Computer Science & AI',
      studentGpa: 3.88,
      studentSkills: ['React', 'TypeScript', 'Node.js', 'SQL', 'RESTful APIs', 'Tailwind CSS'],
      jobTitle: 'Full-Stack Software Development Engineer',
      companyName: 'CloudGrid Technologies',
      roleType: 'placement',
      appliedDate: '2026-10-28T09:20:00Z',
      status: 'screening',
      aiMatchScore: 96,
      aiMatchRationale: 'Highest tier candidate. Possesses 100% of required frontend and backend skill stack with verified GPA > 3.8. Outstanding candidate for direct campus placement fast-track.',
      coverNote: 'CloudGrid’s workspace productivity suite is software I admire daily. I would be thrilled to begin my engineering career with your full-stack core team.'
    }
  ],
  partnerships: [
    {
      id: 'mou_001',
      universityName: 'Institute of Advanced Technology',
      companyName: 'NovaTech Enterprise Solutions',
      mouTitle: 'Strategic Center of Excellence in Cloud & Distributed Computing',
      signedDate: '2025-08-15',
      validUntil: '2028-08-15',
      focusAreas: ['Distributed Systems Lab', 'Student Co-Ops', 'Curriculum Advisory Board', 'Joint Faculty Research'],
      studentInternshipsCommitted: 25,
      researchBudget: '$250,000 / year',
      status: 'active',
      keyContact: 'Marcus Chen (University Talent Partner)',
      highlights: [
        'Funded state-of-the-art Cloud Computing and Distributed Systems laboratory on campus',
        '25 guaranteed summer and winter internship slots for pre-final and final year engineers',
        'Biannual curriculum synchronization review aligning academic electives with industrial hiring criteria'
      ]
    },
    {
      id: 'mou_002',
      universityName: 'Institute of Advanced Technology',
      companyName: 'DeepLogic AI Labs',
      mouTitle: 'Academic Alliance for Applied Artificial Intelligence & Foundation Models',
      signedDate: '2025-11-01',
      validUntil: '2027-11-01',
      focusAreas: ['Generative AI Research', 'GPU Compute Credits', 'Capstone Sponsorship', 'AI Ethics Syllabus'],
      studentInternshipsCommitted: 15,
      researchBudget: '$180,000 + $50k Cloud Credits',
      status: 'active',
      keyContact: 'Dr. Sarah Lin (Chief AI Scientist)',
      highlights: [
        'Dedicated GPU server cluster allocation for university research scholars and honors students',
        'Direct sponsorship of 5 senior undergraduate capstone projects annually with industry co-mentors'
      ]
    },
    {
      id: 'mou_003',
      universityName: 'Institute of Advanced Technology',
      companyName: 'Apex Capital Quantitative Trading',
      mouTitle: 'FinTech & Quantitative Engineering Initiative',
      signedDate: '2026-01-10',
      validUntil: '2029-01-10',
      focusAreas: ['Quantitative Finance Lab', 'Algorithmic Trading Hackathon', 'Merit Scholarships'],
      studentInternshipsCommitted: 10,
      researchBudget: '$320,000 / year',
      status: 'active',
      keyContact: 'Julian Vance (Head of Talent Acquisition)',
      highlights: [
        'Annual Inter-University Quant Hackathon with $25,000 prize pool and fast-tracked interviews',
        'Full tuition scholarships for top 3 quantitative computing and math scholars'
      ]
    }
  ],
  drives: [
    {
      id: 'drv_001',
      companyName: 'NovaTech Enterprise Solutions',
      driveTitle: 'NovaTech Annual Campus Engineering Placement Drive 2026',
      date: '2026-11-12',
      targetDepartments: ['Computer Science', 'Information Technology', 'Electrical & Electronics'],
      eligibleCount: 310,
      registeredCount: 265,
      rounds: ['Online Coding Assessment (90 mins)', 'Technical Architecture Round', 'Director Interview & HR'],
      venue: 'University Central Auditorium & Computing Lab 4',
      status: 'upcoming',
      packageOffered: '$120,000 - $140,000'
    },
    {
      id: 'drv_002',
      companyName: 'CloudGrid Technologies',
      driveTitle: 'CloudGrid Full-Stack Campus Recruitment Sprint',
      date: '2026-11-18',
      targetDepartments: ['Computer Science', 'Software Engineering'],
      eligibleCount: 280,
      registeredCount: 240,
      rounds: ['Automated DSA & Debugging Test', 'Live Pair Programming Interview', 'Values Alignment'],
      venue: 'Innovation Tower Level 3',
      status: 'upcoming',
      packageOffered: '$125,000 - $145,000'
    },
    {
      id: 'drv_003',
      companyName: 'QuantumRobotics & Automation',
      driveTitle: 'Autonomous Robotics & Firmware Talent Selection',
      date: '2026-11-28',
      targetDepartments: ['Electrical Engineering', 'Mechanical', 'Computer Science'],
      eligibleCount: 195,
      registeredCount: 158,
      rounds: ['Embedded Systems Theory Test', 'Hardware Interfacing Simulation', 'Panel Presentation'],
      venue: 'Mechatronics Center Hall B',
      status: 'upcoming',
      packageOffered: '$118,000 - $132,000'
    }
  ],
  stats: {
    totalStudentsRegistered: 4850,
    placementPercentage: 92.4,
    avgPackageLPA: 14.8,
    highestPackageLPA: 54.0,
    activeHiringPartners: 320,
    totalOffersExtended: 1420,
    totalActiveMoUs: 84,
    internshipsCompleted: 980
  }
};

class DatabaseService {
  private db: DatabaseSchema;

  constructor() {
    this.ensureDataDir();
    this.db = this.loadDatabase();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Verify core schema
        if (parsed.users && parsed.jobs && parsed.applications && parsed.partnerships) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to parse database file, re-initializing with seed data:', err);
    }

    // Initialize with seed data and save
    this.saveDatabase(INITIAL_DB);
    return JSON.parse(JSON.stringify(INITIAL_DB));
  }

  private saveDatabase(data: DatabaseSchema) {
    try {
      this.ensureDataDir();
      const tempPath = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('Error persisting database:', err);
    }
  }

  private sync() {
    this.saveDatabase(this.db);
  }

  // Users
  getUsers(): UserProfile[] {
    return this.db.users.map(({ passwordHash: _, ...rest }) => rest);
  }

  getUserById(id: string): UserProfile | undefined {
    const user = this.db.users.find(u => u.id === id);
    if (!user) return undefined;
    const { passwordHash: _, ...rest } = user;
    return rest;
  }

  getUserByEmail(email: string): (UserProfile & { passwordHash: string }) | undefined {
    return this.db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(user: Omit<UserProfile, 'id'> & { password?: string }): UserProfile {
    const id = `usr_${user.role}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const passwordHash = hashPassword(user.password || 'demo123');
    const { password: _, ...profileData } = user;
    const newUser: UserProfile & { passwordHash: string } = {
      ...profileData,
      id,
      passwordHash
    };
    this.db.users.push(newUser);
    this.sync();
    const { passwordHash: __, ...sanitized } = newUser;
    return sanitized;
  }

  updateUser(id: string, updates: Partial<UserProfile>): UserProfile | null {
    const idx = this.db.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    const current = this.db.users[idx];
    const updated = {
      ...current,
      ...updates,
      id: current.id,
      role: current.role, // role is immutable via client update
      email: current.email
    };
    this.db.users[idx] = updated;
    this.sync();
    const { passwordHash: _, ...sanitized } = updated;
    return sanitized;
  }

  verifyPassword(user: UserProfile & { passwordHash: string }, plainText: string): boolean {
    return user.passwordHash === hashPassword(plainText);
  }

  // Jobs
  getJobs(): JobPosting[] {
    return this.db.jobs;
  }

  getJobById(id: string): JobPosting | undefined {
    return this.db.jobs.find(j => j.id === id);
  }

  createJob(jobData: Omit<JobPosting, 'id' | 'createdAt' | 'applicantsCount'>): JobPosting {
    const newJob: JobPosting = {
      ...jobData,
      id: `job_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      applicantsCount: 0,
      createdAt: new Date().toISOString()
    };
    this.db.jobs.unshift(newJob);
    this.sync();
    return newJob;
  }

  updateJob(id: string, updates: Partial<JobPosting>): JobPosting | null {
    const idx = this.db.jobs.findIndex(j => j.id === id);
    if (idx === -1) return null;
    this.db.jobs[idx] = { ...this.db.jobs[idx], ...updates };
    this.sync();
    return this.db.jobs[idx];
  }

  deleteJob(id: string): boolean {
    const initialLen = this.db.jobs.length;
    this.db.jobs = this.db.jobs.filter(j => j.id !== id);
    if (this.db.jobs.length !== initialLen) {
      this.sync();
      return true;
    }
    return false;
  }

  // Applications
  getApplications(filter?: { studentId?: string; jobId?: string; recruiterCompany?: string }): JobApplication[] {
    let list = this.db.applications;
    if (filter?.studentId) {
      list = list.filter(a => a.studentId === filter.studentId);
    }
    if (filter?.jobId) {
      list = list.filter(a => a.jobId === filter.jobId);
    }
    if (filter?.recruiterCompany) {
      list = list.filter(a => a.companyName.toLowerCase().includes(filter.recruiterCompany!.toLowerCase()));
    }
    return list;
  }

  createApplication(appData: Omit<JobApplication, 'id' | 'appliedDate'>): JobApplication {
    // Check if already applied
    const existing = this.db.applications.find(
      a => a.jobId === appData.jobId && a.studentId === appData.studentId
    );
    if (existing) {
      return existing;
    }

    const newApp: JobApplication = {
      ...appData,
      id: `app_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      appliedDate: new Date().toISOString()
    };
    this.db.applications.unshift(newApp);

    // Increment applicantsCount on job
    const job = this.db.jobs.find(j => j.id === appData.jobId);
    if (job) {
      job.applicantsCount = (job.applicantsCount || 0) + 1;
    }

    this.sync();
    return newApp;
  }

  updateApplication(id: string, updates: Partial<JobApplication>): JobApplication | null {
    const idx = this.db.applications.findIndex(a => a.id === id);
    if (idx === -1) return null;
    this.db.applications[idx] = { ...this.db.applications[idx], ...updates };
    this.sync();
    return this.db.applications[idx];
  }

  // Partnerships (MoUs)
  getPartnerships(): IndustryPartnership[] {
    return this.db.partnerships;
  }

  createPartnership(partnership: Omit<IndustryPartnership, 'id'>): IndustryPartnership {
    const newMoU: IndustryPartnership = {
      ...partnership,
      id: `mou_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    };
    this.db.partnerships.unshift(newMoU);
    this.sync();
    return newMoU;
  }

  // Drives
  getDrives(): PlacementDrive[] {
    return this.db.drives;
  }

  createDrive(drive: Omit<PlacementDrive, 'id'>): PlacementDrive {
    const newDrive: PlacementDrive = {
      ...drive,
      id: `drv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    };
    this.db.drives.unshift(newDrive);
    this.sync();
    return newDrive;
  }

  // Stats
  getStats(): PortalStats {
    return {
      ...this.db.stats,
      totalStudentsRegistered: this.db.users.filter(u => u.role === 'student').length * 120 + 4200,
      activeHiringPartners: new Set(this.db.jobs.map(j => j.companyName)).size + 28,
      totalActiveMoUs: this.db.partnerships.filter(p => p.status === 'active').length + 18
    };
  }
}

export const dbService = new DatabaseService();
