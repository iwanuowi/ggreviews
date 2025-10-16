import axios from "axios";
import { API_URL } from "./constants";

// Add a new review (user or admin)
export const addReview = async (gameId, reviewData, token) => {
  const res = await axios.post(
    `${API_URL}/games/${gameId}/reviews`,
    reviewData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

// Get all reviews for a game
export const getReviewsByGame = async (gameId) => {
  const res = await axios.get(`${API_URL}/games/${gameId}/reviews`);
  return res.data;
};

// Get a single review by ID
export const getReviewById = async (reviewId) => {
  const res = await axios.get(`${API_URL}reviews/${reviewId}`);
  return res.data;
};

// Update review (user or admin)
export const updateReview = async (reviewId, updateData, token) => {
  const res = await axios.put(`${API_URL}reviews/${reviewId}`, updateData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Delete review (admin only)
export const deleteReview = async (reviewId, token) => {
  const res = await axios.delete(`${API_URL}reviews/${reviewId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
