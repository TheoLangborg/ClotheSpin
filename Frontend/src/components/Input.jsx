import { useState, useEffect } from "react";
import "./Input.css";
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
    
      setResponse(data);
      setOutfitResults(data);
    } catch (err) {
     
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
      {/* === Titel och intro === */}
      <div style={{ textAlign: "center", marginBottom: "1.8rem", marginTop: "1rem" }}>
        <h2
          style={{
            color: "#3b82f6",
            textShadow: "0 0 8px rgba(59,130,246,0.5)",
            fontWeight: 700,
            fontSize: "2rem",
            marginBottom: "0.4rem",
          }}
        >
          Describe the look you want!
        </h2>
        <p
          style={{
            color: "#323232",
            fontSize: "1rem",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          Try these examples 👇
        </p>
      </div>

      {/* === Exempelknappar ovanför input === */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          justifyContent: "center",
          margin: "0 auto 1.8rem auto",
          maxWidth: "600px",
        }}
      >
        {[
          "Casual streetwear for men",
          "All-black rock outfit",
          "Elegant summer look for women",
          "Retro 90s vibe",
          "Winter city outfit",
        ].map((ex) => (
          <button
            key={ex}
            onClick={() => setPrompt(ex)}
            style={{
              background: "#f3f4f6",
              color: "#323232",
              border: "1px solid #d1d5db",
              borderRadius: "10px",
              padding: "6px 14px",
              cursor: "pointer",
              fontSize: "0.9rem",
              transition: "all 0.25s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#e5e7eb")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#f3f4f6")}
          >
            {ex}
          </button>
        ))}
      </div>

      {/* === Input och knapp === */}
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

      {/* === Resultat === */}
      <div className="page-layout">
        <div className="content-zone">
          {response && <OutfitResult response={response} />}
        </div>
      </div>
    </div>
  );

}
