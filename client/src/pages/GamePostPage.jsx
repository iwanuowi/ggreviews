import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Button,
  TextField,
  Rating,
} from "@mui/material";
import { Upload } from "@mui/icons-material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";

import Swal from "sweetalert2";
import Header from "../components/Header";

import axios from "axios";
import { API_URL } from "../utils/constants";
import { getGames } from "../utils/api_games";

export default function GamePostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Review form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️ Load current user from localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) setCurrentUser(JSON.parse(storedUser));

        // 2️ Fetch all games using your utility
        const allGames = await getGames();
        const foundGame = allGames.find((g) => g._id === id);
        setGame(foundGame);

        // 3 Fetch reviews for this game using Axios
        const res = await axios.get(`${API_URL}games/${id}/reviews`);
        setReviews(res.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setGame(null);
        setReviews([]);
      }
    };

    fetchData();
  }, [id, navigate]);

  // Check if need to refresh reviews
  useEffect(() => {
    if (location.state?.refresh) {
      // if the refresh is true
      const fetchReviews = async () => {
        try {
          // Get the latest reviews for this game
          const res = await axios.get(`${API_URL}games/${id}/reviews`);
          setReviews(res.data); // update the reviews on the page
        } catch (err) {
          console.error("Error refreshing reviews:", err);
        }
      };

      fetchReviews(); // call the function to load reviews

      // Remove the refresh so it doesnt run again by accident
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, id, navigate, location.pathname]);

  // Submit review
  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || rating === 0 || !image) {
      Swal.fire({
        icon: "warning",
        title: "Please fill in the form ",
        text: "Please fill in the title, content, and select a rating before submitting.",
        background: "white",
        color: "white",
      });
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("rating", rating);
      if (image) formData.append("image", image);

      await axios.post(`${API_URL}games/${id}/reviews`, formData, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        icon: "success",
        title: "Review Submitted!",
        text: "Your review has been added successfully.",
        background: "#1a1a1a",
        color: "white",
        timer: 1500,
        showConfirmButton: false,
      });

      // Reset form
      setTitle("");
      setContent("");
      setRating(0);
      setImage(null);

      // Reload review page when submited
      const res = await axios.get(`${API_URL}games/${id}/reviews`);
      setReviews(res.data);
    } catch (err) {
      console.error("Error submitting review:", err);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text:
          err.response?.data?.message ||
          "There was an error submitting your review. Please try again.",
        background: "#1a1a1a",
        color: "white",
      });
    }
  };

  // handle delete function
  const handleDelete = async (reviewId, review) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This review will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#36488aff",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      background: "#1a1a1a",
      color: "white",
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "The review has been removed successfully.",
        showConfirmButton: false,
        timer: 1500,
        background: "#1a1a1a",
        color: "white",
      });

      // Reload the page after delete
      const res = await axios.get(`${API_URL}games/${id}/reviews`);
      setReviews(res.data);
    } catch (err) {
      console.error("Error deleting review:", err);
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: err.response?.data?.message || "Could not delete review.",
        background: "#1a1a1a",
        color: "white",
      });
    }
  };

  const input = {
    mb: 2,
    background: "#2b2b2b",
    input: { color: "white" },
    "& .MuiInputLabel-root": { color: "white" },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#00f0ff" },
      "&:hover fieldset": { borderColor: "#00c0cc" },
      "&.Mui-focused fieldset": { borderColor: "#00f0ff" },
    },
    "& textarea": { color: "#fff" },
  };

  if (!game) {
    return (
      <Typography sx={{ textAlign: "center", mt: 4 }}>Loading...</Typography>
    );
  }

  return (
    <>
      <div style={{ position: "fixed", top: 0, width: "100%", zIndex: 1000 }}>
        <Header />
      </div>

      <Box
        sx={{
          maxWidth: "1200px",
          margin: "0 auto",
          p: 3,
          mt: "80px",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "65% 35%" },
            gap: 3,
            alignItems: "start",
          }}
        >
          {/* The Game */}
          <Box>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 0 25px rgba(0,240,255,0.12)",
                background: "#121212",
                mb: 4,
              }}
            >
              <CardMedia
                component="img"
                height="400"
                image={
                  game.image?.startsWith("http")
                    ? game.image
                    : `${API_URL}uploads/${game.image}`
                }
                alt={game.title}
                sx={{
                  objectFit: "cover",
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                }}
              />
              <CardContent>
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ color: "#00f0ff", textShadow: "0 0 10px #00f0ff" }}
                >
                  {game.title}
                </Typography>

                <Chip
                  label={game.genre?.name || game.genre || "Unknown"}
                  sx={{
                    background: "#00f0ff",
                    color: "black",
                    fontWeight: "bold",
                    mb: 2,
                    mr: 1,
                  }}
                />
                <Chip
                  label={game.platform || "Unknown"}
                  sx={{
                    background: "#00f0ff",
                    color: "black",
                    fontWeight: "bold",
                    mb: 2,
                  }}
                />

                <Typography
                  variant="body1"
                  sx={{ color: "#ccc", whiteSpace: "pre-line" }}
                >
                  {game.description}
                </Typography>
              </CardContent>
            </Card>

            {/* show the reviews of the user created */}
            <Box>
              <Typography
                variant="h5"
                fontWeight="bold"
                gutterBottom
                sx={{ color: "#00f0ff" }}
              >
                📝 Player Reviews
              </Typography>

              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <Card
                    key={review._id}
                    sx={{
                      mb: 3,
                      p: 2,
                      borderRadius: 2,
                      background: "#1a1a1a",
                      border: "1px solid rgba(0,240,255,0.08)",
                      boxShadow: "0 0 15px rgba(0,240,255,0.03)",
                    }}
                  >
                    {/* if its a admin show the speical admin badge if not then show the user name ony */}
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography fontWeight="bold" sx={{ color: "white" }}>
                        {review.user.name}
                      </Typography>

                      {/* speical for admin hehe */}
                      {review.user.role === "admin" && (
                        <Chip
                          label="⭐ Admin Review"
                          sx={{
                            background:
                              "linear-gradient(90deg,#ff00ff,#00f5ff)",
                            color: "white",
                            fontWeight: "bold",
                            ml: 1,
                          }}
                        />
                      )}
                    </Box>
                    <Typography variant="caption" sx={{ color: "gray" }}>
                      {new Date(review.createdAt).toLocaleString()}
                    </Typography>

                    <Typography variant="h6" sx={{ mt: 1, color: "#00f0ff" }}>
                      {review.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ mt: 1, color: "#ccc", whiteSpace: "pre-line" }}
                    >
                      {review.content}
                    </Typography>

                    {review.image && (
                      <CardMedia
                        component="img"
                        image={
                          review.image?.startsWith("http")
                            ? review.image
                            : `${API_URL}api/uploads/${review.image}`
                        }
                        alt="review-img"
                        sx={{
                          borderRadius: 2,
                          mt: 2,
                          maxHeight: 500,
                          objectFit: "contain",
                        }}
                      />
                    )}

                    <Divider
                      sx={{ my: 1, borderColor: "rgba(0,240,255,0.08)" }}
                    />
                    <Button
                      size="small"
                      sx={{ color: "#00f0ff" }}
                      onClick={() =>
                        navigate(`/reviews/${review._id}/comments`)
                      }
                    >
                      💬 View Comments ({review.commentCount || 0})
                    </Button>

                    <Rating
                      value={review.rating}
                      precision={0.5}
                      icon={<Favorite fontSize="inherit" />}
                      emptyIcon={<FavoriteBorder fontSize="inherit" />}
                      readOnly
                      sx={{
                        justifyContent: "center",
                        display: "flex",
                        mb: 1,
                        "& .MuiRating-iconFilled": {
                          color: "#ff4d6d",
                          textShadow: "0 0 8px #ff4d6d",
                        },
                        "& .MuiRating-iconEmpty": { color: "#555" },
                      }}
                    />
                    {currentUser &&
                      (currentUser._id === review.user._id ||
                        currentUser.role === "admin") && (
                        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                          <Button
                            size="small"
                            sx={{
                              color: "#00f0ff",
                              border: "1px solid #00f0ff",
                              textTransform: "none",
                            }}
                            onClick={() =>
                              navigate(`/reviews/${review._id}/edit`)
                            }
                          >
                            ✏️ Edit
                          </Button>
                          <Button
                            size="small"
                            sx={{
                              color: "red",
                              border: "1px solid red",
                              textTransform: "none",
                            }}
                            onClick={() => handleDelete(review._id, review)}
                          >
                            🗑️ Delete
                          </Button>
                        </Box>
                      )}
                  </Card>
                ))
              ) : (
                <Typography sx={{ color: "gray" }}>
                  No reviews yet. Be the first!
                </Typography>
              )}
            </Box>
          </Box>

          {/* The Reviews */}
          <Box
            sx={{
              position: { xs: "static", md: "sticky" },
              top: 170,
            }}
          >
            <Card
              sx={{
                p: 3,
                borderRadius: 2,
                background: "#1e1e1e",
                boxShadow: "0 0 20px rgba(0,240,255,0.05)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Overlay for non logged in users */}
              {!currentUser && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 10,
                    background: "rgba(0,0,0,0.6)",
                    backdropFilter: "blur(10px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    textAlign: "center",
                    p: 2,
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    🚫 Please Log In
                  </Typography>
                  <Typography sx={{ mb: 3 }}>
                    Log in or create an account to write a review.
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      variant="outlined"
                      sx={{
                        color: "#00f0ff",
                        borderColor: "#00f0ff",
                      }}
                      onClick={() => navigate("/loginPage")}
                    >
                      🔐 Log In
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{
                        color: "#00f0ff",
                        borderColor: "#00f0ff",
                      }}
                      onClick={() => navigate("/registerPage")}
                    >
                      ✨ Sign Up
                    </Button>
                  </Box>
                  <Button
                    variant="outlined"
                    sx={{
                      color: "#00f0ff",
                      borderColor: "#00f0ff",
                      mt: "20px",
                    }}
                    onClick={() => navigate("/")}
                  >
                    ⬅️ Back
                  </Button>
                </Box>
              )}

              {/* Blur only when not logged in */}
              <Box
                sx={{
                  filter: currentUser ? "none" : "blur(4px)",
                  pointerEvents: currentUser ? "auto" : "none",
                }}
              >
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ color: "#00f0ff" }}
                >
                  🎮 Write Your Review
                </Typography>

                <TextField
                  label="Review Title"
                  variant="outlined"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  fullWidth
                  sx={input}
                />

                {/* rating */}
                <Rating
                  value={rating}
                  precision={0.5}
                  icon={<Favorite fontSize="inherit" />}
                  emptyIcon={<FavoriteBorder fontSize="inherit" />}
                  onChange={(e, newValue) => setRating(newValue)}
                  sx={{
                    mb: 2,
                    "& .MuiRating-iconFilled": {
                      color: "#ff4d6d",
                      textShadow: "0 0 8px #ff4d6d",
                    },
                    "& .MuiRating-iconHover": {
                      color: "#ff8095",
                    },
                    "& .MuiRating-iconEmpty": {
                      color: "#555",
                    },
                  }}
                />

                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Your thoughts..."
                  variant="outlined"
                  sx={input}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<Upload />}
                    sx={{ color: "#00f0ff", borderColor: "#00f0ff" }}
                  >
                    Upload Screenshot
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files.length > 0)
                          setImage(e.target.files[0]);
                      }}
                    />
                  </Button>

                  {image && (
                    <Box sx={{ ml: 2, position: "relative" }}>
                      <Typography sx={{ color: "lightgray" }}>
                        {image.name}
                      </Typography>
                      <Button
                        size="small"
                        sx={{ color: "red", minWidth: 0, ml: 1 }}
                        onClick={() => setImage(null)}
                      >
                        ✖
                      </Button>
                    </Box>
                  )}
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    background: "#00f0ff",
                    color: "black",
                    fontWeight: "bold",
                    "&:hover": { background: "#00c0cc" },
                  }}
                  onClick={handleSubmit}
                >
                  Submit Review
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 2,
                    background: "#00f0ff",
                    color: "black",
                    fontWeight: "bold",
                    "&:hover": { background: "#00c0cc" },
                  }}
                  onClick={() => navigate("/")}
                >
                  ⬅️ Back to Home
                </Button>
              </Box>
            </Card>
          </Box>
        </Box>
      </Box>
    </>
  );
}
