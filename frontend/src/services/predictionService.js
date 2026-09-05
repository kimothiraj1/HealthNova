import axios from 'axios';

const API_URL = 'http://localhost:5000/api/predict';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const getPrediction = async (inputData) => {
  const response = await axios.post(API_URL, inputData, getAuthHeader());
  return response.data;
};