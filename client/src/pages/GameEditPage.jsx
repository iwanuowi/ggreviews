import Header from "../components/Header";
import {
  Button,
  TextField,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  Typography,
  Box,
  Container,
  Paper,
  IconButton,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { styled } from "@mui/material/styles";
import { getGenres } from "../utils/api_genre";
import { getGame, updateGame } from "../utils/api_games";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";

const VisuallyHiddenInput = styled("input")({
  display: "none",
});

export default function GameEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [platform, setPlatform] = useState("");
  const [image, setImage] = useState(null);
  const [genres, setGenres] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // Fetch genres and game data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [genresData, gameData] = await Promise.all([
          getGenres(),
          getGame(id),
        ]);

        setGenres(genresData);
        setTitle(gameData.title);
        setDescription(gameData.description);
        setGenre(gameData.genre.name || gameData.genre);
        setPlatform(gameData.platform);
        setImage(gameData.image);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [id]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !genre || !platform) {
      Swal.fire({
        icon: "error",
        title: "Missing fields",
        text: "Please fill all required fields!",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("genre", genre);
      formData.append("platform", platform);
      if (image && typeof image !== "string") formData.append("image", image);

      await updateGame(id, formData, token);

      Swal.fire({
        icon: "success",
        title: "Game Updated!",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => navigate("/"));
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err.message || "Something went wrong",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          maxWidth: 600,
          mx: "auto",
          mt: 12,
          p: 3,
          borderRadius: 3,
          backgroundColor: "#1e1e1e",
          boxShadow: "0 0 20px rgba(0,240,255,0.2)",
          color: "white",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          mb={3}
          textAlign="center"
          sx={{ textTransform: "uppercase", color: "#00f0ff" }}
        >
          Edit Game
        </Typography>

        {/* Title */}
        <TextField
          label="Game Title"
          fullWidth
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{
            mb: 2,
            input: { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#00f0ff" },
              "&:hover fieldset": { borderColor: "#00c0cc" },
              "&.Mui-focused fieldset": { borderColor: "#00f0ff" },
            },
            "& .MuiInputLabel-root": { color: "#00f0ff" },
          }}
        />

        {/* Description */}
        <TextField
          label="Description"
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#00f0ff" },
              "&:hover fieldset": { borderColor: "#00c0cc" },
              "&.Mui-focused fieldset": { borderColor: "#00f0ff" },
              "& textarea": { color: "#fff" },
            },
            "& .MuiInputLabel-root": { color: "#00f0ff" },
          }}
        />

        {/* Genre */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel sx={{ color: "#00f0ff" }}>Genre</InputLabel>
          <Select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            sx={{
              color: "white",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#00f0ff" },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#00c0cc",
              },
            }}
          >
            {genres.map((g) => (
              <MenuItem key={g._id} value={g.name}>
                {g.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Platform */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel sx={{ color: "#00f0ff" }}>Platform</InputLabel>
          <Select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            sx={{
              color: "white",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#00f0ff" },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#00c0cc",
              },
            }}
          >
            {["PC", "Mobile", "PC & Mobile", "Consoles", "Consoles + PC"].map(
              (p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>

        {/* Image Upload */}
        <Box
          sx={{
            mb: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          {image && (
            <Box sx={{ position: "relative" }}>
              <img
                src={
                  typeof image === "string" ? image : URL.createObjectURL(image)
                }
                alt="Preview"
                style={{
                  height: 150,
                  borderRadius: 8,
                  border: "1px solid #00f0ff",
                }}
              />
              <IconButton
                onClick={() => setImage(null)}
                sx={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  backgroundColor: "rgba(0,0,0,0.7)",
                  "&:hover": { backgroundColor: "#00f0ff" },
                }}
              >
                <DeleteIcon sx={{ color: "white" }} />
              </IconButton>
            </Box>
          )}
          {!image && (
            <Button
              variant="contained"
              component="label"
              startIcon={<UploadFileIcon />}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                backgroundColor: "#00f0ff",
                color: "#000",
              }}
            >
              Upload Image
              <VisuallyHiddenInput
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files.length && setImage(e.target.files[0])
                }
              />
            </Button>
          )}
        </Box>

        {/* Buttons */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleFormSubmit}
            sx={{
              backgroundColor: "#00f0ff",
              color: "#000",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#00c0cc" },
            }}
          >
            Update Game
          </Button>
          <Button
            variant="outlined"
            component={Link}
            to="/"
            sx={{
              borderColor: "#00f0ff",
              color: "#fff",
              "&:hover": { borderColor: "#00c0cc", color: "#00c0cc" },
            }}
          >
            Back
          </Button>
        </Box>
      </Box>
    </>
  );
}
