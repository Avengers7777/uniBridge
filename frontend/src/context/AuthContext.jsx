import { createContext, useContext, useState, useEffect } from "react";
const AuthContext = createContext(void 0);
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("nexus_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("nexus_theme");
      return saved || "light";
    } catch {
      return "light";
    }
  });
  const [highContrast, setHighContrast] = useState(() => {
    try {
      return localStorage.getItem("nexus_high_contrast") === "true";
    } catch {
      return false;
    }
  });
  const [fontScale, setFontScaleState] = useState(() => {
    try {
      return localStorage.getItem("nexus_font_scale") || "normal";
    } catch {
      return "normal";
    }
  });
  const [notification, setNotification] = useState(null);
  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => curr?.message === message ? null : curr);
    }, 4e3);
  };
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("nexus_theme", theme);
  }, [theme]);
  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }
    localStorage.setItem("nexus_high_contrast", String(highContrast));
  }, [highContrast]);
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("text-scale-lg", "text-scale-xl");
    if (fontScale === "large") root.classList.add("text-scale-lg");
    if (fontScale === "xlarge") root.classList.add("text-scale-xl");
    localStorage.setItem("nexus_font_scale", fontScale);
  }, [fontScale]);
  const toggleTheme = () => {
    setTheme((prev) => prev === "light" ? "dark" : "light");
  };
  const toggleHighContrast = () => {
    setHighContrast((prev) => !prev);
    showNotification(!highContrast ? "High Contrast Mode Enabled (WCAG AAA)" : "Standard Contrast Restored", "info");
  };
  const setFontScale = (scale) => {
    setFontScaleState(scale);
    showNotification(`Font scale adjusted to ${scale}`, "info");
  };
  const loginAsDemoUser = async (targetRole) => {
    const roleEmailMap = {
      student: "aarav.sharma@cu.edu.in",
      tpo: "tpo.director@lpu.co.in",
      recruiter: "ananya.iyer@novatech.in",
      admin: "admin@nexuscollab.org"
    };
    const email = roleEmailMap[targetRole];
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: "demo123" })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem("nexus_user", JSON.stringify(data.user));
        showNotification(`Logged in as ${data.user.name} (${data.user.role.toUpperCase()})`, "success");
      } else {
        showNotification("Failed to switch demo account", "error");
      }
    } catch (err) {
      console.error(err);
      showNotification("Network error switching account", "error");
    }
  };
  const loginWithEmail = async (email, password = "demo123") => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Login failed" };
      }
      setUser(data.user);
      localStorage.setItem("nexus_user", JSON.stringify(data.user));
      showNotification(`Welcome back, ${data.user.name}!`, "success");
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || "Network error" };
    }
  };
  const registerUser = async (userData) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Registration failed" };
      }
      setUser(data.user);
      localStorage.setItem("nexus_user", JSON.stringify(data.user));
      showNotification(`Account created successfully for ${data.user.name}!`, "success");
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || "Network error" };
    }
  };
  const updateCurrentUser = async (updates) => {
    if (!user) return;
    try {
      const res = await fetch(`/api/auth/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem("nexus_user", JSON.stringify(data.user));
        showNotification("Profile updated successfully", "success");
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("nexus_user");
    showNotification("Logged out successfully", "info");
  };
  return <AuthContext.Provider
    value={{
      user,
      role: user?.role || "student",
      isAuthenticated: !!user,
      theme,
      toggleTheme,
      highContrast,
      toggleHighContrast,
      fontScale,
      setFontScale,
      loginAsDemoUser,
      loginWithEmail,
      registerUser,
      updateCurrentUser,
      logout,
      notification,
      showNotification
    }}
  >
      {children}
    </AuthContext.Provider>;
};
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
export {
  AuthProvider,
  useAuth
};
