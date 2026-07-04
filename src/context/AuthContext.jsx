import { createContext, useContext, useEffect, useState } from "react";
import users from "../data/users";

const AuthContext = createContext(null);
const STORAGE_KEY = "ledgerhq_session";

// Role -> permissions map. Adjust freely as your roles grow.
export const ROLE_PERMISSIONS = {
  admin: {
    label: "Admin",
    canManageCustomers: true,
    canDeleteCustomers: true,
    canManageLedger: true,
    canDeleteLedgerEntries: true,
    canViewHistory: true,
  },
  staff: {
    label: "Staff",
    canManageCustomers: true,
    canDeleteCustomers: false,
    canManageLedger: true,
    canDeleteLedgerEntries: false,
    canViewHistory: true,
  },
  viewer: {
    label: "Viewer",
    canManageCustomers: false,
    canDeleteCustomers: false,
    canManageLedger: false,
    canDeleteLedgerEntries: false,
    canViewHistory: true,
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Restore session on first load (swap for onAuthStateChanged when using Firebase)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const stillValid = users.find((u) => u.id === parsed.id);
        if (stillValid) setUser(parsed);
      }
    } catch (err) {
      console.error("Failed to restore session", err);
    } finally {
      setInitializing(false);
    }
  }, []);

  const login = (email, password) => {
    const match = users.find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        u.password === password
    );

    if (!match) {
      return { success: false, error: "Invalid email or password" };
    }

    const { password: _pw, ...safeUser } = match;
    setUser(safeUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const permissions = user ? ROLE_PERMISSIONS[user.role] : null;

  return (
    <AuthContext.Provider
      value={{ user, initializing, login, logout, permissions }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}