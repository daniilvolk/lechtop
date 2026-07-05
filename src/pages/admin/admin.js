import { getState, resetDemoData } from "../../store/store.js";
import { requireAuth, toast } from "../../components/ui.js";
import { scannerModal, openScanner } from "../../components/barcodeScanner.js";
import { barcodeView } from "../../components/ui.js";
import { input, select, textarea } from "../../components/forms.js";
import { generateBarcode } from "../../services/barcodeService.js";
import { deleteCategory, deleteProduct, getProductById, saveCategory, saveProduct } from "../../services/productService.js";
import { deleteOrder, updateOrder } from "../../services/orderService.js";
import { updateUser } from "../../services/authService.js";
import { money } from "../../utils/format.js";
import { productImage } from "../../utils/assets.js";

export function adminPage(section = "dashboard", id = "") {
  const gate = requireAuth("admin");
  if (!gate.allowed) return gate.html;
  return `
    ${scannerModal()}
    <section class="admin-shell">
      <aside class="admin-nav">
        <b>Admin</b>
        <a href="#/admin" ${section === "dashboard" ? "class='active'" : ""}>Dashboard</a>
        <a href="#/admin/products" ${section === "products" ? "class='active'" : ""}>Товары</a>
        <a href="#/admin/categories" ${section === "categories" ? "class='active'" : ""}>Категории</a>
        <a href="#/admin/orders" ${section === "orders" ? "class='active'" : ""}>Заказы</a>
        <a href="#/admin/users" ${section === "users" ? "class='active'" : ""}>Пользователи</a>
        <button class="primary wide" data-action="open-scanner">Сканер barcode</button>
      </aside>
      <div class="admin-content">
        ${renderSection(section, id)}
      </div>
    </section>
  `;
}

function renderSection(section, id) {
  if (section === "products" && id) return productForm(id);
  if (section === "products") return productsAdmin();
  if (section === "categories") return categoriesAdmin();
  if (section === "orders") return ordersAdmin();
  if (section === "users") return usersAdmin();
  return dashboardAdmin();
}

function dashboardAdmin() {
  const state = getState();
  const sales = state.orders.reduce((sum, order) => sum + order.total, 0);
  return `
    <div class="admin-head"><div><span class="kicker">Dashboard</span><h1>Операционный центр LechTop</h1></div><button class="ghost" data-action="reset-demo">Сбросить demo data</button></div>
    <div class="stat-grid">
      <article><span>Товаров</span><b>${state.products.length}</b></article>
      <article><span>Заказов</span><b>${state.orders.length}</b></article>
      <article><span>Пользователей</span><b>${state.users.length}</b></article>
      <article><span>Сумма продаж</span><b>${money(sales)}</b></article>
    </div>
    <section class="panel">
      <h2>Последние заказы</h2>
      ${state.orders.slice(0, 5).map((order) => `<div class="order-row"><b>${order.id}</b><span>${order.customer.name}</span><strong>${money(order.total)}</strong><em>${order.status}</em></div>`).join("")}
    </section>
  `;
}

function productsAdmin() {
  const state = getState();
  return `
    <div class="admin-head"><div><span class="kicker">Products</span><h1>Управление товарами</h1></div><a class="primary" href="#/admin/products/new">Добавить товар</a></div>
    <form class="search-box slim" id="adminBarcodeSearch"><input name="barcode" placeholder="Поиск по barcode" /><button class="secondary">Найти</button></form>
    <div class="admin-table">
      ${state.products.map((product) => `
        <div class="table-row">
          <img src="${product.images[0]}" alt="${product.title}" />
          <div><b>${product.title}</b><span>${product.category} · ${product.barcode}</span></div>
          <strong>${money(product.price)}</strong>
          <span>${product.stock} шт.</span>
          <a class="ghost small" href="#/admin/products/${product.id}">Редактировать</a>
          <button class="danger small" data-action="delete-product" data-id="${product.id}">Удалить</button>
        </div>
      `).join("")}
    </div>
  `;
}

function productForm(id) {
  const state = getState();
  const product = id === "new" ? {
    title: "",
    category: state.categories[0],
    type: "pc",
    brand: "",
    price: 0,
    oldPrice: "",
    discount: "",
    images: [productImage("New Product", "blue")],
    description: "",
    specs: {},
    stock: 1,
    barcode: generateBarcode(),
    badges: []
  } : getProductById(id);

  if (!product) return `<div class="empty">Товар не найден</div>`;
  const specs = Object.entries(product.specs || {}).map(([key, val]) => `${key}: ${val}`).join("\n");
  return `
    <div class="admin-head"><div><span class="kicker">Product CRUD</span><h1>${id === "new" ? "Новый товар" : product.title}</h1></div><a class="ghost" href="#/admin/products">Назад</a></div>
    <section class="edit-layout">
      <form class="panel form-grid" id="productForm" data-id="${product.id || ""}">
        ${input("title", "Название", product.title, "text", "required")}
        ${select("type", "Тип", [{ value: "pc", label: "ПК" }, { value: "laptop", label: "Ноутбук" }, { value: "component", label: "Комплектующее" }], product.type)}
        ${select("category", "Категория", state.categories, product.category)}
        ${input("brand", "Бренд", product.brand, "text", "required")}
        ${input("price", "Цена", product.price, "number", "required")}
        ${input("oldPrice", "Старая цена", product.oldPrice || "", "number")}
        ${input("discount", "Скидка %", product.discount || "", "number")}
        ${input("stock", "Наличие", product.stock, "number", "required")}
        ${input("barcode", "Штрих-код", product.barcode, "text", "required")}
        <button type="button" class="secondary wide" data-action="generate-barcode">Сгенерировать barcode</button>
        ${input("images", "Фото товара URL", product.images[0] || "", "url")}
        ${input("badges", "Badges через запятую", product.badges.join(", "))}
        ${textarea("description", "Описание", product.description, "required")}
        ${textarea("specs", "Характеристики key: value", specs)}
        <button class="primary wide">Сохранить товар</button>
      </form>
      <aside class="panel preview-card">
        <img src="${product.images[0]}" alt="${product.title}" />
        <h2>${product.title || "Preview"}</h2>
        ${barcodeView(product.barcode)}
      </aside>
    </section>
  `;
}

function categoriesAdmin() {
  const state = getState();
  return `
    <div class="admin-head"><div><span class="kicker">Categories</span><h1>Управление категориями</h1></div></div>
    <form class="panel inline-form" id="categoryForm">${input("name", "Новая категория", "", "text", "required")}<button class="primary">Добавить</button></form>
    <div class="chip-grid">${state.categories.map((category) => `<span>${category}<button data-action="delete-category" data-name="${category}">×</button></span>`).join("")}</div>
  `;
}

function ordersAdmin() {
  const statuses = ["new", "paid", "assembling", "shipped", "completed", "cancelled"];
  return `
    <div class="admin-head"><div><span class="kicker">Orders</span><h1>Управление заказами</h1></div></div>
    <div class="admin-table">${getState().orders.map((order) => `
      <div class="table-row">
        <div><b>${order.id}</b><span>${order.customer.name} · ${order.customer.phone}</span></div>
        <strong>${money(order.total)}</strong>
        <select data-action="order-status" data-id="${order.id}">${statuses.map((status) => `<option ${order.status === status ? "selected" : ""}>${status}</option>`).join("")}</select>
        <button class="danger small" data-action="delete-order" data-id="${order.id}">Удалить</button>
      </div>
    `).join("")}</div>
  `;
}

function usersAdmin() {
  return `
    <div class="admin-head"><div><span class="kicker">Users</span><h1>Управление пользователями</h1></div></div>
    <div class="admin-table">${getState().users.map((user) => `
      <div class="table-row">
        <div><b>${user.name}</b><span>${user.email}</span></div>
        <select data-action="user-role" data-id="${user.id}"><option ${user.role === "user" ? "selected" : ""}>user</option><option ${user.role === "admin" ? "selected" : ""}>admin</option></select>
        <label class="toggle"><input type="checkbox" data-action="user-blocked" data-id="${user.id}" ${user.blocked ? "checked" : ""}/><span>Заблокирован</span></label>
      </div>
    `).join("")}</div>
  `;
}

export function bindAdmin() {
  document.querySelector('[data-action="open-scanner"]')?.addEventListener("click", openScanner);
  document.querySelector('[data-action="reset-demo"]')?.addEventListener("click", () => {
    resetDemoData();
    toast("Demo data восстановлены");
    window.dispatchEvent(new Event("store-rerender"));
  });
  document.querySelector("#adminBarcodeSearch")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const barcode = new FormData(event.target).get("barcode")?.toString().trim();
    const product = getState().products.find((item) => item.barcode === barcode);
    if (product) location.hash = `#/admin/products/${product.id}`;
    else toast("Товар с таким штрих-кодом не найден", "bad");
  });
  document.querySelector("#productForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.target;
    const data = Object.fromEntries(new FormData(form).entries());
    saveProduct({ ...data, id: form.dataset.id || undefined, images: [data.images], badges: data.badges });
    toast("Товар сохранен");
    location.hash = "#/admin/products";
  });
  document.querySelector('[data-action="generate-barcode"]')?.addEventListener("click", () => {
    const field = document.querySelector('input[name="barcode"]');
    field.value = generateBarcode();
    toast("Barcode сгенерирован");
  });
  document.querySelector("#categoryForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    saveCategory(new FormData(event.target).get("name"));
    window.dispatchEvent(new Event("store-rerender"));
  });
  document.querySelectorAll("[data-action='delete-product']").forEach((button) => button.addEventListener("click", () => {
    if (confirm("Удалить товар?")) {
      deleteProduct(button.dataset.id);
      window.dispatchEvent(new Event("store-rerender"));
    }
  }));
  document.querySelectorAll("[data-action='delete-category']").forEach((button) => button.addEventListener("click", () => {
    deleteCategory(button.dataset.name);
    window.dispatchEvent(new Event("store-rerender"));
  }));
  document.querySelectorAll("[data-action='order-status']").forEach((select) => select.addEventListener("change", () => updateOrder(select.dataset.id, { status: select.value })));
  document.querySelectorAll("[data-action='delete-order']").forEach((button) => button.addEventListener("click", () => {
    deleteOrder(button.dataset.id);
    window.dispatchEvent(new Event("store-rerender"));
  }));
  document.querySelectorAll("[data-action='user-role']").forEach((select) => select.addEventListener("change", () => updateUser(select.dataset.id, { role: select.value })));
  document.querySelectorAll("[data-action='user-blocked']").forEach((input) => input.addEventListener("change", () => updateUser(input.dataset.id, { blocked: input.checked })));
}
