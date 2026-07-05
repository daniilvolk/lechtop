import { getState } from "../store/store.js";
import { currentUser, updateProfile } from "../services/authService.js";
import { getProductById } from "../services/productService.js";
import { input } from "../components/forms.js";
import { requireAuth, toast } from "../components/ui.js";
import { t } from "../services/languageService.js";
import { money } from "../utils/format.js";

export function accountPage() {
  const gate = requireAuth();
  if (!gate.allowed) return gate.html;
  const user = currentUser();
  const state = getState();
  const orders = state.orders.filter((order) => order.userId === user.id || order.customer.email === user.email);
  const favorites = state.favorites.map(getProductById).filter(Boolean);
  return `
    <section class="page-hero small"><span class="kicker">Account</span><h1>${t("account")}</h1></section>
    <section class="account-layout">
      <form class="panel form-grid" id="profileForm">
        <h2>${t("account")}</h2>
        ${input("name", t("name"), user.name, "text", "required")}
        ${input("email", t("email"), user.email, "email", "required")}
        <button class="primary wide">${t("apply")}</button>
      </form>
      <div class="panel">
        <h2>${t("orderSummary")}</h2>
        ${orders.map((order) => `<div class="order-row"><b>${order.id}</b><span>${order.status}</span><strong>${money(order.total)}</strong></div>`).join("") || `<p>${t("emptyCart")}</p>`}
      </div>
      <div class="panel">
        <h2>${t("favorite")}</h2>
        ${favorites.map((product) => `<a class="fav-row" href="#/product/${product.slug}">${product.title}<span>${money(product.price)}</span></a>`).join("") || `<p>${t("noResults")}</p>`}
      </div>
    </section>
  `;
}

export function bindAccount() {
  document.querySelector("#profileForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    updateProfile({ name: data.get("name"), email: data.get("email") });
    toast(t("profileUpdated"));
    window.dispatchEvent(new Event("store-rerender"));
  });
}
