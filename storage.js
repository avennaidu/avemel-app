// Storage adapter - replaces Claude's artifact window.storage API.
//
// Mode 1 (shared, multi-phone): set VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
//   in a .env file (or Vercel env vars). All phones read/write the same data.
// Mode 2 (fallback): no env vars -> localStorage. Each phone keeps its own data.
//
// The app only uses get(key) and set(key, value) with string values.

const SUPA_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const useSupabase = Boolean(SUPA_URL && SUPA_KEY);

const headers = {
  apikey: SUPA_KEY,
  Authorization: `Bearer ${SUPA_KEY}`,
  "Content-Type": "application/json",
};

const supabase = {
  async get(key) {
    const r = await fetch(
      `${SUPA_URL}/rest/v1/kv_store?select=value&key=eq.${encodeURIComponent(key)}`,
      { headers }
    );
    if (!r.ok) throw new Error(`storage get failed: ${r.status}`);
    const rows = await r.json();
    if (!rows.length) throw new Error("key not found");
    return { key, value: rows[0].value };
  },
  async set(key, value) {
    const r = await fetch(
      `${SUPA_URL}/rest/v1/kv_store?on_conflict=key`,
      {
        method: "POST",
        headers: { ...headers, Prefer: "resolution=merge-duplicates" },
        body: JSON.stringify({ key, value, updated_at: new Date().toISOString() }),
      }
    );
    if (!r.ok) throw new Error(`storage set failed: ${r.status}`);
    return { key, value };
  },
};

const local = {
  async get(key) {
    const v = localStorage.getItem("avemel-kv:" + key);
    if (v === null) throw new Error("key not found");
    return { key, value: v };
  },
  async set(key, value) {
    localStorage.setItem("avemel-kv:" + key, value);
    return { key, value };
  },
};

const backend = useSupabase ? supabase : local;

// Same call signature the app already uses: get(key, shared) / set(key, value, shared)
window.storage = {
  get: (key, _shared) => backend.get(key),
  set: (key, value, _shared) => backend.set(key, value),
};

if (!useSupabase) {
  console.warn(
    "[Avemel] Running on localStorage (single-device). Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY for shared multi-phone data."
  );
}
