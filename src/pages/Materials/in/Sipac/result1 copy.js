import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { Container, Row, Col, Table, Button, Badge } from 'react-bootstrap';

import { primaryDarkColor, body1Color } from '../../../../config/colors';

export default function result(props) {
  const { dadosJSON, itensJSON } = props;
  return (
    <>
      <Row
        className="pt-4 text-center align-content-center"
        style={{ fontWeight: 'bold' }}
      >
        <Col>REQUISIÇÕES IMPORTADAS</Col>
      </Row>
      <Container className="mt-3" style={{ background: body1Color }}>
        <Row>
          <Col>
            <Row>
              <Col xs="auto">Req. nº: 15256/2022</Col>
              <Col xs="auto">Valor: R$ 100.000,00</Col>
              <Col xs="auto">Cadastro: 17/07/2022</Col>
              <Col xs="auto">Usuário: alembergue.guimares</Col>
              <Col xs="auto">Man. nº: 10000/2022</Col>
            </Row>
            <Row className="mt-2">
              <Col>
                Unidade de Custo: PRÓ-REITORIA DE ASSUNTOS ESTUDANTIS (PROAE)
                (11.31)
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                Unidade Requisitante: PRÓ-REITORIA DE ASSUNTOS ESTUDANTIS
                (PROAE) (11.31)
              </Col>
            </Row>
          </Col>
          <Col xs="auto">butao</Col>
        </Row>
      </Container>
      {Object.entries(dadosJSON).map(([key, value]) => (
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

      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Nr.</th>
            <th>Código</th>
            <th>Denominação</th>
            <th>Unid. Med.</th>
            <th>Qt.</th>
          </tr>
        </thead>
        <tbody>
          {itensJSON.map((item) => (
            <tr key={item.Nr}>
              <td>{item.Nr}</td>
              <td>{item['Código']}</td>
              <td>{item['Denominação']}</td>
              <td>{item['Unid. Med.']}</td>
              <td>{item.A}</td>
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
