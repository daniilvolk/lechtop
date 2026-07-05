const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  await page.goto("http://localhost:8081", { waitUntil: "load" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "load" });
  const initial = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    dir: document.documentElement.dir,
    nav: [...document.querySelectorAll(".nav a")].map((a) => a.textContent.trim()),
    price: document.querySelector(".price-row strong")?.textContent || ""
  }));

  await page.goto("http://localhost:8081/#/login", { waitUntil: "load" });
  await page.fill('input[name="email"]', "admin@lechtop.dev");
  await page.fill('input[name="password"]', "admin123");
  await page.click("#loginForm button.primary");
  await page.waitForTimeout(300);
  await page.selectOption('select[data-action="language"]', "en");
  await page.waitForTimeout(150);
  await page.reload({ waitUntil: "load" });
  const afterLogin = await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem("lechtop-store-v4"));
    const user = state.users.find((item) => item.id === state.sessionUserId);
    return {
      lang: document.documentElement.lang,
      dir: document.documentElement.dir,
      userLanguage: user.language,
      price: document.querySelector(".stat-grid") ? "admin" : document.querySelector(".price-row strong")?.textContent || ""
    };
  });

  await page.goto("http://localhost:8081/#/admin/products/new", { waitUntil: "load" });
  const barcodeValue = await page.inputValue("#productForm input[name='barcode']");
  await browser.close();

  const result = { initial, afterLogin, barcodeValue, errors };
  console.log(JSON.stringify(result, null, 2));
  if (errors.length || initial.lang !== "he" || initial.dir !== "rtl" || !initial.price.includes("₪") || afterLogin.userLanguage !== "en" || afterLogin.lang !== "en" || !barcodeValue.startsWith("729")) {
    process.exit(1);
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
