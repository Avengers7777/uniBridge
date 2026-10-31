import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types/index.ts';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
  fontScale: 'normal' | 'large' | 'xlarge';
  setFontScale: (scale: 'normal' | 'large' | 'xlarge') => void;
  loginAsDemoUser: (targetRole: UserRole) => Promise<void>;
  loginWithEmail: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  registerUser: (userData: any) => Promise<{ success: boolean; error?: string }>;
  updateCurrentUser: (updates: Partial<UserProfile>) => Promise<void>;
  logout: () => void;
  notification: { message: string; type: 'success' | 'info' | 'error' } | null;
  showNotification: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('nexus_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('nexus_theme');
      return (saved as 'light' | 'dark') || 'light';
    } catch {
      return 'light';
    }
  });

  const [highContrast, setHighContrast] = useState<boolean>(() => {
    try {
      return localStorage.getItem('nexus_high_contrast') === 'true';
    } catch {
      return false;
    }
  });

  const [fontScale, setFontScaleState] = useState<'normal' | 'large' | 'xlarge'>(() => {
    try {
      return (localStorage.getItem('nexus_font_scale') as 'normal' | 'large' | 'xlarge') || 'normal';
    } catch {
      return 'normal';
    }
  });

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  };

  // Sync theme with HTML root
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('nexus_theme', theme);
  }, [theme]);

  // Sync high contrast with HTML root
  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    localStorage.setItem('nexus_high_contrast', String(highContrast));
  }, [highContrast]);

  // Sync font scale
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('text-scale-lg', 'text-scale-xl');
    if (fontScale === 'large') root.classList.add('text-scale-lg');
    if (fontScale === 'xlarge') root.classList.add('text-scale-xl');
    localStorage.setItem('nexus_font_scale', fontScale);
  }, [fontScale]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleHighContrast = () => {
    setHighContrast(prev => !prev);
    showNotification(!highContrast ? 'High Contrast Mode Enabled (WCAG AAA)' : 'Standard Contrast Restored', 'info');
  };

  const setFontScale = (scale: 'normal' | 'large' | 'xlarge') => {
    setFontScaleState(scale);
    showNotification(`Font scale adjusted to ${scale}`, 'info');
  };

  const loginAsDemoUser = async (targetRole: UserRole) => {
    const roleEmailMap: Record<UserRole, string> = {
      student: 'alex.chen@apex.edu',
      tpo: 'dr.vance@stanford-tech.edu',
      recruiter: 'marcus.chen@novatech.io',
      admin: 'admin@nexuscollab.org'
    };

    const email = roleEmailMap[targetRole];
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: 'demo123' })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem('nexus_user', JSON.stringify(data.user));
        showNotification(`Logged in as ${data.user.name} (${data.user.role.toUpperCase()})`, 'success');
      } else {
        showNotification('Failed to switch demo account', 'error');
      }
    } catch (err) {
      console.error(err);
      showNotification('Network error switching account', 'error');
    }
  };

  const loginWithEmail = async (email: string, password = 'demo123'): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }
      setUser(data.user);
      localStorage.setItem('nexus_user', JSON.stringify(data.user));
      showNotification(`Welcome back, ${data.user.name}!`, 'success');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  };

  const registerUser = async (userData: any): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }
      setUser(data.user);
      localStorage.setItem('nexus_user', JSON.stringify(data.user));
      showNotification(`Account created successfully for ${data.user.name}!`, 'success');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  };

  const updateCurrentUser = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    try {
      const res = await fetch(`/api/auth/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem('nexus_user', JSON.stringify(data.user));
        showNotification('Profile updated successfully', 'success');
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nexus_user');
    showNotification('Logged out successfully', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'student',
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
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
