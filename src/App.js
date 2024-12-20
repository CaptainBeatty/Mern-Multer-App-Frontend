import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PhotoForm from './components/PhotoForm';
import PhotoList from './components/PhotoList';
import Register from './components/Register';
import Login from './components/Login';
import {jwtDecode} from 'jwt-decode';

const App = () => {
  const [photos, setPhotos] = useState([]);
  const [username, setUsername] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);

  // Fonction pour récupérer les photos depuis le backend
  const fetchPhotos = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/photos');
      setPhotos(res.data); // Mettre à jour les photos dans l'état
    } catch (err) {
      console.error('Erreur lors de la récupération des photos:', err);
    }
  };

  // Fonction appelée après connexion réussie
  const handleLoginSuccess = (username) => {
    const token = localStorage.getItem('token');
    console.log('Token après connexion :', token);
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log('Token décodé :', decodedToken);
      setUsername(username);
      setCurrentUserId(decodedToken.id);
      localStorage.setItem('username', username); // Stocker le nom d'utilisateur
      fetchPhotos(); // Charger les photos après connexion
    }
  };

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token'); // Supprimer le token du localStorage
    localStorage.removeItem('username'); // Supprimer le nom d'utilisateur
    setUsername('');
    setCurrentUserId(null);
    setPhotos([]); // Réinitialiser les photos
  };

  // Charger les informations utilisateur depuis le localStorage au démarrage de l'application
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    console.log('Token au démarrage :', token);
    console.log('Nom utilisateur stocké :', storedUsername);
    if (token) {
      const decodedToken = jwtDecode(token);
      setUsername(storedUsername || decodedToken.username);
      setCurrentUserId(decodedToken.id);
      fetchPhotos(); // Charger les photos
    }
  }, []);

  const handlePhotoAdded = (newPhoto) => {
    setPhotos([newPhoto, ...photos]);
  };

  const handlePhotoDeleted = (id) => {
    setPhotos(photos.filter((photo) => photo._id !== id));
  };

  const handlePhotoUpdated = (updatedPhoto) => {
    setPhotos(photos.map((photo) => (photo._id === updatedPhoto._id ? updatedPhoto : photo)));
  };

  return (
    <div>
      <h1>Authentification</h1>
      {username ? (
        <div>
          <h2>Bonjour, {username} !</h2>
          <button onClick={handleLogout}>Se déconnecter</button>
          <h1>Photo Upload App</h1>
          <PhotoForm onPhotoAdded={handlePhotoAdded} />
          <PhotoList
            photos={photos}
            onPhotoDeleted={handlePhotoDeleted}
            onPhotoUpdated={handlePhotoUpdated}
            currentUserId={currentUserId}
          />
        </div>
      ) : (
        <>
          <Register />
          <Login onLoginSuccess={handleLoginSuccess} />
        </>
      )}
    </div>
  );
};

export default App;
