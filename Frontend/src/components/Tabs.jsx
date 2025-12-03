import { useEffect, useRef, useState } from "react";
import {
  AppBar,
  Tabs,
  Tab,
  Toolbar,
  Typography,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";
import LoginModal from "./LoginModal";
import ProfileModal from "./ProfileModal";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export default function TopTabs() {
  const navigate = useNavigate();
  const location = useLocation();
  const tabsRef = useRef(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showArrows, setShowArrows] = useState(false);

  // 🔹 Flikar
  let currentTab =
    location.pathname === "/about"
      ? 3
      : location.pathname === "/tryon"
        ? 2
        : location.pathname === "/generate"
          ? 1
          : location.pathname === "/"
            ? 0
            : false; // <-- alla andra routes (t.ex. /favorites)

  // 🔹 Scrolla upp varje gång tab ändras
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // 🔹 Lyssna på events för login/profil
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
  
  // 🔹 Lyssna på event från result-sidan
  useEffect(() => {
    const handleSwitchTab = (e) => {
      if (!e.detail || !e.detail.tab) return;

      if (e.detail.tab === "tryon") navigate("/tryon");
      if (e.detail.tab === "generate") navigate("/generate");
      if (e.detail.tab === "home") navigate("/");
      if (e.detail.tab === "about") navigate("/about");
    };

    window.addEventListener("switch-tab", handleSwitchTab);
    return () => window.removeEventListener("switch-tab", handleSwitchTab);
  }, []);

  // 🔹 Kolla om tabsen får plats (visa pilar om de inte gör det)
  useEffect(() => {
    const check = () => {
      const el = tabsRef.current;
      if (!el) return;
      const needsScroll = el.scrollWidth > el.clientWidth + 1;

      setShowArrows(needsScroll);
    };

    const raf = requestAnimationFrame(() => setTimeout(check, 300));
    window.addEventListener("resize", check);

    const ro = new ResizeObserver(check);
    if (tabsRef.current) ro.observe(tabsRef.current);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", check);
      ro.disconnect();
    };
  }, []);

  // 🔹 Return JSX normalt
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
          zIndex: 1100,
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            overflow: "visible",     // 🟢 viktiga ändringen
          }}
        >
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

          {/* Scrollande Tabs + pilar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              overflow: "visible",
              minWidth: 0,
              gap: 8,
              maxWidth: "100%",
              flexShrink: 1,
            }}
          >
            {/* 🔸 Vänsterpil */}
            {showArrows && (
              <ChevronLeftIcon
                onClick={() => {
                  const el = tabsRef.current;
                  if (el) el.scrollBy({ left: -150, behavior: "smooth" });

                  // 🔹 Byt till föregående tab
                  const next = Math.max(currentTab - 1, 0);
                  if (next !== currentTab) {
                    if (next === 0) navigate("/");
                    if (next === 1) navigate("/generate");
                    if (next === 2) navigate("/tryon");
                    if (next === 3) navigate("/about");
                  }
                }}
                sx={{
                  color: "#3b82f6",
                  fontSize: "2rem",
                  opacity: currentTab === 0 ? 0.3 : 1,
                  cursor: currentTab === 0 ? "default" : "pointer",
                  transition: "opacity 0.2s",
                }}
              />
            )}

            <Tabs
              value={currentTab}
              onChange={(e, newValue) => {
                if (newValue === 0) navigate("/");
                if (newValue === 1) navigate("/generate");
                if (newValue === 2) navigate("/tryon");
                if (newValue === 3) navigate("/about");
              }}
              variant="standard"
              scrollButtons={false}
              allowScrollButtonsMobile={false}
              textColor="inherit"
              TabIndicatorProps={{
                style: {
                  background: "#999999",
                  height: "3px",
                  borderRadius: "3px",
                },
              }}
              // 👉 Callback-ref som hittar den faktiska scroller-diven
              ref={(node) => {
                if (!node) return;
                const scroller = node.querySelector(".MuiTabs-scroller");
                if (scroller) tabsRef.current = scroller;
              }}
              sx={{

                "& .MuiTabs-flexContainer": {
                  flexWrap: "nowrap",
                },
                "& .MuiTab-root": {
                  flex: "0 0 auto",
                  minWidth: "max-content",
                  textTransform: "none",
                  fontWeight: 500,
                  color: "#000",
                  padding: "12px 16px",
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
                "& .Mui-focusVisible": {
                  backgroundColor: "transparent !important",   // ✅ fixar när tabb är i fokus
                },
              }}
            >
              <Tab label="Home" />
              <Tab label="Generate Outfit" />
              <Tab label="Virtual Try-On" />
              <Tab label="About" />
            </Tabs>

            {/* 🔸 Högerpil */}
            {showArrows && (
              <ChevronRightIcon
                onClick={() => {
                  const el = tabsRef.current;
                  if (el) el.scrollBy({ left: 150, behavior: "smooth" });

                  // 🔹 Byt till nästa tab
                  const next = Math.min(currentTab + 1, 4);
                  if (next !== currentTab) {
                    if (next === 0) navigate("/");
                    if (next === 1) navigate("/generate");
                    if (next === 2) navigate("/tryon");
                    if (next === 3) navigate("/about");
                  }
                }}
                sx={{
                  color: "#3b82f6",
                  fontSize: "2rem",
                  opacity: currentTab === 4 ? 0.3 : 1,
                  cursor: currentTab === 4 ? "default" : "pointer",
                  transition: "opacity 0.2s",
                }}
              />
            )}
          </div>
          <div style={{ flexshrink: 0, marginRight: "40px" }}>
            <ProfileMenu />
          </div>
        </Toolbar>
      </AppBar>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </>
  );
}
