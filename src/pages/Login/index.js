import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { FaUser, FaSignInAlt, FaLock } from 'react-icons/fa';

import { Form, Container, InputGroup, Row, Col, Button } from 'react-bootstrap';

import * as actions from '../../store/modules/auth/actions';
import Loading from '../../components/Loading';

export default function Login() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const location = useLocation();
  const prevPath = location.state?.from?.pathname || '/';

  const isLoading = useSelector((state) => state.auth.isLoading);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    let formErrors = false;

    if (username.length < 6 || username.length > 35) {
      formErrors = true;
      toast.error('Login inválido');
    }
    if (password.length < 6 || password.length > 50) {
      formErrors = true;
      toast.error('Senha inválida');
    }

    if (formErrors) return;

    dispatch(actions.loginRequest({ username, password, prevPath, navigate }));
  };

  return (
    <Container className="d-flex justify-content-center py-5">
      <Loading isLoading={isLoading} />
      <Col
        xs={10}
        sm={6}
        md={4}
        className="border rounded-2 px-4 py-4 bg-light"
      >
        <Row>
          <p className="h4 text-center pb-4">Login</p>
        </Row>
        <Form onSubmit={handleSubmit}>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              <FaUser />
            </InputGroup.Text>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu usuário"
              aria-label="Login"
              aria-describedby="basic-addon1"
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon3">
              <FaLock />
            </InputGroup.Text>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              aria-label="password"
              aria-describedby="basic-addon1"
            />
            <Button
              id="button-addon1"
              variant="outline-primary"
              size="sm"
              type="submit"
            >
              <FaSignInAlt />
            </Button>
          </InputGroup>
        </Form>
      </Col>
    </Container>
  );
}
