import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PhotoForm from './components/PhotoForm';
import PhotoList from './components/PhotoList';
import Register from './components/Register';
import Login from './components/Login';

const App = () => {
  const [photos, setPhotos] = useState([]);
  const [username, setUsername] = useState('');

  // Fonction appelée après connexion
  const handleLoginSuccess = (username) => {
    setUsername(username);
  };

   // Fonction de déconnexion
   const handleLogout = () => {
    localStorage.removeItem('token'); // Supprimer le token JWT
    setUsername(''); // Réinitialiser le state
  };

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/photos');
        setPhotos(res.data);
      } catch (err) {
        console.error('Erreur lors de la récupération des photos:', err);
      }
    };
    fetchPhotos();
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
        </div>
      ) : (
        <>
          <Register />
          <Login onLoginSuccess={handleLoginSuccess} />
        </>
      )}
      <h1>Photo Upload App</h1>
      <PhotoForm onPhotoAdded={handlePhotoAdded} />
      <PhotoList
        photos={photos}
        onPhotoDeleted={handlePhotoDeleted}
        onPhotoUpdated={handlePhotoUpdated}
      />
    </div>
    
  );
};

export default App;
