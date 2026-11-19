import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(void 0);

// ─── Helper: Safe JSON fetch with smart error messages ───────────────────────
async function safeFetch(url, options = {}) {
  let res;
  try {
    res = await fetch(url, options);
  } catch (networkErr) {
    // Network completely failed — server down or wrong URL
    const isLocalhost = window.location.hostname === "localhost";
    if (isLocalhost) {
      throw new Error(
        "🔌 Server se connect nahi ho paya.\n" +
        "Kya backend chal raha hai? Terminal mein check karo:\n" +
        "→ http://localhost:3000 pe server hona chahiye."
      );
    }
    throw new Error("Network error: Internet ya server unavailable hai.");
  }

  const contentType = res.headers.get("content-type") || "";

  // Response JSON nahi hai — HTML page mila (wrong port / proxy issue)
  if (!contentType.includes("application/json")) {
    const preview = await res.text().catch(() => "");
    const isHtmlPage = preview.toLowerCase().includes("<!doctype") ||
                       preview.toLowerCase().includes("<html");

    if (isHtmlPage) {
      const isLocalhost = window.location.hostname === "localhost";
      if (isLocalhost) {
        throw new Error(
          "⚠️ Galat port pe chal rahe ho!\n" +
          "Yeh website sirf http://localhost:3000 pe kaam karti hai.\n" +
          "localhost:5173 ya koi aur port nahi — seedha 3000 use karo."
        );
      } else {
        throw new Error(
          "Server error: API se invalid response mila.\n" +
          "Thodi der baad try karo ya admin se contact karo."
        );
      }
    }

    throw new Error(`Server error (${res.status}): Unexpected response format.`);
  }

  return res;
}

// ─── Friendly error message mapper ───────────────────────────────────────────
function getFriendlyError(status, serverMessage) {
  if (status === 400) return serverMessage || "Invalid request. Fields check karo.";
  if (status === 401) return "❌ Email ya password galat hai. 'demo123' try karo.";
  if (status === 403) return "🚫 Is account ko access karne ki permission nahi.";
  if (status === 404) return "Account nahi mila. Email check karo ya register karo.";
  if (status === 409) return "Yeh email already registered hai. Sign in karo.";
  if (status === 429) return "Zyada attempts! Thodi der baad try karo.";
  if (status >= 500)  return "🛠️ Server mein kuch gadbad hai. Thodi der baad try karo.";
  return serverMessage || "Kuch galat ho gaya. Dobara try karo.";
}

// ─── AuthProvider ─────────────────────────────────────────────────────────────
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
    try { return localStorage.getItem("nexus_theme") || "light"; }
    catch { return "light"; }
  });

  const [highContrast, setHighContrast] = useState(() => {
    try { return localStorage.getItem("nexus_high_contrast") === "true"; }
    catch { return false; }
  });

  const [fontScale, setFontScaleState] = useState(() => {
    try { return localStorage.getItem("nexus_font_scale") || "normal"; }
    catch { return "normal"; }
  });

  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => curr?.message === message ? null : curr);
    }, 4500);
  };

  const dismissNotification = () => setNotification(null);

  // ── Theme effects ──────────────────────────────────────────────────────────
  useEffect(() => {
    const root = document.documentElement;
    theme === "dark" ? root.classList.add("dark") : root.classList.remove("dark");
    localStorage.setItem("nexus_theme", theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    highContrast ? root.classList.add("high-contrast") : root.classList.remove("high-contrast");
    localStorage.setItem("nexus_high_contrast", String(highContrast));
  }, [highContrast]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("text-scale-lg", "text-scale-xl");
    if (fontScale === "large")  root.classList.add("text-scale-lg");
    if (fontScale === "xlarge") root.classList.add("text-scale-xl");
    localStorage.setItem("nexus_font_scale", fontScale);
  }, [fontScale]);

  const toggleTheme = () => setTheme((prev) => prev === "light" ? "dark" : "light");

  const toggleHighContrast = () => {
    setHighContrast((prev) => !prev);
    showNotification(
      !highContrast ? "High Contrast Mode Enabled (WCAG AAA)" : "Standard Contrast Restored",
      "info"
    );
  };

  const setFontScale = (scale) => {
    setFontScaleState(scale);
    showNotification(`Font size: ${scale}`, "info");
  };

  // ── loginAsDemoUser ────────────────────────────────────────────────────────
  const loginAsDemoUser = async (targetRole) => {
    const roleEmailMap = {
      student:   "aarav.sharma@cu.edu.in",
      tpo:       "tpo.director@lpu.co.in",
      recruiter: "ananya.iyer@novatech.in",
      admin:     "admin@nexuscollab.org",
    };
    const email = roleEmailMap[targetRole];
    try {
      const res = await safeFetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: "demo123" }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem("nexus_user", JSON.stringify(data.user));
        showNotification(`✅ Logged in as ${data.user.name} (${data.user.role.toUpperCase()})`, "success");
      } else {
        const data = await res.json().catch(() => ({}));
        showNotification(getFriendlyError(res.status, data.error), "error");
      }
    } catch (err) {
      showNotification(err.message || "Demo login fail ho gaya.", "error");
    }
  };

  // ── loginWithEmail ─────────────────────────────────────────────────────────
  const loginWithEmail = async (email, password = "demo123") => {
    try {
      const res = await safeFetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: getFriendlyError(res.status, data.error) };
      }

      setUser(data.user);
      localStorage.setItem("nexus_user", JSON.stringify(data.user));
      showNotification(`✅ Welcome back, ${data.user.name}!`, "success");
      return { success: true };

    } catch (err) {
      // Format multi-line error nicely
      const msg = err.message || "Login fail ho gaya.";
      return { success: false, error: msg };
    }
  };

  // ── registerUser ───────────────────────────────────────────────────────────
  const registerUser = async (userData) => {
    try {
      const res = await safeFetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: getFriendlyError(res.status, data.error) };
      }

      setUser(data.user);
      localStorage.setItem("nexus_user", JSON.stringify(data.user));
      showNotification(`🎉 Account bana liya, ${data.user.name}!`, "success");
      return { success: true };

    } catch (err) {
      return { success: false, error: err.message || "Registration fail ho gaya." };
    }
  };

  // ── updateCurrentUser ──────────────────────────────────────────────────────
  const updateCurrentUser = async (updates) => {
    if (!user) return;
    try {
      const res = await fetch(`/api/auth/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem("nexus_user", JSON.stringify(data.user));
        showNotification("✅ Profile update ho gaya!", "success");
      } else {
        showNotification("Profile update fail ho gaya.", "error");
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
      showNotification("Network error — profile save nahi hua.", "error");
    }
  };

  // ── logout ─────────────────────────────────────────────────────────────────
  const logout = () => {
    setUser(null);
    localStorage.removeItem("nexus_user");
    showNotification("👋 Logged out successfully", "info");
  };

  return (
    <AuthContext.Provider
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
        showNotification,
        dismissNotification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export { AuthProvider, useAuth };
