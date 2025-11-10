import { useState, useEffect } from "react";
import { Box, Typography, Card, CardMedia, CardContent, IconButton, Tooltip } from "@mui/material";
import { FaHeart } from "react-icons/fa";

export default function FavoritesTab() {
  const [favorites, setFavorites] = useState([]);

  // 🔹 Ladda favoriter vid start
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(saved);
  }, []);

  // 🔹 Ta bort favorit
  const removeFavorite = (item) => {
    const updated = favorites.filter((f) => f.link !== item.link);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  if (favorites.length === 0) {
    return (
      <><Typography
        sx={{
          textAlign: "center",
          color: "#3b82f6",
          mt: 1,
          fontSize: "1.6rem",
          textShadow: "0 0 12px rgba(34, 105, 220, 0.8)",
          fontWeight: 600,
          letterSpacing: "1px",
          zIndex: 10,
        }}
      >
        Favorites{" "}
        <span
          style={{
            color: "#e02424", // ❤️ röd färg
            textShadow: "0 0 10px rgba(224, 36, 36, 0.7)", // 🔥 röd glow
          }}
        >
          ❤️
        </span>
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
        </Typography></>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 3,
        mt: 5,
      }}
    >
      {favorites.map((item, i) => (
        <Card
          key={i}
          sx={{
            position: "relative",
            width: 240,
            borderRadius: 3,
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            cursor: "pointer",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 6px 25px rgba(0,0,0,0.2)",
              transform: "translateY(-5px)",
            },
          }}
          onClick={() => window.open(item.link, "_blank")}
        >
          {/* 🔹 Bild */}
          <CardMedia
            component="img"
            height="240"
            image={item.image}
            alt={item.name}
            sx={{ objectFit: "cover" }}
          />

          {/* ❤️ Hjärta för att ta bort */}
          <Tooltip title="Remove from favorites">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                removeFavorite(item);
              }}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                color: "#e63946",
                transition: "all 0.25s ease",
                "&:hover": {
                  transform: "scale(1.2)",
                  filter: "drop-shadow(0 0 6px rgba(230,57,70,0.6))",
                },
              }}
            >
              <FaHeart />
            </IconButton>
          </Tooltip>

          {/* 🔹 Info */}
          <CardContent sx={{ textAlign: "center" }}>
            <Typography sx={{ fontWeight: 600, color: "#323232" }}>
              {item.name}
            </Typography>
            <Typography sx={{ color: "#3b82f6", mt: 0.5 }}>{item.price}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
