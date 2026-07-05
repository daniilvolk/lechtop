import { listProducts } from "../services/productService.js";
import { productGrid } from "../components/ui.js";
import { t } from "../services/languageService.js";

export function searchPage(params = new URLSearchParams()) {
  const q = params.get("q") || "";
  const products = q ? listProducts({ query: q }) : [];
  return `
    <section class="page-hero small"><span class="kicker">Search</span><h1>${t("globalSearch")}</h1><p>${t("search")} by title, category, brand, specs or barcode.</p></section>
    <section class="search-shell">
      <form class="search-box" id="searchForm">
        <input name="q" value="${q}" placeholder="RTX 4080, LechTop, 7297009010012..." autofocus />
        <button class="primary">${t("search")}</button>
      </form>
      ${q ? productGrid(products) : `<div class="empty">${t("search")}</div>`}
    </section>
  `;
}

export function bindSearch() {
  document.querySelector("#searchForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const q = new FormData(event.target).get("q");
    location.hash = `#/search?q=${encodeURIComponent(q)}`;
  });
}
