import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import dayjs from 'dayjs';

const PhotoDetails = ({ currentUserId, onPhotoDeleted }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCameraType, setNewCameraType] = useState('');
  const [newLocation, setNewLocation] = useState(''); // Nouveau champ pour le lieu
  const [newDate, setNewDate] = useState('');

  // Charger les détails de la photo
  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const res = await axiosInstance.get(`/photos/${id}`);
        const photoData = res.data;

        setPhoto(photoData);

        // Pré-remplir les champs pour l'édition
        setNewTitle(photoData.title);
        setNewCameraType(photoData.cameraType || '');
        setNewLocation(photoData.location || ''); // Pré-remplir le lieu
        setNewDate(
          photoData.date
            ? dayjs(photoData.date, 'D MMMM YYYY').format('YYYY-MM-DD') // Convertir pour le champ de type date
            : ''
        );
      } catch (err) {
        console.error('Erreur lors de la récupération de la photo:', err);
        alert('Erreur lors du chargement de la photo. Veuillez réessayer.');
      }
    };

    fetchPhoto();
  }, [id]);

  // Gérer la mise à jour de la photo
  const handleUpdate = async () => {
    try {
      if (!dayjs(newDate, 'YYYY-MM-DD', true).isValid()) {
        alert('Veuillez entrer une date valide (AAAA-MM-JJ).');
        return;
      }

      const formData = new FormData();
      formData.append('title', newTitle || photo.title);
      formData.append('cameraType', newCameraType || photo.cameraType);
      formData.append('location', newLocation || photo.location); // Ajouter le lieu
      formData.append('date', dayjs(newDate, 'YYYY-MM-DD').format('D MMMM YYYY'));

      await axiosInstance.put(`/photos/${id}`, formData);

      alert('Photo mise à jour avec succès.');

      // Re-fetch les données pour mettre à jour l'état
      const updatedPhoto = await axiosInstance.get(`/photos/${id}`);
      setPhoto(updatedPhoto.data);

      setIsEditing(false); // Quitter le mode édition
    } catch (err) {
      console.error('Erreur lors de la modification de la photo:', err);
      alert('Erreur lors de la modification de la photo. Veuillez réessayer.');
    }
  };

  // Gérer la suppression de la photo
  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/photos/${id}`);
      alert('Photo supprimée avec succès.');

      if (onPhotoDeleted) {
        onPhotoDeleted(id);
      }

      navigate('/');
    } catch (err) {
      console.error('Erreur lors de la suppression de la photo:', err);
      alert('Erreur lors de la suppression de la photo. Veuillez réessayer.');
    }
  };

  if (!photo) return <p>Chargement...</p>;

  return (
    <div style={{ margin: '20px auto', textAlign: 'center', maxWidth: '600px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>{photo.title}</h1>

      <div style={{ marginTop: '15px', fontSize: '16px', fontWeight: 'bold' }}>
        <img src={photo.imageUrl} alt={photo.title} style={{ width: '100%', borderRadius: '10px' }} />

        <div style={{ marginTop: '15px' }}>
          <p><strong>Auteur :</strong> {photo.authorName || 'Utilisateur inconnu'}</p>
          <p><strong>Type d'appareil :</strong> {photo.cameraType || 'Non spécifié'}</p>
          <p><strong>Lieu :</strong> {photo.location || 'Non spécifié'}</p> {/* Affichage du lieu */}
          <p><strong>Date :</strong> {photo.date || 'Non spécifiée'}</p>
        </div>

        {currentUserId === photo.userId && (
          <div style={{ marginTop: '20px' }}>
            {isEditing ? (
              <div>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Nouveau titre"
                  style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%' }}
                />
                <input
                  type="text"
                  value={newCameraType}
                  onChange={(e) => setNewCameraType(e.target.value)}
                  placeholder="Type d'appareil photo"
                  style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%' }}
                />
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)} // Modification du lieu
                  placeholder="Lieu"
                  style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%' }}
                />
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%' }}
                />
                <button
                  onClick={handleUpdate}
                  style={{
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    marginRight: '10px',
                    cursor: 'pointer',
                    borderRadius: '5px',
                  }}
                >
                  Enregistrer
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    cursor: 'pointer',
                    borderRadius: '5px',
                  }}
                >
                  Annuler
                </button>
              </div>
            ) : (
              <div>
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    marginRight: '10px',
                    cursor: 'pointer',
                    borderRadius: '5px',
                  }}
                >
                  Modifier
                </button>
                <button
                  onClick={handleDelete}
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    cursor: 'pointer',
                    borderRadius: '5px',
                  }}
                >
                  Supprimer
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoDetails;
