import { listProducts } from "../services/productService.js";
import { productGrid } from "../components/ui.js";
import { t } from "../services/languageService.js";
import { heroImage } from "../utils/assets.js";

export function homePage() {
  const popular = listProducts().filter((product) => product.badges.includes("להיט") || product.badges.includes("חדש")).slice(0, 4);
  return `
    <section class="hero">
      <div class="hero-copy">
        <span class="kicker">Premium tech / gaming store</span>
        <h1>LechTop</h1>
        <p>${t("heroSubtitle")}</p>
        <div class="hero-actions">
          <a class="primary" href="#/catalog/pc">${t("viewProducts")}</a>
          <a class="secondary" href="#/builder">${t("buildPc")}</a>
          <a class="ghost" href="#/catalog/pc">${t("popularBuilds")}</a>
        </div>
      </div>
      <div class="hero-rig">
        <img src="${heroImage()}" alt="Gaming PC setup" />
        <div class="hero-stat"><b>4K</b><span>Gaming ready</span></div>
        <div class="hero-stat alt"><b>24h</b><span>Assembly SLA</span></div>
      </div>
    </section>

    <section class="feature-band">
      ${[t("pc"), t("laptops"), t("components"), t("builder"), "אחריות ושירות בישראל"].map((item) => `<div><span></span>${item}</div>`).join("")}
    </section>

    <section class="section-head"><span class="kicker">Catalog</span><h2>${t("popularProducts")}</h2></section>
    ${productGrid(popular)}

    <section class="split-section">
      <div>
        <span class="kicker">Why LechTop</span>
        <h2>${t("whyTitle")}</h2>
      </div>
      <div class="reason-grid">
        <article><b>${t("chooseForTask")}</b><p>${t("chooseForTaskText")}</p></article>
        <article><b>${t("compatibility")}</b><p>${t("compatibilityText")}</p></article>
        <article><b>${t("barcodeInventory")}</b><p>${t("barcodeInventoryText")}</p></article>
        <article><b>${t("admin")}</b><p>${t("rolesText")}</p></article>
      </div>
    </section>

    <section class="steps">
      ${[t("chooseProduct"), t("placeOrder"), t("receiveDevice")].map((step, index) => `<div><b>0${index + 1}</b><span>${step}</span></div>`).join("")}
    </section>

    <section class="cta">
      <span class="kicker">Custom build</span>
      <h2>${t("ctaTitle")}</h2>
      <p>${t("ctaText")}</p>
      <a class="primary" href="#/builder">${t("openBuilder")}</a>
    </section>
  `;
}
