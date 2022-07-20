/* eslint-disable react/prop-types */
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaTrashAlt } from 'react-icons/fa';

export default function LineReq({ req, deleteReq }) {
  return (
    <Container>
      <Row>
        <Col xs={2}>{req.id}</Col>
        <Col xs={8}>{req.req}</Col>
        <Col xs={1}>
          <FaTrashAlt
            onClick={() => deleteReq(req.id)}
            role="button"
            tabIndex="0"
            aria-label={`Delete ${req.req}`}
          />
        </Col>
      </Row>
    </Container>
  );
}
