import React, { useState } from 'react';
import { Row, Col, Badge, Form, Image, Button } from 'react-bootstrap';
import { FaCamera, FaSearch } from 'react-icons/fa';
import ImagesGallery from '../ImagesGallery';

// eslint-disable-next-line react/prop-types
function PreviewMultipleImages({ files, setFiles }) {
  const handleMultipleImages = (evnt) => {
    const targetFiles = [...evnt.target.files];
    const newFiles = [...files];
    // console.log(newFiles, targetFiles);
    targetFiles.forEach((file) => {
      const imageURL = URL.createObjectURL(file);
      const newObj = { file, imageURL };
      newFiles.push(newObj);
    });
    // console.log(newFiles);
    setFiles([...newFiles]);
  };

  const removeFileFromArray = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  return (
    <Form.Group as={Col} xs="12" controlId="photos">
      <Form.Label
        className="border-secondary border-1 text-muted p-2 mt-3"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          border: 'dashed',
          cursor: 'pointer',
        }}
      >
        {' '}
        <FaCamera size={38} cursor="pointer" className="m-auto" />
        <p style={{ fontSize: '16px' }}>Adicionar fotos</p>
        <p style={{ fontSize: '12px' }}>Apenas JPEG, JPG, PNG e GIF</p>
      </Form.Label>
      <Form.Control
        className="my-3 d-none"
        type="file"
        onChange={handleMultipleImages}
        multiple
        accept="image/jpeg, image/jpg, image/png, image/gif"
      />

      <ImagesGallery files={files} removeFileFromArray={removeFileFromArray} />
    </Form.Group>
  );
}

export default PreviewMultipleImages;
