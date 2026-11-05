import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { isMongoDBActive } from "./mongodb.js";
import {
  UserModel,
  JobModel,
  ApplicationModel,
  PartnershipModel,
  DriveModel,
  StatsModel
} from "./models/index.js";
const ORIGINAL_DATA_DIR = path.resolve(import.meta.dirname, "data");
const ORIGINAL_DB_FILE = path.join(ORIGINAL_DATA_DIR, "portal-database.json");
const DATA_DIR = process.env.VERCEL
  ? path.resolve("/tmp", "data")
  : ORIGINAL_DATA_DIR;
const DB_FILE = path.join(DATA_DIR, "portal-database.json");
function hashPassword(password) {
  return crypto.createHash("sha256").update(password + "_nexus_salt_2026").digest("hex");
}
const INITIAL_DB = {
  users: [
    {
      id: "usr_student_aarav",
      name: "Aarav Sharma",
      email: "aarav.sharma@cu.edu.in",
      role: "student",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      organization: "Chandigarh University (CU Punjab)",
      department: "Computer Science & Engineering",
      title: "Final Year B.Tech Scholar",
      degree: "B.Tech CSE (Specialization in Cloud & AI)",
      gpa: 8.92,
      graduationYear: 2026,
      phone: "+91 98765 43210",
      linkedin: "https://linkedin.com/in/aarav-sharma-dev",
      github: "https://github.com/aaravsharma",
      skills: ["React", "TypeScript", "Node.js", "Python", "PostgreSQL", "Docker", "RESTful APIs", "Git", "Data Structures & Algorithms", "PyTorch"],
      targetRoles: ["Full-Stack Software Engineer", "AI/ML Systems Specialist", "Cloud Infrastructure Engineer"],
      bio: "Honors CSE student at Chandigarh University (CU Punjab). 1st prize winner at Punjab State Hackathon. Open-source contributor and technical head of Campus Developers Society.",
      verified: true,
      resumeText: `Aarav Sharma
B.Tech Computer Science & Engineering, Chandigarh University (CU Punjab)
CGPA: 8.92 / 10.0 | Class of 2026

TECHNICAL PROFICIENCIES:
- Languages: TypeScript, JavaScript, Python, C++, Java, SQL
- Frameworks & Libraries: React, Node.js, Express, PyTorch, Tailwind CSS, Next.js
- Cloud & Infrastructure: Docker, Kubernetes, AWS, PostgreSQL, Redis, Linux, Git

FLAGSHIP PROJECTS:
1. Distributed Caching Engine: High-throughput in-memory LRU cache with Redis-compatible protocol using Node.js & TypeScript.
2. AI Research Paper Summarizer: Fine-tuned open LLM for biomedical papers with 92% benchmark accuracy.
3. Campus Placement Portal: Built real-time slot scheduling web app used by 3,500+ university candidates during mock placement season.

EXPERIENCE:
- Software Engineering Intern, FinEdge Technologies (Gurugram) - Summer 2025
- Undergrad Research Fellow, Distributed Systems & AI Lab (CU Punjab) - 2024 to Present`,
      passwordHash: hashPassword("demo123")
    },
    {
      id: "usr_tpo_harpreet",
      name: "Prof. Harpreet Singh",
      email: "tpo.director@lpu.co.in",
      role: "tpo",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      organization: "Lovely Professional University (LPU Punjab)",
      department: "Division of Career Services & Corporate Relations",
      title: "Dean of Training & Placement (TPO)",
      phone: "+91 98123 45678",
      linkedin: "https://linkedin.com/in/prof-harpreet-singh-tpo",
      skills: ["Campus Placements", "Corporate MoUs", "NIRF Accreditation", "Curriculum Industry Sync", "Tier-1 Hiring Drives"],
      targetRoles: ["Institutional Placement Management"],
      bio: "Leading corporate alliances and placement for 10,000+ engineering graduates across LPU Punjab, coordinating with Google, Microsoft, Amazon, Infosys, and TCS.",
      verified: true,
      passwordHash: hashPassword("demo123")
    },
    {
      id: "usr_recruiter_ananya",
      name: "Ananya Iyer",
      email: "ananya.iyer@novatech.in",
      role: "recruiter",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      organization: "NovaTech India Enterprise Solutions",
      department: "University Talent Acquisition & Campus Programs",
      title: "Principal Campus Recruitment Lead (India)",
      phone: "+91 99887 66554",
      linkedin: "https://linkedin.com/in/ananya-iyer-talent",
      skills: ["Campus Hiring", "Technical Sourcing", "Skill Benchmarking", "Campus Drives (IITs/NITs/CU/LPU)", "Hackathons"],
      targetRoles: ["Corporate Recruitment"],
      bio: "Managing strategic campus hiring programs across IIT Delhi, IIT Ropar, NIT Jalandhar, Chandigarh University, and LPU. Overseeing sponsored capstone projects and pre-placement offers (PPOs).",
      verified: true,
      passwordHash: hashPassword("demo123")
    },
    {
      id: "usr_admin_deshmukh",
      name: "Dr. Sunita Deshmukh",
      email: "admin@nexuscollab.org",
      role: "admin",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
      organization: "National EdTech Higher Education Consortium",
      department: "Academic Accreditation & Placement Audit Cell",
      title: "Consortium Director & Chief Placement Auditor",
      phone: "+91 91234 56789",
      skills: ["NIRF & NAAC Compliance", "Corporate MoU Governance", "Placement Analytics", "AI Verification"],
      targetRoles: ["Consortium Governance"],
      bio: "Overseeing institutional compliance, NAAC/NIRF accreditation criteria, and verified university-industry alliances across Punjab and pan-India.",
      verified: true,
      passwordHash: hashPassword("demo123")
    }
  ],
  jobs: [
    {
      id: "job_001",
      recruiterId: "usr_recruiter_ananya",
      companyName: "NovaTech India Enterprise Solutions",
      companyLogo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&auto=format&fit=crop&q=80",
      title: "Cloud & Distributed Systems Intern (Summer Co-Op)",
      roleType: "internship",
      department: "Core Cloud Infrastructure",
      location: "Bengaluru / Mohali IT City (Hybrid)",
      workMode: "hybrid",
      stipendOrSalary: "\u20B960,000 / month + \u20B925,000 Relocation + PPO",
      duration: "6 Months (Jan - Jun 2026)",
      requiredSkills: ["Node.js", "TypeScript", "Docker", "PostgreSQL", "Distributed Systems Basics", "Git"],
      preferredSkills: ["Kubernetes", "Go", "Redis", "CI/CD Pipelines"],
      minGpa: 7.5,
      eligibleBatches: ["2026", "2027"],
      deadline: "2026-11-20",
      openings: 15,
      applicantsCount: 42,
      description: "Join our Cloud Infrastructure Engineering unit in Bengaluru & Mohali to architect resilient microservices, scale event streams, and build developer platforms.",
      responsibilities: [
        "Design and deploy asynchronous event processing workers handling high-throughput event queues",
        "Contribute to internal developer CLI and container deployment automation",
        "Participate in architecture design reviews and write rigorous automated test suites",
        "Present your engineering project to executive leadership during campus symposium"
      ],
      perks: ["Direct Pre-Placement Offer (PPO) conversion up to \u20B924 LPA", "MacBook Pro workstation provided", "Mentorship from Staff Engineers"],
      status: "active",
      createdAt: "2026-10-15T09:00:00Z"
    },
    {
      id: "job_002",
      recruiterId: "usr_recruiter_ananya",
      companyName: "Flipkart Tech Labs",
      companyLogo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=80",
      title: "Software Development Engineer - I (Campus Placement)",
      roleType: "placement",
      department: "Supply Chain & E-Commerce Core",
      location: "Bengaluru / Gurugram (Onsite)",
      workMode: "onsite",
      stipendOrSalary: "\u20B922.5 LPA - \u20B928.0 LPA + Stocks & Joining Bonus",
      duration: "Full-Time Permanent",
      requiredSkills: ["Java", "C++", "Data Structures & Algorithms", "System Design", "SQL", "Git"],
      preferredSkills: ["Kafka", "Spring Boot", "Microservices Architecture"],
      minGpa: 7.8,
      eligibleBatches: ["2026"],
      deadline: "2026-11-25",
      openings: 25,
      applicantsCount: 88,
      description: "Campus hiring drive for graduating engineers from IITs, NITs, Chandigarh University, and LPU Punjab to build India\u2019s largest e-commerce infrastructure.",
      responsibilities: [
        "Engineer high-throughput transactional order-processing services capable of 100k requests/sec during Big Billion Days",
        "Collaborate with Product and Site Reliability Engineering teams",
        "Optimize low-latency data access layer across distributed caches and databases"
      ],
      perks: ["Comprehensive health insurance for family", "Annual learning & certification budget of \u20B91,00,000", "ESOP stock grants"],
      status: "active",
      createdAt: "2026-10-18T11:30:00Z"
    },
    {
      id: "job_003",
      recruiterId: "usr_recruiter_ananya",
      companyName: "Zomato Engineering",
      companyLogo: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=120&auto=format&fit=crop&q=80",
      title: "Full-Stack Software Development Engineer (Campus Sprint)",
      roleType: "placement",
      department: "Consumer Experience & Fleet Systems",
      location: "Gurugram / Onsite",
      workMode: "onsite",
      stipendOrSalary: "\u20B918.0 LPA - \u20B924.0 LPA + Fast-Track Promotion",
      duration: "Full-Time Permanent",
      requiredSkills: ["React", "TypeScript", "Node.js", "SQL", "RESTful APIs", "Tailwind CSS"],
      preferredSkills: ["GraphQL", "Redis", "React Native", "High-Scale Systems"],
      minGpa: 7,
      eligibleBatches: ["2026"],
      deadline: "2026-11-30",
      openings: 18,
      applicantsCount: 76,
      description: "Build fast, delightful customer-facing mobile and web experiences that power millions of food delivery and quick-commerce orders daily across 500+ Indian cities.",
      responsibilities: [
        "Build real-time tracking web components with millisecond latency",
        "Architect robust backend endpoints with zero-downtime deployment pipelines",
        "Collaborate with product designers on mobile-first responsive interactions"
      ],
      perks: ["Daily complimentary gourmet dining at HQ", "Flexible work equipment allowances", "Direct mentorship from VP of Engineering"],
      status: "active",
      createdAt: "2026-10-20T14:15:00Z"
    },
    {
      id: "job_004",
      recruiterId: "usr_recruiter_ananya",
      companyName: "DeepLogic AI Labs India",
      companyLogo: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=120&auto=format&fit=crop&q=80",
      title: "Applied Generative AI & Foundation Models Fellow",
      roleType: "research_coop",
      department: "Multimodal AI & Speech Systems",
      location: "Bengaluru / Remote Available",
      workMode: "remote",
      stipendOrSalary: "\u20B975,000 / month + GPU Grants + Research Publication",
      duration: "6 Months (Jan - Jun 2026)",
      requiredSkills: ["Python", "PyTorch", "Vector Databases", "Prompt Engineering", "Data Structures & Algorithms"],
      preferredSkills: ["Hugging Face", "Fine-tuning LoRA", "Indic Language Models (Bhashini)", "CUDA"],
      minGpa: 8,
      eligibleBatches: ["2025", "2026"],
      deadline: "2026-11-15",
      openings: 6,
      applicantsCount: 54,
      description: "Collaborate with AI scientists and research faculty from IIT Ropar, IIT Delhi, and university labs to build Indic multilingual AI foundation models.",
      responsibilities: [
        "Evaluate domain-specific LLM inference pipelines for latency and factual precision in Indian languages",
        "Implement synthetic dataset generation and automated RAG evaluation metrics",
        "Co-author research publications for top AI conferences (NeurIPS/ACL)"
      ],
      perks: ["Co-authorship on peer-reviewed research", "Access to high-capacity NVIDIA H100 GPU clusters", "Direct PPO conversion offer at \u20B930+ LPA"],
      status: "active",
      createdAt: "2026-10-22T08:00:00Z"
    },
    {
      id: "job_005",
      recruiterId: "usr_recruiter_ananya",
      companyName: "Reliance Jio Platforms",
      companyLogo: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=120&auto=format&fit=crop&q=80",
      title: "5G Core Network & IoT Systems Engineer (Campus Drive)",
      roleType: "placement",
      department: "Telecommunications & Cloud RAN",
      location: "Navi Mumbai / Punjab Regional Center (Mohali)",
      workMode: "onsite",
      stipendOrSalary: "\u20B914.5 LPA - \u20B918.0 LPA + Performance Incentives",
      duration: "Full-Time Permanent",
      requiredSkills: ["C++", "Embedded Systems", "Computer Networks", "Linux Kernel", "Git"],
      preferredSkills: ["5G Core Architecture", "RTOS", "Python Automation", "Docker"],
      minGpa: 7.2,
      eligibleBatches: ["2026"],
      deadline: "2026-12-05",
      openings: 30,
      applicantsCount: 110,
      description: "Architecting India\u2019s indigenous 5G telecom stack, high-speed edge computing nodes, and smart industrial automation devices across Punjab and nationwide.",
      responsibilities: [
        "Develop real-time packet processing pipelines for cellular radio access networks",
        "Implement fault-tolerant communication protocols across distributed telecom nodes",
        "Collaborate with university research labs on 6G and industrial IoT prototypes"
      ],
      perks: ["Onsite state-of-the-art telecommunications testing fab", "Comprehensive group mediclaim", "Rapid career advancement track"],
      status: "active",
      createdAt: "2026-10-24T16:20:00Z"
    }
  ],
  applications: [
    {
      id: "app_001",
      jobId: "job_001",
      studentId: "usr_student_aarav",
      studentName: "Aarav Sharma",
      studentEmail: "aarav.sharma@cu.edu.in",
      studentUniversity: "Chandigarh University (CU Punjab)",
      studentDegree: "B.Tech CSE (Cloud & AI)",
      studentGpa: 8.92,
      studentSkills: ["React", "TypeScript", "Node.js", "Python", "PostgreSQL", "Docker", "Distributed Systems Basics"],
      jobTitle: "Cloud & Distributed Systems Intern (Summer Co-Op)",
      companyName: "NovaTech India Enterprise Solutions",
      roleType: "internship",
      appliedDate: "2026-10-25T10:14:00Z",
      status: "interview_scheduled",
      aiMatchScore: 95,
      aiMatchRationale: "Exceptional match. Student demonstrates verified proficiency in required Node.js, TypeScript, Docker, and PostgreSQL. Their distributed cache project directly aligns with NovaTech core cloud team tasks in Mohali and Bengaluru.",
      coverNote: "I am deeply excited about NovaTech India\u2019s high-throughput microservices. My recent capstone at Chandigarh University involved engineering a Redis-compatible distributed cache, and I would love to bring this experience to your summer internship cohort.",
      resumeSnippet: "Aarav Sharma (CU Punjab B.Tech CSE, CGPA 8.92). Built distributed cache engine, won 1st prize at Punjab State Hackathon.",
      interviewDate: "2026-11-06",
      interviewTime: "14:30 IST",
      interviewMode: "Virtual Video Conference (Google Meet)",
      notes: "Technical Round 1 completed with top score. Scheduled for System Architecture review with Director of Engineering."
    },
    {
      id: "app_002",
      jobId: "job_002",
      studentId: "usr_student_aarav",
      studentName: "Aarav Sharma",
      studentEmail: "aarav.sharma@cu.edu.in",
      studentUniversity: "Chandigarh University (CU Punjab)",
      studentDegree: "B.Tech CSE (Cloud & AI)",
      studentGpa: 8.92,
      studentSkills: ["Java", "C++", "Data Structures & Algorithms", "System Design", "SQL", "Git"],
      jobTitle: "Software Development Engineer - I (Campus Placement)",
      companyName: "Flipkart Tech Labs",
      roleType: "placement",
      appliedDate: "2026-10-26T15:30:00Z",
      status: "shortlisted",
      aiMatchScore: 92,
      aiMatchRationale: "Strong alignment. Student has proven DSA fundamentals (500+ LeetCode problems solved) and published open-source project. Recommended for Flipkart core supply chain engineering interview loop.",
      coverNote: "I have focused heavily on distributed systems and high-concurrency Java services. Looking forward to engineering scalable e-commerce microservices at Flipkart.",
      resumeSnippet: "Aarav Sharma (CU Punjab CSE Senior). Solved 500+ algorithmic problems, built high-concurrency microservices."
    },
    {
      id: "app_003",
      jobId: "job_003",
      studentId: "usr_student_aarav",
      studentName: "Aarav Sharma",
      studentEmail: "aarav.sharma@cu.edu.in",
      studentUniversity: "Chandigarh University (CU Punjab)",
      studentDegree: "B.Tech CSE (Cloud & AI)",
      studentGpa: 8.92,
      studentSkills: ["React", "TypeScript", "Node.js", "SQL", "RESTful APIs", "Tailwind CSS"],
      jobTitle: "Full-Stack Software Development Engineer (Campus Sprint)",
      companyName: "Zomato Engineering",
      roleType: "placement",
      appliedDate: "2026-10-28T09:20:00Z",
      status: "screening",
      aiMatchScore: 96,
      aiMatchRationale: "Top tier candidate. Possesses 100% of required frontend and backend skill stack with verified CGPA 8.92. Outstanding candidate for direct campus placement fast-track in Gurugram.",
      coverNote: "Zomato\u2019s rapid ordering and real-time fleet dispatch is engineering I admire daily. I would be thrilled to begin my engineering career with your full-stack core team in Gurugram."
    }
  ],
  partnerships: [
    {
      id: "mou_001",
      universityName: "Lovely Professional University (LPU Punjab)",
      companyName: "NovaTech India Enterprise Solutions",
      mouTitle: "Center of Excellence in Cloud Computing & Enterprise AI",
      signedDate: "2025-08-15",
      validUntil: "2028-08-15",
      focusAreas: ["Cloud Infrastructure Lab", "Student Summer Co-Ops", "Curriculum Industry Alignment", "Joint Research Grants"],
      studentInternshipsCommitted: 60,
      researchBudget: "\u20B945,00,000 / year",
      status: "active",
      keyContact: "Prof. Harpreet Singh (Dean Career Services, LPU)",
      highlights: [
        "Dedicated Cloud Computing and Microservices Innovation Lab established on LPU Phagwara Campus",
        "60 guaranteed summer and winter internship slots annually for pre-final and final year B.Tech students",
        "Biannual curriculum synchronization review aligning academic electives with industrial hiring criteria"
      ]
    },
    {
      id: "mou_002",
      universityName: "Chandigarh University (CU Punjab)",
      companyName: "Flipkart Tech Labs",
      mouTitle: "Academic Alliance for High-Scale Distributed Systems & E-Commerce Tech",
      signedDate: "2025-11-01",
      validUntil: "2027-11-01",
      focusAreas: ["Distributed Systems Lab", "Sponsored Capstone Projects", "Direct PPO Fast-Track", "Industry Co-Mentorship"],
      studentInternshipsCommitted: 45,
      researchBudget: "\u20B935,00,000 / year",
      status: "active",
      keyContact: "Dr. Gurmeet Sandhu (Director Corporate Alliances, CU)",
      highlights: [
        "Direct sponsorship of 10 senior undergraduate capstone projects annually with Flipkart senior engineering co-mentors",
        "Pre-placement fast-track interviews for top 10% students graduating in Computer Science and IT"
      ]
    },
    {
      id: "mou_003",
      universityName: "Indian Institute of Technology Ropar (IIT Ropar, Punjab)",
      companyName: "DeepLogic AI Labs India",
      mouTitle: "Joint Research Consortium on Indic Foundation Models & Generative AI",
      signedDate: "2026-01-10",
      validUntil: "2029-01-10",
      focusAreas: ["NVIDIA GPU Cluster Sponsorship", "Doctoral & Postgrad AI Fellowships", "Bhashini Indic AI Models"],
      studentInternshipsCommitted: 20,
      researchBudget: "\u20B985,00,000 / year",
      status: "active",
      keyContact: "Dr. Arvind Mahajan (Head of Corporate Relations, IIT Ropar)",
      highlights: [
        "Funded GPU server cluster allocation for IIT Ropar research scholars and B.Tech CSE honors students",
        "Full fellowship stipends for top 5 AI and Machine Learning research projects"
      ]
    },
    {
      id: "mou_004",
      universityName: "Dr. B. R. Ambedkar National Institute of Technology (NIT Jalandhar, Punjab)",
      companyName: "Reliance Jio Platforms",
      mouTitle: "5G Core Telecom & Industrial Edge Computing Initiative",
      signedDate: "2025-09-01",
      validUntil: "2028-09-01",
      focusAreas: ["5G Network Testbed", "Embedded Firmware Lab", "Campus Hiring Quotas"],
      studentInternshipsCommitted: 35,
      researchBudget: "\u20B940,00,000 / year",
      status: "active",
      keyContact: "Prof. S. K. Sood (Dean Placements, NIT Jalandhar)",
      highlights: [
        "Dedicated 5G radio access network prototyping testbed installed at NIT Jalandhar electronics complex",
        "Annual campus drive quota guaranteeing 35+ core engineering hires"
      ]
    }
  ],
  drives: [
    {
      id: "drv_001",
      companyName: "Flipkart Tech Labs",
      driveTitle: "Flipkart Annual Punjab Engineering Recruitment Sprint 2026",
      date: "2026-11-12",
      targetDepartments: ["Computer Science (CSE)", "Information Technology (IT)", "Electronics & Comm (ECE)"],
      eligibleCount: 520,
      registeredCount: 465,
      rounds: ["Online Coding Assessment (90 mins)", "Technical Architecture Round", "Bar Raiser & HR Round"],
      venue: "Chandigarh University (CU) - Block C5 Central Auditorium, Mohali",
      status: "upcoming",
      packageOffered: "\u20B922.5 LPA - \u20B928.0 LPA"
    },
    {
      id: "drv_002",
      companyName: "NovaTech India Enterprise Solutions",
      driveTitle: "NovaTech Campus Engineering Selection Drive 2026",
      date: "2026-11-18",
      targetDepartments: ["Computer Science & Engineering", "Software Engineering", "AI & Data Science"],
      eligibleCount: 680,
      registeredCount: 590,
      rounds: ["Automated DSA & Debugging Test", "Live Pair Programming Interview", "Director Review"],
      venue: "Lovely Professional University (LPU Punjab) - Shanti Devi Mittal Auditorium, Phagwara",
      status: "upcoming",
      packageOffered: "\u20B918.0 LPA - \u20B924.0 LPA"
    },
    {
      id: "drv_003",
      companyName: "Zomato Engineering",
      driveTitle: "Zomato High-Scale Web & Mobile Campus Hiring Tour",
      date: "2026-11-28",
      targetDepartments: ["Computer Science", "Electronics & Comm", "Applied Math"],
      eligibleCount: 410,
      registeredCount: 360,
      rounds: ["Coding & Problem Solving Test", "System Design Discussion", "Culture & Values Fit"],
      venue: "IIT Ropar - Senate Hall & Computing Center, Rupnagar, Punjab",
      status: "upcoming",
      packageOffered: "\u20B920.0 LPA - \u20B925.0 LPA"
    },
    {
      id: "drv_004",
      companyName: "Reliance Jio Platforms",
      driveTitle: "Jio 5G Edge & Cloud Core Engineering Selection",
      date: "2026-12-04",
      targetDepartments: ["Electronics & Comm", "Computer Science", "Electrical"],
      eligibleCount: 380,
      registeredCount: 310,
      rounds: ["Embedded Systems & Networks Test", "Technical Interview", "HR Interaction"],
      venue: "NIT Jalandhar - Central Seminar Hall, Jalandhar, Punjab",
      status: "upcoming",
      packageOffered: "\u20B914.5 LPA - \u20B918.0 LPA"
    }
  ],
  stats: {
    totalStudentsRegistered: 8450,
    placementPercentage: 94.2,
    avgPackageLPA: 14.8,
    highestPackageLPA: 54,
    activeHiringPartners: 420,
    totalOffersExtended: 3850,
    totalActiveMoUs: 112,
    internshipsCompleted: 2450
  }
};
class DatabaseService {
  db;
  constructor() {
    this.ensureDataDir();
    this.db = this.loadDatabase();
  }
  ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }
  loadDatabase() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        if (parsed.users && parsed.jobs && parsed.applications && parsed.partnerships) {
          return parsed;
        }
      }
      if (fs.existsSync(ORIGINAL_DB_FILE)) {
        const raw = fs.readFileSync(ORIGINAL_DB_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        if (parsed.users && parsed.jobs && parsed.applications && parsed.partnerships) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn("Failed to parse database file, re-initializing with seed data:", err);
    }
    this.saveDatabase(INITIAL_DB);
    return JSON.parse(JSON.stringify(INITIAL_DB));
  }
  saveDatabase(data) {
    try {
      this.ensureDataDir();
      const tempPath = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf-8");
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error("Error persisting database:", err);
    }
  }
  sync() {
    this.saveDatabase(this.db);
  }
  // Users
  async getUsers() {
    if (isMongoDBActive()) {
      try {
        const users = await UserModel.find().select("-passwordHash").lean();
        return users.map((u) => ({ ...u, id: u.id }));
      } catch (err) {
        console.error("MongoDB getUsers error:", err);
      }
    }
    return this.db.users.map(({ passwordHash: _, ...rest }) => rest);
  }
  async getUserById(id) {
    if (isMongoDBActive()) {
      try {
        const user = await UserModel.findOne({ id }).select("-passwordHash").lean();
        if (user) return { ...user, id: user.id };
      } catch (err) {
        console.error("MongoDB getUserById error:", err);
      }
    }
    const user = this.db.users.find((u) => u.id === id);
    if (!user) return void 0;
    const { passwordHash: _, ...rest } = user;
    return rest;
  }
  async getUserByEmail(email) {
    if (isMongoDBActive()) {
      try {
        const user = await UserModel.findOne({ email: new RegExp(`^${email.trim()}$`, "i") }).lean();
        if (user) return { ...user, id: user.id };
      } catch (err) {
        console.error("MongoDB getUserByEmail error:", err);
      }
    }
    return this.db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }
  async createUser(user) {
    const id = `usr_${user.role}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const passwordHash = hashPassword(user.password || "demo123");
    const { password: _, ...profileData } = user;
    const newUser = {
      ...profileData,
      id,
      passwordHash
    };
    if (isMongoDBActive()) {
      try {
        await UserModel.create(newUser);
      } catch (err) {
        console.error("MongoDB createUser error:", err);
      }
    }
    this.db.users.push(newUser);
    this.sync();
    const { passwordHash: __, ...sanitized } = newUser;
    return sanitized;
  }
  async updateUser(id, updates) {
    if (isMongoDBActive()) {
      try {
        const updated = await UserModel.findOneAndUpdate(
          { id },
          { $set: updates },
          { new: true }
        ).select("-passwordHash").lean();
        const idx = this.db.users.findIndex((u) => u.id === id);
        if (idx !== -1) {
          this.db.users[idx] = { ...this.db.users[idx], ...updates };
          this.sync();
        }
        if (updated) return { ...updated, id: updated.id };
      } catch (err) {
        console.error("MongoDB updateUser error:", err);
      }
    }
    const idx = this.db.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    const current = this.db.users[idx];
    const updated = {
      ...current,
      ...updates,
      id: current.id,
      role: current.role,
      // role is immutable via client update
      email: current.email
    };
    this.db.users[idx] = updated;
    this.sync();
    const { passwordHash: _, ...sanitized } = updated;
    return sanitized;
  }
  verifyPassword(user, plainText) {
    return user.passwordHash === hashPassword(plainText);
  }
  // Jobs
  async getJobs() {
    if (isMongoDBActive()) {
      try {
        const jobs = await JobModel.find().sort({ createdAt: -1 }).lean();
        return jobs.map((j) => ({ ...j, id: j.id }));
      } catch (err) {
        console.error("MongoDB getJobs error:", err);
      }
    }
    return this.db.jobs;
  }
  async getJobById(id) {
    if (isMongoDBActive()) {
      try {
        const job = await JobModel.findOne({ id }).lean();
        if (job) return { ...job, id: job.id };
      } catch (err) {
        console.error("MongoDB getJobById error:", err);
      }
    }
    return this.db.jobs.find((j) => j.id === id);
  }
  async createJob(jobData) {
    const newJob = {
      ...jobData,
      id: `job_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      applicantsCount: 0,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (isMongoDBActive()) {
      try {
        await JobModel.create(newJob);
      } catch (err) {
        console.error("MongoDB createJob error:", err);
      }
    }
    this.db.jobs.unshift(newJob);
    this.sync();
    return newJob;
  }
  async updateJob(id, updates) {
    if (isMongoDBActive()) {
      try {
        const updated = await JobModel.findOneAndUpdate({ id }, { $set: updates }, { new: true }).lean();
        const idx = this.db.jobs.findIndex((j) => j.id === id);
        if (idx !== -1) {
          this.db.jobs[idx] = { ...this.db.jobs[idx], ...updates };
          this.sync();
        }
        if (updated) return { ...updated, id: updated.id };
      } catch (err) {
        console.error("MongoDB updateJob error:", err);
      }
    }
    const idx = this.db.jobs.findIndex((j) => j.id === id);
    if (idx === -1) return null;
    this.db.jobs[idx] = { ...this.db.jobs[idx], ...updates };
    this.sync();
    return this.db.jobs[idx];
  }
  async deleteJob(id) {
    if (isMongoDBActive()) {
      try {
        await JobModel.deleteOne({ id });
      } catch (err) {
        console.error("MongoDB deleteJob error:", err);
      }
    }
    const initialLen = this.db.jobs.length;
    this.db.jobs = this.db.jobs.filter((j) => j.id !== id);
    if (this.db.jobs.length !== initialLen) {
      this.sync();
      return true;
    }
    return false;
  }
  // Applications
  async getApplications(filter) {
    if (isMongoDBActive()) {
      try {
        const query = {};
        if (filter?.studentId) query.studentId = filter.studentId;
        if (filter?.jobId) query.jobId = filter.jobId;
        if (filter?.recruiterCompany) {
          query.companyName = new RegExp(filter.recruiterCompany, "i");
        }
        const apps = await ApplicationModel.find(query).sort({ appliedDate: -1 }).lean();
        return apps.map((a) => ({ ...a, id: a.id }));
      } catch (err) {
        console.error("MongoDB getApplications error:", err);
      }
    }
    let list = this.db.applications;
    if (filter?.studentId) {
      list = list.filter((a) => a.studentId === filter.studentId);
    }
    if (filter?.jobId) {
      list = list.filter((a) => a.jobId === filter.jobId);
    }
    if (filter?.recruiterCompany) {
      list = list.filter((a) => a.companyName.toLowerCase().includes(filter.recruiterCompany.toLowerCase()));
    }
    return list;
  }
  async createApplication(appData) {
    if (isMongoDBActive()) {
      try {
        const existing = await ApplicationModel.findOne({
          jobId: appData.jobId,
          studentId: appData.studentId
        }).lean();
        if (existing) {
          return { ...existing, id: existing.id };
        }
        const newApp = {
          ...appData,
          id: `app_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          appliedDate: (/* @__PURE__ */ new Date()).toISOString()
        };
        await ApplicationModel.create(newApp);
        await JobModel.updateOne({ id: appData.jobId }, { $inc: { applicantsCount: 1 } });
        this.db.applications.unshift(newApp);
        const job = this.db.jobs.find((j) => j.id === appData.jobId);
        if (job) {
          job.applicantsCount = (job.applicantsCount || 0) + 1;
        }
        this.sync();
        return newApp;
      } catch (err) {
        console.error("MongoDB createApplication error:", err);
      }
    }
    const existing = this.db.applications.find(
      (a) => a.jobId === appData.jobId && a.studentId === appData.studentId
    );
    if (existing) {
      return existing;
    }
    const newApp = {
      ...appData,
      id: `app_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      appliedDate: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.db.applications.unshift(newApp);
    const job = this.db.jobs.find((j) => j.id === appData.jobId);
    if (job) {
      job.applicantsCount = (job.applicantsCount || 0) + 1;
    }
    this.sync();
    return newApp;
  }
  async updateApplication(id, updates) {
    if (isMongoDBActive()) {
      try {
        const updated = await ApplicationModel.findOneAndUpdate({ id }, { $set: updates }, { new: true }).lean();
        const idx = this.db.applications.findIndex((a) => a.id === id);
        if (idx !== -1) {
          this.db.applications[idx] = { ...this.db.applications[idx], ...updates };
          this.sync();
        }
        if (updated) return { ...updated, id: updated.id };
      } catch (err) {
        console.error("MongoDB updateApplication error:", err);
      }
    }
    const idx = this.db.applications.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    this.db.applications[idx] = { ...this.db.applications[idx], ...updates };
    this.sync();
    return this.db.applications[idx];
  }
  // Partnerships (MoUs)
  async getPartnerships() {
    if (isMongoDBActive()) {
      try {
        const mous = await PartnershipModel.find().lean();
        return mous.map((m) => ({ ...m, id: m.id }));
      } catch (err) {
        console.error("MongoDB getPartnerships error:", err);
      }
    }
    return this.db.partnerships;
  }
  async createPartnership(partnership) {
    const newMoU = {
      ...partnership,
      id: `mou_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    };
    if (isMongoDBActive()) {
      try {
        await PartnershipModel.create(newMoU);
      } catch (err) {
        console.error("MongoDB createPartnership error:", err);
      }
    }
    this.db.partnerships.unshift(newMoU);
    this.sync();
    return newMoU;
  }
  // Drives
  async getDrives() {
    if (isMongoDBActive()) {
      try {
        const drives = await DriveModel.find().lean();
        return drives.map((d) => ({ ...d, id: d.id }));
      } catch (err) {
        console.error("MongoDB getDrives error:", err);
      }
    }
    return this.db.drives;
  }
  async createDrive(drive) {
    const newDrive = {
      ...drive,
      id: `drv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    };
    if (isMongoDBActive()) {
      try {
        await DriveModel.create(newDrive);
      } catch (err) {
        console.error("MongoDB createDrive error:", err);
      }
    }
    this.db.drives.unshift(newDrive);
    this.sync();
    return newDrive;
  }
  // Stats
  async getStats() {
    if (isMongoDBActive()) {
      try {
        const studentCount = await UserModel.countDocuments({ role: "student" });
        const distinctCompanies = await JobModel.distinct("companyName");
        const activeMoUs = await PartnershipModel.countDocuments({ status: "active" });
        return {
          ...this.db.stats,
          totalStudentsRegistered: studentCount * 120 + 4200,
          activeHiringPartners: distinctCompanies.length + 28,
          totalActiveMoUs: activeMoUs + 18
        };
      } catch (err) {
        console.error("MongoDB getStats error:", err);
      }
    }
    return {
      ...this.db.stats,
      totalStudentsRegistered: this.db.users.filter((u) => u.role === "student").length * 120 + 4200,
      activeHiringPartners: new Set(this.db.jobs.map((j) => j.companyName)).size + 28,
      totalActiveMoUs: this.db.partnerships.filter((p) => p.status === "active").length + 18
    };
  }
}
const dbService = new DatabaseService();
export {
  dbService
};
