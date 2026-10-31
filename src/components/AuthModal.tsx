import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { UserRole } from '../types/index.ts';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  Building2, 
  GraduationCap, 
  Briefcase, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToFullPage?: () => void;
}

export const AuthModal: React.FC<Props> = ({ isOpen, onClose, onSwitchToFullPage }) => {
  const { loginWithEmail, registerUser, loginAsDemoUser } = useAuth();
  const [tab, setTab] = useState<'signin' | 'register'>('signin');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState('alex.chen@apex.edu');
  const [password, setPassword] = useState('demo123');
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [degree, setDegree] = useState('B.Tech Computer Science');
  const [gpa, setGpa] = useState('3.8');
  const [skills, setSkills] = useState('React, TypeScript, Python');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    if (tab === 'signin') {
      const emailMap: Record<UserRole, string> = {
        student: 'alex.chen@apex.edu',
        tpo: 'dr.vance@stanford-tech.edu',
        recruiter: 'marcus.chen@novatech.io',
        admin: 'admin@nexuscollab.org'
      };
      setEmail(emailMap[role] || 'alex.chen@apex.edu');
      setPassword('demo123');
    }
  };

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
          setErrorMessage(res.error || 'Authentication failed. Please verify credentials.');
        }
      } else {
        const skillsList = skills.split(/[,;\n]/).map(s => s.trim()).filter(Boolean);
        const res = await registerUser({
          name: name || (selectedRole === 'student' ? 'Jordan Miller' : 'University Representative'),
          email,
          role: selectedRole,
          organization: organization || (selectedRole === 'student' ? 'Institute of Advanced Technology' : 'Enterprise Partner Corp'),
          degree: selectedRole === 'student' ? degree : undefined,
          gpa: selectedRole === 'student' ? Number(gpa) : undefined,
          skills: skillsList,
          password: password || 'demo123'
        });
        if (res.success) {
          onClose();
        } else {
          setErrorMessage(res.error || 'Registration failed.');
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
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 text-xs max-h-[92vh] overflow-y-auto shadow-2xl"
      >
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
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300 block text-[11px]">
            Fast 1-Click Demo Profiles (Pre-authenticated):
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickDemo('student')}
              className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-center hover:border-slate-400 transition-colors shadow-2xs"
            >
              <GraduationCap className="w-4 h-4 mx-auto text-teal-600 mb-1" />
              <span className="font-semibold text-slate-900 dark:text-white block">Student</span>
              <span className="text-[10px] text-slate-400 block">Alex Chen</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('tpo')}
              className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-center hover:border-slate-400 transition-colors shadow-2xs"
            >
              <Building2 className="w-4 h-4 mx-auto text-amber-600 mb-1" />
              <span className="font-semibold text-slate-900 dark:text-white block">Univ TPO</span>
              <span className="text-[10px] text-slate-400 block">Dr. Vance</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('recruiter')}
              className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-center hover:border-slate-400 transition-colors shadow-2xs"
            >
              <Briefcase className="w-4 h-4 mx-auto text-blue-600 mb-1" />
              <span className="font-semibold text-slate-900 dark:text-white block">Recruiter</span>
              <span className="text-[10px] text-slate-400 block">Marcus Chen</span>
            </button>
          </div>
        </div>

        {/* Sliding Tabs */}
        <div className="relative p-1 bg-slate-100 dark:bg-slate-800 rounded-lg flex border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => { setTab('signin'); setErrorMessage(''); }}
            className={`relative z-10 flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              tab === 'signin' ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setErrorMessage(''); }}
            className={`relative z-10 flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              tab === 'register' ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Register Account
          </button>
          <motion.div
            className="absolute top-1 bottom-1 bg-white dark:bg-slate-900 rounded-md shadow-xs"
            layoutId="modalTabIndicator"
            initial={false}
            animate={{
              left: tab === 'signin' ? '4px' : '50%',
              right: tab === 'signin' ? '50%' : '4px',
            }}
            transition={{ type: 'spring', stiffness: 450, damping: 35 }}
          />
        </div>

        {/* Error message */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {tab === 'register' && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Role</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectRole('student')}
                    className={`py-1.5 px-2 rounded-lg border font-semibold text-center ${
                      selectedRole === 'student' ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectRole('tpo')}
                    className={`py-1.5 px-2 rounded-lg border font-semibold text-center ${
                      selectedRole === 'tpo' ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    Univ TPO
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectRole('recruiter')}
                    className={`py-1.5 px-2 rounded-lg border font-semibold text-center ${
                      selectedRole === 'recruiter' ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    Recruiter
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Legal Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Jordan Miller"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {selectedRole === 'student' || selectedRole === 'tpo' ? 'University / College Name' : 'Company / Enterprise Name'}
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={organization}
                    onChange={e => setOrganization(e.target.value)}
                    placeholder={selectedRole === 'student' ? 'e.g. Institute of Advanced Technology' : 'e.g. NovaTech Enterprise'}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. alex.chen@apex.edu"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-xs disabled:opacity-50 mt-2"
          >
            {isLoading ? 'Authenticating...' : tab === 'signin' ? 'Sign In to Portal' : 'Register & Proceed'}
          </motion.button>
        </form>

        {onSwitchToFullPage && (
          <div className="pt-2 text-center">
            <button
              onClick={() => {
                onClose();
                onSwitchToFullPage();
              }}
              className="text-[11px] text-teal-700 dark:text-teal-400 hover:underline"
            >
              Open Full Enterprise Login Page →
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
