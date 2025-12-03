// src/components/FavoritesTab.jsx
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
} from "@mui/material";
import { FaHeart } from "react-icons/fa";
import { useOutfit } from "./OutfitContext";
import { useState, useMemo } from "react";
import "./FavoriteTab.css";

export default function FavoritesTab() {
  const {
    favorites,
    removeFavorite,
    setTryOnSelection,   // 🔵 global endast för TryOnTab
  } = useOutfit();

  const [sortType, setSortType] = useState("none");
  const [category, setCategory] = useState("all");
  const [confirmOpen, setConfirmOpen] = useState(false);

  // 🔹 Lokalt välj-läge för FAVORITES-tab
  const [isChoosing, setIsChoosing] = useState(false);
  const [localSelection, setLocalSelection] = useState({
    top: null,
    bottom: null,
    shoes: null,
    accessories: null,
  });

  // 🧮 Sortering + filter
  const displayedFavorites = useMemo(() => {
    let list = [...favorites];

    if (category !== "all") {
      list = list.filter((item) => item.category === category);
    }

    if (sortType === "price-low") {
      list.sort(
        (a, b) =>
          parseFloat(a.price.replace(/[^0-9.]/g, "")) -
          parseFloat(b.price.replace(/[^0-9.]/g, ""))
      );
    }

    if (sortType === "price-high") {
      list.sort(
        (a, b) =>
          parseFloat(b.price.replace(/[^0-9.]/g, "")) -
          parseFloat(a.price.replace(/[^0-9.]/g, ""))
      );
    }

    if (sortType === "newest") {
      list.sort((a, b) => b.addedAt - a.addedAt);
    }

    if (sortType === "oldest") {
      list.sort((a, b) => a.addedAt - b.addedAt);
    }

    return list;
  }, [favorites, sortType, category]);

  // 🧹 CLEAR ALL
  const clearAll = () => {
    localStorage.setItem("favorites", JSON.stringify([]));
    window.dispatchEvent(new Event("favorites-updated"));
    window.location.reload();
  };

  // 🟥 INGA FAVORITER?
  if (favorites.length === 0) {
    return (
      <>
        <Typography
          sx={{
            textAlign: "center",
            color: "#3b82f6",
            mt: 1,
            fontSize: "1.6rem",
            textShadow: "0 0 12px rgba(34, 105, 220, 0.8)",
            fontWeight: 600,
            letterSpacing: "1px",
          }}
        >
          Favorites ❤️
        </Typography>

        <Typography
          sx={{
            textAlign: "center",
            color: "#323232",
            mt: 10,
            fontSize: "1.2rem",
          }}
        >
          You haven’t added any favorites yet
        </Typography>
      </>
    );
  }

  return (
    <Box sx={{ width: "100%", mt: 5 }}>
      {/* HEADER ---------------------- */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          px: 2,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {/* Title */}
        <Typography
          sx={{
            color: "#3b82f6",
            fontSize: "1.8rem",
            fontWeight: 700,
            textShadow: "0 0 10px rgba(59,130,246,0.4)",
          }}
        >
          Favorites ({favorites.length})
        </Typography>

        {/* SORT */}
        <Select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="none">Sort by…</MenuItem>
          <MenuItem value="price-low">Price: Low → High</MenuItem>
          <MenuItem value="price-high">Price: High → Low</MenuItem>
          <MenuItem value="newest">Newest First</MenuItem>
          <MenuItem value="oldest">Oldest First</MenuItem>
        </Select>

        {/* CATEGORY FILTER */}
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="all">All Categories</MenuItem>
          <MenuItem value="top">Top</MenuItem>
          <MenuItem value="bottom">Bottom</MenuItem>
          <MenuItem value="shoes">Shoes</MenuItem>
          <MenuItem value="accessories">Accessories</MenuItem>
        </Select>

        {/* CLEAR ALL */}
        <Button
          variant="contained"
          disableRipple
          disableElevation
          color="error"
          onClick={() => setConfirmOpen(true)}
          sx={{
            fontWeight: 600,
            borderRadius: 2,

            "&:hover": {
              background: "#c40b0bff !important",
              boxShadow: "none",
            },
            "&:active": {
              background: "#c40b0bff !important",
              boxShadow: "none",
            },
            "&:focus": {
              outline: "none",
            },
            "&:focus-visible": {
              outline: "none",
            }
          }}
        >
          Clear All
        </Button>

        {/* CHOOSE / GO TO TRY-ON */}
        <Button
          variant="contained"
          disableRipple
          disableElevation
          onClick={() => {
            if (!isChoosing) {
              console.log("🟦 Entering selection mode (Favorites)...");
              setIsChoosing(true);
              setLocalSelection({
                top: null,
                bottom: null,
                shoes: null,
                accessories: null,
              });
              return;
            }

            const selected = Object.values(localSelection).filter(Boolean);

            console.group("👗 TRY-ON START (Favorites)");
            selected.forEach((item) =>
              console.log(`${item.category}: ${item.name}`)
            );
            console.groupEnd();

            if (selected.length === 0) {
              console.warn("No items selected for try-on.");
              return;
            }

            // Skicka endast favorites-val till global tryOnSelection
            setTryOnSelection(localSelection);

            window.dispatchEvent(
              new CustomEvent("switch-tab", { detail: { tab: "tryon" } })
            );

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
            padding: "8px 24px",

            "&:hover": {
              background: "#2563eb !important",
              boxShadow: "none",
            },
            "&:active": {
              background: "#1d4ed8 !important",
              boxShadow: "none",
            },
            "&:focus": {
              outline: "none",
            },
            "&:focus-visible": {
              outline: "none",
            }
          }}
        >
          {isChoosing ? "Go to Try-On" : "Choose for Try-On"}
        </Button>

        {isChoosing && (
          <Button
            disableRipple
            disableElevation
            variant="outlined"
            sx={{

              "&:hover": {
                background: "none",   // ren hover, ingen mörk overlay
                boxShadow: "#111",

              },
              "&:active": {
                background: "none",
                boxShadow: "none",
              }
            }}

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

      {/* GRID ---------------------- */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 3,
        }}
      >
        {displayedFavorites.map((item, i) => {
          const isSelected =
            localSelection[item.category]?.id === item.id;

          return (
            <Card
              key={i}
              className={`favorite-card ${isSelected ? "selected" : ""}`}
              onClick={() => {
                if (!isChoosing) {
                  window.open(item.link, "_blank");
                  return;
                }

                setLocalSelection((prev) => ({
                  ...prev,
                  [item.category]: item,
                }));
              }}
            >
              <CardMedia
                component="img"
                height="240"
                image={item.image}
                alt={item.name}
                sx={{ height: 220, width: "100%", objectFit: "cover" }}
              />

              {/* ❌ REMOVE TRY-ON */}
              {isSelected && (
                <div
                  className="tryon-remove-x"
                  title="Remove from Try-On"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLocalSelection((prev) => ({
                      ...prev,
                      [item.category]: null,
                    }));
                  }}
                >
                  ✕
                </div>
              )}

              {/* REMOVE FROM FAVORITES */}
              <Tooltip title="Remove from favorites">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFavorite(item.id);
                  }}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    color: "#ff0000",
                  }}
                >
                  <FaHeart />
                </IconButton>
              </Tooltip>

              <CardContent sx={{ textAlign: "center" }}>
                <Typography sx={{ fontWeight: 600, color: "#323232" }}>
                  {item.name}
                </Typography>
                <Typography sx={{ color: "#3b82f6", mt: 0.5 }}>
                  {item.price}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {/* CONFIRM DELETE MODAL ---------------------- */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Clear all favorites?</DialogTitle>
        <DialogContent>
          This will remove all saved items. Are you sure?
        </DialogContent>
        <DialogActions>
          <Button
            disableRipple
            disableElevation
            onClick={() => setConfirmOpen(false)}
            sx={{
              textTransform: "none",
              "&:hover": {
                background: "rgba(59,130,246,0.08) !important", // ljus blå-ish hover, ingen mörk overlay
              },
              "&:focus": { outline: "none" },
              "&:focus-visible": { outline: "none" }
            }}
          >
            Cancel
          </Button>
          
          <Button
            color="error"
            disableRipple
            disableElevation
            onClick={clearAll}
            sx={{
              textTransform: "none",
              "&:hover": {
                background: "rgba(255,0,0,0.1) !important", // ljus röd hover
              },
              "&:focus": { outline: "none" },
              "&:focus-visible": { outline: "none" }
            }}
          >
            Yes, remove all
          </Button>
        </DialogActions>
      </Dialog>
    </Box >
  );
}
