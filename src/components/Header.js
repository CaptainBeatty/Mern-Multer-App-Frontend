import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PhotoForm from './PhotoForm'; // Importer le composant PhotoForm

const Header = ({ username, onLogout, onShowLogin, onShowRegister }) => {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false); // État pour gérer la visibilité du formulaire
  const formRef = useRef(null); // Référence pour détecter les clics en dehors

  // Gestion des clics en dehors du formulaire
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setIsFormOpen(false); // Fermer le formulaire si clic en dehors
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header style={styles.header}>
      <div style={styles.logo} onClick={() => navigate('/')}>
        <h1>MernMulterApp</h1>
      </div>
      <div style={styles.auth}>
        {username ? (
          <div style={styles.loggedIn}>
            <span>Bonjour, {username} !</span>
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              style={styles.button}
            >
              Poster
            </button>
            <button onClick={onLogout} style={styles.logoutButton}>
              Déconnexion
            </button>
          </div>
        ) : (
          <div>
            <button onClick={onShowLogin} style={styles.button}>
              Se connecter
            </button>
            <button onClick={onShowRegister} style={styles.button}>
              S'inscrire
            </button>
          </div>
        )}
      </div>
      {/* Afficher le formulaire d'ajout d'image si ouvert */}
      {isFormOpen && (
        <div ref={formRef} style={styles.formContainer}>
          <PhotoForm />
        </div>
      )}
    </header>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px 20px',
    position: 'relative',
  },
  logo: {
    cursor: 'pointer',
  },
  auth: {
    display: 'flex',
    alignItems: 'center',
  },
  loggedIn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  button: {
    backgroundColor: 'white',
    color: '#007bff',
    border: 'none',
    padding: '8px 15px',
    margin: '0 5px',
    cursor: 'pointer',
    borderRadius: '5px',
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    cursor: 'pointer',
    borderRadius: '5px',
  },
  formContainer: {
    position: 'absolute',
    top: '60px',
    right: '20px',
    backgroundColor: 'white',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    zIndex: 10,
  },
};

export default Header;
