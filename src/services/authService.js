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

function toSession(user) {
  return user
    ? {
        id: user.uid,
        name: user.displayName || "",
        email: user.email,
      }
    : null;
}

// збереження/очищення сесії в localStorage
function saveSession(user) {
  const session = toSession(user);
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
    return saveSession(fbUser);
  }
  return storage.get(CURRENT_KEY, null);
}

export function isAuthenticated() {
  return !!getCurrentUser();
}

export async function logout() {
  await signOut(auth);
  storage.remove(CURRENT_KEY);
}

export async function register({ name, email, password }) {
  // найпростіша валідація форм
  const n = String(name || "").trim();
  const e = normEmail(email);
  const p = String(password || "");

  if (n.length < 2) throw new Error("Ім’я занадто коротке");
  if (!/^\S+@\S+\.\S+$/.test(e)) throw new Error("Некоректний email");
  if (p.length < 6) throw new Error("Пароль має містити щонайменше 6 символів");

  const cred = await createUserWithEmailAndPassword(auth, e, p);

  await updateProfile(cred.user, { displayName: n });

  // зберігаємо сесію в localStorage
  return saveSession(cred.user);
}

export async function login({ email, password }) {
  const e = normEmail(email);
  const p = String(password || "");

  const cred = await signInWithEmailAndPassword(auth, e, p);

  return saveSession(cred.user);
}

export async function updateProfileName(newName) {
  const name = String(newName || "").trim();
  if (name.length < 2) throw new Error("Ім’я занадто коротке");

  const fbUser = auth.currentUser;
  if (!fbUser) throw new Error("Необхідно увійти в акаунт");

  await updateProfile(fbUser, { displayName: name });

  // оновлюємо кеш та повертаємо оновлену сесію
  return saveSession(auth.currentUser);
}