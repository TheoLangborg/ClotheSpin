// /src/lib/products.js

// ======================================================
// 🔵 PRODUCTS WRAPPER – gemensam sökfunktion för:
// - AWIN (framtid)
// - Adtraction (framtid)
// - SerpApi (fungerar direkt)
// ======================================================

export const products = {
  search,
};

// ------------------------------------------------------
// 1️⃣ Huvudfunktion – anropas från generateOutfit()
// ------------------------------------------------------
async function search(query, { category, filters = {} } = {}) {
  // Säkerställ lowercase för kontroll
  let q = query.toLowerCase();

  // Hämta kön från filters (kommer från backend)
  const gender = filters.gender || filters?.aiGender || null;

  // ============================
  // 🟦 1. AUTO-GENDER FIX
  // ============================
  let genderPrefix = "";

  if (gender === "male" || gender === "men") genderPrefix = "men's";
  if (gender === "female" || gender === "women") genderPrefix = "women's";

  // Rensa ut fel kön först
  let cleaned = query
    .replace(/women'?s/gi, "")
    .replace(/ladies/gi, "")
    .replace(/girls/gi, "")
    .replace(/female/gi, "")
    .replace(/men'?s/gi, "")
    .replace(/male/gi, "")
    .trim();

  // Bygg slutlig query
  let finalQuery = genderPrefix
    ? `${genderPrefix} ${cleaned}`.trim()
    : cleaned;

  console.log(`🧩 Final gendered query: "${finalQuery}" [${category}]`);

  // ============================
  // 🟦 2. AWIN (placeholder)
  // ============================
  const awin = await awinSearch(finalQuery, category);
  if (awin.length > 0) {
    console.log(`⭐ AWIN returned ${awin.length} products`);
    return applyAllFilters(awin, category, filters);
  }

  // ============================
  // 🟦 3. ADTRACTION (placeholder)
  // ============================
  const adtr = await adtractionSearch(finalQuery, category);
  if (adtr.length > 0) {
    console.log(`⭐ Adtraction returned ${adtr.length} products`);
    return applyAllFilters(adtr, category, filters);
  }

  // ============================
  // 🟦 4. SerpApi (fallback)
  // ============================
  const serp = await serpSearch(finalQuery, category);
  console.log(`⭐ SerpApi returned ${serp.length} products`);
  if (serp.error === "SERPAPI_LIMIT") {
    return { error: "SERPAPI_LIMIT" };
  }

  return applyAllFilters(serp, category, filters);
}

// ------------------------------------------------------
// 2️⃣ AWIN – placeholder tills API finns
// ------------------------------------------------------
async function awinSearch(query, category) {
  const key = process.env.AWIN_API_KEY;
  if (!key) return [];

  try {
    const res = await fetch(
      `https://api.awin.com/products?query=${encodeURIComponent(query)}&accessToken=${key}`
    );
    if (!res.ok) return [];

    const data = await res.json();
    return normalizeProducts(data.products || [], "Awin", category);
  } catch (e) {
    console.warn("⚠️ AWIN error:", e);
    return [];
  }
}

// ------------------------------------------------------
// 3️⃣ Adtraction – placeholder tills API finns
// ------------------------------------------------------
async function adtractionSearch(query, category) {
  const key = process.env.ADTRACTION_API_KEY;
  if (!key) return [];

  try {
    const res = await fetch(
      `https://api.adtraction.com/v2/products?query=${encodeURIComponent(query)}&token=${key}`
    );
    if (!res.ok) return [];

    const data = await res.json();
    const list = data.products || data.items || [];

    return normalizeProducts(list, "Adtraction", category);
  } catch (e) {
    console.warn("⚠️ Adtraction error:", e);
    return [];
  }
}

// ------------------------------------------------------
// 4️⃣ SerpAPI fallback – funkar direkt
// ------------------------------------------------------
async function serpSearch(query, category) {
  const key =
    process.env.SERP_API_KEY ||
    "28f74699766b83a2dc2ae0bfef422cd14991ad7a86948aa29a247a948ae29354";

  const regions = ["us", "uk", "de", "se", "ca", "au"];

  for (const region of regions) {
    try {
      const serp = await fetch(
        `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(
          query
        )}&gl=${region}&hl=en&api_key=${key}`
      );

      const data = await serp.json();

      // 🔥 Detect SerpApi credit limit error
      if (data.error && String(data.error).toLowerCase().includes("payment")) {
        console.error("❌ SERPAPI CREDIT LIMIT EXCEEDED");
        throw new Error("SERPAPI_LIMIT_EXCEEDED");
      }

      // Some accounts return a different structure
      if (data.error_message && String(data.error_message).includes("limit")) {
        console.error("❌ SERPAPI CREDIT LIMIT EXCEEDED");
        throw new Error("SERPAPI_LIMIT_EXCEEDED");
      }

      const raw = data.shopping_results || [];

      if (raw.length === 0) continue;

      return normalizeProducts(
        raw.map((p) => ({
          name: p.title,
          price: p.price,
          image: p.thumbnail,
          link: p.product_link || p.link,
        })),
        "SerpApi",
        category
      );
    } catch (e) {
      if (e.message === "SERPAPI_LIMIT_EXCEEDED") {
        // 🛑 SKICKA UPP ERROR TILL ROUTE.JS
        throw e;
      }
      console.warn(`⚠️ SerpApi region ${region} error`, e);
    }
  }

  // Om alla regioner ger 0 produkter → vi antar att API-limiten är slut
  console.error("❌ SERPAPI LIMIT (inferred from 0 results in all regions)");
  throw new Error("SERPAPI_LIMIT_EXCEEDED");
}

// ------------------------------------------------------
// 5️⃣ Normalisering – samma format för ALLA API
// ------------------------------------------------------
function normalizeProducts(rawList, source, category) {
  return rawList
    .map((item) => {
      const link = fixUrl(item.link);
      const img = fixUrl(item.image);
      if (!link || !img) return null;

      return {
        name: item.name || item.title || "Unknown",
        price: item.price || "N/A",
        image: img,
        link: link,
        affiliate: source !== "SerpApi",
        source,
        category,
      };
    })
    .filter(Boolean);
}

// ------------------------------------------------------
// Hjälpare – fixar URLs
// ------------------------------------------------------
function fixUrl(u) {
  if (!u) return null;
  if (u.startsWith("//")) return "https:" + u;
  if (u.startsWith("http")) return u;
  return null;
}

// ------------------------------------------------------
// 6️⃣ Prisfilter & kategori-filter
// ------------------------------------------------------
function applyAllFilters(list, category, filters) {
  return applyPriceFilters(list, category, filters.price);
}

function applyPriceFilters(products, key, priceFilters) {
  if (!priceFilters) return products;

  const perCat = priceFilters.perCategory || {};
  const globalMax = priceFilters.globalMax;
  const catMax = perCat[key];

  const max = catMax ?? globalMax;
  if (!max) return products;

  return products.filter((p) => {
    const num = parsePrice(p.price);
    return num == null || num <= max;
  });
}

// ------------------------------------------------------
// 7️⃣ Prisstring → nummer
// ------------------------------------------------------
function parsePrice(str) {
  if (!str) return null;
  const cleaned = str.replace(/[^\d.,]/g, "");

  const withDot = cleaned.replace(/\./g, "").replace(",", ".");

  const num = parseFloat(withDot);
  return isNaN(num) ? null : num;
}
