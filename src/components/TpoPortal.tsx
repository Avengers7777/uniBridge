import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { 
  PlacementDrive, 
  IndustryPartnership, 
  CurriculumAnalysisReport, 
  PortalStats, 
  UserProfile 
} from '../types/index.ts';
import { 
  Building2, 
  GraduationCap, 
  TrendingUp, 
  Calendar, 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  Plus, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  Users, 
  DollarSign, 
  X,
  ExternalLink
} from 'lucide-react';

export const TpoPortal: React.FC = () => {
  const { user, showNotification } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'students' | 'drives' | 'mous'>('overview');

  // Data states
  const [stats, setStats] = useState<PortalStats | null>(null);
  const [drives, setDrives] = useState<PlacementDrive[]>([]);
  const [partnerships, setPartnerships] = useState<IndustryPartnership[]>([]);
  const [students, setStudents] = useState<UserProfile[]>([]);

  // Curriculum AI state
  const [curriculumDept, setCurriculumDept] = useState('Computer Science & Engineering');
  const [curriculumSemester, setCurriculumSemester] = useState('Semester 7 (Senior Electives)');
  const [curriculumModules, setCurriculumModules] = useState(
    'Operating Systems, Database Management Systems, Computer Networks, Software Engineering'
  );
  const [isAnalyzingCurriculum, setIsAnalyzingCurriculum] = useState(false);
  const [curriculumReport, setCurriculumReport] = useState<CurriculumAnalysisReport | null>(null);

  // Modal states
  const [showDriveModal, setShowDriveModal] = useState(false);
  const [newDriveCompany, setNewDriveCompany] = useState('');
  const [newDriveTitle, setNewDriveTitle] = useState('');
  const [newDriveDate, setNewDriveDate] = useState('2026-11-20');
  const [newDriveVenue, setNewDriveVenue] = useState('Shanti Devi Mittal Auditorium, LPU Campus');
  const [newDrivePackage, setNewDrivePackage] = useState('₹18.0 - ₹24.0 LPA');

  const [showMouModal, setShowMouModal] = useState(false);
  const [newMouCompany, setNewMouCompany] = useState('');
  const [newMouTitle, setNewMouTitle] = useState('');
  const [newMouQuota, setNewMouQuota] = useState('20');
  const [newMouBudget, setNewMouBudget] = useState('₹35,00,000 / year');

  const fetchTpoData = async () => {
    try {
      const [statsRes, drivesRes, mousRes, usersRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/drives'),
        fetch('/api/partnerships'),
        fetch('/api/auth/users')
      ]);

      if (statsRes.ok) setStats((await statsRes.json()).stats);
      if (drivesRes.ok) setDrives((await drivesRes.json()).drives || []);
      if (mousRes.ok) setPartnerships((await mousRes.json()).partnerships || []);
      if (usersRes.ok) {
        const uList = (await usersRes.json()).users || [];
        setStudents(uList.filter((u: UserProfile) => u.role === 'student'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTpoData();
  }, []);

  // Run AI Curriculum Alignment
  const handleAnalyzeCurriculum = async () => {
    setIsAnalyzingCurriculum(true);
    try {
      const modules = curriculumModules
        .split(/[,;\n]/)
        .map(m => m.trim())
        .filter(Boolean);

      const res = await fetch('/api/ai/curriculum-align', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          department: curriculumDept,
          semester: curriculumSemester,
          currentModules: modules
        })
      });

      if (res.ok) {
        const data = await res.json();
        setCurriculumReport(data);
        showNotification('AI Curriculum-Industry Alignment Analysis completed', 'success');
      } else {
        showNotification('Curriculum analysis failed', 'error');
      }
    } catch (err) {
      console.error(err);
      showNotification('Network error during curriculum analysis', 'error');
    } finally {
      setIsAnalyzingCurriculum(false);
    }
  };

  // Create Placement Drive
  const handleCreateDrive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriveCompany || !newDriveTitle) return;
    try {
      const res = await fetch('/api/drives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: newDriveCompany,
          driveTitle: newDriveTitle,
          date: newDriveDate,
          venue: newDriveVenue,
          packageOffered: newDrivePackage,
          eligibleCount: 260,
          registeredCount: 190
        })
      });
      if (res.ok) {
        showNotification('Campus recruitment drive successfully scheduled', 'success');
        setShowDriveModal(false);
        setNewDriveCompany('');
        setNewDriveTitle('');
        fetchTpoData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create MoU
  const handleCreateMou = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMouCompany || !newMouTitle) return;
    try {
      const res = await fetch('/api/partnerships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          universityName: user?.organization || 'Lovely Professional University (LPU Punjab)',
          companyName: newMouCompany,
          mouTitle: newMouTitle,
          signedDate: new Date().toISOString().split('T')[0],
          validUntil: '2029-06-30',
          focusAreas: ['Student Internships', 'Joint Research Lab', 'Curriculum Advisory'],
          studentInternshipsCommitted: Number(newMouQuota) || 20,
          researchBudget: newMouBudget,
          keyContact: user?.name || 'Prof. Harpreet Singh',
          highlights: ['Direct placement fast-track for top 15% batch graduates']
        })
      });
      if (res.ok) {
        showNotification('Industry-University MoU created and logged into registry', 'success');
        setShowMouModal(false);
        setNewMouCompany('');
        setNewMouTitle('');
        fetchTpoData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* TPO Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center font-bold text-lg border border-slate-300 dark:border-slate-700 shrink-0">
            <Building2 className="w-6 h-6 text-white dark:text-slate-900" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                {user?.name || 'Prof. Harpreet Singh'}
              </h1>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                Institutional Authority
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {user?.title || 'Dean of Corporate Alliances & Placement'} · {user?.organization || 'Lovely Professional University (LPU Punjab)'}
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Placement Telemetry
          </button>
          <button
            onClick={() => setActiveTab('curriculum')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'curriculum'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            AI Curriculum Alignment
          </button>
          <button
            onClick={() => setActiveTab('drives')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'drives'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Campus Drives ({drives.length})
          </button>
          <button
            onClick={() => setActiveTab('mous')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'mous'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Corporate MoUs ({partnerships.length})
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'students'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Student Roster
          </button>
        </div>
      </div>

      {/* TAB 1: Overview & Metrics */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Executive Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Placement Rate</span>
              <p className="text-3xl font-extrabold text-teal-700 dark:text-teal-400 font-mono tabular-nums">
                {stats?.placementPercentage || 92.4}%
              </p>
              <p className="text-[11px] text-slate-400">Class of 2026 Graduating Batch</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Average Package</span>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                ₹{stats?.avgPackageLPA || 14.8} LPA
              </p>
              <p className="text-[11px] text-slate-400">Highest: ₹{stats?.highestPackageLPA || 54.0} LPA</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Active Corporate Partners</span>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                {stats?.activeHiringPartners || 320}+
              </p>
              <p className="text-[11px] text-slate-400">Tier-1 Tech, FinTech & Systems</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Accredited Industry MoUs</span>
              <p className="text-3xl font-extrabold text-teal-700 dark:text-teal-400 font-mono tabular-nums">
                {stats?.totalActiveMoUs || 84}
              </p>
              <p className="text-[11px] text-slate-400">Active Research & Co-Op Agreements</p>
            </div>
          </div>

          {/* Quick Schedule & Partnerships Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Upcoming Campus Drives</h3>
                <button
                  onClick={() => setShowDriveModal(true)}
                  className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Schedule Drive</span>
                </button>
              </div>

              <div className="space-y-3">
                {drives.map(drive => (
                  <div
                    key={drive.id}
                    className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{drive.companyName}</p>
                      <p className="text-slate-500 text-[11px]">{drive.driveTitle} · {drive.date}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{drive.packageOffered}</span>
                      <p className="text-[10px] text-slate-400">{drive.registeredCount} Students Registered</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Strategic Industry MoUs</h3>
                <button
                  onClick={() => setShowMouModal(true)}
                  className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Register MoU</span>
                </button>
              </div>

              <div className="space-y-3">
                {partnerships.map(mou => (
                  <div
                    key={mou.id}
                    className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{mou.companyName}</p>
                      <p className="text-slate-500 text-[11px]">{mou.mouTitle}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-semibold text-teal-700 dark:text-teal-400">
                        {mou.studentInternshipsCommitted} Committed Slots
                      </span>
                      <p className="text-[10px] text-slate-400">Valid until {mou.validUntil}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AI Curriculum-Industry Alignment */}
      {activeTab === 'curriculum' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-5">
            <div>
              <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-400">Academic Advisory</span>
              <h2 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                AI Curriculum-Industry Synchronizer
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Evaluates existing departmental syllabus against real-time tech industry hiring demands to modernize course electives.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Academic Department
                </label>
                <select
                  value={curriculumDept}
                  onChange={(e) => setCurriculumDept(e.target.value)}
                  className="w-full p-2.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Data Science & Artificial Intelligence">Data Science & Artificial Intelligence</option>
                  <option value="Electrical & Electronics Engineering">Electrical & Electronics Engineering</option>
                  <option value="Robotics & Autonomous Systems">Robotics & Autonomous Systems</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Semester / Academic Level
                </label>
                <input
                  type="text"
                  value={curriculumSemester}
                  onChange={(e) => setCurriculumSemester(e.target.value)}
                  className="w-full p-2.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Current Core Course Modules (Comma-separated)
                </label>
                <textarea
                  rows={4}
                  value={curriculumModules}
                  onChange={(e) => setCurriculumModules(e.target.value)}
                  className="w-full p-2.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <button
                onClick={handleAnalyzeCurriculum}
                disabled={isAnalyzingCurriculum}
                className="w-full py-2.5 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded hover:bg-slate-800 flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAnalyzingCurriculum ? 'Benchmarking against Market Demands...' : 'Run AI Curriculum Alignment'}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-5">
            {curriculumReport ? (
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500">Alignment Index</span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {curriculumReport.department}
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-slate-500">Industry Relevance</p>
                    <p className="text-2xl font-black text-teal-700 dark:text-teal-400 font-mono tabular-nums">
                      {curriculumReport.alignmentScore}%
                    </p>
                  </div>
                </div>

                {/* Emerging Skills Missing from Standard Syllabus */}
                <div className="p-4 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 space-y-2 text-xs">
                  <span className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Emerging Industry Competencies Missing in Academic Baseline:</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {curriculumReport.emergingIndustryDemands.map(demand => (
                      <span
                        key={demand}
                        className="text-xs px-2.5 py-1 bg-white dark:bg-slate-900 text-amber-900 dark:text-amber-200 rounded font-medium border border-amber-300 dark:border-amber-700"
                      >
                        {demand}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Module-by-Module Modernization Roadmap */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Recommended Syllabus Upgrades & Corporate Co-Mentorship
                  </h4>
                  <div className="space-y-3">
                    {curriculumReport.recommendedUpdates.map((update, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-slate-900 dark:text-white">{update.moduleName}</p>
                          <span className="text-[11px] text-slate-500">
                            Partner Labs: {update.partnerCompaniesInvolved.join(', ')}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400">
                          <strong>Gap Analysis:</strong> {update.gapIdentified}
                        </p>
                        <div className="space-y-1">
                          <p className="font-semibold text-slate-800 dark:text-slate-200">Recommended Additions:</p>
                          <div className="flex flex-wrap gap-1">
                            {update.suggestedAdditions.map(add => (
                              <span key={add} className="px-2 py-0.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded font-medium border border-slate-200 dark:border-slate-700">
                                {add}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center space-y-3">
                <BookOpen className="w-10 h-10 mx-auto text-slate-400" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Curriculum Benchmarking Ready
                </p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click "Run AI Curriculum Alignment" on the left to analyze gaps between your current courses and corporate hiring criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Placement Drives */}
      {activeTab === 'drives' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Campus Placement Drives Schedule</h2>
              <p className="text-xs text-slate-500">Upcoming interview cycles and campus hiring selection sprints.</p>
            </div>
            <button
              onClick={() => setShowDriveModal(true)}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded hover:bg-slate-800 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule New Drive</span>
            </button>
          </div>

          <div className="space-y-4">
            {drives.map(drive => (
              <div
                key={drive.id}
                className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{drive.companyName}</h3>
                    <span className="px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-semibold border border-teal-200 dark:border-teal-800 text-[10px]">
                      {drive.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 font-medium">{drive.driveTitle}</p>
                  <p className="text-slate-500 text-[11px]">
                    Date: {drive.date} · Venue: {drive.venue} · Target: {drive.targetDepartments.join(', ')}
                  </p>
                </div>

                <div className="flex items-center gap-6 self-start md:self-center">
                  <div className="text-right">
                    <p className="font-mono font-bold text-sm text-slate-900 dark:text-white">{drive.packageOffered}</p>
                    <p className="text-slate-500 text-[11px]">{drive.registeredCount} / {drive.eligibleCount} Registered</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Corporate MoUs */}
      {activeTab === 'mous' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Active Industry-Academia MoUs</h2>
              <p className="text-xs text-slate-500">Legally accredited partnerships, research sponsorships, and guaranteed internship quotas.</p>
            </div>
            <button
              onClick={() => setShowMouModal(true)}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded hover:bg-slate-800 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register New MoU</span>
            </button>
          </div>

          <div className="space-y-4">
            {partnerships.map(mou => (
              <div
                key={mou.id}
                className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3 text-xs"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{mou.mouTitle}</h3>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">
                      Partner Enterprise: <strong className="text-slate-900 dark:text-white">{mou.companyName}</strong> · Valid Until: {mou.validUntil}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-sm text-teal-700 dark:text-teal-400">
                      {mou.studentInternshipsCommitted} Committed Slots
                    </span>
                    <p className="text-slate-500 text-[11px]">Funding: {mou.researchBudget}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">Focus Areas:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {mou.focusAreas.map(f => (
                      <span key={f} className="px-2.5 py-0.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded font-medium border border-slate-200 dark:border-slate-700">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {mou.highlights && mou.highlights.length > 0 && (
                  <div className="p-3 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-[11px] space-y-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Accredited Deliverables:</span>
                    <ul className="list-disc pl-4 space-y-0.5">
                      {mou.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Student Roster & Verification */}
      {activeTab === 'students' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Registered Candidate Roster</h2>
              <p className="text-xs text-slate-500">Student verification, GPA eligibility clearance, and skill profile audit.</p>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-400">
              {students.length} Registered Candidates
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                  <th className="py-2.5 px-3 font-semibold">Student Name</th>
                  <th className="py-2.5 px-3 font-semibold">Degree & Major</th>
                  <th className="py-2.5 px-3 font-semibold">GPA</th>
                  <th className="py-2.5 px-3 font-semibold">Key Skills</th>
                  <th className="py-2.5 px-3 font-semibold">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {students.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{student.name}</td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{student.degree || 'B.Tech CS'}</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">{student.gpa || '3.88'}</td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(student.skills || []).slice(0, 3).map(s => (
                          <span key={s} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px]">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Cleared</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Schedule Placement Drive */}
      {showDriveModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateDrive} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Schedule Campus Placement Drive</h3>
              <button type="button" onClick={() => setShowDriveModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Company Name</label>
              <input
                type="text"
                required
                value={newDriveCompany}
                onChange={e => setNewDriveCompany(e.target.value)}
                placeholder="e.g. Apex Global Systems"
                className="w-full p-2.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Drive Title</label>
              <input
                type="text"
                required
                value={newDriveTitle}
                onChange={e => setNewDriveTitle(e.target.value)}
                placeholder="e.g. 2026 Campus Engineering Hiring Sprint"
                className="w-full p-2.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Drive Date</label>
                <input
                  type="date"
                  value={newDriveDate}
                  onChange={e => setNewDriveDate(e.target.value)}
                  className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Package (CTC)</label>
                <input
                  type="text"
                  value={newDrivePackage}
                  onChange={e => setNewDrivePackage(e.target.value)}
                  className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Campus Venue</label>
              <input
                type="text"
                value={newDriveVenue}
                onChange={e => setNewDriveVenue(e.target.value)}
                className="w-full p-2.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowDriveModal(false)}
                className="px-3 py-1.5 font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded hover:bg-slate-800"
              >
                Schedule Drive
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Register MoU */}
      {showMouModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateMou} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Register Industry-Academia MoU</h3>
              <button type="button" onClick={() => setShowMouModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Partner Enterprise</label>
              <input
                type="text"
                required
                value={newMouCompany}
                onChange={e => setNewMouCompany(e.target.value)}
                placeholder="e.g. Horizon Robotics Labs"
                className="w-full p-2.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">MoU Agreement Title</label>
              <input
                type="text"
                required
                value={newMouTitle}
                onChange={e => setNewMouTitle(e.target.value)}
                placeholder="e.g. Strategic Co-Op in Intelligent Autonomous Systems"
                className="w-full p-2.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Committed Slots</label>
                <input
                  type="number"
                  value={newMouQuota}
                  onChange={e => setNewMouQuota(e.target.value)}
                  className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Research Funding</label>
                <input
                  type="text"
                  value={newMouBudget}
                  onChange={e => setNewMouBudget(e.target.value)}
                  className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowMouModal(false)}
                className="px-3 py-1.5 font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded hover:bg-slate-800"
              >
                Register Agreement
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
