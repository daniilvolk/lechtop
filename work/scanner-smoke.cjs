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

  await page.goto("http://localhost:8081/#/login", { waitUntil: "load" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "load" });
  await page.fill('input[name="email"]', "admin@lechtop.dev");
  await page.fill('input[name="password"]', "admin123");
  await page.click("#loginForm button.primary");
  await page.waitForTimeout(300);
  await page.click('[data-action="open-scanner"]');
  const he = await page.evaluate(() => ({
    title: document.querySelector("#scannerDialog h3")?.textContent,
    placeholder: document.querySelector("#barcodeForm input")?.getAttribute("placeholder"),
    dir: document.documentElement.dir
  }));
  await page.selectOption('select[data-action="language"]', "en");
  await page.click('[data-action="open-scanner"]');
  const en = await page.evaluate(() => ({
    title: document.querySelector("#scannerDialog h3")?.textContent,
    placeholder: document.querySelector("#barcodeForm input")?.getAttribute("placeholder"),
    dir: document.documentElement.dir
  }));
  await browser.close();

  const result = { he, en, errors };
  console.log(JSON.stringify(result, null, 2));
  if (errors.length || !he.placeholder.includes("729") || !en.placeholder.includes("729") || he.dir !== "rtl" || en.dir !== "ltr") {
    process.exit(1);
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
