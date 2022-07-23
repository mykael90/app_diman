/* eslint-disable react/prop-types */
import React from 'react';
import { Row, Col, Badge } from 'react-bootstrap';
import { FaTrashAlt } from 'react-icons/fa';

export default function LineReq({ req, deleteReq }) {
  return (
    <Row>
      <Col xs={2}>
        <Badge bg="light" text="dark">
          {req.id}{' '}
        </Badge>
      </Col>
      <Col xs={8}>
        <Badge bg="light" text="dark">
          {req.req}
        </Badge>
      </Col>
      <Col xs={2} className="text-end text-secondary">
        <FaTrashAlt
          onClick={() => deleteReq(req.id)}
          role="button"
          tabIndex="0"
          aria-label={`Delete ${req.req}`}
        />
      </Col>
    </Row>
  );
}
