import { cartItems, cartTotal, removeFromCart, setQuantity } from "../services/cartService.js";
import { t } from "../services/languageService.js";
import { money } from "../utils/format.js";

export function cartPage() {
  const items = cartItems();
  return `
    <section class="page-hero small"><span class="kicker">Cart</span><h1>${t("cart")}</h1></section>
    <section class="cart-layout">
      <div class="cart-list">
        ${items.length ? items.map((item) => `
          <article class="cart-item">
            <img src="${item.product.images[0]}" alt="${item.product.title}" />
            <div><a href="#/product/${item.product.slug}">${item.product.title}</a><span>${item.product.barcode}</span></div>
            <input data-action="qty" data-id="${item.productId}" type="number" min="1" value="${item.quantity}" />
            <strong>${money(item.product.price * item.quantity)}</strong>
            <button class="icon-line" data-action="remove-cart" data-id="${item.productId}">×</button>
          </article>
        `).join("") : `<div class="empty">${t("emptyCart")}</div>`}
      </div>
      <aside class="summary panel">
        <span class="kicker">${t("total")}</span>
        <h2>${money(cartTotal())}</h2>
        <a class="primary wide ${items.length ? "" : "disabled"}" href="#/checkout">${t("checkout")}</a>
      </aside>
    </section>
  `;
}

export function bindCart() {
  document.querySelectorAll('[data-action="qty"]').forEach((input) => {
    input.addEventListener("change", () => {
      setQuantity(input.dataset.id, input.value);
      window.dispatchEvent(new Event("store-rerender"));
    });
  });
  document.querySelectorAll('[data-action="remove-cart"]').forEach((button) => {
    button.addEventListener("click", () => {
      removeFromCart(button.dataset.id);
      window.dispatchEvent(new Event("store-rerender"));
    });
  });
}
