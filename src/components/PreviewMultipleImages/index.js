import React, { useState } from 'react';
import { Row, Col, Badge, Form, Image, Button } from 'react-bootstrap';
import { FaPaperclip, FaSearch } from 'react-icons/fa';
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
    <Form.Group as={Col} xs="auto" controlId="photos">
      <Form.Label className="border rounded-3 border-secondary text-muted p-2 mt-3">
        {' '}
        <FaPaperclip size={28} cursor="pointer" />
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
