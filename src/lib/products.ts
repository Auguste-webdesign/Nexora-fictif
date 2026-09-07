/**
 * Nexora's curated multi-brand catalog (docs/DESIGN_SYSTEM.md §7.2).
 *
 * Nexora is a retailer, not a manufacturer: every entry is a third-party
 * product it stocks. The iPhone 18 appears here too — the catalog is complete,
 * not "everything except the flagship".
 *
 * Every product carries real photography, normalised to a single 1200x900 tile
 * by scripts/prepare-products.mjs — see that file for how each source shape is
 * handled. ProductGlyph remains as the fallback for any future entry added
 * before its photo exists.
 * Prices are placeholders pending real catalog data.
 */
export const CATEGORIES = [
  "Téléphones",
  "Écouteurs",
  "Casques",
  "Moniteurs",
  "Claviers",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type Product = {
  id: string;
  brand: string;
  name: string;
  category: Category;
  price: number;
  /** One short technical line — the mono spec under the name. */
  spec: string;
  image?: string;
  flagship?: boolean;
};

export const PRODUCTS: Product[] = [
  {
    id: "iphone-18",
    brand: "Apple",
    name: "iPhone 18",
    category: "Téléphones",
    price: 1299,
    spec: "6,3 po · Titane · A19 Pro",
    image: "/products/iphone-18.webp",
    flagship: true,
  },
  { image: "/products/pixel-10-pro.webp", id: "pixel-10-pro", brand: "Google", name: "Pixel 10 Pro", category: "Téléphones", price: 999, spec: "6,7 po · Tensor G5" },
  { image: "/products/galaxy-s26-ultra.webp", id: "galaxy-s26-ultra", brand: "Samsung", name: "Galaxy S26 Ultra", category: "Téléphones", price: 1399, spec: "6,9 po · 200 Mpx" },
  { image: "/products/xperia-1-vii.webp", id: "xperia-1-vii", brand: "Sony", name: "Xperia 1 VII", category: "Téléphones", price: 1099, spec: "6,5 po · OLED 4K" },

  { image: "/products/airpods-pro-3.webp", id: "airpods-pro-3", brand: "Apple", name: "AirPods Pro 3", category: "Écouteurs", price: 279, spec: "RB active · H3 · USB-C" },
  { image: "/products/wf-1000xm6.webp", id: "wf-1000xm6", brand: "Sony", name: "WF-1000XM6", category: "Écouteurs", price: 319, spec: "RB active · LDAC · 8 h" },
  { image: "/products/momentum-4-tw.webp", id: "momentum-4-tw", brand: "Sennheiser", name: "Momentum True Wireless 4", category: "Écouteurs", price: 299, spec: "aptX Lossless" },
  { image: "/products/beoplay-ex.webp", id: "beoplay-ex", brand: "Bang & Olufsen", name: "Beoplay EX", category: "Écouteurs", price: 399, spec: "Aluminium · RB active" },

  { image: "/products/wh-1000xm6.webp", id: "wh-1000xm6", brand: "Sony", name: "WH-1000XM6", category: "Casques", price: 449, spec: "Circum-aural · 30 h" },
  { image: "/products/airpods-max-2.webp", id: "airpods-max-2", brand: "Apple", name: "AirPods Max 2", category: "Casques", price: 579, spec: "USB-C · Audio spatial" },
  { image: "/products/beoplay-h100.webp", id: "beoplay-h100", brand: "Bang & Olufsen", name: "Beoplay H100", category: "Casques", price: 1549, spec: "Titane · Agneau" },
  { image: "/products/hd-820.webp", id: "hd-820", brand: "Sennheiser", name: "HD 820", category: "Casques", price: 2399, spec: "Fermé · 300 Ω" },

  { image: "/products/pro-display-xdr.webp", id: "pro-display-xdr", brand: "Apple", name: "Pro Display XDR", category: "Moniteurs", price: 4999, spec: "32 po · 6K · XDR" },
  { image: "/products/ultrafine-evo.webp", id: "ultrafine-evo", brand: "LG", name: "UltraFine Evo 6K", category: "Moniteurs", price: 1899, spec: "32 po · 6K · Thunderbolt 5" },
  { image: "/products/odyssey-oled-g9.webp", id: "odyssey-oled-g9", brand: "Samsung", name: "Odyssey OLED G9", category: "Moniteurs", price: 1799, spec: "49 po · 240 Hz · QD-OLED" },
  { image: "/products/proart-pa32kcx.webp", id: "proart-pa32kcx", brand: "ASUS", name: "ProArt PA32KCX", category: "Moniteurs", price: 4499, spec: "32 po · 8K · Mini-LED" },

  { image: "/products/q3-max.webp", id: "q3-max", brand: "Keychron", name: "Q3 Max", category: "Claviers", price: 219, spec: "TKL · Gasket · QMK" },
  { image: "/products/hhkb-hybrid.webp", id: "hhkb-hybrid", brand: "HHKB", name: "Professional Hybrid Type-S", category: "Claviers", price: 385, spec: "Topre 45 g · Silencieux" },
  { image: "/products/mx-mechanical.webp", id: "mx-mechanical", brand: "Logitech", name: "MX Mechanical", category: "Claviers", price: 179, spec: "Profil bas · Multi-appareils" },
  { image: "/products/magic-keyboard.webp", id: "magic-keyboard", brand: "Apple", name: "Magic Keyboard", category: "Claviers", price: 199, spec: "Touch ID · Aluminium" },
];

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);

/**
 * iPhone 18 storage tiers.
 *
 * Lives here rather than inside the Acquire section because it is product data,
 * not presentation: the cart and the order endpoint both have to resolve the
 * price of a configured iPhone, and they must read it from the same place the
 * configurator does.
 */
export const IPHONE_STORAGE = [
  { id: "256", label: "256 Go", price: 1299 },
  { id: "512", label: "512 Go", price: 1499 },
  { id: "1tb", label: "1 To", price: 1799 },
] as const;

export type StorageOption = (typeof IPHONE_STORAGE)[number];

export const FLAGSHIP_ID = "iphone-18";
