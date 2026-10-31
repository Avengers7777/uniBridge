import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { UserRole } from '../types/index.ts';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  Mail, 
  User, 
  Building2, 
  GraduationCap, 
  Briefcase, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  KeyRound,
  Check,
  AlertCircle
} from 'lucide-react';

interface Props {
  onBackToHome: () => void;
  onSuccessRedirect?: () => void;
}

export const LoginPage: React.FC<Props> = ({ onBackToHome, onSuccessRedirect }) => {
  const { loginWithEmail, registerUser, loginAsDemoUser } = useAuth();
  
  const [tab, setTab] = useState<'signin' | 'register'>('signin');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [showPassword, setShowPassword] = useState(false);
  
  // Form fields
  const [email, setEmail] = useState('aarav.sharma@cu.edu.in');
  const [password, setPassword] = useState('demo123');
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [degree, setDegree] = useState('B.Tech CSE (Cloud & AI)');
  const [gpa, setGpa] = useState('8.92');
  const [skills, setSkills] = useState('React, TypeScript, Python, Node.js, Docker');
  const [rememberMe, setRememberMe] = useState(true);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Update pre-filled credentials when selecting role in signin mode
  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    if (tab === 'signin') {
      const emailMap: Record<UserRole, string> = {
        student: 'aarav.sharma@cu.edu.in',
        tpo: 'tpo.director@lpu.co.in',
        recruiter: 'ananya.iyer@novatech.in',
        admin: 'admin@nexuscollab.org'
      };
      setEmail(emailMap[role] || 'aarav.sharma@cu.edu.in');
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
          if (onSuccessRedirect) onSuccessRedirect();
          else onBackToHome();
        } else {
          setErrorMessage(res.error || 'Invalid email or password. Please verify credentials.');
        }
      } else {
        const skillsList = skills.split(/[,;\n]/).map(s => s.trim()).filter(Boolean);
        const res = await registerUser({
          name: name || (selectedRole === 'student' ? 'Jordan Miller' : 'University Representative'),
          email,
          role: selectedRole,
          organization: organization || (selectedRole === 'student' ? 'Institute of Advanced Technology' : 'Enterprise Global Solutions'),
          degree: selectedRole === 'student' ? degree : undefined,
          gpa: selectedRole === 'student' ? Number(gpa) : undefined,
          skills: skillsList,
          password: password || 'demo123'
        });
        if (res.success) {
          if (onSuccessRedirect) onSuccessRedirect();
          else onBackToHome();
        } else {
          setErrorMessage(res.error || 'Registration failed. An account with this email may already exist.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network connection failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstantDemoLogin = async (role: UserRole) => {
    setIsLoading(true);
    await loginAsDemoUser(role);
    setIsLoading(false);
    if (onSuccessRedirect) onSuccessRedirect();
    else onBackToHome();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-5xl w-full mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Visual & Trust Showcase Column */}
        <div className="lg:col-span-5 bg-slate-900 text-white relative flex flex-col justify-between p-8 sm:p-10 overflow-hidden">
          {/* Subtle Ambient Background */}
          <div className="absolute inset-0 z-0 opacity-40">
            <img
              src="/src/assets/images/hero_collaboration_summit_1793431838701.jpg"
              alt="Campus technology and industry collaboration"
              className="w-full h-full object-cover filter saturate-50"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-950/60" />
          </div>

          {/* Top Brand & Back Button */}
          <div className="relative z-10 flex items-center justify-between">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors py-1 px-2.5 rounded-md bg-white/10 hover:bg-white/20 backdrop-blur-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Portal</span>
            </button>
            <span className="text-xs font-mono text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800">
              v2026.4 Standard
            </span>
          </div>

          {/* Centerpiece Narrative with Motion */}
          <div className="relative z-10 my-8 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-2"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                Institutional Convergence
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                Accelerating Academia-Industry Placement.
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect your academic milestones to verified industry internships, AI-guided skill-gap diagnostics, and accredited campus placement drives.
              </p>
            </motion.div>

            {/* Floating Metric Badges */}
            <div className="space-y-3 pt-2">
              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-slate-400">Verified Placement Conversion</p>
                  <p className="text-xl font-bold font-mono text-white">92.4%</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-slate-400">Active Partners</p>
                  <p className="text-xl font-bold font-mono text-teal-300">320+ Corps</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Zero-Trust Role-Based Cryptographic Access</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>FERPA & University Accreditation Compliant</span>
              </div>
            </div>
          </div>

          {/* Bottom Security Assurance */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>Institutional Single Sign-On</span>
            </span>
            <span>256-Bit TLS</span>
          </div>
        </div>

        {/* Right Authentication Form Column */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Header Lockup */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {tab === 'signin' ? 'Sign In to Your Workspace' : 'Create Verified Portal Account'}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {tab === 'signin' 
                    ? 'Enter your institutional credentials or select an interactive demo persona.' 
                    : 'Register with your college or corporate affiliation for verified placement access.'}
                </p>
              </div>
              <span className="text-xs font-bold text-teal-700 dark:text-teal-400">
                Nexus<span className="text-slate-900 dark:text-white">Collab</span>
              </span>
            </div>

            {/* Segmented Sign In / Register Tabs with Motion Slider */}
            <div className="relative p-1 bg-slate-100 dark:bg-slate-800 rounded-lg flex border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => { setTab('signin'); setErrorMessage(''); }}
                className={`relative z-10 flex-1 py-2 text-xs font-semibold rounded-md transition-colors ${
                  tab === 'signin' ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setTab('register'); setErrorMessage(''); }}
                className={`relative z-10 flex-1 py-2 text-xs font-semibold rounded-md transition-colors ${
                  tab === 'register' ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Register Account
              </button>
              {/* Sliding Active Pill */}
              <motion.div
                className="absolute top-1 bottom-1 bg-white dark:bg-slate-900 rounded-md shadow-xs"
                layoutId="activeTabIndicator"
                initial={false}
                animate={{
                  left: tab === 'signin' ? '4px' : '50%',
                  right: tab === 'signin' ? '50%' : '4px',
                }}
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            </div>

            {/* Role Persona Selector Cards */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                {tab === 'signin' ? 'Select Active Persona:' : 'Choose Account Type:'}
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {/* Student */}
                <button
                  type="button"
                  onClick={() => handleSelectRole('student')}
                  className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                    selectedRole === 'student'
                      ? 'border-slate-900 dark:border-white bg-slate-900/5 dark:bg-white/5 ring-1 ring-slate-900 dark:ring-white'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                  }`}
                >
                  <GraduationCap className={`w-5 h-5 mb-1.5 ${selectedRole === 'student' ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`} />
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Student</p>
                  <p className="text-[10px] text-slate-500 leading-tight mt-0.5">Aarav (CU Punjab)</p>
                </button>

                {/* University TPO */}
                <button
                  type="button"
                  onClick={() => handleSelectRole('tpo')}
                  className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                    selectedRole === 'tpo'
                      ? 'border-slate-900 dark:border-white bg-slate-900/5 dark:bg-white/5 ring-1 ring-slate-900 dark:ring-white'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                  }`}
                >
                  <Building2 className={`w-5 h-5 mb-1.5 ${selectedRole === 'tpo' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`} />
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Univ TPO</p>
                  <p className="text-[10px] text-slate-500 leading-tight mt-0.5">Prof. Harpreet (LPU)</p>
                </button>

                {/* Recruiter */}
                <button
                  type="button"
                  onClick={() => handleSelectRole('recruiter')}
                  className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                    selectedRole === 'recruiter'
                      ? 'border-slate-900 dark:border-white bg-slate-900/5 dark:bg-white/5 ring-1 ring-slate-900 dark:ring-white'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                  }`}
                >
                  <Briefcase className={`w-5 h-5 mb-1.5 ${selectedRole === 'recruiter' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Recruiter</p>
                  <p className="text-[10px] text-slate-500 leading-tight mt-0.5">Ananya (NovaTech)</p>
                </button>
              </div>
            </div>

            {/* Error Message Animation */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* The Main Authentication Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {tab === 'register' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Full Legal Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Jordan Miller"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {selectedRole === 'student' || selectedRole === 'tpo' ? 'College / University (IIT, NIT, CU, LPU...)' : 'Company / Enterprise Name'}
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={organization}
                        onChange={e => setOrganization(e.target.value)}
                        placeholder={selectedRole === 'student' ? 'e.g. Chandigarh University (CU) or LPU Punjab' : 'e.g. NovaTech India / Flipkart'}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all"
                      />
                    </div>
                    {selectedRole === 'student' && (
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        <button
                          type="button"
                          onClick={() => setOrganization('Chandigarh University (CU Punjab)')}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                        >
                          CU Punjab
                        </button>
                        <button
                          type="button"
                          onClick={() => setOrganization('Lovely Professional University (LPU Punjab)')}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                        >
                          LPU Punjab
                        </button>
                        <button
                          type="button"
                          onClick={() => setOrganization('Indian Institute of Technology Ropar (IIT Ropar)')}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                        >
                          IIT Ropar
                        </button>
                        <button
                          type="button"
                          onClick={() => setOrganization('NIT Jalandhar (Punjab)')}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                        >
                          NIT Jalandhar
                        </button>
                        <button
                          type="button"
                          onClick={() => setOrganization('IIT Delhi')}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                        >
                          IIT Delhi
                        </button>
                      </div>
                    )}
                  </div>

                  {selectedRole === 'student' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Degree & Major</label>
                        <input
                          type="text"
                          value={degree}
                          onChange={e => setDegree(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Cumulative GPA</label>
                        <input
                          type="number"
                          step="0.01"
                          value={gpa}
                          onChange={e => setGpa(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono text-xs"
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Email Address */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Institutional / Corporate Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. alex.chen@apex.edu"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all"
                  />
                </div>
              </div>

              {/* Password with Visibility Toggle */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  {tab === 'signin' && (
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-[11px] text-teal-700 dark:text-teal-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all"
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

              {/* Remember Me Checkbox */}
              {tab === 'signin' && (
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                    />
                    <span>Remember this trusted device</span>
                  </label>
                  <span className="text-[11px] text-slate-400">Demo pwd: <code className="font-mono text-slate-600 dark:text-slate-300">demo123</code></span>
                </div>
              )}

              {/* Submit Action Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 border-2 border-white dark:border-slate-900 border-t-transparent rounded-full animate-spin" />
                    <span>Authenticating Credentials...</span>
                  </span>
                ) : (
                  <span>{tab === 'signin' ? 'Sign In to Portal' : 'Register Verified Account'}</span>
                )}
              </motion.button>
            </form>

            {/* Fast 1-Click Evaluation Strip */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[11px] text-slate-500 font-medium block">
                Instant 1-Click Demo Evaluation (No typing required):
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleInstantDemoLogin('student')}
                  className="px-2 py-1.5 text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-teal-600" />
                  <span>Aarav (CU)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInstantDemoLogin('tpo')}
                  className="px-2 py-1.5 text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700"
                >
                  <Building2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Harpreet (LPU)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInstantDemoLogin('recruiter')}
                  className="px-2 py-1.5 text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700"
                >
                  <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                  <span>Ananya (NovaTech)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Simulated Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-sm w-full p-6 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Reset Credentials</h3>
              <button onClick={() => setShowForgotModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>
            
            {forgotSent ? (
              <div className="text-center py-4 space-y-2">
                <Check className="w-8 h-8 mx-auto text-teal-600" />
                <p className="font-bold text-slate-900 dark:text-white">Reset Link Dispatched</p>
                <p className="text-slate-500">Instructions sent to {forgotEmail || 'your institutional email'}. Check your university inbox.</p>
                <button
                  onClick={() => { setShowForgotModal(false); setForgotSent(false); }}
                  className="mt-3 px-4 py-2 bg-slate-900 text-white rounded font-semibold"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-slate-600 dark:text-slate-400">
                  Enter your verified university or company email to receive a secure recovery code.
                </p>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  placeholder="name@institution.edu"
                  className="w-full p-2.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowForgotModal(false)}
                    className="px-3 py-1.5 font-semibold text-slate-600 hover:bg-slate-100 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setForgotSent(true)}
                    className="px-4 py-1.5 font-semibold text-white bg-slate-900 rounded"
                  >
                    Send Recovery Code
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};
