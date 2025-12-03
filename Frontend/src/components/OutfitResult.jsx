// src/components/OutfitResult.jsx
import React, { useState, useEffect } from "react";
import "./OutfitResult.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useOutfit } from "./OutfitContext";
import { Button, Box, Typography } from "@mui/material";

function safeId(link) {
  return btoa(link).replace(/=/g, "_").replace(/\//g, "-");
}

export default function OutfitResult() {
  const {
    outfitResults,
    setOutfitResults,
    resetOutfits,
    favorites,
    addFavorite,
    removeFavorite,
    setTryOnSelection,   // 🔵 global, bara för att skicka till TryOnTab
  } = useOutfit();

  // 🔹 Lokalt välj-läge för GENERATE-tabben
  const [isChoosing, setIsChoosing] = useState(false);
  const [localSelection, setLocalSelection] = useState({
    top: null,
    bottom: null,
    shoes: null,
    accessories: null,
  });

  useEffect(() => {
    console.log("🔥 FRONTEND outfitResults:", outfitResults);
  }, [outfitResults]);

  const toggleFavorite = (item) => {
    const id = safeId(item.link);

    const formatted = {
      ...item,
      id,
      link: item.link,
      addedAt: Date.now(),
      category: item.category || "uncategorized",
    };

    const exists = favorites.some((f) => f.id === id);
    exists ? removeFavorite(id) : addFavorite(formatted);

    window.dispatchEvent(new Event("favorites-updated"));
  };

  const handleReset = () => {
    setOutfitResults(null);
    resetOutfits();
    setIsChoosing(false);
    setLocalSelection({
      top: null,
      bottom: null,
      shoes: null,
      accessories: null,
    });
  };

  const categories = [
    { key: "top", title: "Top" },
    { key: "bottom", title: "Bottom" },
    { key: "shoes", title: "Shoes" },
    { key: "accessories", title: "Accessories" },
  ];

  const activeCategories = categories.filter(
    (c) => outfitResults?.results?.[c.key]?.length > 0
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 4,
        width: "100%",
      }}
    >
      {!outfitResults ? (
        <Typography variant="body1" sx={{ color: "#323232" }}>
          No outfit generated yet...
        </Typography>
      ) : outfitResults &&
        Object.values(outfitResults).every((arr) => !arr || arr.length === 0) ? (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography sx={{ color: "#333", fontSize: "1.1rem", mb: 2 }}>
            🚫 No items match your filters.
          </Typography>

          {/* OBS: relaxationSuggestions/setFilters måste komma från props/context om du ska använda dem.
              Låter dem stå kvar som du har nu. */}

          <Button
            variant="outlined"
            onClick={handleReset}
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              borderColor: "#3b82f6",
              color: "#3b82f6",
              "&:hover": { borderColor: "#2563eb", color: "#2563eb" },
            }}
          >
            Reset Filters
          </Button>
        </Box>
      ) : (
        <>
          {/* 🔹 Titel över knapparna */}
          <Box
            sx={{
              width: "100%",
              maxWidth: "600px",
              textAlign: "center",
              mb: 1,
              px: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "#3b82f6",
                fontWeight: 600,
                textShadow: "0 0 10px rgba(59,130,246,0.3)",
              }}
            >
              AI Outfit
            </Typography>
          </Box>

          {/* 🔹 Reset + Try-On bredvid varandra */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "16px",
              width: "100%",
              maxWidth: "600px",
              mb: 3,
            }}
          >
            {/* RESET KNAPP */}
            <Button
              variant="contained"
              onClick={handleReset}
              sx={{
                background: "#3b82f6",
                color: "#fff",
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 500,
                fontSize: "1rem",
                padding: "8px 28px",
                "&:hover": { background: "#2563eb" },
              }}
            >
              Reset
            </Button>

            {/* TRY-ON KNAPP */}
            <Button
              variant="contained"
              onClick={() => {
                if (!isChoosing) {
                  // Gå in i välj-läge → nollställ lokal selection
                  console.log("🟦 Entering selection mode (Generate)...");
                  setIsChoosing(true);
                  setLocalSelection({
                    top: null,
                    bottom: null,
                    shoes: null,
                    accessories: null,
                  });
                  return;
                }

                const selectedItems = Object.values(localSelection).filter(Boolean);

                if (selectedItems.length === 0) {
                  console.warn(
                    "⚠️ You must choose at least one item before trying on"
                  );
                  return;
                }

                selectedItems.forEach((item) =>
                  console.log(`${item.name} is on!`)
                );

                // Skicka endast LOKALT val (från denna tab) till global context
                setTryOnSelection(localSelection);

                // Byt tab →
                window.dispatchEvent(
                  new CustomEvent("switch-tab", { detail: { tab: "tryon" } })
                );

                // Lokalt UI kan nollställas (komponenten unmountas ändå)
                setIsChoosing(false);
                setLocalSelection({
                  top: null,
                  bottom: null,
                  shoes: null,
                  accessories: null,
                });
              }}
              sx={{
                background: "#3b82f6",
                color: "#fff",
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 500,
                fontSize: "1rem",
                padding: "8px 20px",
                "&:hover": { background: "#2563eb" },
              }}
            >
              {isChoosing ? "Go to Try-On" : "Choose for Try-On"}
            </Button>

            {isChoosing && (
              <Button
                variant="outlined"
                onClick={() => {
                  setIsChoosing(false);
                  setLocalSelection({
                    top: null,
                    bottom: null,
                    shoes: null,
                    accessories: null,
                  });
                }}
              >
                Cancel
              </Button>
            )}
          </Box>

          {/* 🔹 Själva resultatlistan */}
          <div
            className="results-box"
            style={{ width: "100%", maxWidth: "600px" }}
          >
            {activeCategories.map((cat) => {
              const products = outfitResults?.results?.[cat.key] || [];

              return (
                <div key={cat.key} className="category">
                  <h4>{cat.title}</h4>

                  {products.length === 0 ? (
                    <p>No items found.</p>
                  ) : (
                    <div className="product-list">
                      {products.map((p, i) => {
                        const product = { ...p, category: cat.key };
                        const productId = safeId(product.link);
                        const isFav = favorites.some((f) => f.id === productId);
                        const isSelected =
                          localSelection[cat.key]?.link === product.link;

                        return (
                          <div
                            key={i}
                            className={`product-item ${isSelected ? "selected" : ""
                              }`}
                            onClick={() => {
                              if (!isChoosing) {
                                if (product.link)
                                  window.open(product.link, "_blank");
                                return;
                              }

                              // Välj detta plagg lokalt
                              setLocalSelection((prev) => ({
                                ...prev,
                                [cat.key]: product,
                              }));
                            }}
                          >
                            <div className="product-image-wrapper">
                              <img
                                src={product.image}
                                alt={product.name}
                                onError={(e) =>
                                (e.currentTarget.src =
                                  "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg")
                                }
                              />

                              {/* ❤️ FAVORIT-HJÄRTA */}
                              <div
                                className={`heart-icon ${isFav ? "favorited" : ""
                                  }`}
                                title={
                                  isFav
                                    ? "Remove from favorites"
                                    : "Add to favorites"
                                }
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(product);
                                }}
                              >
                                {isFav ? (
                                  <FaHeart color="#ff0000" />
                                ) : (
                                  <FaRegHeart color="#999" />
                                )}
                              </div>

                              {/* ❌ REMOVE-FROM-TRY-ON (endast synlig om valt) */}
                              {isSelected && (
                                <div
                                  className="remove-tryon"
                                  title="Remove from Try-On"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setLocalSelection((prev) => ({
                                      ...prev,
                                      [cat.key]: null,
                                    }));
                                  }}
                                >
                                  ✕
                                </div>
                              )}
                            </div>

                            <div className="product-info">
                              <h5>{product.name}</h5>
                              <p>{product.price}</p>

                              <small
                                style={{
                                  color: product.affiliate
                                    ? "#22c55e"
                                    : "#999",
                                  fontSize: "0.8rem",
                                  textAlign: "center",
                                  width: "100%",
                                  marginTop: "auto",
                                }}
                              >
                                {product.affiliate
                                  ? "Affiliate Product"
                                  : "Non-affiliate Result"}
                              </small>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </Box>
  );
}
