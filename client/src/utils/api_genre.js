import axios from "axios";

import { API_URL } from "../utils/constants";

export const getGenres = async () => {
  const res = await axios.get(`${API_URL}genres`);
  return res.data;
};

export const addGenre = async (name) => {
  const res = await axios.post(`${API_URL}genres`, { name });
  return res.data;
};

export const deleteGenre = async (id) => {
  const res = await axios.delete(`${API_URL}genres/${id}`);
  return res.data;
};
