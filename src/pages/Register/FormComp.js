import React from 'react';

import { FaUser, FaMale, FaLock } from 'react-icons/fa';

import { Form, InputGroup, Row, Button } from 'react-bootstrap';

export default function form({
  handleSubmit,
  id,
  name,
  setName,
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
}) {
  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">
            <FaMale />
          </InputGroup.Text>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite seu nome"
            aria-label="Name"
            aria-describedby="basic-addon1"
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email"
            aria-label="Email"
            aria-describedby="basic-addon1"
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">
            <FaUser />
          </InputGroup.Text>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Digite seu usuário de acesso"
            aria-label="Username"
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
        </InputGroup>
      </Row>
      <Row className="mx-0 my-4">
        <Button variant="outline-primary" size="sm" type="submit">
          {id ? 'Salvar' : 'Criar minha conta'}
        </Button>
      </Row>
    </Form>
  );
}
