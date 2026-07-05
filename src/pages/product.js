import { getProductBySlug, listProducts } from "../services/productService.js";
import { barcodeView, productGrid } from "../components/ui.js";
import { t } from "../services/languageService.js";
import { money } from "../utils/format.js";

export function productPage(slug) {
  const product = getProductBySlug(slug);
  if (!product) return notFoundProduct();
  const related = listProducts({ type: product.type }).filter((item) => item.id !== product.id).slice(0, 4);
  return `
    <section class="product-detail">
      <div class="gallery">
        <img src="${product.images[0]}" alt="${product.title}" />
        <div class="badges">${product.badges.map((badge) => `<span>${badge}</span>`).join("")}</div>
      </div>
      <div class="buy-panel">
        <span class="kicker">${product.category} / ${product.brand}</span>
        <h1>${product.title}</h1>
        <p>${product.description}</p>
        <div class="price-row big"><strong>${money(product.price)}</strong>${product.oldPrice ? `<del>${money(product.oldPrice)}</del>` : ""}</div>
        <div class="availability">${product.stock > 0 ? `${t("inStock")}: ${product.stock}` : t("outOfStock")}</div>
        <div class="detail-actions">
          <button class="primary" data-action="add-cart" data-id="${product.id}">${t("addToCart")}</button>
          <a class="secondary" href="#/checkout">${t("buyNow")}</a>
        </div>
        ${barcodeView(product.barcode)}
      </div>
    </section>
    <section class="spec-section">
      <h2>${t("specs")}</h2>
      <div class="spec-grid">${Object.entries(product.specs).map(([key, value]) => `<div><span>${key}</span><b>${value}</b></div>`).join("")}</div>
    </section>
    <section class="section-head"><span class="kicker">Related</span><h2>${t("related")}</h2></section>
    ${productGrid(related)}
  `;
}

function notFoundProduct() {
  return `<section class="page-hero small"><h1>Product not found</h1><a class="primary" href="#/catalog/pc">${t("catalog")}</a></section>`;
}
