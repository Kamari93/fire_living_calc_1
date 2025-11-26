// filepath: client/src/services/auth.js
import axios from "axios";
// const API = "http://localhost:5000/api/auth";
const API = "https://firelivingcalc1server.vercel.app/api/auth";

axios.defaults.withCredentials = true;

export const register = (email, password) =>
  axios.post(`${API}/register`, { email, password });

export const login = (email, password) =>
  axios.post(`${API}/login`, { email, password });
// This file contains functions to interact with the authentication API for user registration and login.
// It uses axios to send HTTP requests to the backend server.
