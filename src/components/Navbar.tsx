import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { Menu, X, User, LogOut } from 'lucide-react';

interface Props {
  activeView: string;
  setActiveView: (view: string) => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<Props> = ({ activeView, setActiveView, onOpenAuth }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Platform' },
    { id: 'skill-mapping', label: 'Skill Mapping' },
    { id: 'opportunities', label: 'Opportunities' },
    { id: 'mous', label: 'Industry MoUs' },
    { id: 'analytics', label: 'Placement Stats' },
  ];

  const handleNavClick = (id: string) => {
    setActiveView(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Top Bar Contract: Exactly 3 zones separated by gap-8 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single text element) */}
        <button
          onClick={() => setActiveView('landing')}
          className="text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 text-left hover:opacity-90 transition-opacity"
        >
          <span className="text-slate-900 dark:text-white">Nexus</span>
          <span className="text-teal-700 dark:text-teal-400">Collab</span>
        </button>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
                  isActive
                    ? 'text-slate-900 dark:text-white font-semibold border-b-2 border-slate-900 dark:border-white'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action or user profile element */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveView('portal')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  activeView === 'portal'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {user.role === 'student'
                  ? 'Student Portal'
                  : user.role === 'tpo'
                  ? 'TPO Placement Cell'
                  : user.role === 'recruiter'
                  ? 'Recruiter Pipeline'
                  : 'Admin Panel'}
              </button>
              <button
                onClick={logout}
                title="Sign Out"
                className="p-1.5 rounded-md text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded-md hover:bg-slate-800 dark:hover:bg-white/90 transition-colors whitespace-nowrap shrink-0"
            >
              Sign In / Register
            </button>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="block w-full text-left py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white"
            >
              {item.label}
            </button>
          ))}
          {user ? (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">{user.name} ({user.role})</span>
              <button
                onClick={logout}
                className="text-xs text-rose-600 font-medium py-1"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full text-center py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded-md"
              >
                Sign In / Register
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
