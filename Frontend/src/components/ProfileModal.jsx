import { Box, TextField, Button, Typography } from "@mui/material";
import { useState } from "react";
import { auth } from "./firebase";
import { updateProfile } from "firebase/auth";

export default function ProfileModal({ onClose }) {
  const [displayName, setDisplayName] = useState(auth.currentUser?.displayName || "");
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    try {
      await updateProfile(auth.currentUser, { displayName });
      setMessage("✅ Profile updated!");
      setTimeout(() => onClose(), 1000);
    } catch (err) {
      setMessage("⚠️ Something went wrong. Please try again.");
    }
  };

  return (
    <Box
      onClick={onClose}
      sx={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2500,
      }}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          background: "#fff",
          borderRadius: "16px",
          p: 4,
          width: "300px",
          textAlign: "center",
          boxShadow: "0 4px 40px rgba(0,0,0,0.25)",
        }}
      >
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: 700, color: "#3b82f6" }}
        >
          Edit Profile
        </Typography>

        <TextField
          fullWidth
          label="Display Name"
          variant="outlined"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          sx={{ mb: 2 }}
        />

        {message && (
          <Typography variant="body2" sx={{ mb: 1, color: "#3b82f6" }}>
            {message}
          </Typography>
        )}

        <Button
          variant="contained"
          onClick={handleSave}
          sx={{
            background: "#3b82f6",
            "&:hover": { background: "#2563eb" },
            width: "100%",
            borderRadius: "10px",
          }}
        >
          Save
        </Button>

        <Button
          variant="text"
          onClick={onClose}
          sx={{ mt: 1, color: "#555" }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
}
