import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { getSavedIds as svcGet, toggleSaved as svcToggle } from "../services/recipesService";
import { useAuth } from "./AuthContext";

const SavedCtx = createContext(null);

export function SavedProvider({ children }) {
  const { user, isAuthed } = useAuth();
  const userId = user?.id ?? null;

  const [saved, setSaved] = useState(new Set());

  useEffect(() => {
    let cancelled = false;

    async function loadSaved() {
      if (isAuthed && userId) {
        try {
          const ids = await svcGet(userId);
          if (!cancelled) {
            setSaved(ids);
          }
        } catch (err) {
          console.error("Failed to load saved recipes", err);
          if (!cancelled) {
            setSaved(new Set());
          }
        }
      } else {
        setSaved(new Set());
      }
    }

    loadSaved();

    return () => {
      cancelled = true;
    };
  }, [isAuthed, userId]);

  const value = useMemo(
    () => ({
      saved,
      isAuthed,

      async toggleSaved(recipeId) {
        if (!isAuthed) throw new Error("AUTH_REQUIRED");
        try {
          const ids = await svcToggle(recipeId, userId);
          setSaved(ids);
        } catch (err) {
          console.error("Failed to toggle saved recipe", err);
          throw err;
        }
      },

      isSaved(recipeId) {
        return isAuthed ? saved.has(recipeId) : false;
      },
    }),
    [saved, isAuthed, userId]
  );

  return <SavedCtx.Provider value={value}>{children}</SavedCtx.Provider>;
}

export const useSaved = () => useContext(SavedCtx);
