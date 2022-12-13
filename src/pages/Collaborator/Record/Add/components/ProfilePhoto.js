/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import styled from 'styled-components';
import { Row, Col, Badge, Form, Image } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';

// const ImageStyled = styled(Image)`
//   &:hover {
//     opacity: 0.5; //
//   }
// `;

function ProfilePhoto({ setPhoto, photoURL, setPhotoURL }) {
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    return setPhotoURL(URL.createObjectURL(file));
  };

  return (
    <Form.Group controlId="photo">
      <Form.Label style={{ position: 'relative' }}>
        <Image
          crossOrigin=""
          src={photoURL}
          alt="Foto de perfil do colaborador"
          width="300"
          rounded="true"
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
          style={{ opacity: isHovering ? '0.5' : '1' }}
        />

        <Row
          className={`${isHovering ? 'm-0 p-0' : 'm-0 p-0 d-none'}`}
          role="button"
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <FaEdit size="30px" className="text-dark" />
          <Badge
            xs="auto"
            className="text-dark bg-light mt-2"
            style={{
              fontSize: '0.6em',
            }}
          >
            Máximo 10mb
          </Badge>
        </Row>
      </Form.Label>
      <Form.Control
        type="file"
        onChange={handleChange}
        className="d-none"
        multiple="false"
        accept="image/jpeg, image/jpg, image/png, image/gif"
      />
    </Form.Group>
  );
}

export default ProfilePhoto;
