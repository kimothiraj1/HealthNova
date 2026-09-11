import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/predict`;

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const getPrediction = async (inputData) => {
  const response = await axios.post(API_URL, inputData, getAuthHeader());
  return response.data;
};