import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { getSavedIds as svcGet, toggleSaved as svcToggle } from "../services/recipesService";
import { useAuth } from "./AuthContext";

const SavedCtx = createContext(null);

export function SavedProvider({ children }) {
  const { user, isAuthed } = useAuth();
  const userId = user?.id ?? null;

  const [saved, setSaved] = useState(new Set());

  useEffect(() => {
    if (isAuthed) {
      setSaved(svcGet(userId));
    } else {
      setSaved(new Set());
    }
  }, [isAuthed, userId]);

  const value = useMemo(() => ({
    saved,
    isAuthed,
    toggleSaved: (recipeId) => {
      if (!isAuthed) throw new Error("AUTH_REQUIRED");
      setSaved(svcToggle(recipeId, userId));
    },
    isSaved: (recipeId) => (isAuthed ? saved.has(recipeId) : false),
  }), [saved, isAuthed, userId]);

  return <SavedCtx.Provider value={value}>{children}</SavedCtx.Provider>;
}

export const useSaved = () => useContext(SavedCtx);
