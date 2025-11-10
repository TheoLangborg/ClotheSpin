import { useEffect, useState } from "react";
import {
  AppBar,
  Tabs,
  Tab,
  Toolbar,
  Typography,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import ProfileMenu from "./ProfileMenu"
import LoginModal from "./LoginModal"
import ProfileModal from "./ProfileModal"

export default function TopTabs() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogin, setShowLogin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // 🔹 Flikar
  const currentTab =
    location.pathname === "/about"
      ? 3
      : location.pathname === "/favorites"
        ? 2
        : location.pathname === "/generate"
          ? 1
          : 0;

  // 🔹 Scrolla upp varje gång tab ändras
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const handleOpenLogin = () => setShowLogin(true);
    const handleOpenProfile = () => setShowProfile(true);

    window.addEventListener("open-login", handleOpenLogin);
    window.addEventListener("open-profile", handleOpenProfile);

    return () => {
      window.removeEventListener("open-login", handleOpenLogin);
      window.removeEventListener("open-profile", handleOpenProfile);
    };
  }, []);

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          background: "transparent",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
          borderBottom: "1px solid rgba(0, 150, 255, 0.15)",
          color: "#e5e7eb",
          pointerEvents: "auto",
          zIndex: 1100,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* 🔹 LOGO */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: "1.4rem",
              color: "#4389faff",
              textShadow: "0 0 8px rgba(34, 105, 220, 0.8)",
              letterSpacing: "1px",
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            ClotheSpin
          </Typography>

          {/* 🔹 FLIKAR */}
          <Tabs
            value={currentTab}
            onChange={(e, newValue) => {
              if (newValue === 0) navigate("/");
              if (newValue === 1) navigate("/generate");
              if (newValue === 2) navigate("/favorites");
              if (newValue === 3) navigate("/about");
            }}
            textColor="inherit"
            TabIndicatorProps={{
              style: {
                background: "#999999",
                height: "3px",
                borderRadius: "3px",
              },
            }}
            sx={{
              "& .MuiTab-root": {
                color: "#000000ff",
                textTransform: "none",
                fontWeight: 500,
                transition: "all 0.25s ease",
                backgroundColor: "transparent !important",
              },
              "& .MuiTab-root:hover": {
                color: "#3b82f6",
                textShadow: "0 0 8px rgba(59,130,246,0.7)",
                backgroundColor: "transparent !important",
              },
              "& .Mui-selected": {
                color: "#3b82f6",
                textShadow: "0 0 12px rgba(59,130,246,0.9)",
                backgroundColor: "transparent !important",
              },
            }}
          >
            <Tab label="Home" />
            <Tab label="Generate Outfit" />
            <Tab label="Favorites" />
            <Tab label="About" />
          </Tabs>
          <ProfileMenu />
        </Toolbar>
        {/* 🔹 Klickblock bakom AppBar */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "64px", // samma höjd som AppBar
            zIndex: 1000,
            pointerEvents: "none",
            background: "transparent",
          }}
        ></div>

      </AppBar>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </>
  );
}
