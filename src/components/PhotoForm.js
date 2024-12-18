import React, { useState } from 'react';
import axios from 'axios';

const PhotoForm = ({ onPhotoAdded }) => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', image);

    try {
      const res = await axios.post('http://localhost:5000/api/photos', formData);
      onPhotoAdded(res.data);
      setTitle('');
      setImage(null);
    } catch (err) {
      console.error('Error uploading photo:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Photo Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        required
      />
      <button type="submit">Upload</button>
    </form>
  );
};

export default PhotoForm;
