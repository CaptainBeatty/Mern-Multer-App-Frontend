import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css'; // Importation du fichier CSS

const Header = ({
  username,
  onLogout,
  onTogglePhotoForm,
  isPhotoFormOpen,
  onShowLogin,
  onShowRegister,
  isLoginOpen,
  isRegisterOpen,
}) => {
  const navigate = useNavigate(); // Hook pour naviguer entre les pages

  return (
    <header className="header">
      <h1 className="title" onClick={() => navigate('/')}>MernMulterApp</h1>
      <div className="rightSection">
        {username && (
          <span className="welcomeMessage">Bienvenue {username}</span>
        )}
        {username ? (
          <>
            <button
              className={`button ${isPhotoFormOpen ? 'photoFormOpen' : ''}`}
              onClick={onTogglePhotoForm}
            >
              {isPhotoFormOpen ? 'Fermer' : 'Poster'}
            </button>
            <button className="button" onClick={onLogout}>
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <button
              className={`button ${isLoginOpen ? 'loginOpen' : ''}`}
              onClick={onShowLogin}
            >
              {isLoginOpen ? 'Fermer' : 'Login'}
            </button>
            <button
              className={`button ${isRegisterOpen ? 'registerOpen' : ''}`}
              onClick={onShowRegister}
            >
              {isRegisterOpen ? 'Fermer' : 'Register'}
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
