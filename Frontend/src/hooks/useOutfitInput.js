import { useState, useEffect } from "react";

export default function useOutfitInput(defaultPrompt = "") {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Nytt: trigger som gör att vi kan tvinga sökning även vid samma prompt
  const [triggerSearch, setTriggerSearch] = useState(0);

  // === Skicka prompt till backend ===
  const sendPromptToBackend = async (customPrompt) => {
    const activePrompt = customPrompt || prompt;

    setError("");
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch("http://localhost:3000/api/generate-outfit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: activePrompt }),
      });

      if (!res.ok) throw new Error(`Servern svarade med status ${res.status}`);

      const data = await res.json();
      console.log("Svar från backend:", data);
      setResponse(data);
    } catch (err) {
      console.error("Fel vid fetch:", err);
      setError("Något gick fel – kolla backend-servern eller API-anslutningen.");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Auto-sök när defaultPrompt ändras ELLER triggerSearch uppdateras
  useEffect(() => {
    if (defaultPrompt) {
      setPrompt(defaultPrompt);
      setResponse(null);
      sendPromptToBackend(defaultPrompt);
    }
  }, [defaultPrompt, triggerSearch]);

  // 🖱️ ENTER för att söka direkt
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading && prompt.trim()) {
      e.preventDefault();
      sendPromptToBackend();
    }
  };

  // 🔹 Funktion som kan kallas vid example prompt klick
  const triggerPromptSearch = (newPrompt) => {
    setPrompt(newPrompt);
    setResponse(null);
    setTriggerSearch((prev) => prev + 1); // 👈 tvingar om-sökning även om samma text
  };

  return {
    prompt,
    setPrompt,
    response,
    error,
    loading,
    sendPromptToBackend,
    handleKeyPress,
    setResponse,
    triggerPromptSearch, // exportera så HomeTab kan använda den
  };
}
