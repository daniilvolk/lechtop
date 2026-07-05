import { getState } from "../store/store.js";
import { listProducts } from "../services/productService.js";
import { productGrid } from "../components/ui.js";
import { t } from "../services/languageService.js";

const labelKey = { pc: "pc", laptop: "laptops", component: "components" };

export function catalogPage(type, params = new URLSearchParams()) {
  const state = getState();
  const selectedCategory = params.get("category") || "";
  const query = params.get("q") || "";
  const brand = params.get("brand") || "";
  const maxPrice = params.get("maxPrice") || "";
  const products = listProducts({ type, category: selectedCategory, query, brand, maxPrice });
  const brands = [...new Set(listProducts({ type }).map((product) => product.brand))];
  const cats = [...new Set(listProducts({ type }).map((product) => product.category))];

  return `
    <section class="page-hero small">
      <span class="kicker">${t("catalog")}</span>
      <h1>${t(labelKey[type] || "catalog")}</h1>
      <p>${type === "pc" ? "מחשבי גיימינג ועבודה בהרכבה מקצועית בישראל." : type === "laptop" ? "לפטופים לגיימינג, לימודים, עבודה ועיצוב." : "רכיבים, חיפוש, סינון וברקודים."}</p>
    </section>
    <section class="catalog-layout">
      <aside class="filters">
        <form data-form="filters">
          <label><span>${t("search")}</span><input name="q" value="${query}" placeholder="LechTop, RTX, 729700..." /></label>
          <label><span>${t("category")}</span><select name="category"><option value="">${t("all")}</option>${cats.map((cat) => `<option ${cat === selectedCategory ? "selected" : ""}>${cat}</option>`).join("")}</select></label>
          <label><span>${t("brand")}</span><select name="brand"><option value="">${t("all")}</option>${brands.map((item) => `<option ${item === brand ? "selected" : ""}>${item}</option>`).join("")}</select></label>
          <label><span>${t("priceTo")}</span><input name="maxPrice" type="number" value="${maxPrice}" placeholder="25000" /></label>
          ${type === "pc" ? `<label><span>Use</span><select name="q"><option value="${query}">${query || t("all")}</option><option>Gaming</option><option>Workstation</option><option>Office</option><option>Streaming</option></select></label>` : ""}
          <button class="primary wide">${t("apply")}</button>
          <a class="ghost wide" href="#/catalog/${type}">${t("reset")}</a>
        </form>
        <div class="mini-panel"><b>${state.products.length}</b><span>${t("items")}</span></div>
      </aside>
      <div>
        <div class="catalog-top"><span>${products.length} ${t("items")}</span><a href="#/search">${t("globalSearch")}</a></div>
        ${productGrid(products)}
      </div>
    </section>
  `;
}

export function bindCatalog(type) {
  const form = document.querySelector('[data-form="filters"]');
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const params = new URLSearchParams();
    for (const [key, value] of data.entries()) if (value) params.set(key, value);
    location.hash = `#/catalog/${type}?${params.toString()}`;
  });
}
