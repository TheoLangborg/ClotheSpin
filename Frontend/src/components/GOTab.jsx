import { Box, Typography } from "@mui/material";
import Doll from "./Doll";
import { useEffect, useState, memo } from "react";
import { useLocation } from "react-router-dom";
import Input from "./Input";


export default function GOTab({ sharedPrompt }) {
  const location = useLocation();     // ✅ hook ska ligga här, inte i return
  const [prompt, setPrompt] = useState("");

  // 🔹 När du kommer hit via HomeTab – läs in promptText
  useEffect(() => {
  if (location.state?.promptText) {
    console.log("✅ Mottagen prompt:", location.state.promptText);
    setPrompt(location.state.promptText);
    // ❌ Inte detta: sendPromptToBackend();
  }
}, [location.state]);


  return (
   <>
      {/* 🔹 DOLL — visas ovanför input */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: -70,
        }}
      >
        <Doll />
      </Box>

      {/* 🔹 INPUT — kopplad till prompt */}
      <Box
        sx={{
          mb: 5,
          
        }}
      >
        <Input defaultPrompt={prompt || sharedPrompt} /> {/* 👈 använder prompten */}
      </Box>
    </>
  );
}
