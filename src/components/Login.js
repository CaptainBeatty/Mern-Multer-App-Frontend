import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Importer Link pour la navigation vers la page de récupération
import axiosInstance from '../services/axiosInstance'; // Utiliser axiosInstance pour les requêtes avec gestion automatique des headers

const Login = ({ onLoginSuccess, onClose }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/auth/login', formData);

      // Stocker le token JWT dans localStorage
      localStorage.setItem('token', res.data.token);

      // Passe le nom d'utilisateur au parent
      onLoginSuccess(res.data.username);
    } catch (err) {
      console.error('Erreur lors de la connexion:', err.response?.data?.error || err.message);
      alert('Erreur lors de la connexion. Veuillez vérifier vos informations.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: '400px',
        margin: '20px auto',
        padding: '15px',
        border: '1px solid #ddd',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#f9f9f9',
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '15px', fontSize: '20px', color: '#333' }}>
        Connexion
      </h2>

      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="email" style={styles.label}>Email :</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Votre email"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
          required
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="password" style={styles.label}>Mot de passe :</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Votre mot de passe"
          value={formData.password}
          onChange={handleChange}
          style={styles.input}
          required
        />
      </div>

      <button
        type="submit"
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          padding: '10px 15px',
          borderRadius: '5px',
          width: '100%',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        Se connecter
      </button>

      {/* Lien vers la fonctionnalité de récupération de mot de passe */}
      <div style={{ textAlign: 'center', marginTop: '15px' }}>
        <Link
          to="/forgot-password"
          style={{ color: '#007bff', textDecoration: 'none' }}
          onClick={onClose} // Appeler la fonction pour fermer le formulaire
        >
          Mot de passe oublié ?
        </Link>
      </div>
    </form>
  );
};

const styles = {
  label: {
    display: 'block',
    fontWeight: 'bold',
    marginBottom: '3px',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '8px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxSizing: 'border-box',
  },
};

export default Login;
