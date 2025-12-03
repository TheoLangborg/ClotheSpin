import React from "react";
import "./App.css";
import TopTabs from "./components/Tabs";
import { Routes, Route } from "react-router-dom";
import HomeTab from "./components/HomeTab";
import GOTab from "./components/GOTab";
import FavoritesTab from "./components/FavoritesTab";
import AboutTab from "./components/AboutTab";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import TryOnTab from "./components/TryOnTab";

import { SnackbarProvider, useSnackbar } from "notistack";
import { X } from "lucide-react";

// ✅ Close button component (separate!)
function CloseButton({ snackbarKey }) {
  const { closeSnackbar } = useSnackbar();

  return (
    <X
      size={20}
      color="white"
      style={{
        cursor: "pointer",
        marginLeft: "10px",
      }}
      onClick={() => closeSnackbar(snackbarKey)}
    />
  );
}

// ===============================
// ✅ HUVUDKOMPONENTEN — App()
// ===============================
function App() {
  return (
   
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      autoHideDuration={null} // ❗ stannar tills man klickar
      preventDuplicate
      action={(key) => <CloseButton snackbarKey={key} />}
      sx={{
        "& .SnackbarItem-contentRoot": {
          backgroundColor: "#ef4444 !important", // röd
          color: "white",
          borderRadius: "10px",
          padding: "12px 18px",
          fontSize: "1rem",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
        },
      }}
    >

      <ScrollToTop />
      <TopTabs />

      <div
        style={{
          minHeight: "85vh",
          paddingTop: "110px", // navbar spacing
        }}
      >
        <Routes>
          <Route path="/" element={<HomeTab />} />
          <Route path="/generate" element={<GOTab />} />
          <Route path="/tryon" element={<TryOnTab />} />
          <Route path="/favorites" element={<FavoritesTab />} />
          <Route path="/about" element={<AboutTab />} />
        </Routes>
      </div>

      <div style={{ marginTop: "15rem" }}>
        <Footer />
      </div>

    </SnackbarProvider>
  );
}

export default App;
