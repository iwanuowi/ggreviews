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
import { loginUser } from "../../utils/api_user";
import { useCookies } from "react-cookie";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import Lottie from "lottie-react";
import { useEffect } from "react";

const LoginPage = () => {
  const [cookies, setCookies] = useCookies(["currentuser"]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [animation, setAnimation] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userData = await loginUser(email, password);

      if (userData.token) {
        localStorage.setItem("token", userData.token);
      }

      if (userData.user) {
        localStorage.setItem("user", JSON.stringify(userData.user));
      }

      // important!! cuz it needs to store the token inside
      setCookies(
        "currentuser",
        { ...userData.user, token: userData.token },
        {
          path: "/",
          maxAge: 60 * 60 * 8, // 8 hours
        }
      );

      Swal.fire({
        icon: "success",
        title: `Welcome, ${userData.user.name}`,
        showConfirmButton: false,
        timer: 1500,
      });

      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login failed",
        text: error.response?.data?.message || "Invalid email or password.",
      });
    }
  };

  // fetch the animation
  useEffect(() => {
    fetch("animation/among.json")
      .then((res) => res.json())
      .then((data) => setAnimation(data));
  }, []);

  return (
    <>
      <Header />
      <Container
        maxWidth="sm"
        sx={{
          mt: 10,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          variant="h4"
          sx={{
            position: "absolute",
            zIndex: 0,
            animation: "fly 5s linear infinite",
            "@keyframes fly": {
              "0%": { transform: "translateX(-500%)", opacity: 0 },
              "20%": { opacity: 1 },
              "80%": { opacity: 1 },
              "100%": { transform: "translateX(350%)", opacity: 0 },
            },
          }}
        >
          <Lottie
            animationData={animation}
            loop
            style={{
              width: 200,
              height: 200,
            }}
          />
        </Box>
        <Paper
          elevation={10}
          sx={{
            p: 5,
            borderRadius: "20px",
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
              fontSize: "2.5rem",
              letterSpacing: "2px",
              background: "linear-gradient(90deg,#00f5ff,#ff00ff,#ff9900)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "glow 2s infinite alternate",
              textTransform: "uppercase",
            }}
          >
            Login to Your Account
          </Typography>

          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <FormControl fullWidth>
              <FormLabel sx={{ color: "#ccc", mb: 1 }}>Email</FormLabel>
              <TextField
                variant="outlined"
                type="email"
                placeholder="Enter your email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  input: { color: "#fff" },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    background: "#0f3460",
                    "& fieldset": { borderColor: "#00f5ff" },
                    "&:hover fieldset": { borderColor: "#ff00ff" },
                    "&.Mui-focused fieldset": { borderColor: "#00f5ff" },
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
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  input: { color: "#fff" },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    background: "#0f3460",
                    "& fieldset": { borderColor: "#00f5ff" },
                    "&:hover fieldset": { borderColor: "#ff00ff" },
                    "&.Mui-focused fieldset": { borderColor: "#00f5ff" },
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
              Login
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
              Don’t have an account?
            </Typography>
            <Link
              to="/registerpage"
              style={{
                textDecoration: "none",
                color: "#00f5ff",
                fontWeight: "bold",
              }}
              onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
              onMouseOut={(e) => (e.target.style.textDecoration = "none")}
            >
              Sign up here
            </Link>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default LoginPage;
