import { cartItems, cartTotal } from "../services/cartService.js";
import { currentUser } from "../services/authService.js";
import { createOrder } from "../services/orderService.js";
import { input, textarea } from "../components/forms.js";
import { toast } from "../components/ui.js";
import { t } from "../services/languageService.js";
import { money } from "../utils/format.js";

export function checkoutPage() {
  const user = currentUser();
  const items = cartItems();
  return `
    <section class="page-hero small"><span class="kicker">Checkout</span><h1>${t("checkout")}</h1></section>
    <section class="checkout-layout">
      <form class="panel form-grid" id="checkoutForm">
        ${input("name", t("name"), user?.name || "", "text", "required")}
        ${input("phone", t("phone"), "+972546208935", "tel", "required")}
        ${input("email", t("email"), user?.email || "", "email", "required")}
        ${input("address", t("address"), "Motzkin 9 Netanya 4246009", "text", "required")}
        ${textarea("comment", t("comment"))}
        <label><span>${t("delivery")}</span><select name="delivery"><option>שליח עד הבית</option><option>איסוף עצמי מתל אביב</option><option>משלוח אקספרס</option></select></label>
        <label><span>${t("payment")}</span><select name="payment"><option>כרטיס אשראי</option><option>Bit / PayBox</option><option>העברה בנקאית</option></select></label>
        <button class="primary wide" ${items.length ? "" : "disabled"}>${t("confirmOrder")}</button>
      </form>
      <aside class="summary panel">
        <span class="kicker">${t("orderSummary")}</span>
        ${items.map((item) => `<div class="summary-line"><span>${item.product.title} × ${item.quantity}</span><b>${money(item.product.price * item.quantity)}</b></div>`).join("") || `<p>${t("emptyCart")}</p>`}
        <h2>${money(cartTotal())}</h2>
      </aside>
    </section>
  `;
}

export function bindCheckout() {
  document.querySelector("#checkoutForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    try {
      const order = createOrder(
        {
          name: data.get("name"),
          phone: data.get("phone"),
          email: data.get("email"),
          address: data.get("address"),
          comment: data.get("comment")
        },
        data.get("delivery"),
        data.get("payment")
      );
      toast(`${t("orderCreated")}: ${order.id}`);
      location.hash = "#/account";
    } catch (error) {
      toast(error.message, "bad");
    }
  });
}
