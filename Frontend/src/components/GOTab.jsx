import { Box, Typography } from "@mui/material";
import { useEffect, useState, memo } from "react";
import { useLocation } from "react-router-dom";
import Input from "./Input";


export default function GOTab({ sharedPrompt }) {
  const location = useLocation();     // ✅ hook ska ligga här, inte i return
  const [prompt, setPrompt] = useState("");

  // 🔹 När du kommer hit via HomeTab – läs in promptText
  useEffect(() => {
    if (location.state?.promptText) {
     
    }
  }, [location.state]);


  return (
    <>
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
