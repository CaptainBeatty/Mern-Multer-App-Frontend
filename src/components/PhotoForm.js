import React, { useState } from 'react';
import axios from 'axios';

const PhotoForm = ({ onPhotoAdded }) => {
  const [title, setTitle] = useState(''); // Titre de la photo
  const [image, setImage] = useState(null); // Fichier image
  const [cameraType, setCameraType] = useState(''); // Type d'appareil photo

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token'); // Récupérer le token JWT
      if (!token) {
        alert('Vous devez être connecté pour ajouter une photo.');
        return;
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('image', image);
      formData.append('cameraType', cameraType); // Ajouter le type d'appareil photo

      // Envoyer la requête POST avec le token dans l'en-tête
      const res = await axios.post('http://localhost:5000/api/photos', formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Ajouter le token JWT
        },
      });

      onPhotoAdded(res.data); // Mettre à jour la liste des photos après succès
      setTitle(''); // Réinitialiser le champ titre
      setImage(null); // Réinitialiser le fichier image
      setCameraType(''); // Réinitialiser le type d'appareil photo
    } catch (err) {
      console.error('Erreur lors de l\'ajout de la photo:', err.response?.data?.error || err.message);
      alert('Erreur lors de l\'ajout de la photo. Veuillez réessayer.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Titre :</label>
        <input
          type="text"
          id="title"
          placeholder="Titre de la photo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="image">Image :</label>
        <input
          type="file"
          id="image"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />
      </div>
      <div>
        <label htmlFor="cameraType">Type d'appareil photo :</label>
        <input
          type="text"
          id="cameraType"
          placeholder="Exemple : Nikon D3500"
          value={cameraType}
          onChange={(e) => setCameraType(e.target.value)}
        />
      </div>
      <button type="submit">Ajouter la photo</button>
    </form>
  );
};

export default PhotoForm;
