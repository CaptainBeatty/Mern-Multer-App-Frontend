import React, { useState } from 'react';
import axios from 'axios';

const PhotoList = ({ photos, onPhotoDeleted, onPhotoUpdated }) => {
  const [editPhotoId, setEditPhotoId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newImage, setNewImage] = useState(null);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/photos/${id}`);
      onPhotoDeleted(id);
    } catch (err) {
      console.error('Erreur lors de la suppression de la photo:', err);
    }
  };

  const handleEdit = (photo) => {
    setEditPhotoId(photo._id);
    setNewTitle(photo.title);
    setNewImage(null);
  };

  const handleUpdate = async (id) => {
    try {
      const formData = new FormData();
      formData.append('title', newTitle);
      if (newImage) {
        formData.append('image', newImage);
      }

      const res = await axios.put(`http://localhost:5000/api/photos/${id}`, formData);
      onPhotoUpdated(res.data);
      setEditPhotoId(null);
    } catch (err) {
      console.error('Erreur lors de la modification de la photo:', err);
    }
  };

  return (
    <div>
      {photos.map((photo) => (
        <div key={photo._id} style={{ marginBottom: '20px' }}>
          {editPhotoId === photo._id ? (
            <div>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Nouveau titre"
              />
              <input type="file" onChange={(e) => setNewImage(e.target.files[0])} />
              <button onClick={() => handleUpdate(photo._id)}>Mettre à jour</button>
              <button onClick={() => setEditPhotoId(null)}>Annuler</button>
            </div>
          ) : (
            <div>
              <h3>{photo.title}</h3>
              <img src={photo.imageUrl} alt={photo.title} width="300" />
              <br />
              <button onClick={() => handleEdit(photo)}>Modifier</button>
              <button onClick={() => handleDelete(photo._id)}>Supprimer</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PhotoList;
