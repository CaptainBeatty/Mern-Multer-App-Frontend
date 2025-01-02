import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import PhotoForm from './components/PhotoForm';
import PhotoList from './components/PhotoList';
import PhotoDetails from './components/PhotoDetails';
import Register from './components/Register';
import Login from './components/Login';
import Header from './components/Header';

import { jwtDecode } from 'jwt-decode';

const App = () => {
  const [photos, setPhotos] = useState([]);
  const [username, setUsername] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showPhotoForm, setShowPhotoForm] = useState(false);

  // Charger les photos depuis le backend
  const fetchPhotos = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/photos');
      setPhotos(res.data);
    } catch (err) {
      console.error('Erreur lors de la récupération des photos:', err);
    }
  };

  // Gérer la connexion
  const handleLoginSuccess = (username) => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUsername(username);
      setCurrentUserId(decodedToken.id);
      localStorage.setItem('username', username);
      setShowLogin(false);
    }
    fetchPhotos();
  };

  // Gérer la déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUsername('');
    setCurrentUserId(null);
    setShowPhotoForm(false);
    setShowLogin(false);
    setShowRegister(false);
    fetchPhotos();
  };

  // Gérer la bascule des formulaires
  const handleLoginToggle = () => {
    setShowLogin((prevState) => !prevState);
    setShowRegister(false);
    setShowPhotoForm(false);
  };

  const handleRegisterToggle = () => {
    setShowRegister((prevState) => !prevState);
    setShowLogin(false);
    setShowPhotoForm(false);
  };

  const handlePhotoFormToggle = () => {
    setShowPhotoForm((prevState) => !prevState);
    setShowLogin(false);
    setShowRegister(false);
  };

  // Charger les données utilisateur et les photos au montage du composant
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUsername(storedUsername || decodedToken.username);
      setCurrentUserId(decodedToken.id);
    }
    fetchPhotos();
  }, []);

  return (
    <Router>
      <Header
        username={username}
        onLogout={handleLogout}
        onShowLogin={handleLoginToggle}
        onShowRegister={handleRegisterToggle}
        onTogglePhotoForm={handlePhotoFormToggle}
        isPhotoFormOpen={showPhotoForm}
        isLoginOpen={showLogin}
        isRegisterOpen={showRegister}
      />
      <div style={{ padding: '20px' }}>
        {showLogin && (
          <div style={{ position: 'relative', zIndex: 100 }}>
            <Login onLoginSuccess={handleLoginSuccess} />
          </div>
        )}
        {showRegister && (
          <div style={{ position: 'relative', zIndex: 100 }}>
            <Register />
          </div>
        )}
        <Routes>
          <Route
            path="/"
            element={
              <div>
                {showPhotoForm && username && (
                  <PhotoForm
                    onPhotoAdded={fetchPhotos}
                    onClose={() => setShowPhotoForm(false)}
                  />
                )}
                <PhotoList
                  photos={photos}
                  onPhotoDeleted={fetchPhotos}
                  currentUserId={currentUserId}
                />
              </div>
            }
          />
          <Route
            path="/photo/:id"
            element={
              <div>
                {showPhotoForm && username && (
                  <PhotoForm
                    onPhotoAdded={fetchPhotos}
                    onClose={() => setShowPhotoForm(false)}
                  />
                )}
                <PhotoDetails
                currentUserId={currentUserId}
                onPhotoDeleted={fetchPhotos}
              />
              </div>
              
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
