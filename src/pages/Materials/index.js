/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react';
import { get } from 'lodash';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';

import { StyledForm } from './styled';
import Loading from '../../components/Loading';
import Result from './result';

export default function inputMaterial() {
  const [reqmat, setReqmat] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sipac, setSipac] = useState({});

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_AXIOS_SIPAC}/reqmaterial/${reqmat}`
      );
      setSipac({ ...sipac, ...response.data });

      setIsLoading(false);
    } catch (err) {
      const status = get(err, 'response.status', 0);

      if (status === 401) {
        toast.error('Você precisa fazer login');
      } else {
        toast.error('Ocorreu um erro ao excluir aluno');
      }

      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <Row className="py-5 justify-content-center">
        <Col xs="6" lg="3">
          <Row className="border border-3 rounded-1 border-dark bg-primary justify-content-center">
            TESTANDO
          </Row>
          <StyledForm py="5" px="5" my="5" mx="5">
            <StyledForm.Group className="mb-3" controlId="formBasicEmail">
              <StyledForm.Label class="fs-1">
                Nº Requisição de Material
              </StyledForm.Label>
              <StyledForm.Control
                type="text"
                value={reqmat}
                onChange={(e) => setReqmat(e.target.value)}
                placeholder="requisição"
              />
              <StyledForm.Text className="text-muted">
                A requisição será importada do SIPAC. O processo pode demorar
                alguns segundos.
              </StyledForm.Text>
            </StyledForm.Group>

            <div className="text-center">
              <Button
                onClick={handleClick}
                variant="primary"
                className="btn-primary"
                type="submit"
              >
                Importar
              </Button>
            </div>
          </StyledForm>
        </Col>
      </Row>
      {Object.keys(sipac).length === 0 ? (
        <p>Nada importado ainda.</p>
      ) : (
        <Result {...sipac} />
      )}

      <Form>
        <Form.Group className="mb-3" controlId="formGroupEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGroupPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>
      </Form>
    </Container>
  );
}
