import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ username, onLogout, onTogglePhotoForm, isPhotoFormOpen, onShowLogin, onShowRegister }) => {
  const navigate = useNavigate(); // Hook pour naviguer entre les pages

  return (
    <header style={styles.header}>
      {/* Clique sur le titre pour revenir à la page principale */}
      <h1
        style={styles.title}
        onClick={() => navigate('/')} // Redirection vers la page principale
      >
        MernMulterApp
      </h1>
      <div style={styles.rightSection}>
        {username && <span style={styles.welcomeMessage}>Bienvenue {username}</span>}
        {username ? (
          <>
            <button
              style={{
                ...styles.button,
                backgroundColor: isPhotoFormOpen ? '#dc3545' : 'white',
                color: isPhotoFormOpen ? 'white' : '#007bff',
                border: isPhotoFormOpen ? '1px solid #dc3545' : '1px solid #007bff',
              }}
              onClick={onTogglePhotoForm}
            >
              {isPhotoFormOpen ? 'Fermer' : 'Poster'}
            </button>
            <button style={styles.button} onClick={onLogout}>
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <button style={styles.button} onClick={onShowLogin}>
              Login
            </button>
            <button style={styles.button} onClick={onShowRegister}>
              Register
            </button>
          </>
        )}
      </div>
    </header>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer', // Ajout pour rendre le titre cliquable
  },
  title: {
    fontSize: '24px',
    margin: 0,
    cursor: 'pointer', // Ajout pour rendre le titre cliquable
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
  },
  welcomeMessage: {
    marginRight: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  button: {
    marginLeft: '10px',
    backgroundColor: 'white',
    color: '#007bff',
    border: '1px solid #007bff',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  message: {
    margin: 0,
    fontSize: '16px',
  },
};

export default Header;
