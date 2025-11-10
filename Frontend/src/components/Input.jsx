import { useState, useEffect } from "react";
import "./Input.css";
import Doll from "./Doll";
import OutfitResult from "./OutfitResult";
import { useOutfit } from "./OutfitContext";

export default function Input({ defaultPrompt = "" }) {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setOutfitResults } = useOutfit();

  // === Skicka prompt till backend ===
  const sendPromptToBackend = async () => {
    setError("");
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch(
        `http://localhost:3000/api/generate-outfit?nocache=${Date.now()}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        }
      );

      if (!res.ok) throw new Error(`Servern svarade med status ${res.status}`);

      const data = await res.json();
      console.log("Svar från backend:", data);
      setResponse(data);
      setOutfitResults(data);
    } catch (err) {
      console.error("Fel vid fetch:", err);
      setError("Något gick fel – kolla backend-servern eller API-anslutningen.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (defaultPrompt && defaultPrompt.trim()) {
      setPrompt(defaultPrompt);
      // kör automatiskt sök när prompt ändras
      sendPromptToBackend();
    }
  }, [defaultPrompt]);

  // === Hämta produkter från respons ===
  const getCategoryProducts = (category) => {
    if (!response) return [];
    if (response.results && response.results[category]) {
      return response.results[category];
    }
    // fallback if backend returnerar direkt { top: [...], ... }
    if (response[category]) return response[category];
    return [];
  };

  const categories = [
    { key: "top", title: "Top" },
    { key: "bottom", title: "Bottom" },
    { key: "shoes", title: "Shoes" },
    { key: "accessories", title: "Accessories" },
  ];

  return (
    <div className="doll-wrapper">
      {/* === Dockan i mitten === */}
      <div className="doll-container">
        <Doll />
      </div>

      {/* === Input och knapp längst ner === */}
      <div className="input-section">
        <div className="input-wrapper">
          <textarea
            className="input"
            placeholder="Describe your outfit..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendPromptToBackend()}
          />
          <button
            className="button--submit"
            onClick={sendPromptToBackend}
            disabled={loading || !prompt.trim()}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
          {error && <div className="error-box">{error}</div>}
        </div>
      </div>

      {/* === Huvudinnehåll (input + resultat) === */}
      <div className="page-layout">
        <div className="content-zone">
          {response && <OutfitResult response={response} />}
        </div>
      </div>
    </div>
  );
}
