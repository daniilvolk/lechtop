# LechTop Premium Store

Premium tech/gaming ecommerce SPA for the Israeli market.

## Run

```powershell
& 'C:\Users\inc77\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' server.js
```

Open: http://localhost:8081

## Demo accounts

- Admin: `admin@lechtop.dev` / `admin123`
- User: `user@lechtop.dev` / `user123`

## Current market/localization setup

- Primary language: Hebrew.
- Default document direction: RTL.
- Language switcher: Hebrew / English / Russian.
- Language persists per logged-in user in `user.language`.
- Guest language persists in `localStorage`.
- Currency: Israeli shekel, `ILS`, rendered as `₪`.
- Israeli contact data: `+972546208935`, `lechko24@gmail.com`, `Motzkin 9 Netanya`, `4246009`.
- Product barcodes use Israeli-style `729...` prefixes.

## Implemented

- Home, catalog pages, product page, global search, cart, checkout, account and 404.
- Favorites, compare list, order history and local persistence.
- Auth, protected routes, `user` / `admin` roles.
- `/admin`: dashboard, product CRUD, categories, orders, users, role changes and blocking.
- Barcode workflows: product `barcode`, generated barcode, preview, admin barcode search, scanner modal, USB/Bluetooth/manual input and camera fallback.
- PC builder with component selection, total price and compatibility warning.
- Responsive premium dark tech/gaming UI with animations and RTL support.

## Structure

```text
src/
  components/  shared UI, forms, barcode scanner
  pages/       store pages and admin area
  services/    auth, products, cart, orders, barcode, language
  store/       localStorage state layer
  types/       domain TypeScript reference types
  utils/       formatting and local SVG assets
```

Data is stored in `localStorage` under `lechtop-store-v4`.
