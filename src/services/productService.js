import { getState, updateState } from "../store/store.js";
import { normalize, slugify, todayIso, uid } from "../utils/format.js";

export function listProducts(filters = {}) {
  const { type, category, query, brand, maxPrice, usage } = filters;
  return getState().products.filter((product) => {
    const text = normalize([
      product.title,
      product.category,
      product.brand,
      product.barcode,
      product.description,
      Object.values(product.specs).join(" ")
    ].join(" "));
    return (!type || product.type === type)
      && (!category || product.category === category)
      && (!brand || product.brand === brand)
      && (!maxPrice || product.price <= Number(maxPrice))
      && (!usage || text.includes(normalize(usage)))
      && (!query || text.includes(normalize(query)));
  });
}

export function getProductBySlug(slug) {
  return getState().products.find((product) => product.slug === slug);
}

export function getProductById(id) {
  return getState().products.find((product) => product.id === id);
}

export function findProductByBarcode(barcode) {
  return getState().products.find((product) => product.barcode === String(barcode).trim());
}

export function saveProduct(input) {
  const now = todayIso();
  const product = {
    ...input,
    id: input.id || uid("p"),
    slug: input.slug || slugify(input.title),
    price: Number(input.price || 0),
    oldPrice: input.oldPrice ? Number(input.oldPrice) : undefined,
    discount: input.discount ? Number(input.discount) : undefined,
    stock: Number(input.stock || 0),
    specs: typeof input.specs === "string" ? parseSpecs(input.specs) : input.specs || {},
    images: Array.isArray(input.images) ? input.images : [input.images].filter(Boolean),
    badges: Array.isArray(input.badges) ? input.badges : String(input.badges || "").split(",").map((x) => x.trim()).filter(Boolean),
    createdAt: input.createdAt || now,
    updatedAt: now
  };

  updateState((draft) => {
    const index = draft.products.findIndex((item) => item.id === product.id);
    if (index >= 0) draft.products[index] = product;
    else draft.products.unshift(product);
  });

  return product;
}

export function deleteProduct(id) {
  updateState((draft) => {
    draft.products = draft.products.filter((product) => product.id !== id);
    draft.cart = draft.cart.filter((item) => item.productId !== id);
    draft.favorites = draft.favorites.filter((productId) => productId !== id);
    draft.compare = draft.compare.filter((productId) => productId !== id);
  });
}

export function saveCategory(name, oldName) {
  updateState((draft) => {
    if (oldName) {
      draft.categories = draft.categories.map((category) => category === oldName ? name : category);
      draft.products.forEach((product) => {
        if (product.category === oldName) product.category = name;
      });
    } else if (!draft.categories.includes(name)) {
      draft.categories.push(name);
    }
  });
}

export function deleteCategory(name) {
  updateState((draft) => {
    draft.categories = draft.categories.filter((category) => category !== name);
  });
}

function parseSpecs(value) {
  return String(value)
    .split("\n")
    .map((line) => line.split(":"))
    .filter(([key, val]) => key && val)
    .reduce((acc, [key, val]) => ({ ...acc, [key.trim()]: val.trim() }), {});
}
