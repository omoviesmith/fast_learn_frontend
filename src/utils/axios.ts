import axios from "axios";

//
const axiosInstance = axios.create({
  baseURL: "https://knowledge-base-ph4g.onrender.com",
  withCredentials: true,
});

//
export default axiosInstance;
