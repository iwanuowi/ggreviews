import { useEffect, useState } from "react";
import Header from "../components/Header";
import {
  Select,
  MenuItem,
  FormControl,
  Grid,
  Card,
  CardMedia,
  CardContent,
  TextField,
  Typography,
  Box,
  IconButton,
} from "@mui/material";

import { getGenres } from "../utils/api_genre";
import { getGames, likeGame } from "../utils/api_games";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { API_URL } from "../utils/constants";

import { Whatshot, WhatshotOutlined } from "@mui/icons-material";

export default function Games() {
  const [games, setGames] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [search, setSearch] = useState("");

  const [platforms] = useState([
    "PC",
    "Mobile",
    "PC & Mobile",
    "Consoles",
    "Consoles + PC",
  ]);
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [likedGames, setLikedGames] = useState({}); // store the likes

  // fetch data game and genre
  useEffect(() => {
    const fetchGamesAndGenres = async () => {
      try {
        const gamesData = await getGames();
        setGames(gamesData);
        const genresData = await getGenres();
        setGenres(genresData);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchGamesAndGenres();
  }, []);

  // Filtered games
  const filteredGames = games.filter(
    (game) =>
      (!selectedGenre || game.genre === selectedGenre) &&
      (!selectedPlatform || game.platform === selectedPlatform) &&
      game.title.toLowerCase().includes(search.toLowerCase())
  );

  // Handle Like
  const handleLike = async (gameId) => {
    try {
      const { likesCount, liked } = await likeGame(gameId);

      // Update local likedGames state
      setLikedGames((prev) => {
        const updated = { ...prev, [gameId]: liked };
        localStorage.setItem("likedGames", JSON.stringify(updated));
        return updated;
      });

      // Update games' like count in UI
      setGames((prevGames) =>
        prevGames.map((g) =>
          g._id === gameId ? { ...g, likes: likesCount } : g
        )
      );
    } catch (error) {
      console.error("Error liking game:", error);
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "You must be logged in to like games.",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Header */}
      <div style={{ position: "fixed", top: 0, width: "100%", zIndex: 1000 }}>
        <Header />
      </div>

      {/* Title + Genre + Filters */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: { xs: 10, md: 12 },
        }}
      >
        {/* Title */}
        <Box sx={{ position: "relative", display: "inline-block" }}>
          <Typography
            sx={{
              fontWeight: "bold",
              textTransform: "uppercase",
              fontSize: "clamp(2.5rem, 10vw, 7rem)",
              color: "transparent",
              WebkitTextStroke: "2.5px #00f0ff",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 0,
              filter: "drop-shadow(0 0 6px #00f0ff)",
            }}
          >
            GG Reviews
          </Typography>
          <Typography
            sx={{
              fontWeight: "bold",
              textTransform: "uppercase",
              fontSize: "clamp(2.5rem, 10vw, 7rem)",
              backgroundImage: "url('/images/gamebanner.jpg')",
              backgroundSize: "cover",
              backgroundRepeat: "repeat-y",
              backgroundPosition: "center top",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              position: "relative",
              zIndex: 1,
              animation: "waterfall 5s linear infinite",
              "@keyframes waterfall": {
                "0%": { backgroundPosition: "center top" },
                "100%": { backgroundPosition: "center bottom" },
              },
            }}
          >
            GG Reviews
          </Typography>
        </Box>

        {/* Filters */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
            mt: { xs: 1, md: 2 },
            mb: 2,
          }}
        >
          {/* Genre Filter */}
          <FormControl size="small">
            <FormControl size="small">
              <Select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                displayEmpty
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: "rgba(15, 15, 30, 0.95)",
                      color: "#00f5ff",
                      borderRadius: "12px",
                      border: "1px solid rgba(0,255,255,0.3)",
                      boxShadow: "0 0 15px rgba(0,255,255,0.3)",
                    },
                  },
                }}
                sx={{
                  minWidth: 180,
                  background:
                    "linear-gradient(145deg, rgba(15,15,30,0.95), rgba(25,25,60,0.95))",
                  color: "#00f5ff",
                  borderRadius: "12px",
                  border: "1px solid rgba(0,255,255,0.3)",
                  boxShadow: "0 0 10px rgba(0,255,255,0.3)",
                  "& .MuiSelect-icon": {
                    color: "#00f5ff",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "&:hover": {
                    borderColor: "#00ffff",
                    boxShadow: "0 0 15px #00ffff",
                  },
                  "& .MuiSelect-select": {
                    backgroundColor: "transparent",
                  },
                }}
              >
                <MenuItem value="" sx={{ color: "#fff" }}>
                  🎮 All Games
                </MenuItem>
                {genres.map((g) => (
                  <MenuItem key={g._id} value={g.name} sx={{ color: "#fff" }}>
                    {g.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </FormControl>

          {/* Platform Filter */}
          <FormControl size="small">
            <Select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              displayEmpty
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: "rgba(15, 15, 30, 0.95)",
                    color: "#00f5ff",
                    borderRadius: "12px",
                    border: "1px solid rgba(0,255,255,0.3)",
                    boxShadow: "0 0 15px rgba(0,255,255,0.3)",
                  },
                },
              }}
              sx={{
                minWidth: 180,
                background:
                  "linear-gradient(145deg, rgba(15,15,30,0.95), rgba(25,25,60,0.95))",
                color: "#00f5ff",
                borderRadius: "12px",
                border: "1px solid rgba(0,255,255,0.3)",
                boxShadow: "0 0 10px rgba(0,255,255,0.3)",
                "& .MuiSelect-icon": {
                  color: "#00f5ff",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&:hover": {
                  borderColor: "#00ffff",
                  boxShadow: "0 0 15px #00ffff",
                },
                "& .MuiSelect-select": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <MenuItem value="" sx={{ color: "#fff" }}>
                🕹 All Platforms
              </MenuItem>
              {platforms.map((p) => (
                <MenuItem key={p} value={p} sx={{ color: "#fff" }}>
                  {p}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Search Bar */}
          <TextField
            placeholder="🔍 Search Games..."
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              minWidth: 250,
              borderRadius: "12px",
              background:
                "linear-gradient(145deg, rgba(15,15,30,0.95), rgba(25,25,60,0.95))",
              input: {
                color: "#00f5ff",
                fontWeight: "bold",
                letterSpacing: "1px",
              },
              boxShadow: "0 0 10px rgba(0,255,255,0.3)",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(0,255,255,0.3)",
                },
                "&:hover fieldset": {
                  borderColor: "#00ffff",
                  boxShadow: "0 0 15px #00ffff",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#00f5ff",
                  boxShadow: "0 0 15px #00f5ff",
                },
              },
            }}
          />
        </Box>
      </Box>

      {/* Game Cards */}
      <Grid
        container
        spacing={4}
        justifyContent="center"
        sx={{
          padding: "0 20px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {filteredGames.length > 0 ? (
          filteredGames.map((game) => {
            // check if the user has liked
            const isLiked = likedGames[game._id] || false;

            return (
              <Grid
                item
                key={game._id}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Card
                  sx={{
                    width: { xs: "90%", sm: 250, md: 250 },
                    height: 420,
                    borderRadius: "20px",
                    backgroundColor: "#1e1e1e",
                    color: "white",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                    border: "2px solid transparent",
                    transition: "all 0.3s ease",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    "&:hover": {
                      borderColor: "#4dabf7",
                      boxShadow: "0 0 20px #4dabf7",
                      transform: "translateY(-5px)",
                    },
                  }}
                >
                  {/* Likes */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 1,
                      right: 10,
                      display: "flex",
                      alignItems: "center",
                      p: 0.2,
                    }}
                  >
                    {/** if user already like then show red if not then white */}
                    <IconButton
                      onClick={() => handleLike(game._id)}
                      sx={{
                        color: isLiked ? "red" : "white",
                        "&:hover": { color: "red" },
                      }}
                    >
                      {isLiked ? <Whatshot /> : <WhatshotOutlined />}
                    </IconButton>

                    <Typography
                      variant="body2"
                      sx={{ color: "white", fontWeight: "bold" }}
                    >
                      {/* checks how many user like the game then display the number of likes */}
                      {Array.isArray(game.likes)
                        ? game.likes.length
                        : game.likes || 0}{" "}
                      Likes
                    </Typography>
                  </Box>

                  <Link
                    to={`/games/${game._id}`}
                    style={{ textDecoration: "none" }}
                  >
                    {/* Game Image */}
                    {game.image && (
                      <CardMedia
                        component="img"
                        height="190"
                        sx={{
                          objectFit: "cover",
                          borderTopLeftRadius: "20px",
                          borderTopRightRadius: "20px",
                        }}
                        image={
                          game.image?.startsWith("http")
                            ? game.image
                            : `${API_URL}uploads/${game.image}`
                        }
                        alt={game.title}
                      />
                    )}

                    <CardContent
                      sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        gutterBottom
                        variant="h6"
                        sx={{ color: "white", fontWeight: "bold", mb: 1 }}
                      >
                        {game.title}
                      </Typography>

                      {/* Game Description */}
                      <Typography
                        variant="body2"
                        sx={{
                          color: "gray",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {game.description}
                      </Typography>

                      {/* Genre & Platform */}
                      <Box mt="auto">
                        <Typography
                          variant="caption"
                          display="block"
                          sx={{ color: "lightgray" }}
                        >
                          Genre: {game.genre}
                        </Typography>
                        <Typography
                          variant="caption"
                          display="block"
                          sx={{ color: "lightgray" }}
                        >
                          Platform: {game.platform}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Link>
                </Card>
              </Grid>
            );
          })
        ) : (
          <Typography sx={{ textAlign: "center", width: "100%", mt: 4 }}>
            No games found.
          </Typography>
        )}
      </Grid>
    </div>
  );
}
