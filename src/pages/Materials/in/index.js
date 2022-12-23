import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import { Container } from 'react-bootstrap';

export default function index() {
  return (
    <Card>
      <Card.Header>
        <Container>
          <Nav variant="tabs" defaultActiveKey="#1">
            <Nav.Item>
              <Link className="text-decoration-none" to="/materials/in/sipac">
                <Nav.Link href="#1">Sipac</Nav.Link>
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link
                className="text-decoration-none"
                to="/materials/in/returned"
              >
                <Nav.Link href="#2">Retorno</Nav.Link>
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link
                className="text-decoration-none"
                to="/materials/in/supplier"
              >
                <Nav.Link href="#3">Fornecedor</Nav.Link>
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link
                className="text-decoration-none"
                to="/materials/in/donation"
              >
                <Nav.Link href="#4">Doação</Nav.Link>
              </Link>
            </Nav.Item>
          </Nav>
        </Container>
      </Card.Header>
      <Container>
        <Card.Body>
          <Outlet />
        </Card.Body>
      </Container>
    </Card>
  );
}
