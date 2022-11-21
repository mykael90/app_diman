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
              <Link
                className="text-decoration-none"
                to="/materials/definitions/proccessflow"
              >
                <Nav.Link href="#1">Fluxo de processo</Nav.Link>
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link
                className="text-decoration-none"
                to="/materials/definitions/terminology"
              >
                <Nav.Link href="#2">Terminologia</Nav.Link>
              </Link>
            </Nav.Item>
          </Nav>
        </Container>
      </Card.Header>
      <Container fluid>
        <Card.Body className="ps-0">
          <Outlet />
        </Card.Body>
      </Container>
    </Card>
  );
}
