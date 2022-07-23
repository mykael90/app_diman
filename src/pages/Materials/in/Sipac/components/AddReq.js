/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable react/prop-types */
import React, { useRef } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Button, Row, Col, Form } from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

export default function AddReq({ newReq, setNewReq, submitReq }) {
  const inputRef = useRef();

  return (
    <Form noValidate onSubmit={submitReq}>
      <Form.Group>
        <Row className="d-flex align-items-center">
          <Col>
            <FloatingLabel controlId="reqmat" label="Nº RM">
              <Form.Control
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
          <Col xs="auto" className="center-text ps-0">
            <Button
              size="sm"
              variant="success"
              type="submit"
              aria-label="Add Req"
              onClick={() => inputRef.current.focus()}
            >
              <FaPlus />
            </Button>
          </Col>
        </Row>
      </Form.Group>
    </Form>
  );
}
