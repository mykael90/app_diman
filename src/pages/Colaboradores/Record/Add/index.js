/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Button, InputGroup, Row, Col, Form } from 'react-bootstrap';
import { IMaskInput } from 'react-imask';
import { FaPhone } from 'react-icons/fa';
import { toast } from 'react-toastify';

import * as yup from 'yup'; // RulesValidation
import { Formik } from 'formik'; // FormValidation
import { primaryDarkColor } from '../../../../config/colors';

export default function index({ submitReq }) {
  const [reqs, setReqs] = useState('');

  const schema = yup.object().shape({
    name: yup.string().required('Requerido'),
    email: yup.string().email('Digite um email válido').required('Requerido'),
    rg: yup.string().required('Requerido'),
    cpf: yup.string().required('Requerido'),
    telefone: yup.string().required('Requerido'),
    instagram: yup.string().required('Requerido'),
    birthdate: yup
      .date()
      .max(new Date(), 'Não é possível incluir uma data futura')
      .required('Campo obrigatório'),
  });

  const addReq = (submitReq) => {
    const currentYear = new Date().getFullYear();
    console.log(submitReq);

    // limitar a 10 itens
    if (reqs.length > 9) {
      toast.error('Lista de importação limitada a 10 itens', {
        autoClose: false,
        draggable: true,
        closeOnClick: true,
      });
      return;
    }

    // não incluir repetido na lista
    if (reqs.length > 0) {
      let exists = false;

      reqs.every((value) => {
        if (Object.values(value).includes(submitReq)) {
          exists = true;
          return false;
        }
        return true;
      });

      if (exists) {
        toast.error('Item já incluído na lista de importação', {
          autoClose: false,
          draggable: true,
          closeOnClick: true,
        });
        return;
      }
    }

    const id = reqs.length ? reqs[reqs.length - 1].id + 1 : 1;
    const newReq = { id, req: submitReq };
    const listReqs = [...reqs, newReq];
    setReqs(listReqs);
  };

  const deleteReq = (id) => {
    // forma diferente de escrever, poderia usar splice
    const listReqs = reqs.filter((req) => req.id !== id);
    setReqs(listReqs);
  };
  const addContact = ({ newReq }, resetForm) => {
    if (!newReq) return;
    addReq(newReq);
    resetForm();
  };

  return (
    <Row className="bg-light border rounded d-flex justify-content-center pt-2">
      <Row
        className="px-0 mx-0 my-2 py-2 text-center"
        style={{ background: primaryDarkColor, color: 'white' }}
      >
        <span className="fs-5">CADASTRO DE COLABORADORES</span>
      </Row>
      <Row className="px-0 pt-2">
        <Formik
          initialValues={{
            name: '',
            email: '',
            birthdate: '',
            rg: '',
            cpf: '',
            telefone: '',
          }}
          validationSchema={schema}
          onSubmit={(values, { resetForm }) => {
            submitReq(values, resetForm);
          }}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            touched,
            isValid,
            errors,
          }) => (
            <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <Row>
                <Form.Group as={Col} xs={12} controlId="name" className="pt-2">
                  <Form.Label>NOME</Form.Label>
                  <Form.Control
                    type="text"
                    value={values.name}
                    onChange={handleChange}
                    isInvalid={touched.name && !!errors.name}
                    isValid={touched.name && !errors.name}
                    placeholder="Digite o nome completo"
                    onBlur={handleBlur}
                  />
                  <Form.Control.Feedback
                    tooltip
                    type="invalid"
                    style={{ position: 'static' }}
                  >
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group
                  as={Col}
                  xs={12}
                  md={6}
                  controlId="email"
                  className="pt-2"
                >
                  <Form.Label>EMAIL</Form.Label>
                  <Form.Control
                    type="text"
                    value={values.email}
                    onChange={handleChange}
                    isInvalid={touched.email && !!errors.email}
                    isValid={touched.email && !errors.email}
                    placeholder="Digite o email"
                    onBlur={handleBlur}
                  />

                  <Form.Control.Feedback
                    tooltip
                    type="invalid"
                    style={{ position: 'static' }}
                  >
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group
                  as={Col}
                  xs={12}
                  md={6}
                  controlId="birthdate"
                  className="pt-2"
                >
                  <Form.Label>DATA DE NASCIMENTO</Form.Label>
                  <Form.Control
                    type="date"
                    value={values.birthdate}
                    onChange={handleChange}
                    isInvalid={touched.birthdate && !!errors.birthdate}
                    isValid={touched.birthdate && !errors.birthdate}
                    placeholder="Selecione a data"
                    onBlur={handleBlur}
                  />
                  <Form.Control.Feedback
                    tooltip
                    type="invalid"
                    style={{ position: 'static' }}
                  >
                    {errors.birthdate}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group
                  as={Col}
                  xs={12}
                  md={6}
                  controlId="rg"
                  className="pt-2"
                >
                  <Form.Label>RG</Form.Label>
                  <Form.Control
                    type="text"
                    as={IMaskInput}
                    mask="000.000.000"
                    value={values.rg}
                    onChange={handleChange}
                    isInvalid={touched.rg && !!errors.rg}
                    isValid={touched.rg && !errors.rg}
                    placeholder="Digite o RG"
                    onBlur={handleBlur}
                  />

                  <Form.Control.Feedback
                    tooltip
                    type="invalid"
                    style={{ position: 'static' }}
                  >
                    {errors.rg}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group
                  as={Col}
                  xs={12}
                  md={6}
                  controlId="cpf"
                  className="pt-2"
                >
                  <Form.Label>CPF</Form.Label>
                  <Form.Control
                    type="text"
                    as={IMaskInput}
                    mask="000.000.000-00"
                    value={values.cpf}
                    onChange={handleChange}
                    isInvalid={touched.cpf && !!errors.cpf}
                    isValid={touched.cpf && !errors.cpf}
                    placeholder="Digite o CPF"
                    onBlur={handleBlur}
                  />

                  <Form.Control.Feedback
                    tooltip
                    type="invalid"
                    style={{ position: 'static' }}
                  >
                    {errors.cpf}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <hr />
              <Row>
                <Form.Group
                  as={Col}
                  xs={12}
                  md={6}
                  controlId="telefone"
                  className="pt-0"
                >
                  <Form.Label>Telefone</Form.Label>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">
                      <FaPhone />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      as={IMaskInput}
                      mask="(00) 00000-0000"
                      value={values.telefone}
                      onChange={handleChange}
                      isInvalid={touched.telefone && !!errors.telefone}
                      isValid={touched.telefone && !errors.telefone}
                      placeholder="Digite o telefone"
                      onBlur={handleBlur}
                    />
                  </InputGroup>
                  <Form.Control.Feedback
                    tooltip
                    type="invalid"
                    style={{ position: 'static' }}
                  >
                    {errors.telefone}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group
                  as={Col}
                  xs={12}
                  md={6}
                  controlId="instagram"
                  className="pt-0"
                >
                  <Form.Label>instagram</Form.Label>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                    <Form.Control
                      type="text"
                      value={values.instagram}
                      onChange={handleChange}
                      isInvalid={touched.instagram && !!errors.instagram}
                      isValid={touched.instagram && !errors.instagram}
                      placeholder="Digite o Instagram"
                      onBlur={handleBlur}
                    />
                  </InputGroup>

                  <Form.Control.Feedback
                    tooltip
                    type="invalid"
                    style={{ position: 'static' }}
                  >
                    {errors.instagram}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <hr />
              <Row className="justify-content-center pt-2 pb-4">
                <Col xs="auto" className="text-center">
                  <Button variant="warning" onClick={console.log(`click`)}>
                    Limpar
                  </Button>
                </Col>
                <Col xs="auto" className="text-center">
                  <Button variant="success" onClick={addReq}>
                    Cadastrar
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </Row>
    </Row>
  );
}
