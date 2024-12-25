import React from 'react';
import { Link } from 'react-router-dom';

const PhotoList = ({ photos }) => {
  return (
    <div style={styles.gridContainer}>
      {photos.map((photo) => (
        <div key={photo._id} style={styles.card}>
          {/* Lien vers les détails de la photo */}
          <Link to={`/photo/${photo._id}`} style={styles.link}>
            <img
              src={photo.imageUrl}
              alt={photo.title}
              style={styles.image}
            />
            <h3 style={styles.title}>{photo.title}</h3>
          </Link>
        </div>
      ))}
    </div>
  );
};

const styles = {
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', // Colonnes adaptatives
    gap: '20px', // Espacement entre les cartes
    padding: '20px',
  },
  card: {
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    textAlign: 'center',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover', // Garantit un format uniforme pour les images
  },
  title: {
    padding: '10px',
    margin: 0,
    fontSize: '16px',
    color: '#333',
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
};

export default PhotoList;
