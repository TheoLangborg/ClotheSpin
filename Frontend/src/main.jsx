import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { OutfitProvider } from "./components/OutfitContext"; // 👈 importera här
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <React.StrictMode>
      <OutfitProvider>   {/* 👈 wrappa hela appen */}
        <App />
      </OutfitProvider>
    </React.StrictMode>
  </BrowserRouter >
);
