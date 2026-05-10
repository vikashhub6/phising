import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api/emails`;

export const generateEmailService = (targetId) => axios.post(`${API}/generate`, { targetId });
export const sendEmailService = (data) => axios.post(`${API}/send`, data);
export const getCampaignsService = () => axios.get(`${API}/campaigns`);
