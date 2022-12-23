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
                to="/materials/record/list"
              >
                <Nav.Link href="#1">Listagem</Nav.Link>
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link className="text-decoration-none" to="/materials/record/add">
                <Nav.Link href="#2">Adicionar</Nav.Link>
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link
                className="text-decoration-none"
                to="/materials/record/remove"
              >
                <Nav.Link href="#3">Remover</Nav.Link>
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
