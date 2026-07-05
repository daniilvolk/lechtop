import { listProducts } from "../services/productService.js";
import { addToCart } from "../services/cartService.js";
import { input, textarea } from "../components/forms.js";
import { t } from "../services/languageService.js";
import { money } from "../utils/format.js";
import { toast } from "../components/ui.js";

const slots = [
  ["CPU", "מעבדים"],
  ["GPU", "כרטיסי מסך"],
  ["Motherboard", "לוחות אם"],
  ["RAM", "זיכרון RAM"],
  ["Storage", "SSD / HDD"],
  ["PSU", "ספקי כוח"],
  ["Case", "מארזים"],
  ["Cooling", "קירור"]
];

export function builderPage() {
  const components = listProducts({ type: "component" });
  const options = slots.map(([slot, category]) => {
    const items = components.filter((product) => product.category === category);
    return `
      <label><span>${slot}</span><select name="${slot}">
        <option value="">—</option>
        ${items.map((product) => `<option value="${product.id}" data-price="${product.price}">${product.title} — ${money(product.price)}</option>`).join("")}
      </select></label>
    `;
  }).join("");

  return `
    <section class="page-hero small"><span class="kicker">PC Builder</span><h1>${t("builder")}</h1><p>${t("ctaText")}</p></section>
    <section class="builder-layout">
      <form class="panel form-grid" id="builderForm">
        <h2>${t("components")}</h2>
        ${options}
        <div class="compat-warning" id="compatWarning">${t("compatibilityText")}</div>
        <h2>${t("checkout")}</h2>
        ${input("name", t("name"), "", "text", "required")}
        ${input("phone", t("phone"), "+972 54-", "tel", "required")}
        ${input("email", t("email"), "", "email", "required")}
        ${input("budget", t("priceTo"), "", "number")}
        ${input("purpose", "Purpose", "", "text")}
        ${textarea("comment", t("comment"))}
        <button class="primary wide">${t("buildPc")}</button>
      </form>
      <aside class="summary panel sticky">
        <span class="kicker">${t("total")}</span>
        <h2 id="builderTotal">${money(0)}</h2>
        <p>${t("productAdded")}</p>
      </aside>
    </section>
  `;
}

export function bindBuilder() {
  const form = document.querySelector("#builderForm");
  const totalEl = document.querySelector("#builderTotal");
  const warning = document.querySelector("#compatWarning");
  const calc = () => {
    let total = 0;
    const selected = [...form.querySelectorAll("select")].filter((select) => select.value);
    selected.forEach((select) => {
      total += Number(select.selectedOptions[0]?.dataset.price || 0);
    });
    totalEl.textContent = money(total);
    const hasPsu = Boolean(form.PSU.value);
    const hasGpu = Boolean(form.GPU.value);
    warning.textContent = hasGpu && !hasPsu
      ? "Warning: selected GPU requires a compatible PSU."
      : t("compatibilityText");
  };
  form?.addEventListener("change", calc);
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    [...form.querySelectorAll("select")].forEach((select) => {
      if (select.value) addToCart(select.value);
    });
    toast(t("productAdded"));
    location.hash = "#/cart";
  });
  calc();
}
