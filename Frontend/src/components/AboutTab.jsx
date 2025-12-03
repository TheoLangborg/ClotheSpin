import { Box, Typography } from "@mui/material";



export default function AboutTab() {
  return (


    <>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          textAlign: "center",
          color: "#3b82f6",
          mb: 6,
          textShadow: "0 0 6px rgba(59,130,246,0.6)",
        }}
      >
        About ClotheSpin
      </Typography>

      <Typography
        component="div"
        sx={{
          color: "#323232",
          textAlign: "center",
          maxWidth: "750px",
          mx: "auto",
          mt: 2,
          lineHeight: 1.7,
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4.5, mt: -1.5 }}>
          <Typography
            sx={{
              color: "#3b82f6",
              fontWeight: 600,
              letterSpacing: "0.05em",
            }}
          >
            “Fashion meets intelligence.”
          </Typography>
        </Box>

        ClotheSpin is a project created by <strong>Theo Langborg</strong> — blending
        technology and fashion into one seamless experience.
        <br /><br />
        The goal is to make outfit inspiration effortless. Instead of browsing countless
        stores, you describe what you want — and ClotheSpin finds it for you, using real
        product data and intelligent matching.
        <br /><br />
        This is just the beginning — features like saving your favorite looks,
        personal style profiles, smart brand collaborations, and virtual try-on are coming soon.
        <br /><br />
        Awin
      </Typography>


      <Box id="contact" sx={{ textAlign: "center", mt: 15 }}>
        <Typography sx={{ color: "#323232" }}>
          Contact: <a href="mailto:Tlangborg08@outlook.com" style={{ color: "#3b82f6" }}>Tlangborg08@outlook.com</a>
        </Typography>
      </Box>

    </>
  )
}

