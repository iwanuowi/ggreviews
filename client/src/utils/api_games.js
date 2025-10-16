import axios from "axios";
import { API_URL } from "./constants";

// Get all games
export const getGames = async () => {
  try {
    const res = await axios.get(`${API_URL}/games`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Get single game
export const getGame = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/games/${id}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Add a new game
export const addGame = async (gameData, token) => {
  try {
    const res = await axios.post(`${API_URL}/games`, gameData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Update a game
export const updateGame = async (id, gameData, token) => {
  try {
    const res = await axios.put(`${API_URL}/games/${id}`, gameData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Delete a game
export const deleteGame = async (id, token) => {
  try {
    const res = await axios.delete(`${API_URL}/games/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Like a Game
export const likeGame = async (gameId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${API_URL}/games/${gameId}/like`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // response.data contains: { message, likesCount, liked }
    return response.data;
  } catch (err) {
    // throw the error so the component can catch it
    throw err.response?.data || err;
  }
};
