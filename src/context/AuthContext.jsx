import { createContext, useContext, useMemo, useState, useEffect } from "react";
import {
  getCurrentUser,
  login as svcLogin,
  register as svcRegister,
  logout as svcLogout,
  updateProfileData as svcUpdateProfile,
} from "../services/authService";

import { auth } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  // щоб після reload стан зберігався
  const [user, setUser] = useState(() => getCurrentUser());
  const [initializing, setInitializing] = useState(true);

  const isAuthed = !!user;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, () => {
      const current = getCurrentUser();
      setUser(current);
      setInitializing(false);
    });

    return () => unsub();
  }, []);

  // API, яким користуватимуться компоненти
  const value = useMemo(
    () => ({
      user,
      isAuthed,
      initializing,

      async login(creds) {
        const u = await svcLogin(creds);
        setUser(u);
        return u;
      },

      async register(data) {
        const u = await svcRegister(data);
        setUser(u);
        return u;
      },

      async logout() {
        await svcLogout();
        setUser(null);
      },

      // оновлення профілю (ім’я + аватар)
      async updateProfile(patch) {
        const u = await svcUpdateProfile(patch);
        setUser(u);
        return u;
      },
    }),
    [user, isAuthed, initializing]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
