/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable react/prop-types */
import React, { useRef } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Button, Row, Col } from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

import { StyledForm } from '../styled';

export default function AddReq({ newReq, setNewReq, submitReq }) {
  const inputRef = useRef();

  return (
    <StyledForm onSubmit={submitReq}>
      <StyledForm.Group>
        <Row className="d-flex align-items-center">
          <Col>
            <FloatingLabel controlId="reqmat" label="Nº RM" className="mb-3">
              <StyledForm.Control
                autoFocus
                ref={inputRef}
                id="reqmat"
                type="text"
                placeholder="codigo/ano"
                required
                value={newReq}
                onChange={(e) => setNewReq(e.target.value)}
              />
            </FloatingLabel>
          </Col>
          <Col xs="auto">
            <Button
              className="pb-2"
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
