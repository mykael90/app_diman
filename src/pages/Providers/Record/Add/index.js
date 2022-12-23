/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from 'react';
import { Button, Row, Col, Form, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';

import * as yup from 'yup'; // RulesValidation
import { Formik } from 'formik'; // FormValidation
import axios from '../../../../services/axios';
import { primaryDarkColor } from '../../../../config/colors';
import Loading from '../../../../components/Loading';

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef();

  const schema = yup.object().shape({
    cpfCnpj: yup
      .number()
      .typeError('Digite apenas números')
      .required('Requerido'),
    nomeFantasia: yup.string().required('Requerido'),
    razaoSocial: yup.string().required('Requerido'),
  });

  useEffect(() => {
    // Focus on inputRef
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleStore = async (values, resetForm) => {
    try {
      setIsLoading(true);
      console.log(values);
      await axios.post(`/providers/`, values);

      setIsLoading(false);
      resetForm();

      toast.success(`Cadastro realizado com sucesso`);
    } catch (err) {
      // eslint-disable-next-line no-unused-expressions
      err.response?.data?.errors
        ? err.response.data.errors.map((error) => toast.error(error)) // errors -> resposta de erro enviada do backend (precisa se conectar com o back)
        : toast.error(err.message); // e.message -> erro formulado no front (é criado pelo front, não precisa de conexão)

      setIsLoading(false);
    }
  };

  const initialValues = {
    cpfCnpj: '',
    nomeFantasia: '',
    razaoSocial: '',
  };
  return (
    <>
      <Loading isLoading={isLoading} />
      <Row className="bg-light border rounded d-flex justify-content-center pt-2">
        <Row
          className="px-0 mx-0 py-2 text-center"
          style={{ background: primaryDarkColor, color: 'white' }}
        >
          <span className="fs-5">CADASTRO DE FORNECEDOR</span>
        </Row>
        <Row className="px-0 pt-2">
          <Formik // FORAM DEFINIFOS 2 FORMULÁRIOS POIS O SEGUNDO SÓ VAI APARECER AOÓS A INSERÇÃO DO PRIMEIRO
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={(values, { resetForm }) => {
              handleStore(values, resetForm);
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
              setFieldValue,
              setFieldTouched,
            }) => (
              <Form noValidate autoComplete="off">
                <Row>
                  <Form.Group
                    as={Col}
                    xs={5}
                    sm={5}
                    md={3}
                    lg={2}
                    controlId="cpfCnpj"
                    className="pb-3"
                  >
                    <Form.Label>CNPJ/CPF</Form.Label>
                    <Form.Control
                      type="tel"
                      value={values.cpfCnpj}
                      onChange={handleChange}
                      autoFocus
                      ref={inputRef}
                      placeholder="Digite o cpf ou cnpj"
                      onBlur={handleBlur}
                    />
                    {touched.cpfCnpj && !!errors.cpfCnpj ? (
                      <Badge bg="danger">{errors.cpfCnpj}</Badge>
                    ) : null}
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    xs={12}
                    sm={7}
                    md={9}
                    lg={10}
                    controlId="nomeFantasia"
                    className="pb-3"
                  >
                    <Form.Label>NOME FANTASIA</Form.Label>
                    <Form.Control
                      type="text"
                      value={values.nomeFantasia}
                      onChange={(e) => {
                        setFieldValue(
                          'nomeFantasia',
                          e.target.value.toUpperCase()
                        ); // UPPERCASE
                      }}
                      placeholder="Digite o nome fantasia"
                      onBlur={handleBlur}
                    />
                    {touched.nomeFantasia && !!errors.nomeFantasia ? (
                      <Badge bg="danger">{errors.nomeFantasia}</Badge>
                    ) : null}
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group
                    as={Col}
                    xs={12}
                    controlId="razaoSocial"
                    className="pb-3"
                  >
                    <Form.Label>RAZÃO SOCIAL</Form.Label>
                    <Form.Control
                      type="text"
                      value={values.razaoSocial}
                      onChange={(e) => {
                        setFieldValue(
                          'razaoSocial',
                          e.target.value.toUpperCase()
                        ); // UPPERCASE
                      }}
                      placeholder="Digite a razão social completa"
                      onBlur={handleBlur}
                    />
                    {touched.razaoSocial && !!errors.razaoSocial ? (
                      <Badge bg="danger">{errors.razaoSocial}</Badge>
                    ) : null}
                  </Form.Group>
                </Row>

                <hr />

                <Row className="justify-content-center">
                  <Col xs="auto" className="text-center pt-2 pb-4">
                    <Button type="reset" variant="warning" onClick={resetForm}>
                      Limpar
                    </Button>
                  </Col>
                  <Col xs="auto" className="text-center pt-2 pb-4">
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
