import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { isEmail } from 'validator';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { Form, Button, Row, Col } from 'react-bootstrap';
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
    <Row
      xs={1}
      md={2}
      lg={2}
      xl={3}
      xxl={3}
      className="justify-content-md-center"
    >
      <Col>
        <Loading isLoading={isLoading} />
        <h2>Login</h2>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Insira seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Form.Text className="text-muted">
              Não compartilhamos seu email.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Senha</Form.Label>
            <Form.Control
              type="password"
              placeholder="Insira sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Check me out" />
          </Form.Group>

          <Button variant="primary" type="submit" onClick={handleSubmit}>
            Logar
          </Button>
        </Form>
      </Col>
    </Row>
  );
}
