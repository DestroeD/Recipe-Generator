import { storage } from "./storage";

function ensureUser(userId) {
  if (!userId) throw new Error("Треба увійти в акаунт, щоб зберігати рецепти");
}
function savedKey(userId) {
  return `saved_recipes_ids_${userId}`;
}

export function getSavedIds(userId) {
  ensureUser(userId);
  return new Set(storage.get(savedKey(userId), []));
}

export function isSaved(id, userId) {
  ensureUser(userId);
  return getSavedIds(userId).has(id);
}

export function toggleSaved(id, userId) {
  ensureUser(userId);
  const key = savedKey(userId);
  const ids = new Set(storage.get(key, []));
  ids.has(id) ? ids.delete(id) : ids.add(id);
  storage.set(key, Array.from(ids));
  return ids;
}
