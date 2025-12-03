import { generateOutfit } from "@/lib/generate-outfit";

export async function POST(req) {
  try {
    const { prompt, filters } = await req.json();

    console.log("Mottaget prompt:", prompt);
    console.log("🔥 ROUTE RECEIVED FILTERS:", filters);

    const results = await generateOutfit(prompt, filters);

    return new Response(JSON.stringify({ success: true, results }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });

  } catch (err) {
    console.error("Fel:", err);

    // ⭐ Specialhantering för SerpApi-limit
    if (err.message === "SERPAPI_LIMIT_EXCEEDED") {
      return new Response(
        JSON.stringify({
          success: false,
          error: "SERPAPI_LIMIT_EXCEEDED",
        }),
        {
          status: 429,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Annat fel
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
