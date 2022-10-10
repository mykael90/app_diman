/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Form } from 'react-bootstrap';
import { IMaskInput } from 'react-imask';
import { FaPhone, FaPlus, FaTrashAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useSelector } from 'react-redux';

import * as yup from 'yup'; // RulesValidation
import { Formik, Field, ErrorMessage, FieldArray } from 'formik'; // FormValidation
import axiosRest from '../../../../services/axios';
import { primaryDarkColor } from '../../../../config/colors';
import Loading from '../../../../components/Loading';

export default function index({ submitReq }) {
  const [reqs, setReqs] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contacttypes, setContacttypes] = useState([]);

  const schema = yup.object().shape({
    name: yup.string().required('Requerido'),
    email: yup.string().email('Digite um email válido').required('Requerido'),
    rg: yup.string().required('Requerido'),
    cpf: yup.string().required('Requerido'),
    birthdate: yup
      .date()
      .max(new Date(), 'Não é possível incluir uma data futura')
      .required('Campo obrigatório'),
  });

  const initialValues = {
    name: '',
    email: '',
    birthdate: '',
    rg: '',
    cpf: '',
    contacts: [
      {
        contacttypeId: '',
        contact: '',
      },
    ],
  };

  useEffect(() => {
    async function getContacttypes() {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_AXIOS_REST}/workers/contacttypes`
        );
        setContacttypes(response.data);
        setIsLoading(false);
      } catch (err) {
        // eslint-disable-next-line no-unused-expressions
        err.response?.data?.errors
          ? err.response.data.errors.map((error) => toast.error(error)) // errors -> resposta de erro enviada do backend (precisa se conectar com o back)
          : toast.error(err.message); // e.message -> erro formulado no front (é criado pelo front, não precisa de conexão)
        setIsLoading(false);
      }
    }

    getContacttypes();
  }, []);

  return (
    <>
      <Loading isLoading={isLoading} />
      <Row className="bg-light border rounded d-flex justify-content-center pt-2">
        <Row
          className="px-0 mx-0 my-2 py-2 text-center"
          style={{ background: primaryDarkColor, color: 'white' }}
        >
          <span className="fs-5">CADASTRO DE COLABORADORES</span>
        </Row>
        <Row className="px-0 pt-2">
          <Formik
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={(values, { resetForm }) => {
              console.log(values);
              resetForm();
            }}
          >
            {({
              submitForm,
              resetForm,
              handleChange,
              handleBlur,
              values,
              touched,
              errors,
            }) => (
              <Form noValidate autoComplete="off">
                {JSON.stringify(errors)}
                <Row>
                  <Form.Group
                    as={Col}
                    xs={12}
                    controlId="name"
                    className="pt-2"
                  >
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
                <Row
                  className="d-flex text-center"
                  style={{ background: primaryDarkColor, color: 'white' }}
                >
                  <span className="fs-6">CONTATOS</span>
                </Row>
                <Row className="justify-content-center pt-2 pb-4">
                  <FieldArray name="contacts">
                    {(fieldArrayProps) => {
                      const { push, remove } = fieldArrayProps;
                      return (
                        <Row>
                          {values.contacts.length > 0 &&
                            values.contacts.map((contato, i) => (
                              <Col xs={6} md={4} key={i}>
                                <Col sm>
                                  <Form.Group
                                    controlId={`contacts[${i}].contacttypeId`}
                                  >
                                    <Form.Select
                                      className="me-1"
                                      name={`contacts[${i}].contacttypeId`}
                                    >
                                      <option value="selecione">
                                        Selecione o Tipo
                                      </option>
                                      <option value="instagram">
                                        Instagram
                                      </option>
                                      <option value="telefone">Telefone</option>
                                      <option value="linkedin">Linkedin</option>
                                    </Form.Select>
                                  </Form.Group>
                                </Col>
                                <Col sm>
                                  <Form.Group
                                    controlId={`contacts[${i}].contact`}
                                  >
                                    <Form.Control
                                      placeholder="Digite o contato"
                                      value={contato.contact}
                                      onChange={handleChange}
                                    />
                                  </Form.Group>
                                </Col>
                                <Col sm>
                                  {values.contacts.length <= 1 ? (
                                    <Button
                                      size="sm"
                                      variant="success"
                                      onClick={() =>
                                        push({ contacttypeId: '', contact: '' })
                                      }
                                    >
                                      <FaPlus />
                                    </Button>
                                  ) : values.contacts.length - 1 < i ? (
                                    <Button
                                      size="sm"
                                      variant="outline-secondary"
                                      onClick={() => remove(i)}
                                    >
                                      <FaTrashAlt />
                                    </Button>
                                  ) : (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="outline-secondary"
                                        onClick={() => remove(i)}
                                      >
                                        <FaTrashAlt />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="success"
                                        onClick={() =>
                                          push({
                                            contacttypeId: '',
                                            contact: '',
                                          })
                                        }
                                      >
                                        <FaPlus />
                                      </Button>
                                    </>
                                  )}
                                </Col>
                              </Col>
                            ))}
                        </Row>
                      );
                    }}
                  </FieldArray>
                </Row>
                <hr />
                <Row className="justify-content-center pt-2 pb-4">
                  <Col xs="auto" className="text-center">
                    <Button
                      variant="warning"
                      onClick={() => {
                        resetForm();
                      }}
                    >
                      Limpar
                    </Button>
                  </Col>
                  <Col xs="auto" className="text-center">
                    <Button variant="success" onClick={submitForm}>
                      Cadastrar
                    </Button>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </Row>
      </Row>
    </>
  );
}
