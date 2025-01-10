import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import PhotoForm from './components/PhotoForm';
import PhotoList from './components/PhotoList';
import PhotoDetails from './components/PhotoDetails';
import Register from './components/Register';
import Login from './components/Login';
import Header from './components/Header';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import PrivateRoute from './services/PrivateRoute';
import { jwtDecode } from 'jwt-decode';

const App = () => {
  const [photos, setPhotos] = useState([]);
  const [username, setUsername] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // Contrôle global des modales
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

  // Gestion de la connexion réussie
  const handleLoginSuccess = (username) => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUsername(username);
      setCurrentUserId(decodedToken.id);
      localStorage.setItem('username', username);
      setActiveModal(null); // Ferme toutes les modales
    }
    fetchPhotos();
  };

  // Gestion de la déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUsername('');
    setCurrentUserId(null);
    setShowPhotoForm(false);
    setActiveModal(null); // Ferme toutes les modales
    fetchPhotos();
  };

  // Gestion des modales avec fermeture si déjà ouvertes
  const handleShowLogin = () => {
    setActiveModal((prev) => (prev === 'login' ? null : 'login'));
  };

  const handleShowRegister = () => {
    setActiveModal((prev) => (prev === 'register' ? null : 'register'));
  };

  const handleShowForgotPassword = () => {
    setActiveModal('forgotPassword');
  };

  // Toggle formulaire photo
  const handlePhotoFormToggle = () => {
    setShowPhotoForm((prevState) => !prevState);
    setActiveModal(null); // Ferme toutes les autres modales
  };

  // Charger les données utilisateur et photos au montage du composant
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
        onShowLogin={handleShowLogin}
        onShowRegister={handleShowRegister}
        onTogglePhotoForm={handlePhotoFormToggle}
        isPhotoFormOpen={showPhotoForm}
        isLoginOpen={activeModal === 'login'}
        isRegisterOpen={activeModal === 'register'}
      />
      <div style={{ padding: '20px' }}>
        {/* Modales */}
        {activeModal === 'login' && (
          <div style={{ position: 'relative', zIndex: 100 }}>
            <Login
              onLoginSuccess={handleLoginSuccess}
              onClose={() => setActiveModal(null)} // Ferme le formulaire login
              onForgotPassword={handleShowForgotPassword} // Affiche ForgotPassword
            />
          </div>
        )}
        {activeModal === 'forgotPassword' && (
          <div style={{ position: 'relative', zIndex: 100 }}>
            <ForgotPassword
              onCancel={() => setActiveModal(null)} // Ferme ForgotPassword
            />
          </div>
        )}
        {activeModal === 'register' && (
          <div style={{ position: 'relative', zIndex: 100 }}>
            <Register onClose={() => setActiveModal(null)} /> {/* Ajout de la gestion de fermeture */}
          </div>
        )}

        {/* Routes */}
        <Routes>
          {/* Routes publiques */}
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
          <Route path="/forgot-password" element={<ForgotPassword onCancel={() => setActiveModal(null)} />} />
          <Route
            path="/reset-password/:token"
            element={
              <ResetPassword
                onShowLogin={() => setActiveModal('login')} // Affiche uniquement Login après reset
              />
            }
          />

          {/* Routes protégées avec PrivateRoute */}
          <Route
            path="/photo/:id"
            element={
              <div>
                <PhotoDetails
                  currentUserId={currentUserId}
                  onPhotoDeleted={fetchPhotos}
                />
                {showPhotoForm && username && (
                  <PhotoForm
                    onPhotoAdded={fetchPhotos}
                    onClose={() => setShowPhotoForm(false)}
                  />
                )}
              </div>
            }
          />
          <Route
            path="/add-photo"
            element={
              <PrivateRoute>
                <PhotoForm
                  onPhotoAdded={fetchPhotos}
                  onClose={() => setShowPhotoForm(false)}
                />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
