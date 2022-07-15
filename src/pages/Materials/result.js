import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { Row, Col, Table, Button, Badge } from 'react-bootstrap';

export default function result(props) {
  return (
    <>
      <Row className="pt-4 text-center" style={{ fontWeight: 'bold' }}>
        <Col>DADOS DA REQUISIÇÃO</Col>
      </Row>
      {Object.entries(props.dadosJSON).map(([key, value]) => (
        <Row className="py-0 my-0">
          <Col
            xs="4"
            className="py-0 my-0 me-0 pe-0"
            style={{ fontWeight: 'bold', textAlign: 'end' }}
          >
            {key}:
          </Col>
          <Col xs="8">
            <span className="font-weight-bold">{value}</span>
          </Col>
        </Row>
      ))}

      <Row className="pt-4 text-center" style={{ fontWeight: 'bold' }}>
        <Col>ITENS DA REQUISIÇÃO</Col>
      </Row>

      {/* <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Nr.</th>
            <th>Código</th>
            <th>Denominação</th>
            <th>Unid. Med.</th>
            <th>Qt.</th>
            <th>A</th>
            <th>Valor</th>
            <th>Valor A.</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {props.itensJSON.map((item) => (
            <tr key={item.Nr}>
              <td>{item.Nr}</td>
              <td>{item['Código']}</td>
              <td>{item['Denominação']}</td>
              <td>{item['Unid. Med.']}</td>
              <td>{item['Qt.']}</td>
              <td>{item.A}</td>
              <td>{item.Valor}</td>
              <td>{item['Valor A.']}</td>
              <td>{item.Total}</td>
            </tr>
          ))}
        </tbody>
      </Table> */}

      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Nr.</th>
            <th>Código</th>
            <th>Denominação</th>
            <th>Unid. Med.</th>
            <th>Qt.</th>
            <th> </th>
          </tr>
        </thead>
        <tbody>
          {props.itensJSON.map((item) => (
            <tr key={item.Nr}>
              <td>{item.Nr}</td>
              <td>{item['Código']}</td>
              <td>{item['Denominação']}</td>
              <td>{item['Unid. Med.']}</td>
              <td>
                <Badge bg="danger">-</Badge>{' '}
                <input
                  readOnly
                  className="text-center"
                  type="text"
                  value={item['Qt.']}
                  style={{ width: '3rem' }}
                />{' '}
                <Badge bg="success">+</Badge>
              </td>
              <td className="text-center">
                <Badge bg="danger">
                  <FaTrash />
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Row>
        <Col className="text-center">
          <Button variant="success">Receber</Button>
        </Col>
      </Row>
    </>
  );
}
