import React, { useState } from 'react';
import axios from 'axios';

const PhotoList = ({ photos, onPhotoDeleted, onPhotoUpdated, currentUserId }) => {
  const [editPhotoId, setEditPhotoId] = useState(null); // ID de la photo en cours de modification
  const [newTitle, setNewTitle] = useState('');
  const [newImage, setNewImage] = useState(null);

  // Supprimer une photo
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token'); // Récupérer le token JWT
      if (!token) {
        alert('Vous devez être connecté pour supprimer une photo.');
        return;
      }

      await axios.delete(`http://localhost:5000/api/photos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }, // Ajout du token JWT
      });

      onPhotoDeleted(id); // Mettre à jour l'état local après suppression
    } catch (err) {
      console.error('Erreur lors de la suppression de la photo:', err.response?.data?.error || err.message);
    }
  };

  // Activer le mode modification pour une photo
  const handleEdit = (photo) => {
    setEditPhotoId(photo._id); // ID de la photo en cours de modification
    setNewTitle(photo.title); // Pré-remplir le titre actuel
    setNewImage(null); // Réinitialiser l'image
  };

  // Mettre à jour une photo
  const handleUpdate = async (id) => {
    try {
      const token = localStorage.getItem('token'); // Récupérer le token JWT
      if (!token) {
        alert('Vous devez être connecté pour modifier une photo.');
        return;
      }

      const formData = new FormData();
      formData.append('title', newTitle);
      if (newImage) {
        formData.append('image', newImage); // Ajouter la nouvelle image si présente
      }

      const res = await axios.put(`http://localhost:5000/api/photos/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }, // Ajout du token JWT
      });

      onPhotoUpdated(res.data); // Mettre à jour l'état local avec la photo modifiée
      setEditPhotoId(null); // Quitter le mode édition
    } catch (err) {
      console.error('Erreur lors de la modification de la photo:', err.response?.data?.error || err.message);
    }
  };

  return (
    <div>
      {photos.map((photo) => (
        <div key={photo._id} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '20px' }}>
          {editPhotoId === photo._id ? (
            // Mode édition
            <div>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Nouveau titre"
              />
              <input
                type="file"
                onChange={(e) => setNewImage(e.target.files[0])}
              />
              <button onClick={() => handleUpdate(photo._id)} style={{ marginRight: '10px' }}>
                Enregistrer
              </button>
              <button onClick={() => setEditPhotoId(null)}>Annuler</button>
            </div>
          ) : (
            // Affichage des photos
            <div>
              <h3>{photo.title}</h3>
              <img src={photo.imageUrl} alt={photo.title} width="300" />
              <br />
              <div style={{ marginTop: '10px' }}>
                {/* Bouton Modifier */}
                <button
                  onClick={() => handleEdit(photo)}
                  disabled={!currentUserId || photo.userId !== currentUserId} // Désactiver si non connecté ou pas propriétaire
                  style={{
                    marginRight: '10px',
                    backgroundColor: photo.userId === currentUserId ? '#007bff' : '#cccccc',
                    color: photo.userId === currentUserId ? 'white' : '#666666',
                    border: 'none',
                    padding: '5px 10px',
                    cursor: photo.userId === currentUserId ? 'pointer' : 'not-allowed',
                  }}
                >
                  Modifier
                </button>
                {/* Bouton Supprimer */}
                <button
                  onClick={() => handleDelete(photo._id)}
                  disabled={!currentUserId || photo.userId !== currentUserId} // Désactiver si non connecté ou pas propriétaire
                  style={{
                    backgroundColor: photo.userId === currentUserId ? 'red' : '#cccccc',
                    color: photo.userId === currentUserId ? 'white' : '#666666',
                    border: 'none',
                    padding: '5px 10px',
                    cursor: photo.userId === currentUserId ? 'pointer' : 'not-allowed',
                  }}
                >
                  Supprimer
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PhotoList;
