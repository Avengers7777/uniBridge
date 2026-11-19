import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu,
  X,
  LogOut,
  Layers,
  Target,
  Briefcase,
  FileText,
  BarChart3,
  User,
  ChevronRight,
  LogIn
} from "lucide-react";

const Navbar = ({ activeView, setActiveView, onOpenAuth }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "overview", label: "Platform", icon: Layers },
    { id: "skill-mapping", label: "Skill Mapping", icon: Target },
    { id: "opportunities", label: "Opportunities", icon: Briefcase },
    { id: "mous", label: "Industry MoUs", icon: FileText },
    { id: "analytics", label: "Placement Stats", icon: BarChart3 }
  ];

  const handleNavClick = (id) => {
    setActiveView(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Brand wordmark */}
        <button
          onClick={() => setActiveView("landing")}
          className="text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 text-left hover:opacity-90 transition-opacity flex items-center gap-1.5"
        >
          <span className="text-slate-900 dark:text-white">Nexus</span>
          <span className="text-teal-700 dark:text-teal-400">Collab</span>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
                  isActive
                    ? "text-slate-900 dark:text-white font-semibold border-b-2 border-slate-900 dark:border-white"
                    : "hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Desktop User Action & Hamburger Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => setActiveView("portal")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  activeView === "portal"
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {user.role === "student"
                  ? "Student Portal"
                  : user.role === "tpo"
                  ? "TPO Placement Cell"
                  : user.role === "recruiter"
                  ? "Recruiter Pipeline"
                  : "Admin Panel"}
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
              className="hidden sm:inline-flex px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded-md hover:bg-slate-800 dark:hover:bg-white/90 transition-colors whitespace-nowrap shrink-0 shadow-xs"
            >
              Sign In / Register
            </button>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-rose-600" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>

      {/* Animated Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg px-4 py-4 space-y-2 overflow-hidden shadow-xl"
          >
            {/* Nav links */}
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold"
                        : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? "text-teal-400 dark:text-teal-600" : "text-slate-400"}`} />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </button>
                );
              })}
            </div>

            {/* Mobile User Profile or Auth */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-950 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-teal-700 dark:text-teal-300" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">{user.role}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleNavClick("portal")}
                      className="px-2.5 py-1 text-xs font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded"
                    >
                      Portal
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors border border-rose-200 dark:border-rose-900/60"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In / Register</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export { Navbar };
