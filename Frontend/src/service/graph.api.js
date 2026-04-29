import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});


export const runGraph = async (userMessage) => {
  try {
    const response = await api.post("/run-graph", { userMessage });
    return response.data.result;
  } catch (error) {
    console.error("Error running graph:", error);
    throw error;
  }
};
