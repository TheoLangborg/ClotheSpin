import React, { useState, useEffect } from "react";
import {
  Button,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  IconButton,
} from "@mui/material";
import {
  Logout,
  LoginOutlined,
  Settings,
  Person,
  HelpOutline,
  InfoOutlined,
  AccountCircle,
} from "@mui/icons-material";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import FavoriteIcon from "./FavoriteIcon";
import { useOutfit } from "./OutfitContext";

export default function ProfileMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [favCount, setFavCount] = useState(0);
  const location = useLocation();
  const isFavoritesPage = location.pathname === "/favorites";
  const { favorites } = useOutfit();

  useEffect(() => {
    setFavCount(favorites.length);
  }, [favorites]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    handleMenuClose();
  };

  // Max 12 tecken på display name / email prefix
  const formatUsername = (name) => {
    if (!name) return "User";
    return name.length > 12 ? name.slice(0, 12) + "…" : name;
  };

  return (

    <>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <FavoriteIcon
          count={favCount}
          active={isFavoritesPage}
          onClick={() => navigate("/favorites")}
        />

        {/* LOGIN BUTTON */}
        {!user && (
          <Button
            variant="outlined"
            onClick={() => window.dispatchEvent(new Event("open-login"))}
            sx={{
              borderColor: "#3b82f6",
              color: "#3b82f6",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "10px",
              "&:hover": {
                background: "rgba(59,130,246,0.1)",
                boxShadow: "0 0 12px rgba(59,130,246,0.6)",
              },
            }}
          >
            Login
          </Button>
        )}

        {/* USERNAME + PROFILE ICON */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {user && (
            <span
              style={{
                color: "#3b82f6",
                fontWeight: 600,
                fontSize: "0.95rem",
                textShadow: "0 0 6px rgba(59,130,246,0.6)",
                userSelect: "none",
              }}
            >
              {formatUsername(user.displayName || user.email.split("@")[0])}
            </span>
          )}

          <IconButton onClick={handleMenuOpen}>
            <AccountCircle
              sx={{
                color: user ? "#3b82f6" : "#777",
                fontSize: 36,
                "&:hover": { filter: "drop-shadow(0 0 6px #3b82f6)" },
              }}
            />
          </IconButton>
        </div>
      </div>

      {/* 🔹 Profilmeny */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 4,
          sx: {
            mt: 1.5,
            borderRadius: 2,
            overflow: "visible",
            background: "rgba(15,15,15,0.95)",
            color: "#e5e7eb",
            backdropFilter: "blur(6px)",
            boxShadow: "0 0 25px rgba(59,130,246,0.25)",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {user
          ? [
            <MenuItem key="info" disabled sx={{ opacity: 0.9 }}>
              <div>
                <p style={{ fontWeight: 600, margin: 0 }}>
                  {user?.displayName || "Unnamed User"}
                </p>
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "gray",
                    margin: 0,
                    marginTop: "2px",
                  }}
                >
                  {user?.email}
                </p>
              </div>
            </MenuItem>,

            <Divider key="div1" sx={{ borderColor: "rgba(255,255,255,0.1)" }} />,

            <MenuItem
              key="edit"
              onClick={() => {
                handleMenuClose();
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new Event("open-profile"));
                }
              }}
            >
              <ListItemIcon>
                <Person sx={{ color: "#3b82f6" }} />
              </ListItemIcon>
              Edit Profile
            </MenuItem>,

            <MenuItem key="settings">
              <ListItemIcon>
                <Settings sx={{ color: "#3b82f6" }} />
              </ListItemIcon>
              Settings
            </MenuItem>,

            <MenuItem key="help">
              <ListItemIcon>
                <HelpOutline sx={{ color: "#3b82f6" }} />
              </ListItemIcon>
              Help
            </MenuItem>,

            <MenuItem key="version">
              <ListItemIcon>
                <InfoOutlined sx={{ color: "#3b82f6" }} />
              </ListItemIcon>
              Version 1.0.0
            </MenuItem>,

            <Divider key="div2" sx={{ borderColor: "rgba(255,255,255,0.1)" }} />,

            <MenuItem
              key="logout"
              onClick={handleLogout}
              sx={{ color: "#f87171" }}
            >
              <ListItemIcon>
                <Logout sx={{ color: "#f87171" }} />
              </ListItemIcon>
              Log out
            </MenuItem>,
          ]
          : [
            <MenuItem
              key="login"
              onClick={() => {
                handleMenuClose();
                // Vi skickar signalen upp till TopTabs
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new Event("open-login"));
                }
              }}
            >
              <ListItemIcon>
                <LoginOutlined sx={{ color: "#3b82f6" }} />
              </ListItemIcon>
              Login
            </MenuItem>,
            <Divider
              key="div3"
              sx={{ borderColor: "rgba(255,255,255,0.1)" }}
            />,
            <MenuItem key="version">
              <ListItemIcon>
                <InfoOutlined sx={{ color: "#3b82f6" }} />
              </ListItemIcon>
              Version 1.0.0
            </MenuItem>,
          ]}
      </Menu>
    </>
  );
}
