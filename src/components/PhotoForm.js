import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance'; // Utilisation de axiosInstance
import dayjs from 'dayjs';

const PhotoForm = ({ onPhotoAdded, onClose }) => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [cameraType, setCameraType] = useState('');
  const [location, setLocation] = useState(''); // Nouveau champ pour le lieu
  const [date, setDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      if (!title || !date || !image || !location) {
        setErrorMessage('Veuillez remplir tous les champs obligatoires (titre, image, date).');
        return;
      }

      if (!image.type.startsWith('image/')) {
        setErrorMessage('Veuillez sélectionner un fichier image valide.');
        return;
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('image', image);
      formData.append('cameraType', cameraType);
      formData.append('location', location); // Ajout du lieu
      formData.append('date', dayjs(date).format('YYYY-MM-DD'));

      const res = await axiosInstance.post('/photos', formData); // Utilisation de axiosInstance

      if (res.status === 201) {
        setTitle('');
        setImage(null);
        setCameraType('');
        setLocation(''); // Réinitialiser le lieu
        setDate('');

        if (onPhotoAdded) {
          onPhotoAdded(res.data);
        }

        // Fermer le formulaire après l'ajout
        onClose();
        navigate('/');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.error || 'Erreur lors de l\'ajout de la photo.');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        width: '90%',
        maxWidth: '400px',
        zIndex: 1000,
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Ajouter une photo</h2>
      {errorMessage && <p style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="title" style={styles.label}>Titre :</label>
          <input
            type="text"
            id="title"
            placeholder="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="image" style={styles.label}>Image :</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            style={styles.input}
            required
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="cameraType" style={styles.label}>Type d'appareil photo :</label>
          <input
            type="text"
            id="cameraType"
            placeholder="Type d'appareil photo"
            value={cameraType}
            onChange={(e) => setCameraType(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="location" style={styles.label}>Lieu :</label>
          <input
            type="text"
            id="location"
            placeholder="Lieu de la prise de vue"
            value={location}
            onChange={(e) => setLocation(e.target.value)} // Modification du lieu
            style={styles.input}
            required
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="date" style={styles.label}>Date de prise de vue :</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        <div style={{ textAlign: 'center' }}>
          <button
            type="submit"
            style={{
              ...styles.button,
              backgroundColor: '#28a745',
              marginRight: '10px',
            }}
          >
            Ajouter
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              ...styles.button,
              backgroundColor: '#dc3545',
            }}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  label: {
    display: 'block',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  input: {
    width: '100%',
    padding: '8px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxSizing: 'border-box',
  },
  button: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    color: 'white',
    cursor: 'pointer',
  },
};

export default PhotoForm;
