import { createContext, useContext, useMemo, useState, useEffect } from "react";
import {
  getCurrentUser,
  login as svcLogin,
  register as svcRegister,
  logout as svcLogout,
} from "../services/authService";

const AuthCtx = createContext(null);

const CURRENT_USER_KEY = "rg_demo_current_user";

export function AuthProvider({ children }) {
  // щоб після reload стан зберігався
  const [user, setUser] = useState(() => getCurrentUser());
  const isAuthed = !!user;

  // API, яким користуватимуться компоненти
  const value = useMemo(
    () => ({
      user,
      isAuthed,
      async login(creds) {
        const u = svcLogin(creds);
        setUser(u);
        return u;
      },
      async register(data) {
        const u = svcRegister(data);
        setUser(u);
        return u;
      },
      logout() {
        svcLogout();
        setUser(null);
      },
      
      updateProfile(updates) {
        setUser((prev) => {
          if (!prev) return prev;

          const updatedUser = {
            ...prev,
            ...updates,
          };

          try {
            localStorage.setItem(
              CURRENT_USER_KEY,
              JSON.stringify(updatedUser)
            );
          } catch (e) {
            console.error("Failed to persist updated user", e);
          }

          return updatedUser;
        });
      },
    }),
    [user, isAuthed]
  );

  // синхронізація між вкладками
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key?.includes("rg_demo_current_user")) {
        setUser(getCurrentUser());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
