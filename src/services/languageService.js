import { currentUser, updateProfile } from "./authService.js";
import { getState, setState } from "../store/store.js";

export const languages = [
  { code: "he", label: "עברית", dir: "rtl", locale: "he-IL" },
  { code: "en", label: "English", dir: "ltr", locale: "en-IL" },
  { code: "ru", label: "Русский", dir: "ltr", locale: "ru-IL" }
];

const dict = {
  he: {
    pc: "מחשבים", laptops: "לפטופים", components: "רכיבים", builder: "בניית מחשב", search: "חיפוש", cart: "עגלה",
    login: "כניסה", logout: "יציאה", account: "אזור אישי", catalog: "קטלוג", admin: "ניהול", addToCart: "הוסף לעגלה",
    details: "פרטים", inStock: "במלאי", outOfStock: "אזל מהמלאי", favorite: "מועדפים", compare: "השוואה",
    noResults: "לא נמצאו תוצאות. נסו לשנות את הסינון.", continue: "המשך", protectedRoute: "מסלול מוגן",
    authRequired: "צריך להתחבר כדי לפתוח את העמוד", adminRequired: "גישה למנהלים בלבד",
    footerText: "מחשבי גיימינג, לפטופים, רכיבים ובנייה אישית ברמה פרימיום.", language: "שפה",
    heroSubtitle: "כוח למשחק. בסיס לעתיד.", viewProducts: "צפה במוצרים", buildPc: "בנה מחשב", popularBuilds: "מפרטים פופולריים",
    popularProducts: "מוצרים פופולריים", whyTitle: "טכנולוגיה צריכה להיראות מעולה, אבל חשוב יותר איך היא עובדת אחרי הקנייה.",
    chooseForTask: "התאמה למשימה", chooseForTaskText: "גיימינג, סטרימינג, עריכה, לימודים, משרד או עיצוב.",
    compatibility: "בדיקת תאימות", compatibilityText: "הקונפיגורטור מזהיר על שקע, ספק כוח ופורמט לא מתאימים.",
    barcodeInventory: "ניהול ברקודים", barcodeInventoryText: "לכל מוצר יש ברקוד, חיפוש וסורק בממשק הניהול.",
    rolesText: "לקוח רואה הזמנות, מנהל שולט בקטלוג ובמלאי.", chooseProduct: "בחר מוצר", placeOrder: "בצע הזמנה",
    receiveDevice: "קבל מכשיר מוכן", ctaTitle: "בנה את מחשב החלומות שלך",
    ctaText: "בחרו CPU, GPU, RAM, אחסון, ספק כוח, מארז וקירור. המחיר מחושב אוטומטית.", openBuilder: "פתח קונפיגורטור",
    priceTo: "מחיר עד", brand: "מותג", category: "קטגוריה", all: "הכול", apply: "החל", reset: "איפוס",
    items: "פריטים", globalSearch: "חיפוש כללי", buyNow: "קנה עכשיו", specs: "מפרט", related: "מוצרים דומים",
    checkout: "תשלום", orderSummary: "סיכום הזמנה", total: "סה״כ", name: "שם", phone: "טלפון", email: "אימייל",
    address: "כתובת למשלוח", comment: "הערה", delivery: "משלוח", payment: "תשלום", confirmOrder: "אשר הזמנה",
    emptyCart: "העגלה ריקה.", profileUpdated: "הפרופיל עודכן", orderCreated: "ההזמנה נוצרה", wrongLogin: "אימייל או סיסמה שגויים",
    blockedUser: "המשתמש חסום", passwordsMismatch: "הסיסמאות לא תואמות", shortPassword: "הסיסמה חייבת להיות לפחות 6 תווים",
    userExists: "משתמש עם האימייל הזה כבר קיים", welcome: "ברוך הבא", accountCreated: "החשבון נוצר",
    productAdded: "המוצר נוסף לעגלה", favoritesUpdated: "המועדפים עודכנו", compareUpdated: "ההשוואה עודכנה", loggedOut: "יצאת מהחשבון"
  },
  en: {
    pc: "PCs", laptops: "Laptops", components: "Components", builder: "PC Builder", search: "Search", cart: "Cart",
    login: "Login", logout: "Logout", account: "Account", catalog: "Catalog", admin: "Admin", addToCart: "Add to cart",
    details: "Details", inStock: "In stock", outOfStock: "Out of stock", favorite: "Favorites", compare: "Compare",
    noResults: "No results. Try changing filters.", continue: "Continue", protectedRoute: "Protected route",
    authRequired: "Log in to open this page", adminRequired: "Admin access only",
    footerText: "Premium gaming PCs, laptops, components and custom builds.", language: "Language",
    heroSubtitle: "Power Your Game. Build Your Future.", viewProducts: "View products", buildPc: "Build PC", popularBuilds: "Popular builds",
    popularProducts: "Popular products", whyTitle: "Tech should look premium, but what matters most is how it works after purchase.",
    chooseForTask: "Matched to your task", chooseForTaskText: "Gaming, streaming, editing, study, office or design.",
    compatibility: "Compatibility check", compatibilityText: "The builder warns about socket, PSU and form-factor conflicts.",
    barcodeInventory: "Barcode inventory", barcodeInventoryText: "Every product has a barcode, search and admin scanner.",
    rolesText: "Customers see orders, admins manage catalog and stock.", chooseProduct: "Choose product", placeOrder: "Place order",
    receiveDevice: "Receive ready device", ctaTitle: "Build your dream PC",
    ctaText: "Choose CPU, GPU, RAM, storage, PSU, case and cooling. Total price is calculated automatically.", openBuilder: "Open builder",
    priceTo: "Price up to", brand: "Brand", category: "Category", all: "All", apply: "Apply", reset: "Reset",
    items: "items", globalSearch: "Global search", buyNow: "Buy now", specs: "Specs", related: "Related products",
    checkout: "Checkout", orderSummary: "Order summary", total: "Total", name: "Name", phone: "Phone", email: "Email",
    address: "Delivery address", comment: "Comment", delivery: "Delivery", payment: "Payment", confirmOrder: "Confirm order",
    emptyCart: "Cart is empty.", profileUpdated: "Profile updated", orderCreated: "Order created", wrongLogin: "Wrong email or password",
    blockedUser: "User is blocked", passwordsMismatch: "Passwords do not match", shortPassword: "Password must be at least 6 characters",
    userExists: "A user with this email already exists", welcome: "Welcome", accountCreated: "Account created",
    productAdded: "Product added to cart", favoritesUpdated: "Favorites updated", compareUpdated: "Compare list updated", loggedOut: "You logged out"
  },
  ru: {
    pc: "ПК", laptops: "Ноутбуки", components: "Комплектующие", builder: "Сборка ПК", search: "Поиск", cart: "Корзина",
    login: "Войти", logout: "Выйти", account: "Кабинет", catalog: "Каталог", admin: "Админ", addToCart: "В корзину",
    details: "Подробнее", inStock: "В наличии", outOfStock: "Нет в наличии", favorite: "Избранное", compare: "Сравнить",
    noResults: "Ничего не найдено. Попробуйте изменить фильтры.", continue: "Продолжить", protectedRoute: "Защищенный маршрут",
    authRequired: "Войдите, чтобы открыть страницу", adminRequired: "Доступ только для администратора",
    footerText: "Премиальные игровые ПК, ноутбуки, комплектующие и кастомные сборки.", language: "Язык",
    heroSubtitle: "Power Your Game. Build Your Future.", viewProducts: "Смотреть товары", buildPc: "Собрать ПК", popularBuilds: "Популярные сборки",
    popularProducts: "Популярные товары", whyTitle: "Техника должна выглядеть дорого, но важнее то, как она работает после покупки.",
    chooseForTask: "Подбор под задачу", chooseForTaskText: "Игры, стриминг, монтаж, учеба, офис или дизайн.",
    compatibility: "Проверка совместимости", compatibilityText: "Сборщик предупреждает о конфликтах сокета, питания и форм-фактора.",
    barcodeInventory: "Barcode inventory", barcodeInventoryText: "У каждого товара есть barcode, поиск и админ-сканер.",
    rolesText: "Покупатель видит заказы, администратор управляет каталогом.", chooseProduct: "Выбери товар", placeOrder: "Оформи заказ",
    receiveDevice: "Получи готовое устройство", ctaTitle: "Собери компьютер своей мечты",
    ctaText: "Выберите CPU, GPU, RAM, накопители, блок питания, корпус и охлаждение. Итоговая цена считается автоматически.", openBuilder: "Открыть конфигуратор",
    priceTo: "Цена до", brand: "Бренд", category: "Категория", all: "Все", apply: "Применить", reset: "Сбросить",
    items: "позиций", globalSearch: "Глобальный поиск", buyNow: "Купить сейчас", specs: "Характеристики", related: "Похожие товары",
    checkout: "Оформление заказа", orderSummary: "Состав заказа", total: "Итого", name: "Имя", phone: "Телефон", email: "Email",
    address: "Адрес доставки", comment: "Комментарий", delivery: "Доставка", payment: "Оплата", confirmOrder: "Подтвердить заказ",
    emptyCart: "Корзина пока пуста.", profileUpdated: "Профиль обновлен", orderCreated: "Заказ создан", wrongLogin: "Неверный email или пароль",
    blockedUser: "Пользователь заблокирован", passwordsMismatch: "Пароли не совпадают", shortPassword: "Пароль должен быть не короче 6 символов",
    userExists: "Пользователь с таким email уже существует", welcome: "Добро пожаловать", accountCreated: "Аккаунт создан",
    productAdded: "Товар добавлен в корзину", favoritesUpdated: "Избранное обновлено", compareUpdated: "Сравнение обновлено", loggedOut: "Вы вышли из аккаунта"
  }
};

export function getLanguage() {
  const user = currentUser();
  return user?.language || getState().language || localStorage.getItem("lechtop-language") || "he";
}

export function getLanguageMeta() {
  return languages.find((item) => item.code === getLanguage()) || languages[0];
}

export function setLanguage(code) {
  const lang = languages.some((item) => item.code === code) ? code : "he";
  localStorage.setItem("lechtop-language", lang);
  const user = currentUser();
  if (user) updateProfile({ language: lang });
  else setState({ language: lang });
  applyLanguageDocument();
}

export function applyLanguageDocument() {
  const meta = getLanguageMeta();
  document.documentElement.lang = meta.code;
  document.documentElement.dir = meta.dir;
}

export function t(key) {
  const lang = getLanguage();
  return dict[lang]?.[key] || dict.he[key] || key;
}
