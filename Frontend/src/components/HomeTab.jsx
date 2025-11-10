import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function HomeTab({ setTabValue, setSharedPrompt }) {
  const navigate = useNavigate();

  const examplePrompts = [
    "Streetwear outfit for autumn",
    "Minimalist all-black summer look",
    "Classy date night style for men",
    "Cozy oversized winter fit",
    "Y2K aesthetic outfit for girls",
    "Elegant all-white beach outfit",
  ];

  const handleExampleClick = (promptText) => {
    navigate("/generate", { state: { promptText } }); // 👈 måste se ut så
  };
  return (
    <>
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          fontWeight: 550,
          color: "#3b82f6",
          textShadow: "0 0 10px rgba(59,130,246,0.6)",
        }}
      >
        Welcome to ClotheSpin {" "}
        <span
          style={{
            color: "#22c55e", // 👕 röd färg
            textShadow: "0 0 10px rgba(34, 197, 94, 0.4)", // 🔥 röd glow
          }}
        >
          👕
        </span>
      </Typography>

      <Typography sx={{ textAlign: "center", mt: 2, color: "#323232" }}>
        The AI-powered fashion assistant that creates outfits from your words.
      </Typography>

      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          mt: 25,
          fontWeight: 700,
          color: "#3b82f6",
          textShadow: "0 0 12px rgba(59,130,246,0.6)",
        }}
      >

        Describe your dream outfit.
      </Typography>

      <Typography
        sx={{
          textAlign: "center",
          color: "#323232",
          mt: 2,
          maxWidth: "700px",
          mx: "auto",
        }}
      >
        Type your style, mood, or event — and our AI will generate a complete outfit,
        with real clothing suggestions from top brands.
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 3,
          mt: 4,
        }}
      >
        <Box
          sx={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(59,130,246,0.2)",
            borderRadius: "12px",
            padding: "1.5rem",
            width: "260px",
            textAlign: "center",
            boxShadow: "0 0 20px rgba(59,130,246,0.1)",
          }}
        >
          <Typography sx={{ color: "#3b82f6", fontWeight: 600 }}>🧠 Smart AI</Typography>
          <Typography sx={{ color: "#323232", mt: 1, fontSize: "0.95rem" }}>
            Our algorithm understands your style and finds real items that match.
          </Typography>
        </Box>

        <Box
          sx={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(59,130,246,0.2)",
            borderRadius: "12px",
            padding: "1.5rem",
            width: "260px",
            textAlign: "center",
            boxShadow: "0 0 20px rgba(59,130,246,0.1)",
          }}
        >
          <Typography sx={{ color: "#3b82f6", fontWeight: 600 }}>🛍️ Real Products</Typography>
          <Typography sx={{ color: "#323232", mt: 1, fontSize: "0.95rem" }}>
            Every piece is linked to real stores — ready to buy or get inspired by.
          </Typography>
        </Box>

        <Box
          sx={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(59,130,246,0.2)",
            borderRadius: "12px",
            padding: "1.5rem",
            width: "260px",
            textAlign: "center",
            boxShadow: "0 0 20px rgba(59,130,246,0.1)",
          }}
        >
          <Typography sx={{ color: "#3b82f6", fontWeight: 600 }}>🎨 Personalized</Typography>
          <Typography sx={{ color: "#323232", mt: 1, fontSize: "0.95rem" }}>
            Save your favorite outfits and build your personal style identity.
          </Typography>
        </Box>
      </Box>


      {/* --- Example Prompts --- */}
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Typography
          sx={{
            color: "#3b82f6",
            fontWeight: 600,
            fontSize: "1.3rem",
            mt: 25,
          }}
        >
          Try these example prompts 👇
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "0.8rem",
            mt: 2,
          }}
        >
          {examplePrompts.map((promptText, i) => (
            <Box
              key={i}
              onClick={() => handleExampleClick(promptText)}
              sx={{
                background: "#f3f4f6",
                border: "1px solid #e5e7eb",
                color: "#3b82f6",
                padding: "0.6rem 1.2rem",
                borderRadius: "20px",
                fontSize: "0.95rem",
                cursor: "pointer",
                transition: "all 0.25s ease",
                "&:hover": {
                  background: "#e0e7ff",
                  boxShadow: "0 4px 10px rgba(30,64,175,0.15)",
                },
              }}
            >
              {promptText}
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ mt: 10, textAlign: "center" }}>
        <Typography
          sx={{
            color: "#3b82f6",
            fontWeight: 700,
            fontSize: "1.8rem",
            mt: 23,
            mb: 5,
            textShadow: "0 0 18px rgba(59,130,246,0.8)", // 💙 Glow på rubriken
            letterSpacing: "0.03em",
          }}
        >
          How it works 🪄
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "stretch",
            gap: "2rem",
            flexWrap: "wrap", // gör att de radbryts på små skärmar
            px: 3,
          }}
        >
          {[
            { step: "1", text: "Describe your style or occasion" },
            { step: "2", text: "AI finds matching clothes" },
            { step: "3", text: "Shop or save your outfit" },
          ].map((s, i) => (
            <Box
              key={i}
              sx={{
                width: "250px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(59,130,246,0.25)",
                borderRadius: "12px",
                padding: "1.8rem 1.4rem",
                boxShadow: `
            0 4 14px rgba(59,130,246,0.12),
            inset 0 4 10px rgba(59,130,246,0.08)
          `,

              }}
            >
              <Typography
                sx={{
                  color: "#3b82f6",
                  fontSize: "2rem",
                  fontWeight: 700,
                  mb: 1,
                  textShadow: "0 0 12px rgba(59,130,246,0.8)", // 💙 Glow på siffrorna
                }}
              >
                {s.step}
              </Typography>
              <Typography sx={{ color: "#323232", fontSize: "1rem" }}>
                {s.text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>



    </>
  )
}
