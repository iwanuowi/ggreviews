import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  TextField,
  Button,
  Rating,
  Paper,
} from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import Swal from "sweetalert2";

import {
  getFeedbacks,
  createFeedback,
  deleteFeedback,
} from "../utils/api_feedbacks";
import Header from "../components/Header";

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setCurrentUser(JSON.parse(storedUser));

    // const fetchAllFeedbacks = async () => {
    //   try {
    //     const data = await getFeedbacks();
    //     setFeedbacks(data);
    //   } catch (err) {
    //     console.error("Error fetching feedbacks:", err);
    //   }
    // };

    const fetchAllFeedbacks = async () => {
      try {
        const data = await getFeedbacks();
        setFeedbacks(data);
      } catch (err) {
        console.error("Error fetching feedbacks:", err);
      }
    };

    useEffect(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setCurrentUser(JSON.parse(storedUser));

      fetchAllFeedbacks(); // call it here on mount
    }, []);

    fetchAllFeedbacks();
  }, []);

  const handleSubmit = async () => {
    if (!message.trim() || rating === 0) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Feedback",
        text: "Please provide a message and rating before submitting.",
        background: "#1a1a1a",
        color: "white",
      });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await createFeedback({ message, rating }, token);

      setMessage("");
      setRating(0);

      Swal.fire({
        icon: "success",
        title: "Feedback Submitted!",
        background: "#1a1a1a",
        color: "white",
        timer: 1500,
        showConfirmButton: false,
      });

      fetchAllFeedbacks();
    } catch (err) {
      console.error("Error submitting feedback:", err);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: err.response?.data?.error || "Please try again.",
        background: "#1a1a1a",
        color: "white",
      });
    } finally {
      setLoading(false);
    }
  };

  ///
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const confirmed = await Swal.fire({
        title: "Are you sure?",
        text: "This feedback will be permanently deleted!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });

      if (confirmed.isConfirmed) {
        await deleteFeedback(id, token);

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Feedback has been deleted.",
          timer: 1500,
          showConfirmButton: false,
        });

        fetchAllFeedbacks();
      }
    } catch (err) {
      console.error("Delete failed:", err);
      Swal.fire({
        icon: "error",
        title: "Deletion Failed",
        text: err.error || "Please try again.",
      });
    }
  };

  return (
    <>
      <div style={{ position: "fixed", top: 0, width: "100%", zIndex: 1000 }}>
        <Header />
      </div>

      <Box sx={{ maxWidth: "800px", mx: "auto", p: 3, mt: "80px" }}>
        <Card sx={{ p: 3, mb: 4, background: "#1e1e1e", borderRadius: 2 }}>
          {/* check if the user is logged in */}
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
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                🚫 Please Log In
              </Typography>
              <Typography sx={{ mb: 3 }}>
                Log in to submit your feedback.
              </Typography>
              <Button
                variant="contained"
                sx={{
                  background: "#00f0ff",
                  color: "black",
                  fontWeight: "bold",
                  "&:hover": { background: "#00c0cc" },
                }}
                onClick={() => (window.location.href = "/loginPage")}
              >
                🔐 Log In
              </Button>
            </Box>
          )}

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
              📝 Submit Feedback
            </Typography>

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
                "& .MuiRating-iconEmpty": { color: "#555" },
              }}
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Your feedback..."
              variant="outlined"
              sx={{
                mb: 2,
                background: "#2b2b2b",
                "& .MuiInputBase-input": { color: "white" },
                "& .MuiInputLabel-root": { color: "white" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#00f0ff" },
                  "&:hover fieldset": { borderColor: "#00c0cc" },
                  "&.Mui-focused fieldset": { borderColor: "#00f0ff" },
                },
              }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

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
              disabled={loading}
            >
              Submit Feedback
            </Button>
          </Box>
        </Card>

        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ color: "#00f0ff", mb: 2 }}
        >
          🗒️ All Feedback
        </Typography>

        {feedbacks.map((fb) => (
          <Paper
            key={fb._id}
            sx={{
              p: 2,
              mb: 2,
              background: "#1a1a1a",
              color: "white",
              borderRadius: 2,
            }}
          >
            {fb.user?.name}
            {fb.user?.role === "admin" && (
              <Box
                component="span"
                sx={{
                  backgroundColor: "#ff4d6d",
                  color: "white",
                  borderRadius: "4px",
                  px: 0.5,
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                }}
              >
                ADMIN
              </Box>
            )}
            – {fb.rating}⭐<Typography variant="body2">{fb.message}</Typography>
            <Typography
              variant="caption"
              sx={{ color: "gray", mt: 1, display: "block" }}
            >
              {new Date(fb.createdAt).toLocaleString()}
            </Typography>
            {(currentUser?.role === "admin" ||
              fb.user?._id === currentUser?._id) && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                sx={{ mt: 1 }}
                onClick={() => handleDelete(fb._id)}
              >
                Delete
              </Button>
            )}
          </Paper>
        ))}
      </Box>
    </>
  );
}
