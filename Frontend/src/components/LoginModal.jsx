import { Box, Button, TextField, Typography, IconButton, InputAdornment } from "@mui/material";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { auth } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { updateProfile } from "firebase/auth";

export default function LoginModal({ onClose }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState("login"); // "login" eller "register"
  const [username, setUsername] = useState("");

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleSubmit = async () => {
    setError("");
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("✅ Inloggad!");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("✅ Konto skapat!");
      }

      onClose();
    } catch (err) {
      console.error("Firebase error:", err.code);

      let message = "Something went wrong.";

      switch (err.code) {
        case "auth/invalid-email":
          message = "Invalid email address.";
          break;
        case "auth/user-not-found":
          message = "No account found with this email.";
          break;
        case "auth/wrong-password":
          message = "Incorrect password. Please try again.";
          break;
        case "auth/email-already-in-use":
          message = "This email is already in use.";
          break;
        case "auth/weak-password":
          message = "Password should be at least 6 characters.";
          break;
        default:
          message = "Unexpected error occurred. Please try again later.";
      }

      setError(message);
    }

  };

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(6px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          background: "rgba(255,255,255,0.9)",
          borderRadius: "16px",
          p: 4,
          width: "320px",
          boxShadow: "0 4px 40px rgba(0,0,0,0.25)",
          textAlign: "center",
          backdropFilter: "blur(8px)",
        }}
      >

        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: 700, color: "#3b82f6" }}
        >
          {mode === "login" ? "Log in to ClotheSpin" : "Create Account"}
        </Typography>

        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          sx={{ mb: 2 }}
        />

        {mode === "register" && (
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            sx={{ mb: 2 }}
          />
        )}

        <TextField
          fullWidth
          variant="outlined"
          type={showPassword ? "text" : "password"}
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          sx={{ mb: 3 }}

          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={togglePasswordVisibility}
                  edge="end"
                  sx={{
                    color: showPassword ? "#3b82f6" : "#999",
                    "&:hover": { color: "#2563eb" },
                  }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />



        {error && (
          <Typography
            variant="body2"
            color="error"
            sx={{ mb: 1, whiteSpace: "pre-wrap" }}
          >
            {error}
          </Typography>
        )}

        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            background: "#3b82f6",
            "&:hover": { background: "#2563eb" },
            width: "100%",
            borderRadius: "10px",
            textTransform: "none",
          }}
        >
          {mode === "login" ? "Log In" : "Register"}
        </Button>

        <Typography
          variant="body2"
          sx={{ mt: 2, color: "#555", cursor: "pointer" }}
          onClick={() => setMode(mode === "login" ? "register" : "login")}
        >
          {mode === "login"
            ? "No account? Create one"
            : "Already have an account? Log in"}
        </Typography>

        <Typography
          variant="body2"
          sx={{ mt: 1.5, color: "#999", cursor: "pointer" }}
          onClick={onClose}
        >
          Cancel
        </Typography>
      </Box>
    </Box>
  );
}
