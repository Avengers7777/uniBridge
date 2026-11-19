import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import { Navbar } from "./components/Navbar";
import { AccessibilityToolbar } from "./components/AccessibilityToolbar";
import { LandingPage } from "./components/LandingPage";
import { StudentPortal } from "./components/StudentPortal";
import { TpoPortal } from "./components/TpoPortal";
import { RecruiterPortal } from "./components/RecruiterPortal";
import { AuthModal } from "./components/AuthModal";
import { LoginPage } from "./components/LoginPage";
import { Footer } from "./components/Footer";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
const AppContent = () => {
  const { user, loginAsDemoUser, notification, dismissNotification } = useAuth();
  const [activeView, setActiveView] = useState("landing");
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const handleExploreRole = async (targetRole) => {
    await loginAsDemoUser(targetRole);
    setActiveView("portal");
  };
  const renderMainContent = () => {
    if (activeView === "login") {
      return <LoginPage
        onBackToHome={() => setActiveView("landing")}
        onSuccessRedirect={() => setActiveView("portal")}
      />;
    }
    if (activeView === "portal") {
      if (!user) {
        return <LandingPage
          onExploreRole={handleExploreRole}
          onOpenAuth={() => setIsAuthOpen(true)}
          onNavigateTab={setActiveView}
        />;
      }
      switch (user.role) {
        case "student":
          return <StudentPortal />;
        case "tpo":
        case "admin":
          return <TpoPortal />;
        case "recruiter":
          return <RecruiterPortal />;
        default:
          return <StudentPortal />;
      }
    }
    if (activeView === "skill-mapping") {
      if (user?.role === "student") {
        return <StudentPortal />;
      } else {
        return <StudentPortal />;
      }
    }
    if (activeView === "opportunities") {
      if (user?.role === "recruiter") {
        return <RecruiterPortal />;
      } else {
        return <StudentPortal />;
      }
    }
    if (activeView === "mous") {
      return <TpoPortal />;
    }
    if (activeView === "analytics") {
      return <TpoPortal />;
    }
    return <LandingPage
      onExploreRole={handleExploreRole}
      onOpenAuth={() => setIsAuthOpen(true)}
      onNavigateTab={setActiveView}
    />;
  };
  return <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors selection:bg-slate-800 selection:text-white">
      {
    /* Accessibility & Role Evaluator Bar */
  }
      {activeView !== "login" && <AccessibilityToolbar
    activeView={activeView}
    setActiveView={setActiveView}
    onOpenAuth={() => setActiveView("login")}
  />}

      {
    /* Top Bar Contract Navigation */
  }
      {activeView !== "login" && <Navbar
    activeView={activeView}
    setActiveView={setActiveView}
    onOpenAuth={() => setActiveView("login")}
  />}

      {
    /* Main Viewport Content */
  }
      <main className="flex-1">
        {renderMainContent()}
      </main>

      {
    /* Institutional Footer */
  }
      {activeView !== "login" && <Footer />}

      {
    /* Authentication & Profile Modal */
  }
      <AuthModal
    isOpen={isAuthOpen}
    onClose={() => setIsAuthOpen(false)}
    onSwitchToFullPage={() => setActiveView("login")}
  />

      {
    /* Floating System Toast Notification with Framer Motion */
  }
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={`fixed bottom-5 right-5 z-50 max-w-md flex items-start gap-3 p-4 rounded-xl shadow-2xl backdrop-blur-md text-xs border transition-colors ${
              notification.type === "success"
                ? "bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 border-teal-500/50"
                : notification.type === "error"
                ? "bg-rose-950/95 text-rose-100 border-rose-500/50"
                : "bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 border-slate-700 dark:border-slate-300"
            }`}
          >
            {notification.type === "success" && (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 dark:text-emerald-600 shrink-0 mt-0.5" />
            )}
            {notification.type === "error" && (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            {notification.type === "info" && (
              <Info className="w-5 h-5 text-teal-400 dark:text-teal-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 pr-2">
              <p className="font-semibold leading-relaxed">{notification.message}</p>
            </div>
            <button
              onClick={dismissNotification}
              className="text-slate-400 hover:text-white dark:hover:text-slate-900 p-0.5 rounded transition-colors"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>;
};
function App() {
  return <AuthProvider>
      <AppContent />
    </AuthProvider>;
}
export {
  App as default
};
