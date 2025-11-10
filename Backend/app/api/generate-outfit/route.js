import { generateOutfit } from "@/lib/generate-outfit";

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    console.log("Mottaget prompt:", prompt);

    const results = await generateOutfit(prompt);
    console.log("Resultat från generateOutfit:", results);

   return new Response(JSON.stringify({ success: true, results: results }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",           // 👈 tillåter frontend
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (err) {
    console.error("Fel:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",         // 👈 även vid fel
        },
      }
    );
  }
}

// Hantera preflight-förfrågningar (CORS OPTIONS)
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

