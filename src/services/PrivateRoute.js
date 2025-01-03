import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const isLoggedIn = token && jwtDecode(token).exp > Date.now() / 1000;

  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
