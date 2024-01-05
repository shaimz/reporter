import axios from 'axios';
import { API_URL } from './config.js'; // Adjust the import path as necessary

// Register User
export const registerUser = async (email, password, name) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { email, password, name });
    console.log('User registered:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error.response.data);
    throw error.response.data;
  }
};

// Login User
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    console.log('Login successful:', response.data);
    localStorage.setItem('token', response.data.token); // Save token in localStorage
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error.response.data);
    throw error.response.data;
  }
};

// Get User Info
export const getUserInfo = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }
  try {
    const response = await axios.get(`${API_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user info:', error.response.data);
    throw error.response.data;
  }
};


export const currentUser = async () => {
  const uid = localStorage.getItem('uid');
  if (!uid) {
      throw new Error('No UID found');
  }
  return { uid };
}