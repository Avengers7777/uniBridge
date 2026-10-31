import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid, 
  ReferenceLine,
  Cell
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Award, 
  Sparkles, 
  Layers, 
  Target, 
  BookOpen, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { SkillGapReport } from '../types/index.ts';

interface Props {
  userSkills: string[];
  targetRole: string;
  onSelectRole: (role: string) => void;
  skillGapReport: SkillGapReport | null;
  onRunAnalysis: () => void;
  isAnalyzing: boolean;
}

// 6 Core Engineering Competency Dimensions
interface CompetencyMetric {
  dimension: string;
  candidateScore: number;
  industryBenchmark: number;
  fullMark: number;
  description: string;
}

// Target roles benchmark requirements
const ROLE_BENCHMARKS: Record<string, {
  name: string;
  category: string;
  industryThreshold: number;
  dimensions: {
    frontend: number;
    backend: number;
    data: number;
    cloud: number;
    sysdesign: number;
    dsa: number;
  };
  keySkills: { name: string; requiredLevel: number; category: string }[];
}> = {
  'Full-Stack Software Engineer': {
    name: 'Full-Stack Software Engineer',
    category: 'Application Engineering',
    industryThreshold: 80,
    dimensions: {
      frontend: 88,
      backend: 85,
      data: 80,
      cloud: 75,
      sysdesign: 82,
      dsa: 85,
    },
    keySkills: [
      { name: 'TypeScript & React', requiredLevel: 90, category: 'Frontend' },
      { name: 'Node.js & Express REST APIs', requiredLevel: 85, category: 'Backend' },
      { name: 'PostgreSQL & Relational Modeling', requiredLevel: 80, category: 'Data & DB' },
      { name: 'Docker & Containerization', requiredLevel: 75, category: 'DevOps' },
      { name: 'Distributed Caching (Redis)', requiredLevel: 70, category: 'Architecture' },
      { name: 'Data Structures & Algorithms', requiredLevel: 85, category: 'Problem Solving' },
      { name: 'Automated Testing (Jest/Playwright)', requiredLevel: 75, category: 'Quality' },
    ],
  },
  'AI/ML Systems Specialist': {
    name: 'AI/ML Systems Specialist',
    category: 'Applied Intelligence',
    industryThreshold: 85,
    dimensions: {
      frontend: 45,
      backend: 85,
      data: 92,
      cloud: 85,
      sysdesign: 82,
      dsa: 92,
    },
    keySkills: [
      { name: 'Python & PyTorch', requiredLevel: 95, category: 'ML Core' },
      { name: 'Vector Databases & Embeddings', requiredLevel: 85, category: 'GenAI' },
      { name: 'Mathematical Foundations & Linear Algebra', requiredLevel: 90, category: 'Mathematics' },
      { name: 'Data Pipelines & SQL', requiredLevel: 85, category: 'Data & DB' },
      { name: 'Model Optimization & Quantization', requiredLevel: 78, category: 'MLOps' },
      { name: 'Containerization & GPU Orchestration', requiredLevel: 80, category: 'Cloud' },
    ],
  },
  'Cloud Infrastructure Engineer': {
    name: 'Cloud Infrastructure Engineer',
    category: 'Infrastructure & Platforms',
    industryThreshold: 78,
    dimensions: {
      frontend: 40,
      backend: 80,
      data: 80,
      cloud: 95,
      sysdesign: 90,
      dsa: 80,
    },
    keySkills: [
      { name: 'Docker & Container Runtimes', requiredLevel: 95, category: 'Containers' },
      { name: 'Kubernetes Cluster Management', requiredLevel: 85, category: 'Orchestration' },
      { name: 'Linux Kernel & Shell Automation', requiredLevel: 90, category: 'Systems' },
      { name: 'CI/CD Pipelines & GitOps', requiredLevel: 85, category: 'DevOps' },
      { name: 'Cloud Networking (VPC, DNS, TLS)', requiredLevel: 88, category: 'Networking' },
      { name: 'Terraform & Infrastructure as Code', requiredLevel: 80, category: 'IaC' },
    ],
  },
  'Embedded Firmware & IoT Systems Engineer': {
    name: 'Embedded Firmware & IoT Systems Engineer',
    category: 'Hardware & Edge Systems',
    industryThreshold: 80,
    dimensions: {
      frontend: 35,
      backend: 75,
      data: 65,
      cloud: 72,
      sysdesign: 85,
      dsa: 88,
    },
    keySkills: [
      { name: 'C / C++ Modern Standards', requiredLevel: 95, category: 'Languages' },
      { name: 'RTOS & Embedded Task Scheduling', requiredLevel: 88, category: 'Firmware' },
      { name: 'Hardware Protocols (I2C, SPI, UART, CAN)', requiredLevel: 90, category: 'Protocols' },
      { name: 'Microcontroller Architecture (ARM Cortex)', requiredLevel: 85, category: 'Hardware' },
      { name: 'Low-Power IoT Network Stacks (BLE, 5G)', requiredLevel: 80, category: 'Networking' },
      { name: 'Memory Optimization & Debugging', requiredLevel: 90, category: 'Systems' },
    ],
  },
  'FinTech Quantitative Analyst': {
    name: 'FinTech Quantitative Analyst',
    category: 'Quantitative Finance & Trading',
    industryThreshold: 85,
    dimensions: {
      frontend: 50,
      backend: 88,
      data: 95,
      cloud: 75,
      sysdesign: 85,
      dsa: 95,
    },
    keySkills: [
      { name: 'Python (NumPy, Pandas, SciPy)', requiredLevel: 95, category: 'Analytics' },
      { name: 'Time-Series Data & SQL Analytics', requiredLevel: 92, category: 'Data & DB' },
      { name: 'Statistical Arbitrage & Risk Modeling', requiredLevel: 88, category: 'Quantitative' },
      { name: 'C++ Low Latency Order Execution', requiredLevel: 85, category: 'Low-Latency' },
      { name: 'Data Structures & Algorithmic Complexity', requiredLevel: 95, category: 'Problem Solving' },
      { name: 'Distributed Message Streams (Kafka)', requiredLevel: 80, category: 'Architecture' },
    ],
  },
};

export const SkillAnalyticsDashboard: React.FC<Props> = ({
  userSkills,
  targetRole,
  onSelectRole,
  skillGapReport,
  onRunAnalysis,
  isAnalyzing
}) => {
  const [activeVisualizationTab, setActiveVisualizationTab] = useState<'radar' | 'crossRole' | 'skillMatrix'>('radar');
  const [selectedSkillDetail, setSelectedSkillDetail] = useState<string | null>(null);

  // Normalize current user skills lowercase set
  const userSkillSet = useMemo(() => {
    return new Set(userSkills.map(s => s.toLowerCase().trim()));
  }, [userSkills]);

  const hasSkill = (name: string): boolean => {
    const n = name.toLowerCase();
    for (const s of userSkillSet) {
      if (n.includes(s) || s.includes(n)) return true;
    }
    return false;
  };

  // Compute candidate scores across the 6 dimensions
  const radarData: CompetencyMetric[] = useMemo(() => {
    const roleConfig = ROLE_BENCHMARKS[targetRole] || ROLE_BENCHMARKS['Full-Stack Software Engineer'];

    // Frontend Score calculation
    let feScore = 30;
    if (hasSkill('react')) feScore += 25;
    if (hasSkill('typescript')) feScore += 20;
    if (hasSkill('javascript')) feScore += 10;
    if (hasSkill('tailwind') || hasSkill('css')) feScore += 10;
    if (hasSkill('next.js')) feScore += 10;
    feScore = Math.min(100, feScore);

    // Backend Score calculation
    let beScore = 30;
    if (hasSkill('node')) beScore += 25;
    if (hasSkill('python')) beScore += 20;
    if (hasSkill('rest') || hasSkill('api')) beScore += 15;
    if (hasSkill('c++') || hasSkill('java')) beScore += 15;
    beScore = Math.min(100, beScore);

    // Data & Caching Score
    let dataScore = 30;
    if (hasSkill('sql') || hasSkill('postgresql')) dataScore += 30;
    if (hasSkill('redis') || hasSkill('cache')) dataScore += 20;
    if (hasSkill('pytorch') || hasSkill('vector')) dataScore += 20;
    dataScore = Math.min(100, dataScore);

    // Cloud & DevOps Score
    let cloudScore = 25;
    if (hasSkill('docker')) cloudScore += 30;
    if (hasSkill('git')) cloudScore += 15;
    if (hasSkill('kubernetes')) cloudScore += 20;
    if (hasSkill('linux') || hasSkill('aws')) cloudScore += 15;
    cloudScore = Math.min(100, cloudScore);

    // System Design Score
    let sysScore = 35;
    if (hasSkill('distributed')) sysScore += 30;
    if (hasSkill('docker') && hasSkill('node')) sysScore += 15;
    if (hasSkill('system design')) sysScore += 25;
    sysScore = Math.min(100, sysScore);

    // DSA & Problem Solving
    let dsaScore = 40;
    if (hasSkill('data structures') || hasSkill('algorithms')) dsaScore += 35;
    if (hasSkill('c++') || hasSkill('java')) dsaScore += 15;
    if (hasSkill('python')) dsaScore += 10;
    dsaScore = Math.min(100, dsaScore);

    return [
      {
        dimension: 'Frontend & UI',
        candidateScore: feScore,
        industryBenchmark: roleConfig.dimensions.frontend,
        fullMark: 100,
        description: 'Client state management, responsive UI, component performance'
      },
      {
        dimension: 'Backend & APIs',
        candidateScore: beScore,
        industryBenchmark: roleConfig.dimensions.backend,
        fullMark: 100,
        description: 'REST/gRPC interfaces, business logic, asynchronous event pipelines'
      },
      {
        dimension: 'Data & Databases',
        candidateScore: dataScore,
        industryBenchmark: roleConfig.dimensions.data,
        fullMark: 100,
        description: 'Query optimization, schema normalization, caching layers'
      },
      {
        dimension: 'Cloud & DevOps',
        candidateScore: cloudScore,
        industryBenchmark: roleConfig.dimensions.cloud,
        fullMark: 100,
        description: 'Containers, deployment pipelines, infrastructure automation'
      },
      {
        dimension: 'System Design',
        candidateScore: sysScore,
        industryBenchmark: roleConfig.dimensions.sysdesign,
        fullMark: 100,
        description: 'Microservice decoupling, resilience patterns, high throughput'
      },
      {
        dimension: 'Algorithms & DSA',
        candidateScore: dsaScore,
        industryBenchmark: roleConfig.dimensions.dsa,
        fullMark: 100,
        description: 'Algorithmic time complexity, memory allocation, problem solving'
      },
    ];
  }, [userSkills, targetRole]);

  // Compute Cross-Role Placement Benchmark Comparison
  const crossRoleData = useMemo(() => {
    return Object.keys(ROLE_BENCHMARKS).map(roleKey => {
      const roleCfg = ROLE_BENCHMARKS[roleKey];
      // Compute matching percentage based on key skills required
      const matchingSkillsCount = roleCfg.keySkills.filter(s => hasSkill(s.name.split(' ')[0])).length;
      const fitScore = Math.min(96, Math.max(45, Math.round((matchingSkillsCount / roleCfg.keySkills.length) * 100)));

      return {
        roleKey,
        roleShortName: roleKey.length > 20 ? roleKey.split(' ')[0] + ' ' + (roleKey.split(' ')[1] || '') : roleKey,
        roleFullName: roleKey,
        candidateFit: roleKey === targetRole && skillGapReport ? skillGapReport.matchPercentage : fitScore,
        industryThreshold: roleCfg.industryThreshold,
        category: roleCfg.category
      };
    });
  }, [userSkills, targetRole, skillGapReport]);

  // Key skill breakdown for the active role
  const activeRoleSkills = useMemo(() => {
    const roleCfg = ROLE_BENCHMARKS[targetRole] || ROLE_BENCHMARKS['Full-Stack Software Engineer'];
    return roleCfg.keySkills.map(skill => {
      const isMatched = hasSkill(skill.name.split(' ')[0]) || (skillGapReport?.matchingSkills.some(s => skill.name.toLowerCase().includes(s.toLowerCase())) ?? false);
      const userLevel = isMatched ? Math.min(95, skill.requiredLevel + 5) : Math.max(35, skill.requiredLevel - 35);
      const delta = userLevel - skill.requiredLevel;

      return {
        ...skill,
        isMatched,
        userLevel,
        delta,
        status: delta >= 0 ? 'exceeded' : delta >= -15 ? 'acceptable' : 'critical_gap'
      };
    });
  }, [targetRole, userSkills, skillGapReport]);

  // Overall readiness index
  const averageCandidateScore = Math.round(
    radarData.reduce((acc, curr) => acc + curr.candidateScore, 0) / radarData.length
  );
  const averageBenchmark = Math.round(
    radarData.reduce((acc, curr) => acc + curr.industryBenchmark, 0) / radarData.length
  );
  const readinessGap = averageCandidateScore - averageBenchmark;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6">
      {/* Header with Role Benchmark Selector & Live Metrics */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Industry Skill Readiness Telemetry</span>
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              Recharts Visualizer
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1">
            Skill Competency Matrix vs. 2026 Industry Hiring Standards
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time multi-axis comparison evaluating your verified coursework, repositories, and technical abilities against tier-1 recruiters.
          </p>
        </div>

        {/* Target Role Selector & Metric Chips */}
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Active Benchmark Role
            </label>
            <select
              value={targetRole}
              onChange={(e) => onSelectRole(e.target.value)}
              className="text-xs py-2 px-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-1 focus:ring-slate-900"
            >
              {Object.keys(ROLE_BENCHMARKS).map(roleKey => (
                <option key={roleKey} value={roleKey}>
                  {roleKey}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 pt-4 sm:pt-0">
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center min-w-20">
              <span className="text-[10px] text-slate-500 block uppercase">Candidate</span>
              <span className="text-base font-black text-slate-900 dark:text-white font-mono">
                {averageCandidateScore}%
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center min-w-20">
              <span className="text-[10px] text-slate-500 block uppercase">Benchmark</span>
              <span className="text-base font-black text-slate-600 dark:text-slate-400 font-mono">
                {averageBenchmark}%
              </span>
            </div>
            <div className={`p-2.5 rounded-lg border text-center min-w-24 ${
              readinessGap >= 0 
                ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800/60 text-teal-800 dark:text-teal-300'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300'
            }`}>
              <span className="text-[10px] block uppercase font-semibold">Net Gap</span>
              <span className="text-base font-black font-mono">
                {readinessGap >= 0 ? `+${readinessGap}%` : `${readinessGap}%`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visualizer Mode Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveVisualizationTab('radar')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              activeVisualizationTab === 'radar'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Multi-Axis Competency Radar</span>
          </button>
          <button
            onClick={() => setActiveVisualizationTab('crossRole')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              activeVisualizationTab === 'crossRole'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Cross-Role Hiring Readiness</span>
          </button>
          <button
            onClick={() => setActiveVisualizationTab('skillMatrix')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              activeVisualizationTab === 'skillMatrix'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Detailed Skill Delta Matrix</span>
          </button>
        </div>

        <button
          onClick={onRunAnalysis}
          disabled={isAnalyzing}
          className="px-3.5 py-1.5 text-xs font-semibold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-md hover:bg-slate-800 dark:hover:bg-white/90 transition-colors flex items-center gap-1.5 disabled:opacity-60"
        >
          <Cpu className="w-3.5 h-3.5 text-amber-400" />
          <span>{isAnalyzing ? 'Recomputing Telemetry...' : 'Refresh AI Diagnostic'}</span>
        </button>
      </div>

      {/* VIEW 1: Multi-Axis Competency RadarChart */}
      {activeVisualizationTab === 'radar' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center min-h-[380px]">
            <div className="w-full flex items-center justify-between text-xs px-2 mb-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Radar Spectrum: {targetRole}
              </span>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-600 dark:bg-teal-400 inline-block"></span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Candidate Ability</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-500 inline-block"></span>
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Industry Benchmark</span>
                </span>
              </div>
            </div>

            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" opacity={0.6} />
                  <PolarAngleAxis 
                    dataKey="dimension" 
                    tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} 
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 100]} 
                    tick={{ fill: '#94a3b8', fontSize: 9 }} 
                  />
                  {/* Industry Standard Baseline */}
                  <Radar
                    name="Industry Benchmark"
                    dataKey="industryBenchmark"
                    stroke="#94a3b8"
                    fill="#94a3b8"
                    fillOpacity={0.2}
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                  />
                  {/* Candidate Current Ability */}
                  <Radar
                    name="Candidate Ability"
                    dataKey="candidateScore"
                    stroke="#0f766e"
                    fill="#0f766e"
                    fillOpacity={0.45}
                    strokeWidth={2.5}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload as CompetencyMetric;
                        const diff = data.candidateScore - data.industryBenchmark;
                        return (
                          <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg text-xs space-y-1">
                            <p className="font-bold text-slate-900 dark:text-white">{data.dimension}</p>
                            <p className="text-[11px] text-slate-500">{data.description}</p>
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-0.5 font-mono">
                              <p className="text-teal-700 dark:text-teal-400">
                                Candidate Score: <strong>{data.candidateScore}%</strong>
                              </p>
                              <p className="text-slate-500">
                                Industry Standard: <strong>{data.industryBenchmark}%</strong>
                              </p>
                              <p className={`font-semibold ${diff >= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                Variance: {diff >= 0 ? `+${diff}%` : `${diff}%`}
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Dimension Breakdown Cards */}
          <div className="lg:col-span-5 space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Competency Dimension Breakdown
            </h3>
            <div className="space-y-2">
              {radarData.map(item => {
                const diff = item.candidateScore - item.industryBenchmark;
                const isReady = diff >= 0;
                return (
                  <div
                    key={item.dimension}
                    className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                        {isReady ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        )}
                        <span>{item.dimension}</span>
                      </p>
                      <p className="text-[11px] text-slate-500 max-w-xs">{item.description}</p>
                    </div>

                    <div className="text-right font-mono">
                      <div className="flex items-center gap-2 justify-end">
                        <span className="font-bold text-slate-900 dark:text-white">{item.candidateScore}%</span>
                        <span className="text-slate-400 text-[10px]">/ {item.industryBenchmark}%</span>
                      </div>
                      <span className={`text-[10px] font-semibold ${isReady ? 'text-teal-700 dark:text-teal-400' : 'text-amber-700 dark:text-amber-400'}`}>
                        {diff >= 0 ? `+${diff}% Ready` : `${diff}% Deficit`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Cross-Role Hiring Readiness BarChart */}
      {activeVisualizationTab === 'crossRole' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                Candidate Fit Across Industry Job Families
              </h3>
              <p className="text-slate-500 text-[11px]">
                Click on any role bar to switch the active benchmark target and recalibrate your skill gap analysis.
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-medium">
              <span className="flex items-center gap-1 text-teal-700 dark:text-teal-400">
                <span className="w-3 h-3 bg-teal-700 rounded-sm inline-block"></span>
                <span>Active Target</span>
              </span>
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                <span className="w-3 h-3 bg-slate-700 rounded-sm inline-block"></span>
                <span>Other Roles</span>
              </span>
              <span className="flex items-center gap-1 text-amber-600 font-mono">
                <span className="w-3 h-0.5 bg-amber-500 inline-block"></span>
                <span>Cutoff Threshold (75%)</span>
              </span>
            </div>
          </div>

          <div className="w-full h-80 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={crossRoleData}
                margin={{ top: 20, right: 30, left: 10, bottom: 40 }}
                onClick={(e: any) => {
                  if (e && e.activePayload && e.activePayload[0]) {
                    const selected = e.activePayload[0].payload?.roleFullName;
                    if (selected) onSelectRole(selected);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.5} />
                <XAxis 
                  dataKey="roleShortName" 
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis 
                  domain={[0, 100]} 
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  unit="%" 
                />
                <Tooltip
                  cursor={{ fill: 'rgba(15, 23, 42, 0.05)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const isPassing = data.candidateFit >= data.industryThreshold;
                      return (
                        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg text-xs space-y-1">
                          <p className="font-bold text-slate-900 dark:text-white">{data.roleFullName}</p>
                          <p className="text-[11px] text-slate-500">{data.category}</p>
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-0.5 font-mono">
                            <p className="text-teal-700 dark:text-teal-400">
                              Candidate Fit: <strong>{data.candidateFit}%</strong>
                            </p>
                            <p className="text-slate-500">
                              Placement Cutoff: <strong>{data.industryThreshold}%</strong>
                            </p>
                            <p className={`font-semibold ${isPassing ? 'text-emerald-600' : 'text-amber-600'}`}>
                              {isPassing ? '✓ Placement Benchmark Met' : '⚠ Skill Gap Exists'}
                            </p>
                          </div>
                          <p className="text-[10px] text-teal-600 dark:text-teal-400 pt-1">
                            Click bar to activate this role
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {/* 75% Tier-1 Cutoff Reference Line */}
                <ReferenceLine 
                  y={75} 
                  stroke="#d97706" 
                  strokeDasharray="4 4" 
                  label={{ 
                    value: 'Placement Cutoff 75%', 
                    fill: '#d97706', 
                    fontSize: 10, 
                    position: 'insideTopRight' 
                  }} 
                />
                <Bar 
                  dataKey="candidateFit" 
                  radius={[4, 4, 0, 0]}
                  name="Candidate Match"
                >
                  {crossRoleData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.roleFullName === targetRole ? '#0f766e' : '#334155'}
                      className="cursor-pointer transition-opacity hover:opacity-80"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* VIEW 3: Detailed Skill Delta Matrix */}
      {activeVisualizationTab === 'skillMatrix' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                Core Skill Requirements & Proficiency Variance: {targetRole}
              </h3>
              <p className="text-slate-500 text-[11px]">
                Granular competencies mandated by recruitment panels and campus drive eligibility criteria.
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              {activeRoleSkills.filter(s => s.isMatched).length} / {activeRoleSkills.length} Skills Verified
            </span>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-500">
                    <th className="py-2.5 px-4 font-semibold">Competency Requirement</th>
                    <th className="py-2.5 px-4 font-semibold">Category</th>
                    <th className="py-2.5 px-4 font-semibold">Proficiency Bar</th>
                    <th className="py-2.5 px-4 font-semibold">Industry Target</th>
                    <th className="py-2.5 px-4 font-semibold">Status & Delta</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {activeRoleSkills.map(skill => {
                    const isExceeded = skill.status === 'exceeded';
                    const isAcceptable = skill.status === 'acceptable';
                    return (
                      <tr key={skill.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                          <div className="flex items-center gap-2">
                            {isExceeded ? (
                              <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                            )}
                            <span>{skill.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px]">
                            {skill.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 w-44">
                          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                isExceeded ? 'bg-teal-600 dark:bg-teal-400' : 'bg-amber-500'
                              }`}
                              style={{ width: `${skill.userLevel}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                            Current: {skill.userLevel}%
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                          {skill.requiredLevel}%
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border font-mono ${
                            isExceeded
                              ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800'
                              : isAcceptable
                              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                          }`}>
                            {skill.delta >= 0 ? `+${skill.delta}% Ready` : `${skill.delta}% Gap`}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedSkillDetail(skill.name)}
                            className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline inline-flex items-center gap-1"
                          >
                            <span>Bridging Module</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Bridging Module Modal */}
      {selectedSkillDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Bridging Roadmap: {selectedSkillDetail}</span>
              </h3>
              <button
                onClick={() => setSelectedSkillDetail(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Recommended practical coursework and capstone project to close the competency delta for <strong>{selectedSkillDetail}</strong> prior to upcoming campus interviews.
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <p className="font-semibold text-slate-900 dark:text-white">Module 1: Practical Enterprise Implementation</p>
                <p className="text-[11px] text-slate-500 mt-0.5">2-week hands-on syllabus verified by university industry mentors.</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <p className="font-semibold text-slate-900 dark:text-white">Module 2: Real-World Portfolio Project</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Build a high-throughput module with unit test coverage to showcase on GitHub.</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedSkillDetail(null)}
                className="px-4 py-2 text-xs font-semibold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-md hover:bg-slate-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
