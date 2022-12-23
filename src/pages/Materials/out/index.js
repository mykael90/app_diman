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
              <Link className="text-decoration-none" to="/materials/out/use">
                <Nav.Link href="#1">Uso</Nav.Link>
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link
                className="text-decoration-none"
                to="/materials/out/discard"
              >
                <Nav.Link href="#2">Descarte</Nav.Link>
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link
                className="text-decoration-none"
                to="/materials/out/devolution"
              >
                <Nav.Link href="#3">Devolução</Nav.Link>
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link
                className="text-decoration-none"
                to="/materials/out/donation"
              >
                <Nav.Link href="#4">Doação</Nav.Link>
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link
                className="text-decoration-none"
                to="/materials/out/loan"
                style={{ color: 'inherit' }}
              >
                <Nav.Link href="#5">Empréstimo</Nav.Link>
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link
                className="text-decoration-none"
                to="/materials/out/loss"
                style={{ color: 'inherit' }}
              >
                <Nav.Link href="#6" disabled>
                  Extravio
                </Nav.Link>
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
