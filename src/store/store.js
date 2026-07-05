import { categories, orders, products, users } from "../services/seed.js";

const KEY = "lechtop-store-v4";
const listeners = new Set();

const fallback = {
  products,
  categories,
  users,
  orders,
  language: "he",
  sessionUserId: null,
  cart: [],
  favorites: [],
  compare: []
};

let state = structuredClone(fallback);

export function initStore() {
  const saved = localStorage.getItem(KEY);
  state = saved ? { ...structuredClone(fallback), ...JSON.parse(saved) } : structuredClone(fallback);
  persist();
}

export function getState() {
  return state;
}

export function setState(patch) {
  state = { ...state, ...patch };
  persist();
  listeners.forEach((fn) => fn(state));
}

export function updateState(mutator) {
  const draft = structuredClone(state);
  mutator(draft);
  state = draft;
  persist();
  listeners.forEach((fn) => fn(state));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function resetDemoData() {
  state = structuredClone(fallback);
  persist();
  listeners.forEach((fn) => fn(state));
}

function persist() {
  localStorage.setItem(KEY, JSON.stringify(state));
}
