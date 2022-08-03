/* eslint-disable react/jsx-no-bind */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { isEmail } from 'validator';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import { get } from 'lodash';

import FormComp from './FormComp';

import Loading from '../../components/Loading';
import axios from '../../services/axios';
import * as actions from '../../store/modules/auth/actions';

export default function Register() {
  const dispatch = useDispatch();
  const id = useSelector((state) => state.auth.user.id);
  const nameStored = useSelector((state) => state.auth.user.name);
  const emailStored = useSelector((state) => state.auth.user.email);
  const isLoading = useSelector((state) => state.auth.isLoading);

  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [positions, setPositions] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    setName(nameStored);
    setEmail(emailStored);
  }, [emailStored, id, nameStored]);

  useEffect(() => {
    async function getData() {
      try {
        // setIsLoading(true);
        const response = await axios.get('/userspositions/types');
        setPositions(response.data);
        // setIsLoading(false);
      } catch (err) {
        const errors = get(err, 'response.data.errors', []);
        errors.map((error) => toast.error(error));
        // setIsLoading(false);
      }
    }
    getData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    let formErrors = false;

    if (name.length < 3 || name.length > 255) {
      formErrors = true;
      toast.error('Nome deve ter entre 3 e 255 caracteres');
    }

    if (username.length < 3 || username.length > 35) {
      formErrors = true;
      toast.error('Login deve ter entre 3 e 35 caracteres');
    }

    if (!isEmail(email)) {
      formErrors = true;
      toast.error('Email inválido');
    }

    if (!id && (password.length < 6 || password.length > 50)) {
      formErrors = true;
      toast.error('Senha deve ter entre 6 e 50 caracteres');
    }

    if (formErrors) return;

    dispatch(
      actions.registerRequest({
        name,
        position,
        email,
        username,
        password,
        id,
        navigate,
      })
    );
  }
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
          <p className="h4 text-center pb-4">
            {id ? 'Editar dados' : 'Crie sua conta'}
          </p>
        </Row>
        <FormComp
          handleSubmit={handleSubmit}
          id={id}
          name={name}
          setName={setName}
          setPosition={setPosition}
          positions={positions}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          email={email}
          setEmail={setEmail}
        />
      </Col>
    </Container>
  );
}
