import axios from "axios";
import { API_URL } from "./constants";

// Get all feedbacks
export const getFeedbacks = async () => {
  try {
    const res = await axios.get(`${API_URL}feedbacks`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Create new feedback
export const createFeedback = async (feedbackData, token) => {
  try {
    const res = await axios.post(`${API_URL}feedbacks`, feedbackData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Delete a feedback by ID
export const deleteFeedback = async (id, token) => {
  try {
    const res = await axios.delete(`${API_URL}feedbacks/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};
