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
                <Link className="text-decoration-none" to="/materials/out/use">
                  Uso
                </Link>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="#2">
                <Link
                  className="text-decoration-none"
                  to="/materials/out/discard"
                >
                  Descarte
                </Link>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="#3">
                <Link
                  className="text-decoration-none"
                  to="/materials/out/devolution"
                >
                  Devolução
                </Link>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="#4">
                <Link
                  className="text-decoration-none"
                  to="/materials/out/donation"
                >
                  Doação
                </Link>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="#5" disabled>
                <Link
                  className="text-decoration-none"
                  to="/materials/out/loss"
                  style={{ color: 'inherit' }}
                >
                  Extravio
                </Link>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="#6">
                <Link
                  className="text-decoration-none"
                  to="/materials/out/loan"
                  style={{ color: 'inherit' }}
                >
                  Empréstimo
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
