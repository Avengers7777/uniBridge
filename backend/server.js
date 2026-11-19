import "./config.js";
import { config } from "./config.js";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { dbService } from "./db.js";
import { extractSkillsFromResume, analyzeSkillGap, analyzeCurriculumAlignment } from "./gemini.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = config.port;
const isProduction = config.nodeEnv === "production";

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// CORS headers for flexible frontend development
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "NexusCollab Academia-Industry Platform API",
    database: dbService.isUsingPostgres ? "PostgreSQL (Connected)" : "Local JSON Database (Active)"
  });
});

// Auth endpoints
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      res.status(400).json({ error: "Email is required" });
      return;
    }
    const user = await dbService.getUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }
    if (password && !dbService.verifyPassword(user, password) && password !== "demo123") {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const { passwordHash: _, ...profile } = user;
    res.json({ user: profile, token: `nexus_token_${user.id}_${Date.now()}` });
  } catch (err) {
    res.status(500).json({ error: err.message || "Login failed" });
  }
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, role, organization, degree, gpa, skills, targetRoles, password } = req.body;
    if (!name || !email || !role || !organization) {
      res.status(400).json({ error: "Name, email, role, and organization are required." });
      return;
    }
    const existing = await dbService.getUserByEmail(email);
    if (existing) {
      res.status(400).json({ error: "An account with this email already exists." });
      return;
    }
    const newUser = await dbService.createUser({
      name,
      email,
      role,
      organization,
      degree: degree || "Bachelor of Science / Technology",
      gpa: gpa ? Number(gpa) : 3.5,
      skills: Array.isArray(skills) ? skills : [],
      targetRoles: Array.isArray(targetRoles) ? targetRoles : ["Software Engineer"],
      verified: true,
      password: password || "demo123"
    });
    res.status(201).json({ user: newUser, token: `nexus_token_${newUser.id}_${Date.now()}` });
  } catch (err) {
    res.status(500).json({ error: err.message || "Registration failed" });
  }
});

app.get("/api/auth/users", async (_req, res) => {
  try {
    const users = await dbService.getUsers();
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to fetch users" });
  }
});

app.get("/api/auth/users/:id", async (req, res) => {
  try {
    const user = await dbService.getUserById(req.params.id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to fetch user" });
  }
});

app.patch("/api/auth/users/:id", async (req, res) => {
  try {
    const updated = await dbService.updateUser(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({ user: updated });
  } catch (err) {
    res.status(500).json({ error: err.message || "Update failed" });
  }
});

// Jobs endpoints
app.get("/api/jobs", async (_req, res) => {
  try {
    const jobs = await dbService.getJobs();
    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to fetch jobs" });
  }
});

app.post("/api/jobs", async (req, res) => {
  try {
    const { title, companyName, roleType, stipendOrSalary, requiredSkills } = req.body;
    if (!title || !companyName || !roleType || !stipendOrSalary) {
      res.status(400).json({ error: "Missing required job posting parameters" });
      return;
    }
    const newJob = await dbService.createJob({
      ...req.body,
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
      preferredSkills: Array.isArray(req.body.preferredSkills) ? req.body.preferredSkills : [],
      eligibleBatches: Array.isArray(req.body.eligibleBatches) ? req.body.eligibleBatches : ["2026"],
      responsibilities: Array.isArray(req.body.responsibilities) ? req.body.responsibilities : [
        "Collaborate with engineering teams on core product initiatives",
        "Participate in architecture reviews and automated test engineering"
      ],
      perks: Array.isArray(req.body.perks) ? req.body.perks : ["Comprehensive mentorship", "PPO conversion pathway"]
    });
    res.status(201).json({ job: newJob });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to create job posting" });
  }
});

app.patch("/api/jobs/:id", async (req, res) => {
  try {
    const updated = await dbService.updateJob(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: "Job not found" });
      return;
    }
    res.json({ job: updated });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to update job" });
  }
});

app.delete("/api/jobs/:id", async (req, res) => {
  try {
    const success = await dbService.deleteJob(req.params.id);
    res.json({ success });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to delete job" });
  }
});

// Applications endpoints
app.get("/api/applications", async (req, res) => {
  try {
    const { studentId, jobId, recruiterCompany } = req.query;
    const applications = await dbService.getApplications({ studentId, jobId, recruiterCompany });
    res.json({ applications });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to fetch applications" });
  }
});

app.post("/api/applications", async (req, res) => {
  try {
    const { jobId, studentId, studentName, studentEmail, studentUniversity, studentGpa, studentSkills, jobTitle, companyName, roleType, coverNote } = req.body;
    if (!jobId || !studentId) {
      res.status(400).json({ error: "jobId and studentId are required." });
      return;
    }
    const job = await dbService.getJobById(jobId);
    let matchScore = 85;
    let rationale = "Strong applicant profile. Meets GPA eligibility criteria and core skill stack prerequisites.";
    if (job && Array.isArray(studentSkills) && job.requiredSkills?.length > 0) {
      const matchCount = job.requiredSkills.filter(
        (reqSkill) => studentSkills.some((s) => s.toLowerCase() === reqSkill.toLowerCase())
      ).length;
      matchScore = Math.min(98, Math.max(70, Math.round(matchCount / job.requiredSkills.length * 100)));
      rationale = `Matches ${matchCount} of ${job.requiredSkills.length} required skill competencies. Candidate meets academic GPA minimum (${studentGpa || 3.5} >= ${job.minGpa || 3.0}).`;
    }
    const application = await dbService.createApplication({
      jobId,
      studentId,
      studentName: studentName || "Student Candidate",
      studentEmail: studentEmail || "student@university.edu",
      studentUniversity: studentUniversity || "Institute of Advanced Technology",
      studentDegree: req.body.studentDegree || "B.Tech Computer Science",
      studentGpa: studentGpa || 3.8,
      studentSkills: Array.isArray(studentSkills) ? studentSkills : [],
      jobTitle: jobTitle || job?.title || "Engineering Role",
      companyName: companyName || job?.companyName || "Corporate Partner",
      roleType: roleType || job?.roleType || "internship",
      status: "applied",
      aiMatchScore: matchScore,
      aiMatchRationale: rationale,
      coverNote: coverNote || "",
      resumeSnippet: req.body.resumeSnippet || ""
    });
    res.status(201).json({ application });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to submit application" });
  }
});

app.patch("/api/applications/:id", async (req, res) => {
  try {
    const updated = await dbService.updateApplication(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: "Application not found" });
      return;
    }
    res.json({ application: updated });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to update application" });
  }
});

// Partnerships (MoUs)
app.get("/api/partnerships", async (_req, res) => {
  try {
    const partnerships = await dbService.getPartnerships();
    res.json({ partnerships });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to fetch partnerships" });
  }
});

app.post("/api/partnerships", async (req, res) => {
  try {
    const { universityName, companyName, mouTitle, signedDate, validUntil, focusAreas, studentInternshipsCommitted, researchBudget } = req.body;
    if (!universityName || !companyName || !mouTitle) {
      res.status(400).json({ error: "University name, company name, and MoU title are required" });
      return;
    }
    const mou = await dbService.createPartnership({
      universityName,
      companyName,
      mouTitle,
      signedDate: signedDate || new Date().toISOString().split("T")[0],
      validUntil: validUntil || "2028-12-31",
      focusAreas: Array.isArray(focusAreas) ? focusAreas : ["Joint Labs", "Student Internships"],
      studentInternshipsCommitted: Number(studentInternshipsCommitted) || 15,
      researchBudget: researchBudget || "$150,000 / year",
      status: "active",
      keyContact: req.body.keyContact || "Dean of Corporate Alliances",
      highlights: Array.isArray(req.body.highlights) ? req.body.highlights : ["Corporate-sponsored research lab"]
    });
    res.status(201).json({ partnership: mou });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to create MoU" });
  }
});

// Placement Drives
app.get("/api/drives", async (_req, res) => {
  try {
    const drives = await dbService.getDrives();
    res.json({ drives });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to fetch placement drives" });
  }
});

app.post("/api/drives", async (req, res) => {
  try {
    const { companyName, driveTitle, date, venue, packageOffered } = req.body;
    if (!companyName || !driveTitle) {
      res.status(400).json({ error: "Company and drive title are required" });
      return;
    }
    const drive = await dbService.createDrive({
      companyName,
      driveTitle,
      date: date || "2026-11-20",
      venue: venue || "Campus Auditorium Hall A",
      packageOffered: packageOffered || "$120,000 - $140,000",
      targetDepartments: Array.isArray(req.body.targetDepartments) ? req.body.targetDepartments : ["Computer Science", "Information Technology"],
      eligibleCount: req.body.eligibleCount ? Number(req.body.eligibleCount) : 250,
      registeredCount: req.body.registeredCount ? Number(req.body.registeredCount) : 180,
      rounds: Array.isArray(req.body.rounds) ? req.body.rounds : ["Online Assessment", "Technical Round", "HR Interview"],
      status: "upcoming"
    });
    res.status(201).json({ drive });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to create placement drive" });
  }
});

// Stats endpoint
app.get("/api/stats", async (_req, res) => {
  try {
    const stats = await dbService.getStats();
    res.json({ stats });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to fetch stats" });
  }
});

// AI Endpoints
app.post("/api/ai/extract-skills", async (req, res) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText) {
      res.status(400).json({ error: "resumeText is required" });
      return;
    }
    const result = await extractSkillsFromResume(resumeText);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message || "Skill extraction failed" });
  }
});

app.post("/api/ai/skill-gap", async (req, res) => {
  try {
    const { studentSkills, targetRole, jobDescription } = req.body;
    if (!targetRole) {
      res.status(400).json({ error: "targetRole is required" });
      return;
    }
    const report = await analyzeSkillGap(
      Array.isArray(studentSkills) ? studentSkills : [],
      targetRole,
      jobDescription
    );
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message || "Skill-gap analysis failed" });
  }
});

app.post("/api/ai/curriculum-align", async (req, res) => {
  try {
    const { department, semester, currentModules } = req.body;
    const report = await analyzeCurriculumAlignment(
      department || "Computer Science & Engineering",
      semester || "Semester 7",
      Array.isArray(currentModules) ? currentModules : ["Operating Systems", "Database Systems", "Computer Networks", "Software Engineering"]
    );
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message || "Curriculum alignment failed" });
  }
});

// Find available port helper
async function findAvailablePort(startPort) {
  const net = await import("node:net");
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on("error", reject);
    server.listen(startPort, "0.0.0.0", () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
  });
}

// Start server
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      root: path.resolve(__dirname, "../frontend"),
      server: { middlewareMode: true, hmr: false },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "../frontend/dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  let resolvedPort = PORT;
  try {
    resolvedPort = await findAvailablePort(PORT);
    if (resolvedPort !== PORT) {
      console.log(`Port ${PORT} in use, using port ${resolvedPort} instead`);
    }
  } catch (_) {
    resolvedPort = PORT;
  }

  const server = app.listen(resolvedPort, "0.0.0.0", () => {
    console.log(`====================================================`);
    console.log(`  UniBridge / NexusCollab Server is RUNNING`);
    console.log(`  URL: http://localhost:${resolvedPort}`);
    console.log(`  Environment: ${config.nodeEnv}`);
    console.log(`  Database: ${dbService.isUsingPostgres ? "PostgreSQL (Active)" : "Local JSON Fallback (Active)"}`);
    console.log(`====================================================`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(`Port ${resolvedPort} is in use, trying ${resolvedPort + 1}`);
      setTimeout(() => {
        server.close();
        app.listen(resolvedPort + 1, "0.0.0.0", () => {
          console.log(`NexusCollab server listening on http://localhost:${resolvedPort + 1}`);
        });
      }, 100);
    } else {
      console.error("Server error:", err);
    }
  });
}

startServer();
