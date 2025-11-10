// src/components/OutfitContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const OutfitContext = createContext();

export function OutfitProvider({ children }) {
  const [outfitResults, setOutfitResults] = useState(null);
  const [prompt, setPrompt] = useState("");

  // 🔹 Läs från localStorage vid start
  useEffect(() => {
    const savedResults = localStorage.getItem("outfitResults");
    const savedPrompt = localStorage.getItem("outfitPrompt");
    if (savedResults) setOutfitResults(JSON.parse(savedResults));
    if (savedPrompt) setPrompt(savedPrompt);
  }, []);

  // 🔹 Spara automatiskt när något ändras
  useEffect(() => {
    if (outfitResults)
      localStorage.setItem("outfitResults", JSON.stringify(outfitResults));
    else localStorage.removeItem("outfitResults");
  }, [outfitResults]);

  useEffect(() => {
    if (prompt) localStorage.setItem("outfitPrompt", prompt);
    else localStorage.removeItem("outfitPrompt");
  }, [prompt]);

  // 🔹 Reset-knappen
  const resetOutfits = () => {
    setOutfitResults(null);
    setPrompt("");
    localStorage.removeItem("outfitResults");
    localStorage.removeItem("outfitPrompt");
  };

  return (
    <OutfitContext.Provider
      value={{ outfitResults, setOutfitResults, resetOutfits, prompt, setPrompt }}
    >
      {children}
    </OutfitContext.Provider>
  );
}

export function useOutfit() {
  return useContext(OutfitContext);
}
