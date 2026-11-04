import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  ArrowRight,
  CheckCircle2,
  Building2,
  GraduationCap,
  Briefcase,
  BarChart3,
  ShieldCheck,
  TrendingUp,
  Cpu
} from "lucide-react";
const LandingPage = ({ onExploreRole, onOpenAuth, onNavigateTab }) => {
  const { loginAsDemoUser } = useAuth();
  const [demoSkillText, setDemoSkillText] = useState(
    "React, TypeScript, Python, Node.js, SQL, Docker, Git"
  );
  const [demoRole, setDemoRole] = useState("Full-Stack Software Engineer");
  const [demoAnalyzing, setDemoAnalyzing] = useState(false);
  const [demoReport, setDemoReport] = useState({
    targetRole: "Full-Stack Software Engineer",
    currentSkills: ["React", "TypeScript", "Python", "Node.js", "SQL", "Docker", "Git"],
    matchingSkills: ["React", "TypeScript", "Node.js", "SQL", "Docker"],
    missingSkills: ["System Design & Scalability", "Automated Integration Testing (Jest/Playwright)", "Kubernetes"],
    matchPercentage: 86,
    marketDemandScore: 94,
    analysisSummary: "Candidate possesses 86% of core engineering requirements. Solid foundations in modern React/Node stack with an immediate learning runway in system design and automated testing.",
    careerAdvice: "Complete one distributed queue project or full-stack testing harness to elevate placement readiness into the top 10th percentile.",
    recommendedPathways: [
      {
        skill: "System Design & Scalability",
        category: "Core Architecture",
        priority: "high",
        courses: ["Microservice Architecture Patterns", "Distributed Data Caching with Redis"],
        estimatedWeeks: 3,
        practicalProject: "Design a rate-limited URL shortener or webhook dispatcher."
      },
      {
        skill: "Automated Integration Testing",
        category: "Quality Engineering",
        priority: "medium",
        courses: ["End-to-End Testing with Playwright", "Test-Driven Development in TypeScript"],
        estimatedWeeks: 2,
        practicalProject: "Configure a CI/CD test harness with 85%+ coverage for a REST API."
      }
    ],
    generatedAt: (/* @__PURE__ */ new Date()).toISOString()
  });
  const handleRunDemoAnalysis = async () => {
    setDemoAnalyzing(true);
    try {
      const skillsArr = demoSkillText.split(/[,;\n]/).map((s) => s.trim()).filter(Boolean);
      const res = await fetch("/api/ai/skill-gap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentSkills: skillsArr,
          targetRole: demoRole
        })
      });
      if (res.ok) {
        const data = await res.json();
        setDemoReport(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDemoAnalyzing(false);
    }
  };
  return <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {
    /* Hero Section */
  }
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {
    /* Hero Copy */
  }
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-800 dark:text-teal-300">
                <span>Enterprise EdTech Infrastructure</span>
                <span aria-hidden="true">·</span>
                <span>Version 2026 Academic Standard</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight" style={{ textWrap: "balance" }}>
                Unifying Universities, Students, and Industry on a Single AI-Guided Placement Grid.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                NexusCollab closes the academia-industry gap through automated resume skill extraction, real-time market skill mapping, verified campus drives, and accredited corporate MoUs.
              </p>

              {
    /* Action Buttons */
  }
              <div className="flex flex-wrap gap-3 pt-2">
                <button
    onClick={() => onExploreRole("student")}
    className="px-5 py-3 text-sm font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-white/90 transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 shadow-sm"
  >
                  <span>Launch Student Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
    onClick={() => onExploreRole("tpo")}
    className="px-5 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 border border-slate-300 dark:border-slate-700"
  >
                  <Building2 className="w-4 h-4 text-slate-500" />
                  <span>University Placement Cell</span>
                </button>
                <button
    onClick={() => onExploreRole("recruiter")}
    className="px-5 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 border border-slate-300 dark:border-slate-700"
  >
                  <Briefcase className="w-4 h-4 text-slate-500" />
                  <span>Recruiter Pipeline</span>
                </button>
              </div>

              {
    /* Quick Trust Attributes (Clean Unboxed Metadata) */
  }
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>ABAC Role-Based Access Control</span>
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>WCAG AAA Accessible</span>
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Full-Stack Persistent Database</span>
                </span>
              </div>
            </div>

            {
    /* Hero Visual Banner */
  }
            <div className="lg:col-span-5">
              <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg bg-slate-100 dark:bg-slate-800">
                <img
    src="/src/assets/images/hero_collaboration_summit_1793431838701.jpg"
    alt="Higher education technology campus and corporate executives collaborating"
    className="w-full h-80 sm:h-96 object-cover"
    referrerPolicy="no-referrer"
  />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-5">
                  <div className="text-white text-xs">
                    <p className="font-semibold text-sm">Academia-Industry Convergence Center</p>
                    <p className="text-slate-300">Synchronizing curriculum benchmarks with enterprise tech hiring.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {
    /* Claim-to-Proof Quantitative Metric Bar */
  }
        <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">94.2%</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Verified Campus Placement Rate</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">₹14.8 LPA</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Average Engineering Package</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">320+</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Active Corporate Hiring Partners</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">84</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Active Institutional MoUs</p>
              </div>
            </div>
          </div>
        </div>

        {
    /* Indian Universities & Corporate Ecosystem Ribbon */
  }
        <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[11px] font-bold text-teal-800 dark:text-teal-400 uppercase tracking-wider">
                  Partner Institutional Ecosystem
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Trusted by Training & Placement Cells (TPOs) across Premier Indian Universities & Tech Hubs
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span className="px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 font-mono text-[11px]">
                  Punjab & Pan-India Network
                </span>
              </div>
            </div>

            {
    /* University Badges Grid */
  }
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 pt-4">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">Punjab Premier</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 font-mono">NAAC A+</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">Chandigarh University</p>
                  <p className="text-[11px] text-slate-500">CU Punjab · Mohali Campus</p>
                </div>
                <p className="text-[10px] text-teal-700 dark:text-teal-300 font-medium mt-2 pt-1 border-t border-slate-200/60 dark:border-slate-700">
                  9,500+ Placement Offers · ₹54.7 LPA Highest
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">Punjab Premier</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 font-mono">NIRF Top 40</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">Lovely Professional University</p>
                  <p className="text-[11px] text-slate-500">LPU Punjab · Phagwara Campus</p>
                </div>
                <p className="text-[10px] text-teal-700 dark:text-teal-300 font-medium mt-2 pt-1 border-t border-slate-200/60 dark:border-slate-700">
                  3,000+ Recruiters · ₹64 LPA Highest Domestic
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">Institute of National Importance</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 font-mono">IIT</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">IIT Ropar</p>
                  <p className="text-[11px] text-slate-500">Indian Institute of Tech, Punjab</p>
                </div>
                <p className="text-[10px] text-teal-700 dark:text-teal-300 font-medium mt-2 pt-1 border-t border-slate-200/60 dark:border-slate-700">
                  Core AI & Systems Research Consortia
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">National Institute</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 font-mono">NIT</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">NIT Jalandhar</p>
                  <p className="text-[11px] text-slate-500">Dr. B.R. Ambedkar NIT, Punjab</p>
                </div>
                <p className="text-[10px] text-teal-700 dark:text-teal-300 font-medium mt-2 pt-1 border-t border-slate-200/60 dark:border-slate-700">
                  Engineering & Industrial Automation MoUs
                </p>
              </div>
            </div>

            {
    /* Additional Pan-India institutes banner */
  }
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Also integrated with:</span>
              <div className="flex flex-wrap items-center gap-2 font-medium">
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300">IIT Delhi</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300">IIT Bombay</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300">Thapar University (TIET Patiala)</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300">BITS Pilani</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300">DTU Delhi</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {
    /* Interactive AI Skill-Gap Analyzer Test-Drive */
  }
      <section className="py-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-semibold text-teal-700 dark:text-teal-400">Interactive Engine Demonstration</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              Test-Drive the AI Skill-Gap & Placement Benchmark Engine
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
              Select or type candidate competencies to evaluate alignment against real enterprise recruitment standards.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {
    /* Input Workbench */
  }
            <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-800/80 p-6 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Target Role Benchmark
                </label>
                <select
    value={demoRole}
    onChange={(e) => setDemoRole(e.target.value)}
    className="w-full text-xs p-2.5 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
  >
                  <option value="Full-Stack Software Engineer">Full-Stack Software Engineer</option>
                  <option value="AI/ML Systems Specialist">AI/ML Systems Specialist</option>
                  <option value="Cloud Infrastructure Engineer">Cloud Infrastructure Engineer</option>
                  <option value="Embedded Firmware & IoT Systems Engineer">Embedded Firmware & IoT Systems Engineer</option>
                  <option value="FinTech Quantitative Analyst">FinTech Quantitative Analyst</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Candidate Competencies & Experience Snippet
                </label>
                <textarea
    rows={4}
    value={demoSkillText}
    onChange={(e) => setDemoSkillText(e.target.value)}
    placeholder="e.g. React, TypeScript, Python, Node.js, SQL, Docker..."
    className="w-full text-xs p-3 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-1 focus:ring-slate-900"
  />
              </div>

              {
    /* Preset buttons */
  }
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-500">Quick preset personas:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
    onClick={() => {
      setDemoRole("Full-Stack Software Engineer");
      setDemoSkillText("React, TypeScript, Node.js, PostgreSQL, Docker, Git, REST APIs, Tailwind CSS");
    }}
    className="px-2 py-1 text-[11px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded hover:border-slate-400 text-slate-700 dark:text-slate-300"
  >
                    CS Senior (Full-Stack)
                  </button>
                  <button
    onClick={() => {
      setDemoRole("AI/ML Systems Specialist");
      setDemoSkillText("Python, PyTorch, Linear Algebra, Vector Databases, NumPy, Scikit-learn, Git");
    }}
    className="px-2 py-1 text-[11px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded hover:border-slate-400 text-slate-700 dark:text-slate-300"
  >
                    AI Scholar (PyTorch/ML)
                  </button>
                  <button
    onClick={() => {
      setDemoRole("Embedded Firmware & IoT Systems Engineer");
      setDemoSkillText("C++, Microcontrollers, RTOS, SPI/I2C, Hardware Interfacing, Git");
    }}
    className="px-2 py-1 text-[11px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded hover:border-slate-400 text-slate-700 dark:text-slate-300"
  >
                    Embedded & IoT Scholar
                  </button>
                </div>
              </div>

              <button
    onClick={handleRunDemoAnalysis}
    disabled={demoAnalyzing}
    className="w-full py-2.5 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded-md hover:bg-slate-800 dark:hover:bg-white/90 transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-60"
  >
                {demoAnalyzing ? <span>Computing Multi-Dimensional Fit...</span> : <>
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Run AI Skill-Gap Analysis</span>
                  </>}
              </button>
            </div>

            {
    /* Results Output Canvas */
  }
            <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-800/80 p-6 rounded-xl border border-slate-200 dark:border-slate-700 space-y-5">
              {demoReport ? <>
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                    <div>
                      <p className="text-xs text-slate-500">Benchmark Role</p>
                      <p className="text-base font-bold text-slate-900 dark:text-white">{demoReport.targetRole}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Alignment Fit</p>
                        <p className="text-2xl font-black text-teal-700 dark:text-teal-400 font-mono tabular-nums">
                          {demoReport.matchPercentage}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Market Demand</p>
                        <p className="text-2xl font-black text-amber-700 dark:text-amber-400 font-mono tabular-nums">
                          {demoReport.marketDemandScore}/100
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-700">
                    {demoReport.analysisSummary}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {
    /* Verified Skills */
  }
                    <div className="bg-white dark:bg-slate-900 p-3.5 rounded border border-slate-200 dark:border-slate-700 space-y-2">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                        <span>Verified Matched Skills ({demoReport.matchingSkills.length})</span>
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {demoReport.matchingSkills.map((skill) => <span
    key={skill}
    className="text-[11px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded font-medium"
  >
                            {skill}
                          </span>)}
                      </div>
                    </div>

                    {
    /* Missing Gaps */
  }
                    <div className="bg-white dark:bg-slate-900 p-3.5 rounded border border-slate-200 dark:border-slate-700 space-y-2">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                        <span>Identified Skill Gaps ({demoReport.missingSkills.length})</span>
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {demoReport.missingSkills.map((skill) => <span
    key={skill}
    className="text-[11px] px-2 py-0.5 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 rounded font-medium border border-amber-200 dark:border-amber-800/50"
  >
                            {skill}
                          </span>)}
                      </div>
                    </div>
                  </div>

                  {
    /* Recommended Bridge Pathway */
  }
                  {demoReport.recommendedPathways.length > 0 && <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        Bridging Curriculum Roadmap
                      </p>
                      <div className="space-y-2">
                        {demoReport.recommendedPathways.slice(0, 2).map((pathway, idx) => <div
    key={idx}
    className="bg-white dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
  >
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-white">{pathway.skill}</p>
                              <p className="text-slate-500 text-[11px]">{pathway.practicalProject}</p>
                            </div>
                            <span className="text-slate-600 dark:text-slate-400 whitespace-nowrap text-[11px] font-mono">
                              ~{pathway.estimatedWeeks} Weeks Est.
                            </span>
                          </div>)}
                      </div>
                    </div>}

                  <div className="pt-2 flex justify-end">
                    <button
    onClick={() => onExploreRole("student")}
    className="text-xs font-semibold text-slate-900 dark:text-white hover:underline flex items-center gap-1"
  >
                      <span>Open Full Student Career Workbench</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </> : <div className="text-center py-12 text-slate-500 text-xs">
                  Run an analysis to inspect candidate alignment metrics.
                </div>}
            </div>
          </div>
        </div>
      </section>

      {
    /* Visual Showcase Bento Grid */
  }
      <section className="py-16 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold text-teal-700 dark:text-teal-400">Collaborative Ecosystem</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              Engineered for Institutional Scale & Corporate Rigor
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
              Explore how students, academic deans, and hiring directors collaborate with complete visibility and auditability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {
    /* Card 1: Skill Mapping */
  }
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
              <img
    src="/src/assets/images/skill_mapping_lab_1793431839546.jpg"
    alt="Engineering students and university mentors analyzing curriculum skill matrix"
    className="w-full h-48 object-cover"
    referrerPolicy="no-referrer"
  />
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <span>Curriculum Sync</span>
                    <span aria-hidden="true">·</span>
                    <span>Student Career Lab</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Adaptive Skill-Gap Radar
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Automatically parses resumes, pinpoints exact missing frameworks, and suggests targeted bridging modules verified by corporate mentors.
                  </p>
                </div>
                <button
    onClick={() => onExploreRole("student")}
    className="text-xs font-semibold text-slate-900 dark:text-white hover:underline flex items-center gap-1 pt-2 border-t border-slate-100 dark:border-slate-800"
  >
                  <span>Explore Student View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {
    /* Card 2: Placement Symposium */
  }
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
              <img
    src="/src/assets/images/placement_symposium_1793431840191.jpg"
    alt="Corporate placement interview session in university career center"
    className="w-full h-48 object-cover"
    referrerPolicy="no-referrer"
  />
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <span>Campus Hiring</span>
                    <span aria-hidden="true">·</span>
                    <span>Direct Fast-Track</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Verified Placement Drives
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Orchestrates batch interview rounds, transparent eligibility gates, online coding scores, and direct offer letters without manual spreadsheet friction.
                  </p>
                </div>
                <button
    onClick={() => onExploreRole("tpo")}
    className="text-xs font-semibold text-slate-900 dark:text-white hover:underline flex items-center gap-1 pt-2 border-t border-slate-100 dark:border-slate-800"
  >
                  <span>Explore TPO View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {
    /* Card 3: Industry MoU Signing */
  }
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
              <img
    src="/src/assets/images/industry_mou_signing_1793431840096.jpg"
    alt="Academic dean and enterprise director exchanging signed MoU agreement"
    className="w-full h-48 object-cover"
    referrerPolicy="no-referrer"
  />
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <span>Corporate Alliances</span>
                    <span aria-hidden="true">·</span>
                    <span>Accreditation Ready</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Legally Binding Industry MoUs
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Formalize academic-industry alliances with committed internship quotas, research funding tracking, and joint capstone sponsorship milestones.
                  </p>
                </div>
                <button
    onClick={() => onExploreRole("recruiter")}
    className="text-xs font-semibold text-slate-900 dark:text-white hover:underline flex items-center gap-1 pt-2 border-t border-slate-100 dark:border-slate-800"
  >
                  <span>Explore Recruiter View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {
    /* Strategic Value Pillars for Institutions */
  }
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-semibold text-teal-700 dark:text-teal-400">Institutional Governance</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              Why Premier Universities & EdTech Consortia Trust NexusCollab
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <GraduationCap className="w-6 h-6 text-teal-700 dark:text-teal-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Accreditation Compliance</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Generates audit-ready reports on student placement percentage, highest and average CTC, internship completion ratios, and verified corporate MoUs.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <ShieldCheck className="w-6 h-6 text-teal-700 dark:text-teal-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Verified Academic Credentials</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Prevents resume tampering and GPA inflation. Only verified university students with institutional sign-off can enter formal corporate placement pipelines.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <BarChart3 className="w-6 h-6 text-teal-700 dark:text-teal-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Real-Time Curriculum Feedback</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                AI continuously correlates rejection reasons and missing skills from corporate interview loops back into academic syllabus enhancement recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {
    /* Call to Action Bar */
  }
      <section className="py-12 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold">Ready to modernize your campus placement & skill ecosystem?</h2>
            <p className="text-xs text-slate-400">Experience role-based workspaces designed for students, institutions, and enterprise recruiters.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
    onClick={onOpenAuth}
    className="px-5 py-2.5 text-xs font-semibold bg-white text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
  >
              Sign Up Institution
            </button>
            <button
    onClick={() => onExploreRole("student")}
    className="px-5 py-2.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-md transition-colors border border-slate-700"
  >
              Test Live Demo
            </button>
          </div>
        </div>
      </section>
    </div>;
};
export {
  LandingPage
};
