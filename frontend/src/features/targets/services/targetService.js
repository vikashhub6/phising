import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api/targets`;

export const getTargetsService = () => axios.get(API);
export const getTargetService = (id) => axios.get(`${API}/${id}`);
export const createTargetService = (data) => axios.post(API, data);
export const updateTargetService = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteTargetService = (id) => axios.delete(`${API}/${id}`);
