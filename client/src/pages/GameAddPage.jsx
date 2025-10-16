import Header from "../components/Header";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { styled } from "@mui/material/styles";
import { API_URL } from "../utils/constants";
import { useCookies } from "react-cookie";
import axios from "axios";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";

const VisuallyHiddenInput = styled("input")({
  display: "none",
});

export default function GameAddPage() {
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies;
  const { token = "" } = currentuser;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [platform, setPlatform] = useState("");
  const [image, setImage] = useState(null);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await axios.get(`${API_URL}genres`);
        setGenres(res.data);
      } catch (err) {
        console.error("Error fetching genres:", err);
      }
    };
    fetchGenres();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !genre || !platform) {
      Swal.fire("Error", "Please fill all required fields", "error");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("genre", genre);
      formData.append("platform", platform);
      if (image) formData.append("image", image);

      await axios.post(`${API_URL}games`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire({
        icon: "success",
        title: "Game Added!",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => navigate("/mangeGame"));
    } catch (err) {
      Swal.fire("Error", "Failed to add game", "error");
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="sm" sx={{ mt: 12, mb: 6 }}>
        <Paper
          elevation={8}
          sx={{
            p: 5,
            borderRadius: "16px",
            bgcolor: "#0f0f0f",
            border: "1px solid #00ffff",
            boxShadow: "0 0 20px rgba(0,255,255,0.3)",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: "bold",
              color: "#00ffff",
              mb: 4,
              textShadow: "0 0 10px #00ffff",
            }}
          >
            Add New Game
          </Typography>

          <Box
            component="form"
            onSubmit={handleFormSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            {/* Game Title */}
            <TextField
              label="Game Title"
              variant="outlined"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{
                input: { color: "#fff" },
                label: { color: "#00ffff" },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "& fieldset": { borderColor: "#00ffff" },
                  "&:hover fieldset": {
                    borderColor: "#00ffff",
                    boxShadow: "0 0 8px #00ffff88",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#00ffff",
                    boxShadow: "0 0 10px #00ffffaa",
                  },
                },
              }}
            />

            {/* Description */}
            <TextField
              label="Description"
              variant="outlined"
              multiline
              minRows={3}
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{
                input: { color: "#fff" },
                label: { color: "#00ffff" },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "& fieldset": { borderColor: "#00ffff" },
                  "&:hover fieldset": {
                    borderColor: "#00ffff",
                    boxShadow: "0 0 8px #00ffff88",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#00ffff",
                    boxShadow: "0 0 10px #00ffffaa",
                  },

                  "& textarea": { color: "#fff" },
                },
              }}
            />

            {/* Genre */}
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel sx={{ color: "#00ffff" }}>Genre</InputLabel>
              <Select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                sx={{
                  color: "#fff",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#00ffff",
                    borderWidth: "2px",
                    borderRadius: "12px",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#00ffff",
                    boxShadow: "0 0 8px #00ffff88",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#00ffff",
                    boxShadow: "0 0 10px #00ffffaa",
                  },
                }}
              >
                {genres.length > 0 ? (
                  genres.map((g) => (
                    <MenuItem key={g._id} value={g.name}>
                      {g.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No genres</MenuItem>
                )}
              </Select>
            </FormControl>

            {/* Platform */}
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel sx={{ color: "#00ffff" }}>Platform</InputLabel>
              <Select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                sx={{
                  color: "#fff",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#00ffff",
                    borderWidth: "2px",
                    borderRadius: "12px",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#00ffff",
                    boxShadow: "0 0 8px #00ffff88",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#00ffff",
                    boxShadow: "0 0 10px #00ffffaa",
                  },
                }}
              >
                <MenuItem value="PC">PC</MenuItem>
                <MenuItem value="Mobile">Mobile</MenuItem>
                <MenuItem value="PC & Mobile">PC & Mobile</MenuItem>
                <MenuItem value="Consoles">Consoles</MenuItem>
                <MenuItem value="Consoles + PC">Consoles + PC</MenuItem>
              </Select>
            </FormControl>

            {/* Image Upload */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              {image ? (
                <Box sx={{ position: "relative" }}>
                  <img
                    src={
                      typeof image === "string"
                        ? image
                        : URL.createObjectURL(image)
                    }
                    alt="Preview"
                    style={{
                      height: 150,
                      borderRadius: 10,
                      border: "2px solid #00ffff",
                    }}
                  />
                  <IconButton
                    onClick={() => setImage(null)}
                    sx={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                      bgcolor: "#00ffff33",
                      "&:hover": { bgcolor: "#00ffff" },
                    }}
                  >
                    <DeleteIcon sx={{ color: "#000" }} />
                  </IconButton>
                </Box>
              ) : (
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<UploadFileIcon />}
                  sx={{
                    bgcolor: "#00ffff",
                    color: "#000",
                    "&:hover": { bgcolor: "#00bfff" },
                  }}
                >
                  Upload Image
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </Button>
              )}
            </Box>

            {/* Buttons */}
            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: "#00ffff",
                color: "#000",
                fontWeight: "bold",
                "&:hover": { bgcolor: "#00bfff" },
              }}
            >
              Add Game
            </Button>
            <Button
              component={Link}
              to="/mangeGame"
              variant="outlined"
              sx={{
                borderColor: "#00ffff",
                color: "#00ffff",
                "&:hover": { bgcolor: "#00ffff", color: "#000" },
              }}
            >
              Back
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
