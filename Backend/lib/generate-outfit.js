// /src/pages/api/generate-outfit.js
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import gpt from "@/lib/gpt";
import { products } from "@/lib/products";

// ======================================================
// ⭐ MAIN FUNCTION
// ======================================================
export async function generateOutfit(prompt, filters = {}) {
  console.log("🧠 Interpreting AI prompt...");
  console.log("🔥 BACKEND RECEIVED FILTERS:", JSON.stringify(filters, null, 2));

  const ai = await gpt.interpretPrompt(prompt);

  // Fallbackvärden
  const gender = ai?.gender || "unisex";
  const style = ai?.style || "other";
  const season = ai?.season || "all-year";
  const budget = ai?.budget || "medium";
  const colorScheme = ai?.color_scheme || [];

  // GPT genererade sökfraser
  const allCategories = [
    { key: "top", queries: ai?.top || [] },
    { key: "bottom", queries: ai?.bottom || [] },
    { key: "shoes", queries: ai?.shoes || [] },
    { key: "accessories", queries: ai?.accessories || [] },
  ];

  // Vilka kategorier är valda i frontend?
  const allowedKeys = Array.isArray(filters.categories)
    ? filters.categories
    : Array.isArray(filters.selectedCategories)
      ? filters.selectedCategories
      : ["top", "bottom", "shoes", "accessories"];

  const activeCategories = allCategories.filter((c) =>
    allowedKeys.includes(c.key)
  );

  // ⭐ Alltid 12 items totalt
  const TOTAL_ITEMS = 12;
  const categoryCount = activeCategories.length;
  let perCategoryLimit = Math.floor(TOTAL_ITEMS / categoryCount);

  if (perCategoryLimit < 1) perCategoryLimit = 1;

  console.log("🎯 Active categories:", activeCategories.map(c => c.key));
  console.log("🎯 Per category limit:", perCategoryLimit);

  const results = {};

  // ======================================================
  // ⭐ LOOP PER CATEGORY
  // ======================================================
  for (const { key, queries } of activeCategories) {
    // 🎯 Slumpa en av GPT:s keywords
    let keyword = null;

    if (Array.isArray(queries) && queries.length > 0) {
      keyword = queries[Math.floor(Math.random() * queries.length)];
    }

    // Fallback om GPT ger tomt
    if (!keyword) {
      keyword = `${gender} ${key} ${style}`;
    }

    console.log(`🔍 Fetching products for: "${keyword}" [${key}]`);

    const list = await products.search(keyword, {
  category: key,
  filters,
  gender,
});

// Om API-limit → returnera tydligt fel till frontend
if (list?.error === "SERPAPI_LIMIT") {
  return {
    meta: { error: "SERPAPI_LIMIT" },
    results: {},
  };
}


    const finalList =
      list.length > 0
        ? list.slice(0, perCategoryLimit)
        : [
          {
            name: `No ${key} items found`,
            price: "-",
            image:
              "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg",
            link: "#",
            affiliate: false,
            source: "Fallback",
            category: key,
          },
        ];

    results[key] = finalList.map((p) => ({
      ...p,
      category: key,
      addedAt: Date.now(),
    }));
  }

  // Metadata
  const meta = {
    prompt,
    gender,
    style,
    season,
    budget,
    colorScheme,
    generatedAt: Date.now(),
  };

  return { meta, results };
}

// ======================================================
// ⭐ API HANDLER (Next.js Pages Router)
// ======================================================
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Only POST allowed",
    });
  }

  const { prompt, filters } = req.body || {};

  if (!prompt) {
    return res.status(400).json({
      success: false,
      error: "Missing prompt",
    });
  }

  try {
    const { meta, results } = await generateOutfit(prompt, filters || {});
    return res.status(200).json({ success: true, meta, results });
  } catch (err) {
    console.error("❌ API Error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
