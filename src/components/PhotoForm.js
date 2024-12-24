import React, { useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs'; // Importer Day.js

const PhotoForm = ({ onPhotoAdded }) => {
  const [title, setTitle] = useState(''); // Titre de la photo
  const [image, setImage] = useState(null); // Fichier image
  const [cameraType, setCameraType] = useState(''); // Type d'appareil photo
  const [date, setDate] = useState(''); // Date de prise de vue

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token'); // Récupérer le token JWT
      if (!token) {
        alert('Vous devez être connecté pour ajouter une photo.');
        return;
      }

      // Validation : Vérifier que les champs obligatoires sont remplis
      if (!title || !date || !image) {
        alert('Veuillez remplir tous les champs obligatoires (titre, image, date).');
        return;
      }

      // Convertir et valider la date
      const formattedDate = dayjs(date).format('DD/MM/YYYY');
      if (!dayjs(formattedDate, 'DD/MM/YYYY', true).isValid()) {
        alert('Veuillez entrer une date valide (AAAA-MM-JJ ou sélectionner dans le picker).');
        return;
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('image', image);
      formData.append('cameraType', cameraType); // Ajouter le type d'appareil photo
      formData.append('date', formattedDate); // Ajouter la date formatée

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
      setDate(''); // Réinitialiser la date de prise de vue
    } catch (err) {
      console.error('Erreur lors de l\'ajout de la photo :', err.response?.data?.error || err.message);
      alert('Erreur lors de l\'ajout de la photo. Veuillez réessayer.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Titre : *</label>
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
        <label htmlFor="image">Image : *</label>
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
      <div>
        <label htmlFor="date">Date de prise de vue : *</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => {
            const selectedDate = e.target.value; // Format brut YYYY-MM-DD
            setDate(selectedDate); // Mettre à jour l'état avec la date sélectionnée
          }}
          required
        />
      </div>
      <button type="submit">Ajouter la photo</button>
    </form>
  );
};

export default PhotoForm;
