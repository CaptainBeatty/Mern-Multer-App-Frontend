import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import PhotoForm from './components/PhotoForm';
import PhotoList from './components/PhotoList';
import PhotoDetails from './components/PhotoDetails'; // Importer le composant de détails
import Register from './components/Register';
import Login from './components/Login';
import { jwtDecode } from 'jwt-decode';

const App = () => {
  const [photos, setPhotos] = useState([]); // Toutes les photos publiées
  const [username, setUsername] = useState(''); // Nom d'utilisateur connecté
  const [currentUserId, setCurrentUserId] = useState(null); // ID de l'utilisateur connecté
  const [showLogin, setShowLogin] = useState(false); // Afficher ou cacher le formulaire de connexion
  const [showRegister, setShowRegister] = useState(false); // Afficher ou cacher le formulaire d'inscription

  // Fonction pour récupérer les photos depuis le backend
  const fetchPhotos = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/photos'); // Récupérer toutes les photos
      setPhotos(res.data); // Stocker les photos dans l'état
    } catch (err) {
      console.error('Erreur lors de la récupération des photos:', err);
    }
  };

  // Fonction appelée après connexion réussie
  const handleLoginSuccess = (username) => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token); // Décoder le token JWT
      setUsername(username);
      setCurrentUserId(decodedToken.id);
      localStorage.setItem('username', username); // Stocker le username dans le localStorage
      setShowLogin(false); // Fermer le formulaire de connexion après succès
    }
    fetchPhotos(); // Charger les photos après connexion
  };

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token'); // Supprimer le token du localStorage
    localStorage.removeItem('username'); // Supprimer le nom d'utilisateur
    setUsername('');
    setCurrentUserId(null);
    fetchPhotos(); // Recharger les photos après déconnexion
  };

  // Charger les photos et les informations utilisateur au démarrage de l'application
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (token) {
      const decodedToken = jwtDecode(token); // Décoder le token JWT
      setUsername(storedUsername || decodedToken.username); // Charger le username depuis le localStorage ou le token
      setCurrentUserId(decodedToken.id); // Charger l'ID utilisateur
    }
    fetchPhotos(); // Charger les photos publiées
  }, []);

  const handlePhotoAdded = (newPhoto) => {
    setPhotos([newPhoto, ...photos]); // Ajouter la nouvelle photo à la liste
  };

  const handlePhotoDeleted = (id) => {
    setPhotos(photos.filter((photo) => photo._id !== id)); // Retirer la photo supprimée de la liste
  };

  const handlePhotoUpdated = (updatedPhoto) => {
    setPhotos(photos.map((photo) => (photo._id === updatedPhoto._id ? updatedPhoto : photo))); // Mettre à jour la photo modifiée
  };

  return (
    <Router>
      <Routes>
        {/* Route pour la page d'accueil */}
        <Route
          path="/"
          element={
            <div>
              <h1>Galerie de Photos</h1>
              {username ? (
                <div>
                  <h2>Bonjour, {username} !</h2>
                  <button onClick={handleLogout}>Se déconnecter</button>
                  <PhotoForm onPhotoAdded={handlePhotoAdded} />
                </div>
              ) : (
                <div>
                  <h2>Bienvenue sur la galerie !</h2>
                  <p>Connectez-vous ou créez un compte pour publier, modifier ou supprimer des photos.</p>
                  <div>
                    <button onClick={() => setShowLogin(true)}>Se connecter</button>
                    <button onClick={() => setShowRegister(true)}>S'inscrire</button>
                  </div>
                  {showLogin && <Login onLoginSuccess={handleLoginSuccess} />}
                  {showRegister && <Register />}
                </div>
              )}
              <PhotoList
                photos={photos}
                onPhotoDeleted={handlePhotoDeleted}
                onPhotoUpdated={handlePhotoUpdated}
                currentUserId={currentUserId} // ID utilisateur pour activer/désactiver les boutons
              />
            </div>
          }
        />
        {/* Route pour les détails de la photo */}
        <Route
          path="/photo/:id"
          element={<PhotoDetails currentUserId={currentUserId} onPhotoDeleted={handlePhotoDeleted} // Passer la fonction au composant PhotoDetails
          /> }
        />
      </Routes>
    </Router>
  );
};

export default App;
