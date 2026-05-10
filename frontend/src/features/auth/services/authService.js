import axios from "axios";

const API = "/api/auth";

export const registerService = (data) => axios.post(`${API}/register`, data);
export const loginService = (data) => axios.post(`${API}/login`, data);
export const getProfileService = () => axios.get(`${API}/profile`);
