import axiosInstance from '../services/axiosInstance';
import { useParams, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // Pour décoder le token JWT

const ResetPassword = ({ onShowLogin }) => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // Décoder l'email à partir du token
  const decodedToken = jwtDecode(token);
  const userEmail = decodedToken.email; // Email extrait du token

  const handleResetPassword = async () => {
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const response = await axiosInstance.post(`/auth/reset-password/${token}`, { newPassword });
      alert(response.data.message);

      // Rediriger vers le formulaire de connexion avec l'email pré-rempli
      navigate('/login', { state: { email: userEmail } });

      // Appeler onShowLogin pour synchroniser l'état
      if (onShowLogin) onShowLogin();
    } catch (error) {
      console.error('Erreur lors de la réinitialisation :', error.response?.data?.error || error.message);
      setError(error.response?.data?.error || 'Une erreur est survenue. Veuillez réessayer.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Réinitialisation du mot de passe</h2>
      <input
        type="password"
        placeholder="Nouveau mot de passe"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        style={styles.input}
      />
      <input
        type="password"
        placeholder="Confirmez le mot de passe"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        style={styles.input}
      />
      {error && <p style={styles.error}>{error}</p>}
      <button onClick={handleResetPassword} style={styles.button}>
        Réinitialiser
      </button>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#f9f9f9',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    maxWidth: '400px',
    margin: 'auto',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  title: {
    marginBottom: '20px',
    fontSize: '24px',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '16px',
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  error: {
    color: 'red',
    fontSize: '14px',
    marginBottom: '15px',
  },
};

export default ResetPassword;
