import React, { useState } from 'react';

const ImageUploader = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/bird_classification/', {
        method: 'POST',
        body: formData,
        headers: {
          // Add any additional headers if needed
        },
      });

      if (!response.ok) {
        console.error('Error:', response.status, response.statusText);
      } else {
        const result = await response.json();
        console.log('Prediction:', result.prediction);
        console.log('Name:', result.name);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Predict Bird</button>
    </div>
  );
};

export default ImageUploader;
