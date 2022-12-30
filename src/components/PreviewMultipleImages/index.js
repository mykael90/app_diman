import React, { useState } from 'react';
import { Row, Col, Badge, Form, Image, Button } from 'react-bootstrap';
import { FaEdit, FaSearch } from 'react-icons/fa';
import ImagesGallery from '../ImagesGallery';

function PreviewMultipleImages() {
  const [images, setImages] = useState([]);

  const handleMultipleImages = (evnt) => {
    const selectedFiles = [];
    const targetFiles = evnt.target.files;
    console.log(targetFiles);
    const targetFilesObject = [...targetFiles];
    targetFilesObject.map((file) =>
      selectedFiles.push(URL.createObjectURL(file))
    );
    setImages([...images, ...selectedFiles]);
  };

  return (
    <Form.Group as={Col} xs="auto" controlId="photos">
      <Form.Control
        className="my-3"
        type="file"
        onChange={handleMultipleImages}
        multiple
        accept="image/jpeg, image/jpg, image/png, image/gif"
      />

      <ImagesGallery images={images} />
      {JSON.stringify(images)}
    </Form.Group>
  );
}

export default PreviewMultipleImages;
