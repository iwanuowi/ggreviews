import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  IconButton,
} from "@mui/material";
import { Edit, Delete, Save, Close } from "@mui/icons-material";
import Header from "../components/Header";
import axios from "axios";
import { API_URL } from "../utils/constants";
import Swal from "sweetalert2";

export default function ReviewCommentsPage() {
  const { reviewId } = useParams();
  const [gameId, setGameId] = useState(null);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  // const [editingCommentId, setEditingCommentId] = useState(null);
  // const [editedContent, setEditedContent] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setCurrentUser(JSON.parse(storedUser));
    fetchComments();
  }, [reviewId]);

  const fetchComments = async () => {
    try {
      const res = await axios.get(`${API_URL}comments/${reviewId}`);
      setComments(res.data);
      // Fetch review to get gameId
      const reviewRes = await axios.get(`${API_URL}reviews/${reviewId}`);
      setGameId(reviewRes.data.game); // gameId is review.game
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}comments/${reviewId}`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This comment will be deleted.",
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
      await axios.delete(`${API_URL}comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "The comment has been deleted.",
        showConfirmButton: false,
        timer: 1500,
        background: "#1a1a1a",
        color: "white",
      });
      //navigate back to game and trigger refresh
      navigate(`/games/${gameId}`, { state: { refresh: true } });
    } catch (err) {
      console.error("Error deleting comment:", err);
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: err.response?.data?.message || "Could not delete comment.",
        background: "#1a1a1a",
        color: "white",
      });
    }
  };

  const isOwnerOrAdmin = (comment) => {
    return (
      currentUser &&
      (comment.user?._id === currentUser._id || currentUser.role === "admin")
    );
  };

  return (
    <>
      <div style={{ position: "fixed", top: 0, width: "100%", zIndex: 1000 }}>
        <Header />
      </div>

      <Box
        sx={{
          maxWidth: "800px",
          margin: "100px auto",
          p: 3,
          background: "#121212",
          borderRadius: 3,
          boxShadow: "0 0 25px rgba(0,240,255,0.1)",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ color: "#00f0ff", mb: 3 }}
        >
          💬 Comments
        </Typography>

        {currentUser ? (
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{
                mb: 2,
                background: "#1e1e1e",
                input: { color: "white" },
                "& .MuiInputBase-input": {
                  color: "white",
                },
                "& .MuiInputLabel-root": { color: "#ccc" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#00f0ff" },
                  "&:hover fieldset": { borderColor: "#00c0cc" },
                  "&.Mui-focused fieldset": { borderColor: "#00f0ff" },
                },
              }}
            />
            <Button
              variant="contained"
              sx={{
                background: "#00f0ff",
                color: "black",
                fontWeight: "bold",
                "&:hover": { background: "#00c0cc" },
              }}
              onClick={handleAddComment}
            >
              ➕ Post Comment
            </Button>
          </Box>
        ) : (
          <Typography sx={{ color: "gray", mb: 3 }}>
            Please log in to add a comment.
          </Typography>
        )}

        <Divider sx={{ mb: 3, borderColor: "rgba(0,240,255,0.2)" }} />

        {comments.length > 0 ? (
          comments.map((comment) => (
            <Card
              key={comment._id}
              sx={{
                mb: 2,
                background: "#1a1a1a",
                border: "1px solid rgba(0,240,255,0.08)",
                p: 1,
              }}
            >
              <CardContent>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: "#00f0ff",
                    fontWeight: "bold",
                    mb: 0.5,
                  }}
                >
                  {comment.user?.name} {""}
                  <span style={{ color: "gray", fontWeight: "normal" }}>
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                  <Typography sx={{ color: "white" }}>
                    {comment.content}
                  </Typography>
                </Typography>

                {isOwnerOrAdmin(comment) && (
                  <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: "#00f0ff",
                        color: "#00f0ff",
                        textTransform: "none",
                        "&:hover": {
                          borderColor: "#00c0cc",
                          background: "rgba(0,240,255,0.1)",
                        },
                      }}
                      onClick={() => navigate(`/comments/${comment._id}/edit`)}
                    >
                      ✏️ Edit
                    </Button>

                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: "#ff4d4d",
                        color: "#ff4d4d",
                        textTransform: "none",
                        "&:hover": {
                          borderColor: "#ff1a1a",
                          background: "rgba(255, 77, 77, 0.1)",
                        },
                      }}
                      onClick={() => handleDeleteComment(comment._id)}
                    >
                      🗑 Delete
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography sx={{ color: "gray" }}>No comments yet.</Typography>
        )}

        <Button
          sx={{
            mt: 3,
            color: "#00f0ff",
            border: "1px solid #00f0ff",
            textTransform: "none",
          }}
          onClick={() => navigate(-1, { state: { refresh: true } })}
        >
          ⬅ Back to Reviews
        </Button>
      </Box>
    </>
  );
}
