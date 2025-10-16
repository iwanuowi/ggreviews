import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  List,
  ListItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../components/Header";
import { getGenres, addGenre, deleteGenre } from "../utils/api_genre";

export default function AddGenrePage() {
  const [genres, setGenres] = useState([]);
  const [newGenre, setNewGenre] = useState("");

  const fetchGenres = async () => {
    try {
      const data = await getGenres();
      setGenres(data);
    } catch {
      Swal.fire("Error", "Failed to fetch genres", "error");
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  const handleAddGenre = async () => {
    if (!newGenre.trim()) return;
    try {
      await addGenre(newGenre);
      setNewGenre("");
      fetchGenres();
      Swal.fire("Success", "Genre added!", "success");
    } catch {
      Swal.fire("Error", "Failed to add genre", "error");
    }
  };

  const handleDeleteGenre = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete this genre?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    });
    if (confirm.isConfirmed) {
      try {
        await deleteGenre(id);
        fetchGenres();
        Swal.fire("Deleted!", "Genre has been removed.", "success");
      } catch {
        Swal.fire("Error", "Failed to delete genre", "error");
      }
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="sm" sx={{ mt: 10, mb: 6 }}>
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: "16px",
            bgcolor: "#0a0a0a",
            border: "1px solid #00ffff",
            boxShadow: "0 0 20px rgba(0,255,255,0.3)",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: "bold",
              color: "#ffffffff",
              mb: 3,
              textShadow: "0 0 10px #00ffff",
            }}
          >
            Manage Genres
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              label="New Genre"
              variant="outlined"
              value={newGenre}
              onChange={(e) => setNewGenre(e.target.value)}
              sx={{
                input: { color: "#fff" },
                label: { color: "#00ffff" },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                  "& fieldset": {
                    borderColor: "#00ffff",
                    borderWidth: "2px",
                  },
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

            <Button
              variant="contained"
              onClick={handleAddGenre}
              sx={{
                bgcolor: "#00ffff",
                color: "#000",
                fontWeight: "bold",
                "&:hover": { bgcolor: "#00bfff" },
              }}
            >
              Add
            </Button>
          </Box>

          <List sx={{ maxHeight: 250, overflowY: "auto" }}>
            {genres.length > 0 ? (
              genres.map((g) => (
                <ListItem
                  key={g._id}
                  sx={{
                    borderBottom: "1px solid #00ffff50",
                    color: "#fff",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  {g.name}
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleDeleteGenre(g._id)}
                    sx={{
                      borderColor: "#00ffff",
                      color: "#00ffff",
                      "&:hover": { bgcolor: "#00ffff", color: "#000" },
                    }}
                  >
                    Remove
                  </Button>
                </ListItem>
              ))
            ) : (
              <Typography align="center" sx={{ color: "#aaa", mt: 2 }}>
                No genres available
              </Typography>
            )}
          </List>

          <Box sx={{ mt: 3, textAlign: "center" }}>
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
