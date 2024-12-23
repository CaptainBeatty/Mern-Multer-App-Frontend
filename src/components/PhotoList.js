import React from 'react';
import { Link } from 'react-router-dom';

const PhotoList = ({ photos }) => {
  return (
    <div>
      {photos.map((photo) => (
        <div key={photo._id} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '20px' }}>
          {/* Affichage du titre */}
          <h3>{photo.title}</h3>
          {/* Affichage de la photo cliquable */}
          <Link to={`/photo/${photo._id}`}>
            <img
              src={photo.imageUrl}
              alt={photo.title}
              width="300"
              style={{ cursor: 'pointer', display: 'block', margin: '10px 0' }}
            />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default PhotoList;
