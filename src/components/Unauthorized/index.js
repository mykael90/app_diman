import React from 'react';
import { Link } from 'react-router-dom';

import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaHome, FaEnvelope } from 'react-icons/fa';

export default function Unauthorized() {
  return (
    <Container className="text-center py-5">
      <Row className="py-2" />
      <Row className="py-3">
        <h1>Oops!</h1>
      </Row>
      <Row>
        <h2>401 - Acesso não autorizado</h2>
      </Row>
      <Row className="py-3">
        <h5>Desculpe, você não possui permissão para acessar essa página.</h5>
      </Row>
      <Row className="d-flex justify-content-center">
        <Col xs="auto" className="mx-2">
          <Link to="/Home" className="text-decoration-none">
            <Button className="d-flex justify-content-center">
              <FaHome className="me-2" style={{ fontSize: '1.5em' }} />
              <span>Página Inicial</span>
            </Button>
          </Link>
        </Col>
        <Col xs="auto" className="mx-2">
          <Link to="/Suporte" className="text-decoration-none">
            <Button
              variant="secondary"
              className="d-flex justify-content-center"
            >
              {' '}
              <FaEnvelope className="me-2" style={{ fontSize: '1.3em' }} />
              <span>Contactar Suporte</span>
            </Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
}
