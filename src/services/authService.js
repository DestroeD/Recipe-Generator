import { storage } from "./storage";

const USERS_KEY = "demo_users";
const CURRENT_KEY = "demo_current_user";

// Нормалізація email
function normEmail(email) {
  return String(email || "").trim().toLowerCase();
}

// Зчитати список користувачів
function listUsers() {
  return storage.get(USERS_KEY, []);
}

// Зберегти список користувачів
function saveUsers(users) {
  storage.set(USERS_KEY, users);
}

function toSession(user) {
  return user ? { id: user.id, name: user.name, email: user.email } : null;
}

export function getCurrentUser() {
  return storage.get(CURRENT_KEY, null);
}

export function isAuthenticated() {
  return !!getCurrentUser();
}

export function logout() {
  storage.remove(CURRENT_KEY);
}

export function register({ name, email, password }) {
  // найпростіша валідація форм
  const n = String(name || "").trim();
  const e = normEmail(email);
  const p = String(password || "");

  if (n.length < 2) throw new Error("Ім’я занадто коротке");
  if (!/^\S+@\S+\.\S+$/.test(e)) throw new Error("Некоректний email");
  if (p.length < 6) throw new Error("Пароль має містити щонайменше 6 символів");

  const users = listUsers();
  if (users.some(u => normEmail(u.email) === e)) {
    throw new Error("Користувач з таким email вже існує");
  }

  const user = {
    id: crypto.randomUUID(),
    name: n,
    email: e,
    password: p,
    createdAt: Date.now(),
  };

  saveUsers([...users, user]);

  const session = toSession(user);
  storage.set(CURRENT_KEY, session);
  return session;
}

export function login({ email, password }) {
  const e = normEmail(email);
  const p = String(password || "");

  const users = listUsers();
  const user = users.find(u => normEmail(u.email) === e && u.password === p);
  if (!user) throw new Error("Невірний email або пароль");

  const session = toSession(user);
  storage.set(CURRENT_KEY, session);
  return session;
}

// Оновити профіль (ім’я) поточного користувача
export function updateProfileName(newName) {
  const session = getCurrentUser();
  if (!session) throw new Error("Необхідно увійти в акаунт");

  const users = listUsers();
  const idx = users.findIndex(u => u.id === session.id);
  if (idx === -1) throw new Error("Користувача не знайдено");

  const name = String(newName || "").trim();
  if (name.length < 2) throw new Error("Ім’я занадто коротке");

  users[idx] = { ...users[idx], name };
  saveUsers(users);

  const newSession = { ...session, name };
  storage.set(CURRENT_KEY, newSession);
  return newSession;
}