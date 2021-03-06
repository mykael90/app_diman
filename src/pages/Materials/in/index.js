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
              <Nav.Link href="#1">
                <Link className="text-decoration-none" to="/materials/in/sipac">
                  Sipac
                </Link>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="#2">
                <Link
                  className="text-decoration-none"
                  to="/materials/in/returned"
                >
                  Retorno
                </Link>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="#3">
                <Link
                  className="text-decoration-none"
                  to="/materials/in/donation"
                >
                  Doação
                </Link>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="#4" disabled>
                <Link
                  className="text-decoration-none"
                  to="/materials/in/first"
                  style={{ color: 'inherit' }}
                >
                  Saldo Inicial
                </Link>
              </Nav.Link>
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
