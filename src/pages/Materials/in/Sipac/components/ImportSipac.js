import React from 'react';

import { Container, Row, Col, Button } from 'react-bootstrap';

import { StyledForm } from '../styled';
import { primaryDarkColor, body1Color } from '../../../../../config/colors';

export default function importSipac({
  handleSubmit,
  reqmat,
  setReqmat,
  handleClear,
}) {
  return (
    <Container>
      <Row className="py-2 justify-content-center">
        <Col
          xs="11"
          lg="6"
          xl="4"
          className="border"
          style={{ background: body1Color }}
        >
          <Row
            className="justify-content-center fs-6"
            style={{ background: primaryDarkColor, color: 'white' }}
          >
            Lista de importação
          </Row>
          <StyledForm my="2" mx="2" onSubmit={handleSubmit}>
            <StyledForm.Group className="mb-1" controlId="formBasicEmail">
              <StyledForm.Label className="fs-6">
                Nº Requisição de Material:
              </StyledForm.Label>
              <StyledForm.Control
                type="text"
                value={reqmat}
                onChange={(e) => setReqmat(e.target.value)}
                placeholder="Insira aqui cód. RM"
              />
              <StyledForm.Text className="text-muted">
                A requisição será importada do SIPAC. O processo pode demorar
                alguns segundos.
              </StyledForm.Text>
            </StyledForm.Group>
            <Row className="text-center justify-content-center">
              <Col xs="auto" className="my-1">
                <Button variant="warning" onClick={handleClear}>
                  Limpar
                </Button>
              </Col>
              <Col xs="auto" className="my-1">
                <Button variant="primary" className="btn-primary" type="submit">
                  Importar
                </Button>
              </Col>
            </Row>
          </StyledForm>
        </Col>
      </Row>
    </Container>
  );
}
