import axios from 'axios';

const API_URL = 'http://localhost:5000/api/images';

export const fetchImages = () => {
  return axios.get(API_URL);
};

export const uploadImage = (formData, token) => {
  return axios.post(API_URL, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
