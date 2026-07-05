const localeByLanguage = { he: "he-IL", en: "en-IL", ru: "ru-IL" };

export const money = (value) =>
  new Intl.NumberFormat(localeByLanguage[readLanguage()] || "he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 0 }).format(value);

export const uid = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/ё/g, "e")
    .replace(/[^a-zа-я0-9]+/gi, "-")
    .replace(/(^-|-$)/g, "");

export const normalize = (value) => String(value || "").toLowerCase().trim();

export const todayIso = () => new Date().toISOString();

function readLanguage() {
  try {
    const state = JSON.parse(localStorage.getItem("lechtop-store-v4") || "{}");
    const user = state.users?.find((item) => item.id === state.sessionUserId);
    return user?.language || state.language || localStorage.getItem("lechtop-language") || "he";
  } catch {
    return "he";
  }
}
