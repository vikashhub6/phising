import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api/auth`;

export const registerService = (data) => axios.post(`${API}/register`, data);
export const loginService = (data) => axios.post(`${API}/login`, data);
export const getProfileService = () => axios.get(`${API}/profile`);


console.log("API URL for authService:", API);


