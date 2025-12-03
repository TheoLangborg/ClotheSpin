// /src/lib/gpt.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ======================================================
// 🧠 GRUND-FUNKTION FÖR GPT REQUESTS
// ======================================================
async function ask(messages, options = {}) {
  try {
    const res = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.4,
      messages,
      ...options,
    });

    return res.choices[0].message.content;
  } catch (err) {
    console.error("GPT ERROR:", err);
    throw new Error("GPT failed");
  }
}

// ======================================================
// 🧠 SUPER-BOOSTED interpretPrompt()
// ======================================================
async function interpretPrompt(prompt) {
  const system = `
You are an outfit-analysis AI. You MUST return JSON only.
Your job is to interpret the user’s prompt and produce structured fashion data AND varied clothing keywords.

RETURN EXACTLY THIS JSON SHAPE:
{
  "gender": "",
  "style": "",
  "season": "",
  "budget": "",
  "color_scheme": [],
  "top": [],
  "bottom": [],
  "shoes": [],
  "accessories": []
}

====================================================
GENDER DETECTION RULES
====================================================
- If user mentions: "man", "men", "male", "him", "for men" → gender = "male"
- If user mentions: "woman", "women", "female", "her", "for women" → gender = "female"
- If unclear → gender = "unisex"

Special correction:
- Never return female items for male prompts.
- Never return male items for female prompts.

Prefix rule:
- male → use male-oriented clothing items (oxford shirt, men's blazer, chinos, loafers…)
- female → use female-oriented clothing items (blouses, skirts, heels, women’s blazers…)
- unisex → use neutral terms (hoodie, t-shirt, trainers)

====================================================
KEYWORD GENERATION RULES
====================================================
These arrays are used for SERP API product lookup.

GENERAL:
- ALWAYS generate **3–6 unique keywords** per category.
- MUST be real clothing items.
- NO generic terms like “clothes”, “outfit”, “topwear”, “bottomwear”.
- MUST match detected gender (no skirts for men, no men’s jackets for women).
- Must produce *varied* terms, not variants of the same item.

====================================================
STYLE-ADAPTIVE KEYWORD RULES
====================================================

If style includes:

OLD MONEY:
- oxford shirt, cashmere sweater, knit polo, cable knit, navy blazer, linen shirt,
- chinos, tailored trousers,
- loafers, derby shoes,
- leather belt, elegant watch

STREETWEAR:
- oversized hoodie, graphic t-shirt, bomber jacket, varsity jacket, cargo pants,
- baggy jeans, sneakers, high-tops, caps, chains

BUSINESS / FORMAL:
- dress shirt, suit jacket, wool blazer, tailored trousers, oxfords, derbies,
- trench coat

CLASSY / ELEGANT:
- turtleneck, merino knitwear, silk shirt, wool trousers, leather loafers,
- long coat, heels (female), dress shoes (male)

SUMMER:
- linen shirt, linen trousers, polo, pleated shorts, espadrilles, loafers,
- sunglasses, lightweight cotton shirts

WINTER:
- wool coat, knit sweater, turtleneck, thermal trousers, boots, scarves

DATE NIGHT:
- fitted shirt, turtleneck, fine knitwear, suede jacket,
- tailored trousers, luxury sneakers, dress shoes

====================================================
SEASON RULES
====================================================
- Detect season if explicitly mentioned.
- Otherwise season = "all"
- Seasonal items should affect keyword choices.

====================================================
COLOR SCHEME RULES
====================================================
- Extract stated colors.
- If none: generate a palette that matches the style.
  - old money → navy, beige, cream, olive, brown
  - streetwear → black, white, grey, bold accents
  - classy → black, charcoal, camel, white
  - summer → white, sand, light blue, olive
  - winter → grey, navy, burgundy, forest green

====================================================
JSON RULES
====================================================
- Output MUST be valid JSON.
- No comments, no markdown, no text outside JSON.
- Arrays must always exist.
- Never repeat the prompt or add explanation.
- Keep values in English.
====================================================

User request:
"${prompt}"
`;

  const content = await ask([
    { role: "system", content: system },
    { role: "user", content: prompt },
  ]);

  // Strip unwanted formatting
  const clean = content
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(clean);
  } catch (err) {
    console.error("❌ GPT JSON parse error:", clean);
    return null;
  }
}

export default {
  ask,
  interpretPrompt,
};
