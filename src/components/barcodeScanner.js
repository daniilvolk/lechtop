import { getLanguage } from "../services/languageService.js";
import { findProductByBarcode } from "../services/productService.js";
import { toast } from "./ui.js";

let stream = null;

const labels = {
  he: {
    title: "סורק ברקוד",
    close: "סגור",
    camera: "מצלמת המכשיר",
    manual: "USB/Bluetooth או הזנה ידנית",
    placeholder: "לדוגמה 7297009010012",
    find: "מצא מוצר",
    hint: "רוב סורקי ה-USB/Bluetooth עובדים כמו מקלדת: מקמו את הסמן בשדה וסרקו.",
    cameraUnavailable: "המצלמה אינה זמינה, השתמשו בהזנה ידנית או בסורק USB.",
    notFound: "לא נמצא מוצר עם הברקוד הזה"
  },
  en: {
    title: "Barcode scanner",
    close: "Close",
    camera: "Device camera",
    manual: "USB/Bluetooth or manual input",
    placeholder: "Example 7297009010012",
    find: "Find product",
    hint: "Most USB/Bluetooth scanners work like a keyboard: focus the field and scan.",
    cameraUnavailable: "Camera is unavailable, use manual input or a USB scanner.",
    notFound: "No product found with this barcode"
  },
  ru: {
    title: "Сканер штрих-кода",
    close: "Закрыть",
    camera: "Камера устройства",
    manual: "USB/Bluetooth или ручной ввод",
    placeholder: "Например 7297009010012",
    find: "Найти товар",
    hint: "Большинство USB/Bluetooth сканеров работают как клавиатура: наведите фокус в поле и сканируйте.",
    cameraUnavailable: "Камера недоступна, используйте ручной ввод или USB-сканер.",
    notFound: "Товар с таким штрих-кодом не найден"
  }
};

function l() {
  return labels[getLanguage()] || labels.he;
}

export function scannerModal() {
  const text = l();
  return `
    <dialog class="scanner-modal" id="scannerDialog">
      <form method="dialog" class="scanner-head">
        <div><span class="kicker">Barcode scanner</span><h3>${text.title}</h3></div>
        <button class="ghost small" data-action="close-scanner">${text.close}</button>
      </form>
      <div class="scanner-grid">
        <div class="camera-box">
          <video id="scannerVideo" autoplay playsinline muted></video>
          <span>${text.camera}</span>
        </div>
        <form id="barcodeForm" class="panel compact">
          <label><span>${text.manual}</span><input name="barcode" autofocus placeholder="${text.placeholder}" /></label>
          <button class="primary wide">${text.find}</button>
          <p>${text.hint}</p>
        </form>
      </div>
    </dialog>
  `;
}

export async function openScanner() {
  const dialog = document.querySelector("#scannerDialog");
  dialog?.showModal();
  const video = document.querySelector("#scannerVideo");
  try {
    stream = await navigator.mediaDevices?.getUserMedia({ video: { facingMode: "environment" } });
    if (video && stream) video.srcObject = stream;
  } catch {
    toast(l().cameraUnavailable, "warn");
  }
}

export function closeScanner() {
  stream?.getTracks().forEach((track) => track.stop());
  stream = null;
  document.querySelector("#scannerDialog")?.close();
}

export function bindScanner() {
  document.body.addEventListener("submit", (event) => {
    if (event.target?.id !== "barcodeForm") return;
    event.preventDefault();
    const barcode = new FormData(event.target).get("barcode")?.toString().trim();
    const product = findProductByBarcode(barcode);
    if (!product) {
      toast(l().notFound, "bad");
      return;
    }
    closeScanner();
    location.hash = `#/admin/products/${product.id}`;
  });

  document.body.addEventListener("click", (event) => {
    if (event.target.closest('[data-action="close-scanner"]')) closeScanner();
  });
}
