import { Box } from "@mui/material";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Input from "./Input";
import { useOutfit } from "./OutfitContext";
import OutfitResult from "./OutfitResult";

export default function GOTab() {
  const location = useLocation();
  const { prompt, setPrompt } = useOutfit(); // 🔥 HÄR – ANVÄND CONTEXT
  const { outfitResults } = useOutfit();

  // 🔹 Om du kom hit från HomeTab med en prompt
  useEffect(() => {
    if (location.state?.promptText) {
      setPrompt(location.state.promptText);
    }
  }, [location.state, setPrompt]);

  return (
    <Box sx={{ mb: 5 }}>
      {/* 🔥 Input kopplad direkt till contexten */}
      <Input />

      {outfitResults && (
        <OutfitResult />
      )}
    </Box>
  );
}