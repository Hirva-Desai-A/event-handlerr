

import axios from "axios";

// Create an Axios instance
const API = axios.create({
    baseURL: "http://localhost:5000/api"
    , // Make sure this matches your backend URL
});

// This automatically attaches the token to every request!
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;