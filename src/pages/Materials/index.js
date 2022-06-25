/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react';
import { get } from 'lodash';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
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
      <Row className="my-2 py-2 justify-content-center">
        <Col xs="6" lg="3">
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label class="fs-1">Nº Requisição de Material</Form.Label>
              <Form.Control
                type="text"
                value={reqmat}
                onChange={(e) => setReqmat(e.target.value)}
                placeholder="requisição"
              />
              <Form.Text className="text-muted">
                A requisição será importada do SIPAC. O processo pode demorar
                alguns segundos.
              </Form.Text>
            </Form.Group>

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
          </Form>
        </Col>
      </Row>
      {Object.keys(sipac).length === 0 ? (
        <p>Nada importado ainda.</p>
      ) : (
        <Result {...sipac} />
      )}
    </Container>
  );
}
