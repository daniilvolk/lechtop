export function productImage(title, accent = "red") {
  const palette = {
    red: ["#ff314f", "#22d3ee"],
    blue: ["#22d3ee", "#8b5cf6"],
    violet: ["#8b5cf6", "#ff314f"],
    green: ["#42e3a4", "#22d3ee"]
  }[accent] || ["#ff314f", "#22d3ee"];
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#05070d"/>
          <stop offset="0.52" stop-color="#121827"/>
          <stop offset="1" stop-color="#05070d"/>
        </linearGradient>
        <radialGradient id="r" cx="70%" cy="30%" r="55%">
          <stop offset="0" stop-color="${palette[0]}" stop-opacity=".55"/>
          <stop offset="1" stop-color="${palette[1]}" stop-opacity="0"/>
        </radialGradient>
        <filter id="blur"><feGaussianBlur stdDeviation="26"/></filter>
      </defs>
      <rect width="1200" height="900" fill="url(#g)"/>
      <rect width="1200" height="900" fill="url(#r)"/>
      <g opacity=".28" stroke="#fff" stroke-width="1">
        ${Array.from({ length: 22 }, (_, i) => `<path d="M${i * 58} 0v900"/>`).join("")}
        ${Array.from({ length: 16 }, (_, i) => `<path d="M0 ${i * 60}h1200"/>`).join("")}
      </g>
      <g transform="translate(270 140)">
        <rect x="90" y="80" width="420" height="560" rx="34" fill="#0a0f1d" stroke="${palette[0]}" stroke-width="4"/>
        <rect x="132" y="122" width="336" height="476" rx="20" fill="#111827" stroke="#ffffff" stroke-opacity=".1"/>
        <circle cx="300" cy="360" r="118" fill="none" stroke="${palette[1]}" stroke-width="24"/>
        <circle cx="300" cy="360" r="62" fill="${palette[0]}" opacity=".7" filter="url(#blur)"/>
        <path d="M650 150h72v410h-72zM600 220h54v270h-54z" fill="${palette[1]}" opacity=".62"/>
      </g>
      <text x="70" y="790" fill="#f5f7fb" font-family="Inter, Arial" font-size="58" font-weight="800">${escapeXml(title)}</text>
      <text x="72" y="842" fill="#a8b0c3" font-family="Inter, Arial" font-size="28">LechTop premium tech</text>
    </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function heroImage() {
  return productImage("Power Your Game", "blue");
}

function escapeXml(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
