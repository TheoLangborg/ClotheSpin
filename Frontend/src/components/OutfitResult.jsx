// src/components/OutfitResult.jsx
import React, { useState, useEffect } from "react";
import "./OutfitResult.css"; // du kan lägga CSS här separat
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useOutfit } from "./OutfitContext"
import { Button, Box, Typography } from "@mui/material";



export default function OutfitResult() {
  const { outfitResults, setOutfitResults, resetOutfits } = useOutfit();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const handleReset = () => {
    setOutfitResults(null);
    resetOutfits();
  };

  const toggleFavorite = (item) => {
    const exists = favorites.some((f) => f.link === item.link);
    if (exists) setFavorites(favorites.filter((f) => f.link !== item.link));
    else setFavorites([...favorites, item]);
  };

  const getCategoryProducts = (category) => {
    if (!outfitResults) return [];
    if (outfitResults.results && outfitResults.results[category])
      return outfitResults.results[category];
    if (outfitResults[category]) return outfitResults[category];
    return [];
  };

  const categories = [
    { key: "top", title: "Top" },
    { key: "bottom", title: "Bottom" },
    { key: "shoes", title: "Shoes" },
    { key: "accessories", title: "Accessories" },
  ];

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
      ) : (
        <>
          {/* 🔹 Titel + Reset-knapp */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              maxWidth: "600px",
              mb: 2,
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
          </Box>

          {/* 🔹 Själva resultatlistan */}
          <div className="results-box" style={{ width: "100%", maxWidth: "600px" }}>
            {categories.map((cat) => {
              const products = getCategoryProducts(cat.key).slice(0, 3);
              return (
                <div key={cat.key} className="category">
                  <h4>{cat.title}</h4>
                  {products.length === 0 ? (
                    <p>No items found.</p>
                  ) : (
                    <div className="product-list">
                      {products.map((p, i) => {
                        const isFav = favorites.some((f) => f.link === p.link);
                        return (
                          <div
                            key={i}
                            className="product-item"
                            onClick={() => p.link && window.open(p.link, "_blank")}
                          >
                            <div className="product-image-wrapper">
                              <img
                                src={p.image}
                                alt={p.name}
                                onError={(e) =>
                                (e.currentTarget.src =
                                  "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg")
                                }
                              />
                              <div
                                className={`heart-icon ${isFav ? "favorited" : ""}`}
                                title={
                                  isFav ? "Remove from favorites" : "Add to favorites"
                                }
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(p);
                                }}
                              >
                                {isFav ? (
                                  <FaHeart color="#e02424" />
                                ) : (
                                  <FaRegHeart color="#999" />
                                )}
                              </div>
                            </div>
                            <div className="product-info">
                              <div>
                                <h5>{p.name}</h5>
                                <p>{p.price}</p>
                              </div>

                              <small
                                style={{
                                  color: p.affiliate ? "#22c55e" : "#999",
                                  fontSize: "0.8rem",
                                  textAlign: "center",
                                  width: "100%",
                                  marginTop: "auto",
                                }}
                              >
                                {p.affiliate ? "Affiliate Product" : "Non-affiliate Result"}
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
