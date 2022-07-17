import React from 'react';
import { Accordion, Container, Row, Col, Table, Button } from 'react-bootstrap';

import { body1Color } from '../../../../config/colors';

export default function result({ dadosJSON, itensJSON, handleClear }) {
  return (
    <>
      <Row className="pt-2 text-center align-content-center">
        <Col>REQUISIÇÕES IMPORTADAS</Col>
      </Row>
      <Accordion>
        <Accordion.Item eventKey="0" className="mt-3">
          <Accordion.Header style={{ background: body1Color }}>
            {' '}
            <Container>
              <Row>
                <Col xs="auto">Req. nº: {Object.values(dadosJSON)[0]}</Col>
                <Col xs="auto">Valor: {Object.values(dadosJSON)[11]}</Col>
                <Col xs="auto">Cadastro: {Object.values(dadosJSON)[9]}</Col>
                <Col xs="auto">
                  Usuário:{' '}
                  {Object.values(dadosJSON)[7].substring(
                    0,
                    Object.values(dadosJSON)[7].indexOf(' ')
                  )}
                  {/* {Pegando apenas o login do usuario, descartando o nome} */}
                </Col>
                <Col xs="auto">
                  Man. nº:{' '}
                  {Object.values(dadosJSON)[13].substring(
                    0,
                    Object.values(dadosJSON)[13].indexOf(' ')
                  )}
                  {/* {Pegando apenas o codigo da manutencao, descartando o nome} */}
                </Col>
              </Row>
              <Row className="mt-2">
                <Col>Unidade de Custo: {Object.values(dadosJSON)[4]}</Col>
              </Row>
              <Row className="mt-2">
                <Col>Unidade Requisitante: {Object.values(dadosJSON)[5]}</Col>
              </Row>
            </Container>
          </Accordion.Header>
          <Accordion.Body>
            <Container>
              <Row className="pt-2 text-center">
                <Col>ITENS DA REQUISIÇÃO</Col>
              </Row>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Nr.</th>
                    <th>Código</th>
                    <th>Denominação</th>
                    <th>Und.</th>
                    <th>Qtd.</th>
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
              <Row className="justify-content-center">
                <Col xs="auto" className="text-center">
                  <Button variant="warning" onClick={handleClear}>
                    Limpar
                  </Button>
                </Col>
                <Col xs="auto" className="text-center">
                  <Button variant="success">Receber</Button>
                </Col>
              </Row>
            </Container>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
}
