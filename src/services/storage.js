const PREFIX = "rg_"; // щоб ключі не конфліктували з чимось іншим у браузері

function key(k) {
  return `${PREFIX}${k}`;
}

export const storage = {
  get(k, fallback = null) {
    try {
      const raw = localStorage.getItem(key(k));
      return raw === null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  },

  set(k, value) {
    localStorage.setItem(key(k), JSON.stringify(value));
  },

  remove(k) {
    localStorage.removeItem(key(k));
  },

  clearAppData() {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  },
};
