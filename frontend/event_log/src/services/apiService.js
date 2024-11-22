import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

export const fetchLogs = async (filters = {}, limit = 50, skip = 0) => {
  try {
    const params = { filters, limit, skip };
    const response = await axios.get(`${API_BASE_URL}/logs`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching logs:", error);
    throw error;
  }
};
