/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable react/prop-types */
import React, { useRef } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Button, Row, Col } from 'react-bootstrap';

import { StyledForm } from '../styled';

export default function AddReq({ newReq, setNewReq, submitReq }) {
  const inputRef = useRef();

  return (
    <StyledForm onSubmit={submitReq}>
      <StyledForm.Group>
        <Row>
          <Col>
            <StyledForm.Label htmlFor="addReq">
              <StyledForm.Control
                autoFocus
                ref={inputRef}
                id="addReq"
                type="text"
                placeholder="Digitar requisição"
                required
                value={newReq}
                onChange={(e) => setNewReq(e.target.value)}
              />
            </StyledForm.Label>
          </Col>
          <Col>
            <Button
              variant="dark"
              type="submit"
              aria-label="Add Req"
              onClick={() => inputRef.current.focus()}
            >
              <FaPlus />
            </Button>
          </Col>
        </Row>
      </StyledForm.Group>
    </StyledForm>
  );
}
