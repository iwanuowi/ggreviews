import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Rating,
} from "@mui/material";
import { Upload, Favorite, FavoriteBorder } from "@mui/icons-material";
import Header from "../components/Header";
import axios from "axios";
import Swal from "sweetalert2";
import { API_URL } from "../utils/constants";

export default function EditReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [gamePost, setGamePost] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // Load existing post when page opens
  useEffect(() => {
    const fetchGamePost = async () => {
      try {
        const res = await axios.get(`${API_URL}reviews/${id}`);
        const post = res.data;
        setGamePost(post);

        // Fill form fields with existing data
        setTitle(post.title || "");
        setContent(post.content || "");
        setRating(post.rating || 0);
        setPreview(post.image ? `${API_URL}${post.image}` : null);
      } catch (err) {
        console.error("Error fetching game post:", err);
      }
    };
    fetchGamePost();
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    {
      console.log("Preview URL:", preview);
    }
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("rating", rating);
      if (image) formData.append("image", image);

      await axios.put(`${API_URL}reviews/${id}`, formData, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        icon: "success",
        title: "Game Review Updated!",
        text: "Your review has been successfully updated.",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => navigate(-1));
    } catch (err) {
      console.error("Error updating game post:", err);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Something went wrong while updating your review.",
      });
    }
  };

  if (!gamePost)
    return (
      <Typography sx={{ textAlign: "center", mt: 4, color: "#ccc" }}>
        Loading review...
      </Typography>
    );
  console.log("Preview URL:", preview);
  return (
    <>
      <Header />
      <Box sx={{ maxWidth: "700px", margin: "100px auto", p: 3 }}>
        <Card
          sx={{
            p: 3,
            borderRadius: 2,
            background: "#1e1e1e",
            boxShadow: "0 0 20px rgba(0,240,255,0.05)",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
            sx={{ color: "#00f0ff" }}
          >
            ✏️ Edit Your Game Review
          </Typography>

          {/* Title */}
          <TextField
            label="Review Title"
            fullWidth
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{
              mb: 2,
              background: "#2b2b2b",
              input: { color: "white" },
              "& .MuiInputLabel-root": { color: "white" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#00f0ff" },
                "&:hover fieldset": { borderColor: "#00c0cc" },
                "&.Mui-focused fieldset": { borderColor: "#00f0ff" },
              },
            }}
          />

          {/* Rating */}
          <Rating
            value={Number(rating)}
            precision={0.5}
            onChange={(e, newValue) => setRating(newValue)}
            icon={<Favorite fontSize="inherit" />}
            emptyIcon={<FavoriteBorder fontSize="inherit" />}
            sx={{
              mb: 2,
              "& .MuiRating-iconFilled": { color: "#ff4d6d" },
              "& .MuiRating-iconHover": { color: "#ff8095" },
              "& .MuiRating-iconEmpty": { color: "#555" },
            }}
          />

          {/* Content */}
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your thoughts..."
            variant="outlined"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{
              mb: 2,
              background: "#2b2b2b",
              input: { color: "white" },
              "& .MuiInputLabel-root": { color: "white" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#00f0ff" },
                "&:hover fieldset": { borderColor: "#00c0cc" },
                "&.Mui-focused fieldset": { borderColor: "#00f0ff" },
                "& textarea": { color: "#fff" },
              },
            }}
          />

          {/* Image Upload */}
          <Button
            variant="outlined"
            component="label"
            startIcon={<Upload />}
            sx={{ color: "#00f0ff", borderColor: "#00f0ff", mb: 2 }}
          >
            Upload New Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>

          {preview && (
            <Box sx={{ textAlign: "center", mb: 2 }}>
              <img
                src={preview.content}
                alt="Preview"
                style={{
                  width: "100%",
                  maxHeight: "250px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
            </Box>
          )}

          {/* Save Button */}
          <Button
            variant="contained"
            fullWidth
            sx={{
              background: "#00f0ff",
              color: "black",
              fontWeight: "bold",
              "&:hover": { background: "#00c0cc" },
            }}
            onClick={handleUpdate}
          >
            Save Changes
          </Button>

          {/* Cancel */}
          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              background: "#333",
              color: "#fff",
              "&:hover": { background: "#555" },
            }}
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
        </Card>
      </Box>
    </>
  );
}
