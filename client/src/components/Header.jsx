import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState(null);

  const storedUser = localStorage.getItem("user");
  const currentuser = storedUser ? JSON.parse(storedUser) : null;

  const navigate = useNavigate();

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const buttonStyle = {
    color: "#00ffff",
    borderColor: "#00ffff",
    fontWeight: "bold",
    textTransform: "none",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#00ffff",
      color: "#000",
      transform: "scale(1.1)",
      boxShadow: "0 0 10px #00ffff, 0 0 20px #00ffff",
    },
  };

  const adminButtons = (
    <>
      <Button
        component={Link}
        to="/gameAdd"
        variant="outlined"
        sx={buttonStyle}
      >
        Add Games
      </Button>
      <Button
        component={Link}
        to="/genreAdd"
        variant="outlined"
        sx={buttonStyle}
      >
        Add Genre
      </Button>
      <Button
        component={Link}
        to="/mangeGame"
        variant="outlined"
        sx={buttonStyle}
      >
        Manage Games
      </Button>
    </>
  );

  const loggedInButtons = (
    <>
      <Typography sx={{ color: "#00ffff", mr: 2, fontWeight: "bold" }}>
        Welcome, {currentuser?.name}
      </Typography>
      {currentuser?.role === "admin" && adminButtons}
      <Button variant="outlined" sx={buttonStyle} onClick={handleLogout}>
        Logout
      </Button>
    </>
  );

  const guestButtons = (
    <>
      <Button
        component={Link}
        to="/registerpage"
        variant="outlined"
        sx={buttonStyle}
      >
        Sign Up
      </Button>
      <Button
        component={Link}
        to="/loginpage"
        variant="outlined"
        sx={buttonStyle}
      >
        Login
      </Button>
    </>
  );

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: "#0a0a0a",
        px: 2,
        borderBottom: "2px solid #00ffff",
        boxShadow: "0 0 15px #00ffff",
      }}
    >
      <Toolbar sx={{ flexWrap: "wrap" }}>
        {/* Logo */}
        <IconButton
          edge="start"
          sx={{
            mr: 1,
            color: "#00ffff",
            "&:hover": { transform: "rotate(20deg)", transition: "0.3s" },
          }}
        >
          <SportsEsportsIcon fontSize="large" />
        </IconButton>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              mr: 3,
              background: "linear-gradient(90deg, #00ffff, #00bfff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            GG Review
          </Typography>
        </Link>

        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleMenuOpen}
              sx={{ ml: "auto" }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  bgcolor: "#111",
                  color: "#00ffff",
                  border: "1px solid #00ffff",
                  "& .MuiMenuItem-root:hover": {
                    backgroundColor: "#00ffff",
                    color: "#000",
                  },
                },
              }}
            >
              <MenuItem onClick={handleMenuClose} component={Link} to="/">
                Games
              </MenuItem>
              <Button sx={buttonStyle}>Feedback</Button>

              {currentuser ? (
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              ) : (
                <>
                  <MenuItem
                    onClick={handleMenuClose}
                    component={Link}
                    to="/registerpage"
                  >
                    Sign Up
                  </MenuItem>
                  <MenuItem
                    onClick={handleMenuClose}
                    component={Link}
                    to="/loginpage"
                  >
                    Login
                  </MenuItem>
                </>
              )}
            </Menu>
          </>
        ) : (
          <>
            <Box sx={{ display: "flex", flexGrow: 1 }}>
              <Button component={Link} to="/" sx={buttonStyle}>
                Games
              </Button>
              <MenuItem
                component={Link}
                to="/feedback"
                onClick={handleMenuClose}
                sx={buttonStyle}
              >
                Feedback
              </MenuItem>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {currentuser ? loggedInButtons : guestButtons}
            </Box>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
