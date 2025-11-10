// === 🧩 Lägg högst upp i generate-outfit.js ===

// 🟢 1. Hämta produkter från Adtraction
async function fetchAdtractionProducts(query) {
  const ADTRACTION_API_KEY = process.env.ADTRACTION_API_KEY;

  if (!ADTRACTION_API_KEY) return [];

  try {
    const res = await fetch(
      `https://api.adtraction.com/v2/products?query=${encodeURIComponent(
        query
      )}&token=${ADTRACTION_API_KEY}`
    );

    if (!res.ok) return [];

    const data = await res.json();
    // Anpassa beroende på deras exakta svarstruktur
    return data.products || data.items || [];
  } catch (err) {
    console.warn("⚠️ Adtraction API-fel, använder fallback:", err);
    return [];
  }
}

// 🟣 2. Hämta produkter från Awin
async function fetchAwinProducts(query) {
  const AWIN_API_KEY = process.env.AWIN_API_KEY;

  if (!AWIN_API_KEY) return [];

  try {
    const res = await fetch(
      `https://api.awin.com/products?query=${encodeURIComponent(
        query
      )}&accessToken=${AWIN_API_KEY}`
    );

    if (!res.ok) return [];

    const data = await res.json();
    return data.products || [];
  } catch (err) {
    console.warn("⚠️ AWIN API-fel, använder fallback:", err);
    return [];
  }
}

export async function generateOutfit(prompt) {
  try {
    // 🧩 Översätt svenska ord → engelska för bättre SerpApi-resultat
    const translatedPrompt = prompt
      .replace(/herr/gi, "men")
      .replace(/dam/gi, "women")
      .replace(/kille/gi, "men")
      .replace(/tjej/gi, "women")
      .replace(/outfit/gi, "clothing")
      .replace(/stil/gi, "style")
      .replace(/svart/gi, "black")
      .replace(/vit/gi, "white")
      .replace(/grön/gi, "green")
      .replace(/brun/gi, "brown");

    // 🧠 Förbättrad prompt-tolkning för kön
    let basePrompt = translatedPrompt;
    if (
      prompt.toLowerCase().includes("girl") ||
      prompt.toLowerCase().includes("woman") ||
      prompt.toLowerCase().includes("female") ||
      prompt.toLowerCase().includes("girls") ||
      prompt.toLowerCase().includes("womans") ||
      prompt.toLowerCase().includes("¨lady") ||
      prompt.toLowerCase().includes("ladies") ||
      prompt.toLowerCase().includes("females")
    ) {
      basePrompt += " for women";
    } else if (
      prompt.toLowerCase().includes("boy") ||
      prompt.toLowerCase().includes("man") ||
      prompt.toLowerCase().includes("male") ||
      prompt.toLowerCase().includes("boys") ||
      prompt.toLowerCase().includes("mens") ||
      prompt.toLowerCase().includes("guy") ||
      prompt.toLowerCase().includes("guys") ||
      prompt.toLowerCase().includes("mans") ||
      prompt.toLowerCase().includes("males")
    ) {
      basePrompt += " for men";
    } else {
      basePrompt += " outfit for women"; // 👈 default till women
    }

    // 🔹 Kategorier
    const categories = [
      { key: "top", label: "shirt OR hoodie OR jacket OR t-shirt OR sweatshirt" },
      { key: "bottom", label: "pants OR jeans OR shorts OR trousers" },
      { key: "shoes", label: "shoes OR sneakers OR boots" },
      { key: "accessories", label: "watch OR cap OR hat OR sunglasses OR chain" },
    ];

    const results = {};

    for (const { key, label } of categories) {
      // 🧩 Lägg till variation för naturligare resultat
      const randomizer = [
        "trendy", "new", "unique", "aesthetic", "modern",
        "2025 fashion", "streetwear", "stylish", "cool look"
      ][Math.floor(Math.random() * 9)];

      const searchQuery = `${basePrompt} ${label} ${randomizer}`;

      // --- 1️⃣ Testa Awin först ---
      console.log(`🟣 Fetching from AWIN for [${key}]:`, searchQuery);
      const awinResults = await fetchAwinProducts(searchQuery);
      if (awinResults && awinResults.length > 0) {
        console.log(`✅ [${key}] Using Awin results (${awinResults.length} items)`);
        results[key] = awinResults.map((p) => ({
          name: p.name || "Unknown product",
          price: p.price || "N/A",
          image: p.image || "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg",
          link: p.tracking_link || "#",
          affiliate: true,
          source: "Awin",
        }));
        continue; // hoppa över Adtraction/SerpApi
      }

      // --- 2️⃣ Testa Adtraction ---
      console.log(`🟢 Fetching from ADTRACTION for [${key}]:`, searchQuery);
      const adtractionResults = await fetchAdtractionProducts(searchQuery);
      if (adtractionResults && adtractionResults.length > 0) {
        console.log(`✅ [${key}] Using Adtraction results (${adtractionResults.length} items)`);
        results[key] = adtractionResults.map((p) => ({
          name: p.name || "Unknown product",
          price: p.price || "N/A",
          image: p.image || "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg",
          link: p.tracking_link || p.url || "#",
          affiliate: true,
          source: "Adtraction",
        }));
        continue;
      }

      // --- 3️⃣ Annars: SerpApi fallback ---
      console.log(`🪄 Using SerpApi fallback for [${key}] →`, searchQuery);
      const serpRes = await fetch(
        `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(
          searchQuery
        )}&hl=en&gl=us&api_key=${process.env.SERP_API_KEY ||
        "28f74699766b83a2dc2ae0bfef422cd14991ad7a86948aa29a247a948ae29354"
        }`
      );
      const serpData = await serpRes.json();

      const toAbsolute = (u) => {
        if (!u) return null;
        if (u.startsWith("//")) return "https:" + u;
        if (/^https?:\/\//.test(u)) return u;
        return null;
      };

      const raw = serpData.shopping_results || [];
      const serpItems = raw
        .map((p) => {
          const link = toAbsolute(p.link) || toAbsolute(p.product_link);
          const image = toAbsolute(p.thumbnail);
          if (!link || !image) return null;
          return {
            name: p.title || "Unknown product",
            price: p.price || "N/A",
            image,
            link,
            affiliate: false,
            source: "SerpApi",
          };
        })
        .filter(Boolean)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      if (serpItems.length === 0) {
        serpItems.push({
          name: `No ${key} items found`,
          price: "-",
          image:
            "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg",
          link: "#",
          affiliate: false,
          source: "Fallback",
        });
      }

      results[key] = serpItems;
    }

    return results;
  } catch (err) {
    console.error("❌ Fel i API:", err);
    throw new Error("Något gick fel med API-anropet");
  }
}