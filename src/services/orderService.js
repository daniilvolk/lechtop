import { getState, updateState } from "../store/store.js";
import { cartItems, cartTotal, clearCart } from "./cartService.js";
import { currentUser } from "./authService.js";

export function createOrder(customer, delivery, payment) {
  const items = cartItems();
  if (!items.length) throw new Error("Корзина пуста");
  const user = currentUser();
  const order = {
    id: `LT-${Math.floor(1000 + Math.random() * 9000)}`,
    userId: user?.id,
    customer,
    delivery,
    payment,
    items: items.map((item) => ({
      productId: item.productId,
      title: item.product.title,
      price: item.product.price,
      quantity: item.quantity
    })),
    total: cartTotal(),
    status: "new",
    createdAt: new Date().toISOString()
  };
  updateState((draft) => {
    draft.orders.unshift(order);
  });
  clearCart();
  return order;
}

export function updateOrder(id, patch) {
  updateState((draft) => {
    const order = draft.orders.find((item) => item.id === id);
    Object.assign(order, patch);
  });
}

export function deleteOrder(id) {
  updateState((draft) => {
    draft.orders = draft.orders.filter((order) => order.id !== id);
  });
}
