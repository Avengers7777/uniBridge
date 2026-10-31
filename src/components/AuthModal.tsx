import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { UserRole } from '../types/index.ts';
import { X, Lock, Mail, User, Building2, GraduationCap, Briefcase, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { loginWithEmail, registerUser, loginAsDemoUser } = useAuth();
  const [tab, setTab] = useState<'signin' | 'register'>('signin');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('demo123');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [organization, setOrganization] = useState('');
  const [degree, setDegree] = useState('B.Tech Computer Science');
  const [gpa, setGpa] = useState('3.8');
  const [skills, setSkills] = useState('React, TypeScript, Python');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      if (tab === 'signin') {
        const res = await loginWithEmail(email, password);
        if (res.success) {
          onClose();
        } else {
          setErrorMessage(res.error || 'Authentication failed');
        }
      } else {
        const skillsList = skills.split(/[,;\n]/).map(s => s.trim()).filter(Boolean);
        const res = await registerUser({
          name,
          email,
          role,
          organization: organization || (role === 'student' ? 'Institute of Advanced Technology' : 'Enterprise Partner Corp'),
          degree: role === 'student' ? degree : undefined,
          gpa: role === 'student' ? Number(gpa) : undefined,
          skills: skillsList,
          password
        });
        if (res.success) {
          onClose();
        } else {
          setErrorMessage(res.error || 'Registration failed');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = async (targetRole: UserRole) => {
    setIsLoading(true);
    await loginAsDemoUser(targetRole);
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-6 space-y-5 text-xs max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {tab === 'signin' ? 'Sign In to NexusCollab' : 'Create Verified Portal Account'}
            </h2>
            <p className="text-[11px] text-slate-500">
              Institutional placement & corporate recruitment gateway
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Shortcuts for Buyers/Evaluators */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300 block text-[11px]">
            Fast 1-Click Demo Profiles (No Password Required):
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickDemo('student')}
              className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-center hover:border-slate-400 transition-colors"
            >
              <GraduationCap className="w-4 h-4 mx-auto text-teal-600 mb-1" />
              <span className="font-semibold text-slate-900 dark:text-white block">Student</span>
              <span className="text-[10px] text-slate-400 block">Alex Chen</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('tpo')}
              className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-center hover:border-slate-400 transition-colors"
            >
              <Building2 className="w-4 h-4 mx-auto text-amber-600 mb-1" />
              <span className="font-semibold text-slate-900 dark:text-white block">Univ TPO</span>
              <span className="text-[10px] text-slate-400 block">Dr. Vance</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('recruiter')}
              className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-center hover:border-slate-400 transition-colors"
            >
              <Briefcase className="w-4 h-4 mx-auto text-blue-600 mb-1" />
              <span className="font-semibold text-slate-900 dark:text-white block">Recruiter</span>
              <span className="text-[10px] text-slate-400 block">Marcus Chen</span>
            </button>
          </div>
        </div>

        {/* Tabs: Sign In / Register */}
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setTab('signin')}
            className={`flex-1 py-2 font-semibold text-center transition-colors ${
              tab === 'signin'
                ? 'text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            Sign In with Password
          </button>
          <button
            type="button"
            onClick={() => setTab('register')}
            className={`flex-1 py-2 font-semibold text-center transition-colors ${
              tab === 'register'
                ? 'text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            Register New Account
          </button>
        </div>

        {errorMessage && (
          <div className="p-2.5 rounded bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {tab === 'register' && (
            <>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Role</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`py-1.5 px-2 rounded border font-semibold text-center ${
                      role === 'student' ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('tpo')}
                    className={`py-1.5 px-2 rounded border font-semibold text-center ${
                      role === 'tpo' ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    Univ TPO
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('recruiter')}
                    className={`py-1.5 px-2 rounded border font-semibold text-center ${
                      role === 'recruiter' ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    Recruiter
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Jordan Miller"
                  className="w-full p-2.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {role === 'student' || role === 'tpo' ? 'University / College Name' : 'Company / Enterprise Name'}
                </label>
                <input
                  type="text"
                  required
                  value={organization}
                  onChange={e => setOrganization(e.target.value)}
                  placeholder={role === 'student' ? 'e.g. Institute of Advanced Technology' : 'e.g. Global Tech Solutions'}
                  className="w-full p-2.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              {role === 'student' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Degree</label>
                    <input
                      type="text"
                      value={degree}
                      onChange={e => setDegree(e.target.value)}
                      className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Current GPA</label>
                    <input
                      type="number"
                      step="0.01"
                      value={gpa}
                      onChange={e => setGpa(e.target.value)}
                      className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e.g. alex.chen@apex.edu"
              className="w-full p-2.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-2.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded hover:bg-slate-800 dark:hover:bg-white/90 transition-colors shadow-xs disabled:opacity-50 mt-2"
          >
            {isLoading ? 'Authenticating...' : tab === 'signin' ? 'Sign In to Portal' : 'Register & Proceed'}
          </button>
        </form>
      </div>
    </div>
  );
};
