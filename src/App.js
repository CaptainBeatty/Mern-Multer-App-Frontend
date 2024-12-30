import React, { useState, useEffect, useRef } from 'react';
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

  const loginFormRef = useRef(null);
  const registerFormRef = useRef(null);

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
    fetchPhotos();
  };

  // Fermer le formulaire d'ajout de photo
  const closePhotoForm = () => {
    setShowPhotoForm(false);
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

  // Fermer les formulaires au clic à l'extérieur
  const handleClickOutside = (e) => {
    if (
      !loginFormRef.current?.contains(e.target) &&
      !registerFormRef.current?.contains(e.target)
    ) {
      setShowLogin(false);
      setShowRegister(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Router>
      <Header
        username={username}
        onLogout={handleLogout}
        onShowLogin={() => {
          setShowLogin(!showLogin);
          setShowRegister(false);
          setShowPhotoForm(false);
        }}
        onShowRegister={() => {
          setShowRegister(!showRegister);
          setShowLogin(false);
          setShowPhotoForm(false);
        }}
        onTogglePhotoForm={() => {
          setShowPhotoForm(!showPhotoForm);
          setShowLogin(false);
          setShowRegister(false);
        }}
        isPhotoFormOpen={showPhotoForm}
      />
      <div style={{ padding: '20px' }}>
        {showLogin && (
          <div ref={loginFormRef} style={{ position: 'relative', zIndex: 100 }}>
            <Login onLoginSuccess={handleLoginSuccess} />
          </div>
        )}
        {showRegister && (
          <div ref={registerFormRef} style={{ position: 'relative', zIndex: 100 }}>
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
                    onPhotoAdded={fetchPhotos} // Recharger les photos après ajout
                    onClose={closePhotoForm} // Fermer le formulaire
                  />
                )}
                <PhotoList
                  photos={photos}
                  onPhotoDeleted={fetchPhotos} // Recharger les photos après suppression
                  currentUserId={currentUserId}
                />
              </div>
            }
          />
          <Route
            path="/photo/:id"
            element={
              <PhotoDetails
                currentUserId={currentUserId}
                onPhotoDeleted={fetchPhotos}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
