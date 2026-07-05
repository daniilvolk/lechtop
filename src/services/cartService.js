import { getState, updateState } from "../store/store.js";
import { getProductById } from "./productService.js";

export function cartItems() {
  return getState().cart.map((item) => ({ ...item, product: getProductById(item.productId) })).filter((item) => item.product);
}

export function cartTotal() {
  return cartItems().reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

export function addToCart(productId, quantity = 1) {
  updateState((draft) => {
    const item = draft.cart.find((entry) => entry.productId === productId);
    if (item) item.quantity += quantity;
    else draft.cart.push({ productId, quantity });
  });
}

export function setQuantity(productId, quantity) {
  updateState((draft) => {
    const item = draft.cart.find((entry) => entry.productId === productId);
    if (item) item.quantity = Math.max(1, Number(quantity));
  });
}

export function removeFromCart(productId) {
  updateState((draft) => {
    draft.cart = draft.cart.filter((item) => item.productId !== productId);
  });
}

export function clearCart() {
  updateState((draft) => {
    draft.cart = [];
  });
}

export function toggleFavorite(productId) {
  updateState((draft) => {
    draft.favorites = draft.favorites.includes(productId)
      ? draft.favorites.filter((id) => id !== productId)
      : [...draft.favorites, productId];
  });
}

export function toggleCompare(productId) {
  updateState((draft) => {
    draft.compare = draft.compare.includes(productId)
      ? draft.compare.filter((id) => id !== productId)
      : [...draft.compare.slice(-2), productId];
  });
}
