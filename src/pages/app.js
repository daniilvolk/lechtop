import { subscribe } from "../store/store.js";
import { bindGlobalUi, shell } from "../components/ui.js";
import { bindScanner } from "../components/barcodeScanner.js";
import { homePage } from "./home.js";
import { bindCatalog, catalogPage } from "./catalog.js";
import { productPage } from "./product.js";
import { bindCart, cartPage } from "./cart.js";
import { bindCheckout, checkoutPage } from "./checkout.js";
import { bindAuth, loginPage, registerPage } from "./auth.js";
import { accountPage, bindAccount } from "./account.js";
import { bindBuilder, builderPage } from "./builder.js";
import { bindSearch, searchPage } from "./search.js";
import { adminPage, bindAdmin } from "./admin/admin.js";
import { applyLanguageDocument } from "../services/languageService.js";

const app = document.querySelector("#app");
let initialized = false;

export function renderApp() {
  applyLanguageDocument();
  const { path, params } = parseHash();
  let html = "";
  let binder = () => {};

  if (path === "/") html = homePage();
  else if (path.startsWith("/catalog/")) {
    const type = path.split("/")[2];
    html = catalogPage(type, params);
    binder = () => bindCatalog(type);
  } else if (path.startsWith("/product/")) html = productPage(path.split("/")[2]);
  else if (path === "/cart") { html = cartPage(); binder = bindCart; }
  else if (path === "/checkout") { html = checkoutPage(); binder = bindCheckout; }
  else if (path === "/login") { html = loginPage(); binder = bindAuth; }
  else if (path === "/register") { html = registerPage(); binder = bindAuth; }
  else if (path === "/account") { html = accountPage(); binder = bindAccount; }
  else if (path === "/builder") { html = builderPage(); binder = bindBuilder; }
  else if (path === "/search") { html = searchPage(params); binder = bindSearch; }
  else if (path.startsWith("/admin")) {
    const [, , section = "dashboard", id = ""] = path.split("/");
    html = adminPage(section, id);
    binder = bindAdmin;
  } else {
    html = `<section class="not-found"><span>404</span><h1>Страница не найдена</h1><a class="primary" href="#/">На главную</a></section>`;
  }

  app.innerHTML = shell(html);
  prepareMotion();
  binder();
  bindScanner();

  if (!initialized) {
    initialized = true;
    bindGlobalUi();
    window.addEventListener("hashchange", renderApp);
    window.addEventListener("store-rerender", renderApp);
    subscribe(() => {});
  }
}

function parseHash() {
  const raw = location.hash.replace(/^#/, "") || "/";
  const [path, query = ""] = raw.split("?");
  return { path, params: new URLSearchParams(query) };
}

function prepareMotion() {
  const animated = app.querySelectorAll(
    ".hero-copy, .hero-rig, .feature-band > *, .section-head, .product-card, .reason-grid article, .steps > *, .cta, .page-hero > *, .panel, .cart-item, .table-row, .stat-grid article, .spec-grid > *, .gallery, .buy-panel"
  );
  animated.forEach((node, index) => {
    node.classList.add("reveal");
    node.style.setProperty("--reveal-delay", `${Math.min(index * 42, 420)}ms`);
  });

  if (!("IntersectionObserver" in window)) {
    animated.forEach((node) => node.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

  animated.forEach((node) => observer.observe(node));
}
