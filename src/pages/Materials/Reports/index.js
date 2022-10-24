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
                <Link
                  className="text-decoration-none"
                  to="/materials/reports/inventory"
                >
                  Inventário
                </Link>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="#2">
                <Link
                  className="text-decoration-none"
                  to="/materials/reports/input"
                >
                  Entradas
                </Link>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="#3">
                <Link
                  className="text-decoration-none"
                  to="/materials/reports/output"
                >
                  Saídas
                </Link>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="#4">
                <Link
                  className="text-decoration-none"
                  to="/materials/reports/provisionfrequency"
                >
                  Provisões
                </Link>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="#5">
                <Link
                  className="text-decoration-none"
                  to="/materials/reports/consumefrequency"
                >
                  Consumos
                </Link>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="#6">
                <Link
                  className="text-decoration-none"
                  to="/materials/reports/maintenancebalanceoutput"
                >
                  Balanço por Manutenção
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
