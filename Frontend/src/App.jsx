import React from "react";
import "./App.css";
import TopTabs from "./components/Tabs";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeTab from "./components/HomeTab";
import GOTab from "./components/GOTab";
import FavoritesTab from "./components/FavoritesTab";
import AboutTab from "./components/AboutTab";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { auth } from "./components/firebase";
import Doll from "./components/Doll"

console.log("Firebase loaded:", auth);

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <TopTabs />

      {/* 🔹 Sidinnehåll med extra padding för att inte ligga bakom navbaren */}
      <div
        style={{
          minHeight: "85vh",
          paddingTop: "110px", // <-- extra utrymme för att inte hamna bakom navbaren
        }}
      >
        <Routes>
          <Route path="/" element={<HomeTab />} />
          <Route path="/generate" element={<GOTab />} /> {/* 🔹 exakt path */}
          <Route path="/tryon" element={<Doll />} />
          <Route path="/favorites" element={<FavoritesTab />} /> {/* 🔹 exakt path */}
          <Route path="/about" element={<AboutTab />} />
        </Routes>
      </div>

      <div style={{ marginTop: "15rem" }}>
        {/* 🔹 Footer längst ner på varje sida */}
        <Footer />
      </div>

    </BrowserRouter>
  );
}

export default App;  