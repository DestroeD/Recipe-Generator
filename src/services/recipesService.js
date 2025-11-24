import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

function ensureUser(userId) {
  if (!userId) throw new Error("Треба увійти в акаунт, щоб зберігати рецепти");
}

function savedDocRef(userId) {
  ensureUser(userId);
  return doc(db, "savedRecipes", userId);
}

export async function getSavedIds(userId) {
  const ref = savedDocRef(userId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return new Set();
  }

  const data = snap.data();
  const ids = Array.isArray(data.ids) ? data.ids : [];
  return new Set(ids);
}

export async function isSaved(id, userId) {
  const ids = await getSavedIds(userId);
  return ids.has(id);
}

export async function toggleSaved(id, userId) {
  const ref = savedDocRef(userId);
  const snap = await getDoc(ref);

  const currentIds =
    snap.exists() && Array.isArray(snap.data().ids)
      ? new Set(snap.data().ids)
      : new Set();

  if (currentIds.has(id)) {
    currentIds.delete(id);
  } else {
    currentIds.add(id);
  }

  // записуємо масив id у Firestore
  await setDoc(ref, { ids: Array.from(currentIds) });

  return currentIds;
}
