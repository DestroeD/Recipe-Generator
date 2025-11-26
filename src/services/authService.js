import { storage } from "./storage";
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

const CURRENT_KEY = "demo_current_user";

// Нормалізація email
function normEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function getStoredSession() {
  return storage.get(CURRENT_KEY, null);
}

function toSessionFromFirebase(user, prev = null) {
  if (!user) return null;

  return {
    id: user.uid,
    name: user.displayName || prev?.name || "",
    email: user.email,
    avatar: prev?.avatar ?? null,
  };
}

function saveSessionFromFirebase(user) {
  const prev = getStoredSession();
  const session = toSessionFromFirebase(user, prev);

  if (session) {
    storage.set(CURRENT_KEY, session);
  } else {
    storage.remove(CURRENT_KEY);
  }
  return session;
}

export function getCurrentUser() {
  const fbUser = auth.currentUser;
  if (fbUser) {
    return saveSessionFromFirebase(fbUser);
  }
  return getStoredSession();
}

export function isAuthenticated() {
  return !!getCurrentUser();
}

export async function logout() {
  await signOut(auth);
  storage.remove(CURRENT_KEY);
}

export async function register({ name, email, password }) {
  const n = String(name || "").trim();
  const e = normEmail(email);
  const p = String(password || "");

  if (n.length < 2) throw new Error("Ім’я занадто коротке");
  if (!/^\S+@\S+\.\S+$/.test(e)) throw new Error("Некоректний email");
  if (p.length < 6) throw new Error("Пароль має містити щонайменше 6 символів");

  const cred = await createUserWithEmailAndPassword(auth, e, p);

  await updateProfile(cred.user, { displayName: n });

  // зберігаємо сесію
  return saveSessionFromFirebase(cred.user);
}

export async function login({ email, password }) {
  const e = normEmail(email);
  const p = String(password || "");

  const cred = await signInWithEmailAndPassword(auth, e, p);

  return saveSessionFromFirebase(cred.user);
}

// оновлення імені в Firebase + name/avatar у localStorage
export async function updateProfileData({ name, avatar }) {
  const fbUser = auth.currentUser;
  if (!fbUser) throw new Error("Необхідно увійти в акаунт");

  let safeName;

  if (name !== undefined) {
    safeName = String(name || "").trim();
    if (safeName.length < 2) throw new Error("Ім’я занадто коротке");

    await updateProfile(fbUser, { displayName: safeName });
  }

  const prev =
    getStoredSession() || toSessionFromFirebase(fbUser, null);

  const session = {
    ...prev,
    ...(safeName !== undefined ? { name: safeName } : {}),
    ...(avatar !== undefined ? { avatar } : {}),
  };

  storage.set(CURRENT_KEY, session);
  return session;
}

export async function updateProfileName(newName) {
  return updateProfileData({ name: newName });
}