export function generateBarcode(prefix = "7297009") {
  const body = `${prefix}${Math.floor(100000 + Math.random() * 899999)}`.slice(0, 12);
  return `${body}${checksumEan13(body)}`;
}

export function checksumEan13(value) {
  const digits = String(value).padStart(12, "0").slice(0, 12).split("").map(Number);
  const sum = digits.reduce((acc, digit, index) => acc + digit * (index % 2 ? 3 : 1), 0);
  return (10 - (sum % 10)) % 10;
}

export function barcodeSvg(value, width = 260, height = 86) {
  const chars = String(value).split("");
  let x = 12;
  const bars = chars.flatMap((char, index) => {
    const code = char.charCodeAt(0) + index * 17;
    return [1, 2, 1, 3, 2].map((base, bit) => {
      const w = ((code >> bit) & 1) ? base + 1 : base;
      const bar = `<rect x="${x}" y="8" width="${w}" height="${height - 30}" rx="1" fill="currentColor"/>`;
      x += w + 2;
      return bar;
    });
  }).join("");

  return `<svg viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="Barcode ${value}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" rx="12" fill="white"/>
    <g color="#090b12">${bars}</g>
    <text x="50%" y="${height - 8}" text-anchor="middle" fill="#090b12" font-family="Inter, Arial" font-size="14" letter-spacing="2">${value}</text>
  </svg>`;
}
