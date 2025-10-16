import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography } from "@mui/material";
import Swal from "sweetalert2";
import axios from "axios";
import Header from "../components/Header";
import { API_URL } from "../utils/constants";

export default function ReviewCommentEditPage() {
  const { commentId } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComment();
  }, [commentId]);

  const fetchComment = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}comments/single/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContent(res.data.content);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching comment:", err);
      Swal.fire("Error", "Failed to load comment.", "error");
      navigate(-1);
    }
  };

  const handleUpdate = async () => {
    if (!content.trim()) {
      Swal.fire("Warning", "Comment cannot be empty!", "warning");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}comments/${commentId}`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Your comment has been updated successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate(-1); // go back to comments list
    } catch (err) {
      console.error("Error updating comment:", err);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to update comment.",
        "error"
      );
    }
  };

  if (loading) return null;

  return (
    <>
      <div style={{ position: "fixed", top: 0, width: "100%", zIndex: 1000 }}>
        <Header />
      </div>

      <Box
        sx={{
          maxWidth: "700px",
          margin: "120px auto",
          background: "#121212",
          borderRadius: 3,
          p: 3,
          boxShadow: "0 0 25px rgba(0,240,255,0.1)",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ color: "#00f0ff", mb: 2 }}
        >
          ✏️ Edit Comment
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{
            mb: 2,
            background: "#1e1e1e",
            input: { color: "white" },
            "& .MuiInputLabel-root": { color: "#ccc" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#00f0ff" },
              "&:hover fieldset": { borderColor: "#00c0cc" },
              "&.Mui-focused fieldset": { borderColor: "#00f0ff" },
              "& textarea": { color: "#fff" },
            },
          }}
        />

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            sx={{
              background: "#00f0ff",
              color: "black",
              fontWeight: "bold",
              "&:hover": { background: "#00c0cc" },
            }}
            onClick={handleUpdate}
          >
            💾 Save Changes
          </Button>

          <Button
            variant="outlined"
            sx={{
              color: "#00f0ff",
              borderColor: "#00f0ff",
              "&:hover": {
                borderColor: "#00c0cc",
                background: "rgba(0,240,255,0.1)",
              },
            }}
            onClick={() => navigate(-1)}
          >
            ❌ Cancel
          </Button>
        </Box>
      </Box>
    </>
  );
}
