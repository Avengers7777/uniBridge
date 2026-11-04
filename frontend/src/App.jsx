import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { AccessibilityToolbar } from "./components/AccessibilityToolbar";
import { LandingPage } from "./components/LandingPage";
import { StudentPortal } from "./components/StudentPortal";
import { TpoPortal } from "./components/TpoPortal";
import { RecruiterPortal } from "./components/RecruiterPortal";
import { AuthModal } from "./components/AuthModal";
import { LoginPage } from "./components/LoginPage";
import { Footer } from "./components/Footer";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";
const AppContent = () => {
  const { user, loginAsDemoUser, notification } = useAuth();
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
    /* Floating System Notification */
  }
      {notification && <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 p-3.5 rounded-lg shadow-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs border border-slate-700 dark:border-slate-200 transition-all">
          {notification.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />}
          {notification.type === "error" && <AlertCircle className="w-4 h-4 text-rose-400 dark:text-rose-600 shrink-0" />}
          {notification.type === "info" && <Info className="w-4 h-4 text-teal-400 dark:text-teal-600 shrink-0" />}
          <span className="font-medium">{notification.message}</span>
        </div>}
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
