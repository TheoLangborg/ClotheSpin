import { Box, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function Footer() {
  const links = [
    { to: "/privacy", label: "Privacy" },
    { to: "/terms", label: "Terms" },
    { to: "/about", label: "Contact" },
  ];

  return (
    <Box
  component="footer"
  sx={{
    width: "100%",
    borderTop: "1px solid rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    py: 3,
    mt: 6,
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(8px)",
    color: "#333",
    fontSize: "0.9rem",
  }}
>
  <Typography variant="body2" sx={{ mb: 1 }}>
    Built by <strong>Theo Langborg</strong> © 2025 — ClotheSpin
  </Typography>
  <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
    <a href="#" style={{ color: "#333", textDecoration: "none" }}>Privacy</a>
    <span style={{ color: "#aaa" }}>|</span>
    <a href="#" style={{ color: "#333", textDecoration: "none" }}>Terms</a>
    <span style={{ color: "#aaa" }}>|</span>
    <a href="/about" style={{ color: "#333", textDecoration: "none" }}>Contact</a>
  </Box>
</Box>

  );
}
