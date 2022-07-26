import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { isEmail } from 'validator';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { FaUser, FaSignInAlt, FaStarOfLife } from 'react-icons/fa';

import { Form, Container, InputGroup, Row, Col, Button } from 'react-bootstrap';

import * as actions from '../../store/modules/auth/actions';
import Loading from '../../components/Loading';

export default function Login() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const location = useLocation();
  const prevPath = location.state?.from?.pathname || '/';

  const isLoading = useSelector((state) => state.auth.isLoading);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    let formErrors = false;

    if (!isEmail(email)) {
      formErrors = true;
      toast.error('Email inválido');
    }

    if (password.length < 6 || password.length > 50) {
      formErrors = true;
      toast.error('Senha inválida');
    }
    if (formErrors) return;

    dispatch(actions.loginRequest({ email, password, prevPath, navigate }));
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
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              aria-label="Email"
              aria-describedby="basic-addon1"
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon3">
              <FaStarOfLife />
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
