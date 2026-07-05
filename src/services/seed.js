import { productImage } from "../utils/assets.js";

const now = new Date().toISOString();

export const categories = [
  "מחשבי גיימינג",
  "לפטופים",
  "כרטיסי מסך",
  "מעבדים",
  "לוחות אם",
  "זיכרון RAM",
  "SSD / HDD",
  "ספקי כוח",
  "מארזים",
  "קירור",
  "ציוד היקפי"
];

export const products = [
  {
    id: "p-aurora-x9",
    title: "LechTop Aurora X9",
    slug: "lechtop-aurora-x9",
    category: "מחשבי גיימינג",
    type: "pc",
    brand: "LechTop",
    price: 24990,
    oldPrice: 27990,
    discount: 11,
    images: [productImage("Aurora X9", "red")],
    description: "מחשב גיימינג דגל עם קירור שקט, כרטיס RTX ועוצמה אמיתית ל-4K.",
    specs: { CPU: "Intel Core i9-14900K", GPU: "RTX 4090 24GB", RAM: "64GB DDR5", Storage: "2TB NVMe", PSU: "1000W Gold" },
    stock: 7,
    barcode: "7297009010012",
    badges: ["להיט", "מבצע"],
    createdAt: now,
    updatedAt: now
  },
  {
    id: "p-neon-r7",
    title: "LechTop Neon R7",
    slug: "lechtop-neon-r7",
    category: "מחשבי גיימינג",
    type: "pc",
    brand: "LechTop",
    price: 15490,
    oldPrice: 16990,
    discount: 9,
    images: [productImage("Neon R7", "blue")],
    description: "מפרט מאוזן לגיימינג תחרותי, סטרימינג ועבודה כבדה.",
    specs: { CPU: "Ryzen 7 7800X3D", GPU: "RTX 4070 Ti Super", RAM: "32GB DDR5", Storage: "1TB NVMe", Cooling: "360mm AIO" },
    stock: 12,
    barcode: "7297009010029",
    badges: ["חדש"],
    createdAt: now,
    updatedAt: now
  },
  {
    id: "p-studio-pro",
    title: "LechTop Studio Pro",
    slug: "lechtop-studio-pro",
    category: "מחשבי גיימינג",
    type: "pc",
    brand: "LechTop",
    price: 18990,
    images: [productImage("Studio Pro", "violet")],
    description: "תחנת עבודה לעריכת וידאו, תלת-ממד, AI ומשימות עם הרבה זיכרון.",
    specs: { CPU: "Ryzen 9 7950X", GPU: "RTX 4080 Super", RAM: "96GB DDR5", Storage: "4TB NVMe", Use: "Workstation" },
    stock: 5,
    barcode: "7297009010036",
    badges: ["להיט"],
    createdAt: now,
    updatedAt: now
  },
  {
    id: "l-rog-strix",
    title: "ASUS ROG Strix Scar 18",
    slug: "asus-rog-strix-scar-18",
    category: "לפטופים",
    type: "laptop",
    brand: "ASUS",
    price: 32990,
    oldPrice: 34990,
    discount: 6,
    images: [productImage("ROG Strix", "red")],
    description: "לפטופ גיימינג גדול עם גרפיקה חזקה ומסך 240Hz.",
    specs: { CPU: "Intel Core i9 HX", GPU: "RTX 4090 Laptop", RAM: "32GB", Screen: "18 inch 240Hz", Weight: "3.1 kg" },
    stock: 4,
    barcode: "7297009020011",
    badges: ["חדש"],
    createdAt: now,
    updatedAt: now
  },
  {
    id: "l-legion-7",
    title: "Lenovo Legion Pro 7",
    slug: "lenovo-legion-pro-7",
    category: "לפטופים",
    type: "laptop",
    brand: "Lenovo",
    price: 21990,
    images: [productImage("Legion Pro", "blue")],
    description: "לפטופ חזק למשחקים, לימודים, עיצוב ועבודה ניידת.",
    specs: { CPU: "Ryzen 9", GPU: "RTX 4080 Laptop", RAM: "32GB", Screen: "16 inch QHD", Purpose: "Games / Design" },
    stock: 9,
    barcode: "7297009020028",
    badges: ["להיט"],
    createdAt: now,
    updatedAt: now
  },
  {
    id: "c-rtx-4080",
    title: "NVIDIA RTX 4080 Super",
    slug: "nvidia-rtx-4080-super",
    category: "כרטיסי מסך",
    type: "component",
    brand: "NVIDIA",
    price: 11890,
    images: [productImage("RTX 4080", "green")],
    description: "כרטיס מסך חזק לגיימינג 4K, רנדר ו-AI.",
    specs: { Memory: "16GB GDDR6X", Bus: "256-bit", Power: "320W", Interface: "PCIe 4.0" },
    stock: 18,
    barcode: "7297009030010",
    badges: ["מבצע"],
    createdAt: now,
    updatedAt: now
  },
  {
    id: "c-ryzen-7800x3d",
    title: "AMD Ryzen 7 7800X3D",
    slug: "amd-ryzen-7-7800x3d",
    category: "מעבדים",
    type: "component",
    brand: "AMD",
    price: 4290,
    images: [productImage("Ryzen 7", "violet")],
    description: "מעבד גיימינג מצוין עם 3D V-Cache ויעילות גבוהה.",
    specs: { Cores: "8", Threads: "16", Socket: "AM5", TDP: "120W" },
    stock: 23,
    barcode: "7297009030027",
    badges: ["להיט"],
    createdAt: now,
    updatedAt: now
  },
  {
    id: "c-ddr5-fury",
    title: "Kingston Fury Beast 32GB DDR5",
    slug: "kingston-fury-beast-32gb-ddr5",
    category: "זיכרון RAM",
    type: "component",
    brand: "Kingston",
    price: 1490,
    images: [productImage("DDR5 Fury", "blue")],
    description: "ערכת זיכרון מהירה למערכות גיימינג ועבודה מודרניות.",
    specs: { Capacity: "32GB", Speed: "6000MHz", Type: "DDR5", Profile: "EXPO / XMP" },
    stock: 37,
    barcode: "7297009030034",
    badges: ["חדש"],
    createdAt: now,
    updatedAt: now
  }
];

export const users = [
  { id: "u-admin", name: "Admin LechTop", email: "admin@lechtop.dev", password: "admin123", role: "admin", language: "he", blocked: false, createdAt: now },
  { id: "u-user", name: "Demo Customer", email: "user@lechtop.dev", password: "user123", role: "user", language: "he", blocked: false, createdAt: now }
];

export const orders = [
  {
    id: "LT-1001",
    userId: "u-user",
    customer: { name: "Demo Customer", phone: "+972 54-777-2233", email: "user@lechtop.dev", address: "Dizengoff 99, Tel Aviv-Yafo", comment: "Delivery after 18:00" },
    delivery: "שליח עד הבית",
    payment: "כרטיס אשראי",
    items: [{ productId: "p-neon-r7", title: "LechTop Neon R7", price: 15490, quantity: 1 }],
    total: 15490,
    status: "assembling",
    createdAt: now
  }
];
