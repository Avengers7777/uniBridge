import React from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { Eye, Sun, Moon, Type, ShieldCheck, UserCheck, Briefcase, GraduationCap } from 'lucide-react';
import { UserRole } from '../types/index.ts';

interface Props {
  activeView: string;
  setActiveView: (view: string) => void;
  onOpenAuth: () => void;
}

export const AccessibilityToolbar: React.FC<Props> = ({ activeView, setActiveView, onOpenAuth }) => {
  const {
    user,
    role,
    theme,
    toggleTheme,
    highContrast,
    toggleHighContrast,
    fontScale,
    setFontScale,
    loginAsDemoUser,
    logout
  } = useAuth();

  const handleRoleSwitch = (targetRole: UserRole) => {
    loginAsDemoUser(targetRole);
    setActiveView('portal');
  };

  return (
    <aside aria-label="Accessibility and demonstration controls" className="border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 px-4 py-2 text-xs transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Fast Role Evaluator for EduTech Buyers */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
            <span>Interactive Demo Roles:</span>
          </span>
          <div className="flex items-center gap-1 bg-white dark:bg-slate-800 rounded p-0.5 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => handleRoleSwitch('student')}
              className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
                user?.role === 'student'
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <GraduationCap className="w-3 h-3" />
              <span>Student</span>
            </button>
            <button
              onClick={() => handleRoleSwitch('tpo')}
              className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
                user?.role === 'tpo'
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              <span>University TPO</span>
            </button>
            <button
              onClick={() => handleRoleSwitch('recruiter')}
              className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
                user?.role === 'recruiter'
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Briefcase className="w-3 h-3" />
              <span>Corporate Recruiter</span>
            </button>
            <button
              onClick={() => {
                logout();
                setActiveView('landing');
              }}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                !user && activeView === 'landing'
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Visitor / Landing
            </button>
          </div>
        </div>

        {/* Accessibility & Inclusivity Controls */}
        <div className="flex items-center gap-3">
          {/* High Contrast Mode Toggle (WCAG AAA) */}
          <button
            onClick={toggleHighContrast}
            aria-pressed={highContrast}
            className={`px-2 py-1 rounded flex items-center gap-1.5 border font-medium transition-colors ${
              highContrast
                ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white ring-2 ring-amber-500'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-50'
            }`}
            title="Toggle WCAG AAA High Contrast View"
          >
            <Eye className="w-3.5 h-3.5" aria-hidden="true" />
            <span>High Contrast</span>
          </button>

          {/* Font Scaling */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-1.5 py-0.5">
            <Type className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
            <button
              onClick={() => setFontScale('normal')}
              className={`px-1.5 py-0.5 rounded font-mono text-[11px] ${fontScale === 'normal' ? 'font-bold underline text-slate-900 dark:text-white' : 'text-slate-500'}`}
              title="Standard Font Size"
            >
              A
            </button>
            <button
              onClick={() => setFontScale('large')}
              className={`px-1.5 py-0.5 rounded font-mono text-xs ${fontScale === 'large' ? 'font-bold underline text-slate-900 dark:text-white' : 'text-slate-500'}`}
              title="Large Font (+10%)"
            >
              A+
            </button>
            <button
              onClick={() => setFontScale('xlarge')}
              className={`px-1.5 py-0.5 rounded font-mono text-sm ${fontScale === 'xlarge' ? 'font-bold underline text-slate-900 dark:text-white' : 'text-slate-500'}`}
              title="Extra Large Font (+25%)"
            >
              A++
            </button>
          </div>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            className="p-1.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
          </button>
        </div>
      </div>
    </aside>
  );
};
