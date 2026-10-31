import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { 
  JobPosting, 
  JobApplication, 
  IndustryPartnership,
  JobType,
  WorkMode
} from '../types/index.ts';
import { 
  Briefcase, 
  Users, 
  Calendar, 
  Plus, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Mail, 
  Phone, 
  Award, 
  MapPin, 
  DollarSign, 
  X,
  ExternalLink,
  Sparkles,
  Building2,
  FileCheck
} from 'lucide-react';

export const RecruiterPortal: React.FC = () => {
  const { user, showNotification } = useAuth();
  const [activeTab, setActiveTab] = useState<'pipeline' | 'postings' | 'partnerships'>('pipeline');

  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [partnerships, setPartnerships] = useState<IndustryPartnership[]>([]);

  // Pipeline filters
  const [selectedJobId, setSelectedJobId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchCandidate, setSearchCandidate] = useState<string>('');

  // Modals
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [interviewModalApp, setInterviewModalApp] = useState<JobApplication | null>(null);
  const [interviewDate, setInterviewDate] = useState('2026-11-10');
  const [interviewTime, setInterviewTime] = useState('14:30 EST');
  const [interviewMode, setInterviewMode] = useState('Google Meet (Virtual)');
  const [interviewNotes, setInterviewNotes] = useState('Technical architecture and algorithmic problem solving.');

  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<JobType>('internship');
  const [newMode, setNewMode] = useState<WorkMode>('hybrid');
  const [newLocation, setNewLocation] = useState('San Francisco, CA / Hybrid');
  const [newSalary, setNewSalary] = useState('$5,500 / month + Relocation');
  const [newDuration, setNewDuration] = useState('12 Weeks');
  const [newSkills, setNewSkills] = useState('TypeScript, Node.js, Docker, SQL');
  const [newMinGpa, setNewMinGpa] = useState('3.4');
  const [newDesc, setNewDesc] = useState('');

  const fetchRecruiterData = async () => {
    try {
      const [appsRes, jobsRes, mousRes] = await Promise.all([
        fetch('/api/applications'),
        fetch('/api/jobs'),
        fetch('/api/partnerships')
      ]);

      if (appsRes.ok) setApplications((await appsRes.json()).applications || []);
      if (jobsRes.ok) setJobs((await jobsRes.json()).jobs || []);
      if (mousRes.ok) setPartnerships((await mousRes.json()).partnerships || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecruiterData();
  }, []);

  // Update application status
  const handleUpdateStatus = async (appId: string, status: string, additionalData?: any) => {
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, ...additionalData })
      });
      if (res.ok) {
        showNotification(`Application status updated to ${status.replace('_', ' ')}`, 'success');
        fetchRecruiterData();
        if (selectedApp?.id === appId) {
          setSelectedApp(prev => prev ? { ...prev, status: status as any, ...additionalData } : null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Schedule Interview
  const handleScheduleInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewModalApp) return;

    await handleUpdateStatus(interviewModalApp.id, 'interview_scheduled', {
      interviewDate,
      interviewTime,
      interviewMode,
      notes: interviewNotes
    });
    setInterviewModalApp(null);
  };

  // Create Job Posting
  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    try {
      const reqSkills = newSkills.split(/[,;\n]/).map(s => s.trim()).filter(Boolean);
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recruiterId: user?.id || 'usr_recruiter_marcus',
          companyName: user?.organization || 'NovaTech Enterprise Solutions',
          title: newTitle,
          roleType: newType,
          department: 'Engineering Division',
          location: newLocation,
          workMode: newMode,
          stipendOrSalary: newSalary,
          duration: newDuration,
          requiredSkills: reqSkills,
          minGpa: Number(newMinGpa) || 3.2,
          description: newDesc || `Join ${user?.organization || 'our engineering team'} to work on high-impact technology initiatives.`,
          status: 'active'
        })
      });

      if (res.ok) {
        showNotification('Opportunity posting published successfully', 'success');
        setShowCreateJobModal(false);
        setNewTitle('');
        setNewDesc('');
        fetchRecruiterData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered applications
  const filteredApps = applications.filter(app => {
    if (selectedJobId !== 'all' && app.jobId !== selectedJobId) return false;
    if (statusFilter !== 'all' && app.status !== statusFilter) return false;
    if (searchCandidate) {
      const q = searchCandidate.toLowerCase();
      const matchName = app.studentName.toLowerCase().includes(q);
      const matchUniv = app.studentUniversity.toLowerCase().includes(q);
      const matchTitle = app.jobTitle.toLowerCase().includes(q);
      if (!matchName && !matchUniv && !matchTitle) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Recruiter Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center font-bold text-lg border border-slate-300 dark:border-slate-700 shrink-0">
            <Briefcase className="w-6 h-6 text-white dark:text-slate-900" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                {user?.name || 'Marcus Chen'}
              </h1>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                Verified Recruiter
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {user?.title || 'Principal Campus Recruitment Lead'} · {user?.organization || 'NovaTech Enterprise Solutions'}
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'pipeline'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Candidate Pipeline ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab('postings')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'postings'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Active Postings ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab('partnerships')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'partnerships'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            University Alliances
          </button>
        </div>
      </div>

      {/* TAB 1: Candidate Talent Pipeline */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchCandidate}
                onChange={e => setSearchCandidate(e.target.value)}
                placeholder="Search candidate, college, or role..."
                className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* Job filter dropdown */}
              <select
                value={selectedJobId}
                onChange={e => setSelectedJobId(e.target.value)}
                className="text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-slate-700 dark:text-slate-200 font-medium"
              >
                <option value="all">All Vacancies</option>
                {jobs.map(j => (
                  <option key={j.id} value={j.id}>{j.title}</option>
                ))}
              </select>

              {/* Status filter dropdown */}
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-slate-700 dark:text-slate-200 font-medium"
              >
                <option value="all">All Stages</option>
                <option value="applied">Applied</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="interview_scheduled">Interview Scheduled</option>
                <option value="offer_extended">Offer Extended</option>
                <option value="accepted">Accepted</option>
              </select>
            </div>
          </div>

          {/* Pipeline Applications Table / Cards */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-500">
                    <th className="py-3 px-4 font-semibold">Candidate</th>
                    <th className="py-3 px-4 font-semibold">Applied Role</th>
                    <th className="py-3 px-4 font-semibold">AI Match Score</th>
                    <th className="py-3 px-4 font-semibold">Academic GPA</th>
                    <th className="py-3 px-4 font-semibold">Status Stage</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredApps.map(app => {
                    const statusClass = 
                      app.status === 'offer_extended'
                        ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 font-bold'
                        : app.status === 'interview_scheduled'
                        ? 'bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-200 border-teal-300'
                        : app.status === 'shortlisted'
                        ? 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
                        : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200';

                    return (
                      <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-900 dark:text-white">{app.studentName}</p>
                          <p className="text-[11px] text-slate-500">{app.studentUniversity}</p>
                        </td>
                        <td className="py-3 px-4 text-slate-800 dark:text-slate-200">
                          {app.jobTitle}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-teal-700 dark:text-teal-400">
                              {app.aiMatchScore}%
                            </span>
                            <span className="text-[10px] text-slate-400">fit</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                          {app.studentGpa || '3.88'}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${statusClass}`}>
                            {app.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedApp(app)}
                              className="px-2.5 py-1 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded font-medium"
                            >
                              Review
                            </button>
                            {app.status !== 'interview_scheduled' && app.status !== 'offer_extended' && (
                              <button
                                onClick={() => setInterviewModalApp(app)}
                                className="px-2.5 py-1 text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950 rounded font-semibold"
                              >
                                Interview
                              </button>
                            )}
                            {app.status === 'interview_scheduled' && (
                              <button
                                onClick={() => handleUpdateStatus(app.id, 'offer_extended')}
                                className="px-2.5 py-1 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950 rounded font-semibold"
                              >
                                Extend Offer
                              </button>
                            )}
                          </div>
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

      {/* TAB 2: Postings Manager */}
      {activeTab === 'postings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Active Campus Openings</h2>
              <p className="text-xs text-slate-500">Manage internship quotas, graduate placements, and campus drive eligibility.</p>
            </div>
            <button
              onClick={() => setShowCreateJobModal(true)}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded hover:bg-slate-800 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post New Vacancy</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map(job => (
              <div
                key={job.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase">{job.roleType}</span>
                    <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-400 font-mono">
                      {job.applicantsCount} Applicants
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{job.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {job.location} ({job.workMode}) · <span className="font-semibold">{job.stipendOrSalary}</span>
                  </p>
                  <p className="text-[11px] text-slate-500">Duration: {job.duration} · Min GPA: {job.minGpa}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Deadline: {job.deadline}</span>
                  <button
                    onClick={() => {
                      setSelectedJobId(job.id);
                      setActiveTab('pipeline');
                    }}
                    className="text-xs font-semibold text-slate-900 dark:text-white hover:underline"
                  >
                    View Pipeline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: University Partnerships */}
      {activeTab === 'partnerships' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Corporate-Academic Alliances</h2>
            <p className="text-xs text-slate-500">Sponsored campus research laboratories, capstone projects, and guaranteed talent pipelines.</p>
          </div>

          <div className="space-y-4">
            {partnerships.map(mou => (
              <div
                key={mou.id}
                className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{mou.mouTitle}</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Academic Institution: <strong className="text-slate-900 dark:text-white">{mou.universityName}</strong>
                    </p>
                  </div>
                  <span className="font-mono font-bold text-teal-700 dark:text-teal-400">
                    {mou.studentInternshipsCommitted} Committed Co-Op Slots
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {mou.focusAreas.map(f => (
                    <span key={f} className="px-2.5 py-0.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded font-medium border border-slate-200 dark:border-slate-700">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Application Review */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500">{selectedApp.jobTitle}</span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  Candidate: {selectedApp.studentName}
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  {selectedApp.studentUniversity} · {selectedApp.studentDegree} (GPA: {selectedApp.studentGpa})
                </p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Fit Assessment */}
            <div className="p-4 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span>AI Screening & Competency Fit</span>
                </span>
                <span className="font-mono font-bold text-base text-teal-900 dark:text-teal-200">
                  {selectedApp.aiMatchScore}% Match
                </span>
              </div>
              <p className="text-teal-800 dark:text-teal-300 leading-relaxed">
                {selectedApp.aiMatchRationale}
              </p>
            </div>

            {/* Skills */}
            <div className="space-y-1.5">
              <span className="font-bold text-slate-900 dark:text-white">Verified Candidate Skills:</span>
              <div className="flex flex-wrap gap-1.5">
                {(selectedApp.studentSkills || []).map(skill => (
                  <span key={skill} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Cover Note */}
            {selectedApp.coverNote && (
              <div className="space-y-1.5">
                <span className="font-bold text-slate-900 dark:text-white">Candidate Statement:</span>
                <p className="p-3 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                  {selectedApp.coverNote}
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => handleUpdateStatus(selectedApp.id, 'rejected')}
                className="px-3 py-1.5 font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded"
              >
                Reject Candidate
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleUpdateStatus(selectedApp.id, 'shortlisted');
                  }}
                  className="px-3 py-1.5 font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded"
                >
                  Shortlist
                </button>
                <button
                  onClick={() => {
                    setInterviewModalApp(selectedApp);
                    setSelectedApp(null);
                  }}
                  className="px-4 py-1.5 font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded hover:bg-slate-800"
                >
                  Schedule Interview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Schedule Interview */}
      {interviewModalApp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleScheduleInterview} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Schedule Interview: {interviewModalApp.studentName}
              </h3>
              <button type="button" onClick={() => setInterviewModalApp(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Interview Date</label>
                <input
                  type="date"
                  value={interviewDate}
                  onChange={e => setInterviewDate(e.target.value)}
                  className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Interview Time</label>
                <input
                  type="text"
                  value={interviewTime}
                  onChange={e => setInterviewTime(e.target.value)}
                  className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Interview Venue / Link</label>
              <input
                type="text"
                value={interviewMode}
                onChange={e => setInterviewMode(e.target.value)}
                className="w-full p-2.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Notes & Topics</label>
              <textarea
                rows={3}
                value={interviewNotes}
                onChange={e => setInterviewNotes(e.target.value)}
                className="w-full p-2.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setInterviewModalApp(null)}
                className="px-3 py-1.5 font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded hover:bg-slate-800"
              >
                Confirm & Dispatch Notification
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Create Job Posting */}
      {showCreateJobModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateJob} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Post New Campus Opportunity</h3>
              <button type="button" onClick={() => setShowCreateJobModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Position Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g. Distributed Cloud Systems Intern"
                className="w-full p-2.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Role Type</label>
                <select
                  value={newType}
                  onChange={(e: any) => setNewType(e.target.value)}
                  className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="internship">Internship</option>
                  <option value="placement">Full-Time Placement</option>
                  <option value="research_coop">Research Co-Op</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Work Mode</label>
                <select
                  value={newMode}
                  onChange={(e: any) => setNewMode(e.target.value)}
                  className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="hybrid">Hybrid</option>
                  <option value="remote">Remote</option>
                  <option value="onsite">Onsite</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Compensation / Stipend</label>
                <input
                  type="text"
                  value={newSalary}
                  onChange={e => setNewSalary(e.target.value)}
                  className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Min GPA Cutoff</label>
                <input
                  type="number"
                  step="0.1"
                  value={newMinGpa}
                  onChange={e => setNewMinGpa(e.target.value)}
                  className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Required Skills (Comma-separated)</label>
              <input
                type="text"
                value={newSkills}
                onChange={e => setNewSkills(e.target.value)}
                placeholder="e.g. React, TypeScript, Node.js, SQL"
                className="w-full p-2.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Role Description</label>
              <textarea
                rows={3}
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                placeholder="Describe team projects and candidate learning outcomes..."
                className="w-full p-2.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowCreateJobModal(false)}
                className="px-3 py-1.5 font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded hover:bg-slate-800"
              >
                Publish Campus Vacancy
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
