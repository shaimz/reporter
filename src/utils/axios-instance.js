import axios from "axios";

// Create an instance of axios with a custom config
const instance = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;