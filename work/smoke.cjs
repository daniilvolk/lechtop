const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  await page.goto("http://localhost:8081", { waitUntil: "networkidle" });
  const title = await page.locator("h1").first().textContent();
  await page.click('a[href="#/catalog/pc"]');
  await page.waitForTimeout(300);
  const cards = await page.locator(".product-card").count();
  await page.click('a[href="#/login"]');
  await page.fill('input[name="email"]', "admin@lechtop.dev");
  await page.fill('input[name="password"]', "admin123");
  await page.click("#loginForm button.primary");
  await page.waitForTimeout(500);
  const hash = await page.evaluate(() => location.hash);
  const stats = await page.locator(".stat-grid article").count();
  await page.goto("http://localhost:8081/#/admin/products/new", { waitUntil: "networkidle" });
  const barcodeValue = await page.inputValue('#productForm input[name="barcode"]');
  await browser.close();

  console.log(JSON.stringify({ title, cards, hash, stats, barcodeValue, errors }, null, 2));
  if (errors.length || title !== "LechTop" || cards < 1 || hash !== "#/admin" || stats !== 4 || !barcodeValue) {
    process.exit(1);
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
