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
                <Col xs="auto">
                  Req. nº: {dadosJSON['Número da Requisição']}
                </Col>
                <Col xs="auto">
                  Valor: {dadosJSON['Valor do Total Atendido']}
                </Col>
                <Col xs="auto">Cadastro: {dadosJSON['Data de Cadastro']}</Col>
                <Col xs="auto">
                  Usuário:{' '}
                  {dadosJSON['Usuário'].substring(
                    0,
                    dadosJSON['Usuário'].indexOf(' ')
                  )}
                  {/* {Pegando apenas o login do usuario, descartando o nome} */}
                </Col>
                <Col xs="auto">
                  Man. nº:{' '}
                  {dadosJSON['Número da Requisição Relacionada'].substring(
                    0,
                    dadosJSON['Número da Requisição Relacionada'].indexOf(' ')
                  )}
                  {/* {Pegando apenas o codigo da manutencao, descartando o nome} */}
                </Col>
              </Row>
              <Row className="mt-2">
                <Col>Unidade de Custo: {dadosJSON['Unidade de Custo']}</Col>
              </Row>
              <Row className="mt-2">
                <Col>
                  Unidade Requisitante: {dadosJSON['Unidade Requisitante']}
                </Col>
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
