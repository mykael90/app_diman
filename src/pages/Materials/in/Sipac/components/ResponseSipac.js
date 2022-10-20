/* eslint-disable react/prop-types */
import React from 'react';
import {
  Accordion,
  Container,
  Row,
  Col,
  Table,
  Button,
  ButtonGroup,
  Dropdown,
} from 'react-bootstrap';

import { body1Color, primaryDarkColor } from '../../../../../config/colors';

export default function ResponseSipac({ sipac, handleStore, handleDelete }) {
  return (
    <>
      <Row className="pt-2 text-center align-content-center">
        <Col>REQUISIÇÕES IMPORTADAS</Col>
      </Row>
      <Accordion>
        {sipac.info?.map((req, index) => (
          <Accordion.Item
            style={{ borderTop: `1px solid ${primaryDarkColor}` }}
            key={req.dadosJSON['Número da Requisição']}
            eventKey={index}
            className="my-3"
          >
            <Accordion.Header style={{ background: body1Color }}>
              {' '}
              <Container>
                <Row>
                  <Col xs="auto">
                    Req. nº: {req.dadosJSON['Número da Requisição']}
                  </Col>
                  <Col xs="auto">
                    Valor: {req.dadosJSON['Valor do Total Atendido']}
                  </Col>
                  <Col xs="auto">
                    Cadastro: {req.dadosJSON['Data de Cadastro']}
                  </Col>
                  <Col xs="auto">
                    Usuário:{' '}
                    {req.dadosJSON['Usuário'].substring(
                      0,
                      req.dadosJSON['Usuário'].indexOf(' ')
                    )}
                    {/* {Pegando apenas o login do usuario, descartando o nome} */}
                  </Col>
                  <Col xs="auto">
                    Man. nº:{' '}
                    {req.dadosJSON[
                      'Número da Requisição Relacionada'
                    ].substring(
                      0,
                      req.dadosJSON['Número da Requisição Relacionada'].indexOf(
                        ' '
                      )
                    )}
                    {/* {Pegando apenas o codigo da manutencao, descartando o nome} */}
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col>
                    Unidade de Custo: {req.dadosJSON['Unidade de Custo']}
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col>
                    Unidade Requisitante:{' '}
                    {req.dadosJSON['Unidade Requisitante']}
                  </Col>
                </Row>
              </Container>
            </Accordion.Header>
            <Accordion.Body style={{ padding: 0 }}>
              <Container style={{ padding: 0 }}>
                <Row className="pt-2 text-center">
                  <Col>ITENS DA REQUISIÇÃO</Col>
                </Row>
                <Table style={{ padding: 0 }} striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Nr.</th>
                      <th>(Cod) Denominação</th>
                      <th>Und.</th>
                      <th>Qtd.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {req.itensJSON.map((item) => (
                      <tr key={item.Nr}>
                        <td>{item.Nr}</td>
                        <td>
                          ({item['Código']}) - {item['Denominação']}
                        </td>
                        <td>{item['Unid. Med.'].substr(0, 3)}</td>
                        <td>{item.A}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Row className="justify-content-center pb-3">
                  <Col xs="auto" className="text-center">
                    <Button
                      variant="warning"
                      onClick={(e) => handleDelete(e, index)}
                    >
                      Limpar
                    </Button>
                  </Col>
                  <Col xs="auto" className="text-center">
                    <Dropdown as={ButtonGroup}>
                      <Button
                        onClick={(e) => handleStore(e, index)}
                        variant="success"
                      >
                        Receber Restrito
                      </Button>

                      <Dropdown.Toggle
                        split
                        variant="success"
                        id="dropdown-split-basic"
                      />

                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={(e) => handleStore(e, index, true)}
                        >
                          Repor Estoque
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                </Row>
              </Container>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </>
  );
}
