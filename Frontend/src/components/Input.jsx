import { useState, useEffect } from "react";
import "./Input.css";
import { useOutfit } from "./OutfitContext";
import FilterPanel from "./FilterPanel";
import { useSnackbar } from "notistack";

export default function Input({ defaultPrompt = "" }) {
  const { prompt, setPrompt, setOutfitResults, saveOutfitHistory } = useOutfit();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [priceFilter, setPriceFilter] = useState(100); // (om du vill använda senare)
  const [filterOpen, setFilterOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const [filters, setFilters] = useState({
    maxPriceAll: 10000, // 🔥 GLOBAL MAX = 10 000
    selectedCategories: ["top", "bottom", "shoes", "accessories"],
    categoryPrices: {
      top: 10000,
      bottom: 10000,
      shoes: 10000,
      accessories: 10000,
    },
  });

  const logFilters = (filtersObj) => {
    console.group("🔎 FILTER DEBUG");
    console.log("Global max:", filtersObj.maxPriceAll);
    console.log("Selected categories:", filtersObj.selectedCategories);
    console.log("Category max prices:", filtersObj.categoryPrices);
    console.groupEnd();
  };

  const explainWhy = (filtersObj, results) => {
    if (!results || results.length !== 0) return;

    console.group("⚠️ WHY NO PRODUCTS FOUND?");
    console.log("These filters caused 0 results:", filtersObj);
    console.groupEnd();
  };

  const resetFilters = () => {
    setFilters({
      maxPriceAll: 2000,
      selectedCategories: ["top", "bottom", "shoes", "accessories"],
      categoryPrices: {
        top: 2000,
        bottom: 2000,
        shoes: 2000,
        accessories: 2000,
      },
    });

    // 👉 vi nollställer resultaten till null (inte tom array)
    setOutfitResults(null);
  };

  const sendPromptToBackend = async () => {
    setError("");
    setLoading(true);
    setResponse(null);
    // =========================
    // 🧪 DEBUG MODE: ALWAYS SHOW RESULTS
    // =========================
    const DEBUG = true;

    if (DEBUG) {
      const mock = {
        top: [
          {
            name: "Debug Black Hoodie",
            price: "499 kr",
            image: "https://via.placeholder.com/300x380?text=Hoodie",
            link: "#",
            category: "top",
          },
        ],
        bottom: [
          {
            name: "Debug Blue Jeans",
            price: "799 kr",
            image: "https://via.placeholder.com/300x380?text=Jeans",
            link: "#",
            category: "bottom",
          },
        ],
        shoes: [
          {
            name: "Debug White Sneakers",
            price: "1199 kr",
            image: "https://via.placeholder.com/300x380?text=Shoes",
            link: "#",
            category: "shoes",
          },
        ],
        accessories: [
          {
            name: "Debug Chain",
            price: "199 kr",
            image: "https://via.placeholder.com/300x380?text=Accessory",
            link: "#",
            category: "accessories",
          },
        ],
      };

      console.log("🧪 DEBUG: Using mock outfit results");
      setOutfitResults(mock);

      setLoading(false);
      return; // 🔥 STOPPA HÄR SÅ FETCHEN INTE KÖRS
    }

    try {
      // ✔ Bygg filter i det format backend förväntar sig
      const backendFilters = {
        categories: filters.selectedCategories,
        price: {
          globalMax: filters.maxPriceAll,
          perCategory: filters.categoryPrices,
        },
      };

      const res = await fetch(
        "http://localhost:3000/api/generate-outfit?nocache=" + Date.now(),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            filters: backendFilters,
          }),
        }
      );

      // 🔥 CHECKA SERPAPI LIMIT
      if (!res.ok) {
        const data = await res.json();

        if (data.error === "SERPAPI_LIMIT_EXCEEDED") {
          enqueueSnackbar("SerpApi API limit exceeded — try again later!", {
            variant: "error",
            anchorOrigin: { vertical: "top", horizontal: "right" },
            autoHideDuration: null, // 👈 Stannar kvar tills man klickar X
            persist: true, // 👈 Tvingar notisen att stanna
          });
          return;
        }

        enqueueSnackbar("Server error — try again later.", { variant: "error" });
        return;
      }

      // 🚀 Fortsätt: allt under här körs bara om det INTE är limit error
      const data = await res.json();

      if (data.error === "SERPAPI_LIMIT") {
        alert("⚠️ SerpApi API limit exceeded. Please wait until next reset or replace API key.");
        return;
      }

      // ✔ Spara endast results i context (meta ligger kvar i data om du vill använda)
      setOutfitResults(data.results);

      // =========================
      // 🔍 DIAGNOSE WHY NO RESULTS
      // =========================
      const allCategories = ["top", "bottom", "shoes", "accessories"];
      const resultsByCat = data.results || {};

      const emptyCategories = allCategories.filter((cat) => {
        return !resultsByCat[cat] || resultsByCat[cat].length === 0;
      });

      if (emptyCategories.length > 0) {
        console.group("⚠️ WHY NO ITEMS FOUND");

        emptyCategories.forEach((cat) => {
          const maxPrice = filters.categoryPrices[cat];
          console.log(
            `Category "${cat}" returned 0 items. Possible reasons:`,
            {
              priceTooLow: `No items under ${maxPrice} kr`,
              globalMax: filters.maxPriceAll,
              categoryMax: filters.categoryPrices[cat],
              selected: filters.selectedCategories.includes(cat),
            }
          );
        });

        console.groupEnd();
      }

      // =========================
      // 🤖 SMART RELAXATION SUGGESTIONS (just nu bara loggar)
      // =========================
      const relaxationSuggestions = [];

      emptyCategories.forEach((cat) => {
        const catMax = filters.categoryPrices[cat];
        const globalMax = filters.maxPriceAll;

        // 1. Förslag: höj kategori-max
        relaxationSuggestions.push({
          type: "increase-category",
          message: `Try increasing "${cat}" max price above ${catMax} kr.`,
          newFilters: {
            ...filters,
            categoryPrices: {
              ...filters.categoryPrices,
              [cat]: catMax + 200, // +200 kr som exempel
            },
          },
        });

        // 2. Om global max är lägre än kategoriens behov
        if (globalMax < catMax + 200) {
          relaxationSuggestions.push({
            type: "increase-global",
            message: `Try increasing global max above ${globalMax} kr.`,
            newFilters: {
              ...filters,
              maxPriceAll: globalMax + 300,
            },
          });
        }

        // 3. Om kategorin inte är vald alls
        if (!filters.selectedCategories.includes(cat)) {
          relaxationSuggestions.push({
            type: "add-category",
            message: `You have disabled "${cat}". Try enabling it.`,
            newFilters: {
              ...filters,
              selectedCategories: [...filters.selectedCategories, cat],
            },
          });
        }
      });

      console.group("💡 RELAXATION SUGGESTIONS");
      relaxationSuggestions.forEach((s) => console.log(s.message));
      console.groupEnd();

      console.group("🔎 FILTER DEBUG");
      console.log("Filters (frontend):", filters);
      console.log("Results (backend):", data.results);
      console.groupEnd();

      if (
        data.results &&
        Object.values(data.results).every((arr) => !arr || arr.length === 0)
      ) {
        console.warn("⚠️ No results due to filters.");
      }

      // DEBUG helpers
      logFilters(filters);
      explainWhy(filters, data.results);

      if (data.success) {
        saveOutfitHistory(data);
      }
    } catch (err) {
      console.error("Error in generate:", err);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultPrompt]);

  const categories = [
    { key: "top", title: "Top" },
    { key: "bottom", title: "Bottom" },
    { key: "shoes", title: "Shoes" },
    { key: "accessories", title: "Accessories" },
  ];

  return (
    <div className="doll-wrapper">
      {/* === Titel och intro === */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "1.8rem",
          marginTop: "1rem",
        }}
      >
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
            onMouseOver={(e) =>
              (e.currentTarget.style.background = "#e5e7eb")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.background = "#f3f4f6")
            }
          >
            {ex}
          </button>
        ))}
      </div>

      <div className="input-section">
        <div className="input-wrapper">
          {/* TEXTAREA */}
          <textarea
            className="input"
            placeholder="Describe your outfit..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendPromptToBackend()}
          />

          {/* FILTER BAR */}
          <div className="filter-bar">
            <button
              className="filter-btn"
              onClick={() => setFilterOpen((prev) => !prev)}
            >
              Filter
            </button>
          </div>

          {/* GENERATE BUTTON */}
          <button
            className="button--submit"
            onClick={sendPromptToBackend}
            disabled={loading || !prompt.trim()}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>



        {/* FILTER PANEL */}
        {filterOpen && (
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            onClose={() => setFilterOpen(false)}
            onApply={() => {
              setFilterOpen(false);
              sendPromptToBackend();
            }}
          />
        )}
      </div>
    </div>
  );
}
