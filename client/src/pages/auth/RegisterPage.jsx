import {
  Button,
  Container,
  Paper,
  Box,
  FormControl,
  FormLabel,
  TextField,
  Typography,
} from "@mui/material";
import Header from "../../components/Header";
import { useState } from "react";
import { registerUser } from "../../utils/api_user";
import Swal from "sweetalert2";
import { useCookies } from "react-cookie";
import { useNavigate, Link } from "react-router-dom";
import validator from "email-validator";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [cookies, setCookies] = useCookies();
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Swal.fire({ icon: "warning", title: "Fill all fields" });
      return;
    }
    if (!validator.validate(email)) {
      Swal.fire({ icon: "warning", title: "Invalid Email" });
      return;
    }
    if (password !== confirmPassword) {
      Swal.fire({ icon: "error", title: "Passwords do not match" });
      return;
    }

    try {
      const userData = await registerUser(name, email, password);
      setCookies("currentuser", userData, { maxAge: 60 * 60 * 8, path: "/" });
      Swal.fire({
        icon: "success",
        title: "Account Created!",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.response?.data?.message || "Something went wrong.",
      });
    }
  };

  return (
    <>
      <Header />
      <Container
        maxWidth="sm"
        sx={{
          mt: 8,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={10}
          sx={{
            p: 5,
            borderRadius: "20px",
            width: "100%",
            backdropFilter: "blur(12px)",
            background: "rgba(20,20,40,0.7)",
            border: "1px solid rgba(0,255,255,0.2)",
            boxShadow:
              "0 0 25px rgba(0,255,255,0.4), 0 0 50px rgba(255,0,255,0.2)",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              fontWeight: "bold",
              fontSize: "1.9rem",
              letterSpacing: "2px",
              background: "linear-gradient(90deg,#00f5ff,#ff00ff,#ff9900)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "glow 2s infinite alternate",
              textTransform: "uppercase",
            }}
          >
            Create Your Account
          </Typography>

          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleRegister();
            }}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <FormControl fullWidth>
              <FormLabel sx={{ color: "#ccc", mb: 1 }}>Name</FormLabel>
              <TextField
                variant="outlined"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{
                  input: { color: "#fff" },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    background: "#0f3460",
                    "& fieldset": { borderColor: "#00f5ff" },
                    "&:hover fieldset": { borderColor: "#ff00ff" },
                    "&.Mui-focused fieldset": {
                      borderColor: "#00f5ff",
                      boxShadow: "0 0 10px #00f5ff",
                    },
                  },
                }}
              />
            </FormControl>

            <FormControl fullWidth>
              <FormLabel sx={{ color: "#ccc", mb: 1 }}>Email</FormLabel>
              <TextField
                variant="outlined"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  input: { color: "#fff" },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    background: "#0f3460",
                    "& fieldset": { borderColor: "#00f5ff" },
                    "&:hover fieldset": { borderColor: "#ff00ff" },
                    "&.Mui-focused fieldset": {
                      borderColor: "#00f5ff",
                      boxShadow: "0 0 10px #00f5ff",
                    },
                  },
                }}
              />
            </FormControl>

            <FormControl fullWidth>
              <FormLabel sx={{ color: "#ccc", mb: 1 }}>Password</FormLabel>
              <TextField
                variant="outlined"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  input: { color: "#fff" },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    background: "#0f3460",
                    "& fieldset": { borderColor: "#00f5ff" },
                    "&:hover fieldset": { borderColor: "#ff00ff" },
                    "&.Mui-focused fieldset": {
                      borderColor: "#00f5ff",
                      boxShadow: "0 0 10px #00f5ff",
                    },
                  },
                }}
              />
            </FormControl>

            <FormControl fullWidth>
              <FormLabel sx={{ color: "#ccc", mb: 1 }}>
                Confirm Password
              </FormLabel>
              <TextField
                variant="outlined"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={{
                  input: { color: "#fff" },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    background: "#0f3460",
                    "& fieldset": { borderColor: "#00f5ff" },
                    "&:hover fieldset": { borderColor: "#ff00ff" },
                    "&.Mui-focused fieldset": {
                      borderColor: "#00f5ff",
                      boxShadow: "0 0 10px #00f5ff",
                    },
                  },
                }}
              />
            </FormControl>

            <Button
              variant="contained"
              size="large"
              fullWidth
              type="submit"
              sx={{
                mt: 2,
                borderRadius: "12px",
                fontWeight: "bold",
                background: "linear-gradient(90deg,#00f5ff,#ff00ff)",
                color: "#fff",
                textTransform: "uppercase",
                boxShadow: "0 0 15px rgba(0,255,255,0.5)",
                "&:hover": {
                  background: "linear-gradient(90deg,#ff00ff,#00f5ff)",
                  boxShadow: "0 0 20px rgba(255,0,255,0.6)",
                },
              }}
            >
              Sign Up
            </Button>
          </Box>

          <Box
            sx={{
              mt: 3,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
            }}
          >
            <Typography variant="body1" sx={{ mr: 1 }}>
              Already have an account?
            </Typography>
            <Link
              to="/loginpage"
              style={{
                textDecoration: "none",
                color: "#00f5ff",
                fontWeight: "bold",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.target.style.textDecoration = "underline";
                e.target.style.textShadow = "0 0 10px #00f5ff";
              }}
              onMouseOut={(e) => {
                e.target.style.textDecoration = "none";
                e.target.style.textShadow = "none";
              }}
            >
              Login here
            </Link>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default RegisterPage;
