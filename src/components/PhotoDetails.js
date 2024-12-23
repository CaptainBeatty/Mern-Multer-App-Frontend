import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PhotoDetails = ({ currentUserId }) => {
  const { id } = useParams(); // Récupérer l'ID de la photo depuis l'URL
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null); // Détails de la photo
  const [isEditing, setIsEditing] = useState(false); // Mode édition
  const [newTitle, setNewTitle] = useState(''); // Nouveau titre
  const [newCameraType, setNewCameraType] = useState(''); // Nouveau type d'appareil photo
  const [newImage, setNewImage] = useState(null); // Nouvelle image

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/photos/${id}`);
        setPhoto(res.data);
        setNewTitle(res.data.title); // Pré-remplir le titre
        setNewCameraType(res.data.cameraType || ''); // Pré-remplir le type d'appareil photo
      } catch (err) {
        console.error('Erreur lors de la récupération de la photo:', err);
      }
    };

    fetchPhoto();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token'); // Récupérer le token JWT
      if (!token) {
        alert('Vous devez être connecté pour modifier une photo.');
        return;
      }

      const formData = new FormData();
      formData.append('title', newTitle || photo.title); // Utiliser le nouveau titre ou conserver l'ancien
      formData.append('cameraType', newCameraType || photo.cameraType); // Utiliser le nouveau type ou conserver l'ancien
      if (newImage) {
        formData.append('image', newImage); // Ajouter la nouvelle image si présente
      }

      const res = await axios.put(`http://localhost:5000/api/photos/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPhoto(res.data); // Mettre à jour la photo avec les nouvelles données
      setIsEditing(false); // Quitter le mode édition
    } catch (err) {
      console.error('Erreur lors de la modification de la photo:', err);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Vous devez être connecté pour supprimer une photo.');
        return;
      }

      await axios.delete(`http://localhost:5000/api/photos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/'); // Rediriger vers la page d'accueil après suppression
    } catch (err) {
      console.error('Erreur lors de la suppression de la photo:', err);
    }
  };

  if (!photo) return <p>Chargement...</p>;

  return (
    <div>
      <h1>Détails de la Photo</h1>
      <div>
        <img src={photo.imageUrl} alt={photo.title} width="600" />
        {isEditing ? (
          <div style={{ marginTop: '20px' }}>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Nouveau titre"
              style={{ display: 'block', marginBottom: '10px' }}
            />
            <input
              type="text"
              value={newCameraType}
              onChange={(e) => setNewCameraType(e.target.value)}
              placeholder="Type d'appareil photo"
              style={{ display: 'block', marginBottom: '10px' }}
            />
            <input
              type="file"
              onChange={(e) => setNewImage(e.target.files[0])}
              style={{ display: 'block', marginBottom: '10px' }}
            />
            <button onClick={handleUpdate} style={{ marginRight: '10px' }}>
              Enregistrer
            </button>
            <button onClick={() => setIsEditing(false)}>Annuler</button>
          </div>
        ) : (
          <div>
            <h3>{photo.title}</h3>
            <p>Appareil photo : {photo.cameraType || 'Non spécifié'}</p>
            {currentUserId === photo.userId && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  style={{ marginRight: '10px' }}
                >
                  Modifier
                </button>
                <button
                  onClick={handleDelete}
                  style={{ backgroundColor: 'red', color: 'white' }}
                >
                  Supprimer
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoDetails;
