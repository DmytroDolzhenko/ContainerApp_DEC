import { useState } from "react";
import { Box, Paper, Typography, TextField, Button, Alert } from "@mui/material";
import { useAuth } from "../../auth/hooks/useAuth";

export const LoginList = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email === "admin@gmail.com" && password === "admin") {
      login({
        id: 1,
        fullName: "Super Admin",
        email: "admin@gmail.com",
        role: "Admin",
        avatar: "/static/images/avatar/1.jpg"
      });
    } else if (email === "operator@gmail.com" && password === "operator") {
      login({
        id: 2,
        fullName: "John Operator",
        email: "operator@gmail.com",
        role: "Operator",
        avatar: ""
      });
    } else {
      setError("Невірний логін або пароль");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0f0d15 0%, #231e2e 100%)",
      }}
    >
      <Paper
        elevation={10}
        sx={{
          p: 4,
          width: 400,
          bgcolor: "#1e1b26",
          border: "1px solid #322d3d",
          borderRadius: "16px",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" sx={{ color: "#fff", fontWeight: "bold", mb: 1 }}>
          Welcome Back
        </Typography>
        <Typography variant="body2" sx={{ color: "#a0a0a0", mb: 4 }}>
          Please sign in to continue
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                "& fieldset": { borderColor: "#322d3d" },
                "&:hover fieldset": { borderColor: "#bb86fc" },
              },
              "& .MuiInputLabel-root": { color: "#a0a0a0" },
            }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                "& fieldset": { borderColor: "#322d3d" },
                "&:hover fieldset": { borderColor: "#bb86fc" },
              },
              "& .MuiInputLabel-root": { color: "#a0a0a0" },
            }}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{
              mt: 3,
              bgcolor: "#bb86fc",
              color: "#000",
              fontWeight: "bold",
              height: 48,
              "&:hover": { bgcolor: "#9a67ea" },
            }}
          >
            Sign In
          </Button>
        </form>
      </Paper>
    </Box>
  );
};