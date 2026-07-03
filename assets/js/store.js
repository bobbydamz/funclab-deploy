// assets/js/store.js — shared localStorage read/write helpers for the client-side-only rebuild.
// No backend exists; every module below persists purely in the browser via these helpers.
const Store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      const v = JSON.parse(raw);
      return v === null || v === undefined ? fallback : v;
    } catch (_) { return fallback; }
  },
  set(key, value) { localStorage.setItem(key, JSON.stringify(value)); },
  uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
};
window.Store = Store;
