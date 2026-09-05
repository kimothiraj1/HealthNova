import axios from 'axios';

const API_URL = 'http://localhost:5000/api/logs';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const createHealthLog = async (logData) => {
  const response = await axios.post(API_URL, logData, getAuthHeader());
  return response.data;
};

export const getMyHealthLogs = async () => {
  const response = await axios.get(API_URL, getAuthHeader());
  return response.data;
};