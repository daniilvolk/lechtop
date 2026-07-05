import { getState } from "../store/store.js";
import { currentUser, logout } from "../services/authService.js";
import { addToCart, toggleCompare, toggleFavorite } from "../services/cartService.js";
import { barcodeSvg } from "../services/barcodeService.js";
import { getLanguage, languages, setLanguage, t } from "../services/languageService.js";
import { money } from "../utils/format.js";

export function shell(content) {
  const user = currentUser();
  const lang = getLanguage();
  const cartCount = getState().cart.reduce((sum, item) => sum + item.quantity, 0);
  return `
    <header class="header">
      <a class="brand" href="#/"><span class="brand-mark"></span><span>LechTop</span></a>
      <button class="nav-toggle" data-action="toggle-menu" aria-label="Menu">☰</button>
      <nav class="nav" id="mainNav">
        <a href="#/catalog/pc">${t("pc")}</a>
        <a href="#/catalog/laptop">${t("laptops")}</a>
        <a href="#/catalog/component">${t("components")}</a>
        <a href="#/builder">${t("builder")}</a>
        <a href="#/search">${t("search")}</a>
        ${user?.role === "admin" ? `<a href="#/admin">${t("admin")}</a>` : ""}
      </nav>
      <div class="header-actions">
        <label class="language-select" title="${t("language")}">
          <span>${t("language")}</span>
          <select data-action="language">
            ${languages.map((item) => `<option value="${item.code}" ${item.code === lang ? "selected" : ""}>${item.label}</option>`).join("")}
          </select>
        </label>
        <a class="icon-btn" href="#/cart" title="${t("cart")}">🛒<span>${cartCount}</span></a>
        ${user ? `<a class="profile-chip" href="#/account">${user.name}</a><button class="ghost small" data-action="logout">${t("logout")}</button>` : `<a class="ghost small" href="#/login">${t("login")}</a>`}
      </div>
    </header>
    <main>${content}</main>
    <footer class="footer">
      <div><strong>LechTop</strong><p>${t("footerText")}</p></div>
      <div><span>support@lechtop.co.il</span><span>+972 54-777-2233</span><span>HaArba'a 28, Tel Aviv</span></div>
      <div><a href="#/catalog/pc">${t("catalog")}</a><a href="#/builder">${t("builder")}</a><a href="#/admin">${t("admin")}</a></div>
    </footer>
  `;
}

export function productCard(product) {
  return `
    <article class="product-card" data-product-id="${product.id}">
      <a href="#/product/${product.slug}" class="product-image">
        <img src="${product.images[0]}" alt="${product.title}" loading="lazy" />
        <span class="stock">${product.stock > 0 ? t("inStock") : t("outOfStock")}</span>
      </a>
      <div class="badges">${product.badges.map((badge) => `<span>${badge}</span>`).join("")}</div>
      <a class="product-title" href="#/product/${product.slug}">${product.title}</a>
      <p>${Object.entries(product.specs).slice(0, 4).map(([key, val]) => `${key}: ${val}`).join(" · ")}</p>
      <div class="price-row">
        <strong>${money(product.price)}</strong>
        ${product.oldPrice ? `<del>${money(product.oldPrice)}</del>` : ""}
      </div>
      <div class="card-actions">
        <button class="primary" data-action="add-cart" data-id="${product.id}">${t("addToCart")}</button>
        <a class="ghost" href="#/product/${product.slug}">${t("details")}</a>
        <button class="icon-line" data-action="favorite" data-id="${product.id}" title="${t("favorite")}">♡</button>
        <button class="icon-line" data-action="compare" data-id="${product.id}" title="${t("compare")}">⇄</button>
      </div>
    </article>
  `;
}

export function productGrid(products) {
  if (!products.length) return `<div class="empty">${t("noResults")}</div>`;
  return `<div class="product-grid">${products.map(productCard).join("")}</div>`;
}

export function barcodeView(value) {
  return `<div class="barcode">${barcodeSvg(value)}</div>`;
}

export function toast(message, type = "ok") {
  let el = document.querySelector(".toast-stack");
  if (!el) {
    el = document.createElement("div");
    el.className = "toast-stack";
    document.body.appendChild(el);
  }
  const item = document.createElement("div");
  item.className = `toast ${type}`;
  item.textContent = message;
  el.appendChild(item);
  setTimeout(() => item.remove(), 3200);
}

export function bindGlobalUi() {
  document.addEventListener("pointermove", (event) => {
    document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
    document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);
  }, { passive: true });

  document.body.addEventListener("change", (event) => {
    const target = event.target.closest('[data-action="language"]');
    if (!target) return;
    setLanguage(target.value);
    toast(`${t("language")}: ${languages.find((item) => item.code === target.value)?.label || target.value}`);
    window.dispatchEvent(new Event("store-rerender"));
  });

  document.body.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    if (!target) return;
    const action = target.dataset.action;
    if (action === "toggle-menu") document.querySelector("#mainNav")?.classList.toggle("open");
    if (action === "logout") {
      logout();
      location.hash = "#/";
      toast(t("loggedOut"));
    }
    if (action === "add-cart") {
      addToCart(target.dataset.id);
      toast(t("productAdded"));
      window.dispatchEvent(new Event("store-rerender"));
    }
    if (action === "favorite") {
      toggleFavorite(target.dataset.id);
      toast(t("favoritesUpdated"));
      window.dispatchEvent(new Event("store-rerender"));
    }
    if (action === "compare") {
      toggleCompare(target.dataset.id);
      toast(t("compareUpdated"));
      window.dispatchEvent(new Event("store-rerender"));
    }
  });
}

export function requireAuth(role) {
  const user = currentUser();
  if (!user) {
    return { allowed: false, html: authGate(t("authRequired"), "#/login") };
  }
  if (role && user.role !== role) {
    return { allowed: false, html: authGate(t("adminRequired"), "#/") };
  }
  return { allowed: true, user };
}

function authGate(title, link) {
  return `
    <section class="auth-gate">
      <div class="panel center">
        <span class="kicker">${t("protectedRoute")}</span>
        <h1>${title}</h1>
        <a class="primary wide" href="${link}">${t("continue")}</a>
      </div>
    </section>
  `;
}

export function skeletonCards(count = 6) {
  return `<div class="product-grid">${Array.from({ length: count }, () => `<div class="skeleton-card"><i></i><b></b><span></span><small></small></div>`).join("")}</div>`;
}
