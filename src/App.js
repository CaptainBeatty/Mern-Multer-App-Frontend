import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import PhotoForm from './components/PhotoForm';
import PhotoList from './components/PhotoList';
import PhotoDetails from './components/PhotoDetails';
import Register from './components/Register';
import Login from './components/Login';
import Header from './components/Header'; // Importer le composant Header
import { jwtDecode } from 'jwt-decode';

const App = () => {
  const [photos, setPhotos] = useState([]); // Stocker les photos
  const [username, setUsername] = useState(''); // Nom de l'utilisateur connecté
  const [currentUserId, setCurrentUserId] = useState(null); // ID utilisateur
  const [showLogin, setShowLogin] = useState(false); // Afficher ou masquer Login
  const [showRegister, setShowRegister] = useState(false); // Afficher ou masquer Register
  const [showPhotoForm, setShowPhotoForm] = useState(false); // Afficher ou masquer le formulaire d'ajout de photo

  // Récupérer les photos depuis le backend
  const fetchPhotos = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/photos');
      setPhotos(res.data);
    } catch (err) {
      console.error('Erreur lors de la récupération des photos:', err);
    }
  };

  // Fonction appelée après une connexion réussie
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

  // Déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUsername('');
    setCurrentUserId(null);
    setShowPhotoForm(false); // Cacher le formulaire d'ajout au logout
    fetchPhotos();
  };

  // Charger les informations utilisateur et les photos au démarrage
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

  const handlePhotoAdded = (newPhoto) => {
    setPhotos([newPhoto, ...photos]);
    setShowPhotoForm(false); // Cacher le formulaire après ajout
  };

  const handlePhotoDeleted = (id) => {
    setPhotos(photos.filter((photo) => photo._id !== id));
  };

  const handlePhotoUpdated = (updatedPhoto) => {
    setPhotos(photos.map((photo) => (photo._id === updatedPhoto._id ? updatedPhoto : photo)));
  };

  return (
    <Router>
      {/* Intégration du Header */}
      <Header
        username={username}
        onLogout={handleLogout}
        onShowLogin={() => {
          setShowLogin(true);
          setShowRegister(false);
        }}
        onShowRegister={() => {
          setShowRegister(true);
          setShowLogin(false);
        }}
        onTogglePhotoForm={() => setShowPhotoForm(!showPhotoForm)} // Gérer l'affichage du formulaire d'ajout
      />
      <div style={{ padding: '20px' }}>
        <Routes>
          {/* Route pour la page principale */}
          <Route
            path="/"
            element={
              <div>
                {/* Login et Register affichés conditionnellement */}
                {showLogin && <Login onLoginSuccess={handleLoginSuccess} />}
                {showRegister && <Register />}
                {/* Formulaire d'ajout de photo */}
                {showPhotoForm && username && (
                  <div style={{ marginBottom: '20px' }}>
                    <PhotoForm onPhotoAdded={handlePhotoAdded} />
                  </div>
                )}
                {/* Liste des photos */}
                <PhotoList
                  photos={photos}
                  onPhotoDeleted={handlePhotoDeleted}
                  onPhotoUpdated={handlePhotoUpdated}
                  currentUserId={currentUserId}
                />
              </div>
            }
          />
          {/* Route pour les détails d'une photo */}
          <Route
            path="/photo/:id"
            element={
              <PhotoDetails
                currentUserId={currentUserId}
                onPhotoDeleted={handlePhotoDeleted}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
