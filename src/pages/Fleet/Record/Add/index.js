/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Button, Row, Col, Form } from 'react-bootstrap';
import { IMaskInput } from 'react-imask';
import { toast } from 'react-toastify';

import * as yup from 'yup'; // RulesValidation
import { Formik } from 'formik'; // FormValidation
import { primaryDarkColor } from '../../../../config/colors';
import Loading from '../../../../components/Loading';

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);
  // const [contacttypes, setContacttypes] = useState([]);
  const template = {
    name: '',
    email: '',
    phone: '',
    birthdate: '',
    rg: '',
    cpf: '',
    filenamePhoto: '',
  };
  const [initialValues, setInitialValues] = useState(template);

  const schema = yup.object().shape({
    name: yup.string().required('Requerido'),
    // email: yup.string().email('Digite um email válido').required('Requerido'),
    // rg: yup.string().required('Requerido'),
    // phone: yup.string().required('Requerido'),
    // cpf: yup
    //   .string()
    //   .test('is-valid', 'CPF inválido', (cpf) => validateCPF(cpf)),
    // birthdate: yup
    //   .date()
    //   .max(new Date(), 'Não é possível incluir uma data futura')
    //   .required('Campo obrigatório'),
  });

  const handleStore = async (values, resetForm) => {
    try {
      resetForm();
      setIsLoading(false);
      console.log(values);
      toast.success('Colaborador Cadastrado Com Sucesso!');
    } catch (err) {
      // eslint-disable-next-line no-unused-expressions
      err.response?.data?.errors
        ? err.response.data.errors.map((error) => toast.error(error)) // errors -> resposta de erro enviada do backend (precisa se conectar com o back)
        : toast.error(err.message); // e.message -> erro formulado no front (é criado pelo front, não precisa de conexão)
      setIsLoading(false);
    }
  };

  return (
    <>
      <Loading isLoading={isLoading} />
      <div className="bg-light border rounded pt-2 px-3">
        <Row>
          <Col
            xs={12}
            className=" text-center"
            style={{ background: primaryDarkColor, color: 'white' }}
          >
            <span className="fs-5">INFORMAÇÕES PESSOAIS</span>
          </Col>
        </Row>
        <Row className="pt-2">
          <Formik
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={(values, { resetForm }) => {
              handleStore(values, resetForm);
            }}
            enableReinitialize
          >
            {({
              handleSubmit,
              resetForm,
              handleChange,
              handleBlur,
              values,
              touched,
              errors,
              setFieldValue,
            }) => (
              <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Row className="d-flex justify-content-center align-items-center pb-4">
                  <Col md={10} lg={8}>
                    <Row>
                      <Form.Group
                        as={Col}
                        xs={12}
                        controlId="name"
                        className="pb-3"
                      >
                        <Form.Label>NOME</Form.Label>
                        <Form.Control
                          type="text"
                          value={values.name}
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          isInvalid={touched.name && !!errors.name}
                          isValid={touched.name && !errors.name}
                          placeholder="Digite o nome completo"
                          onBlur={(e) => {
                            setFieldValue('name', e.target.value.toUpperCase()); // UPPERCASE
                            handleBlur(e);
                          }}
                        />
                        {/* {touched.name && !!errors.name ? (
                          <Badge bg="danger">{errors.name}</Badge>
                        ) : null} */}
                        <Form.Control.Feedback
                          tooltip
                          type="invalid"
                          style={{ position: 'static' }}
                        >
                          {errors.name}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Row>
                    <Row>
                      <Form.Group
                        as={Col}
                        xs={12}
                        lg={4}
                        controlId="cpf"
                        className="pb-3"
                      >
                        <Form.Label>CPF</Form.Label>
                        <Form.Control
                          type="tel"
                          as={IMaskInput}
                          mask="000.000.000-00"
                          value={values.cpf}
                          isInvalid={touched.cpf && !!errors.cpf}
                          // isValid={touched.cpf && !errors.cpf}
                          placeholder="Digite o CPF"
                          onBlur={handleBlur}
                          onAccept={(value, mask) => {
                            setFieldValue(mask.el.input.id, mask.unmaskedValue);
                          }}
                        />
                        <Form.Control.Feedback
                          tooltip
                          type="invalid"
                          style={{ position: 'static' }}
                        >
                          {errors.cpf}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        xs={12}
                        lg={4}
                        controlId="rg"
                        className="pb-3"
                      >
                        <Form.Label>RG</Form.Label>
                        <Form.Control
                          type="tel"
                          as={IMaskInput}
                          mask={Number}
                          value={values.rg}
                          isInvalid={touched.rg && !!errors.rg}
                          // isValid={touched.rg && !errors.rg}
                          placeholder="Digite o RG"
                          onBlur={handleBlur}
                          onAccept={(value, mask) => {
                            setFieldValue(mask.el.input.id, mask.unmaskedValue);
                          }}
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
                        lg={4}
                        controlId="birthdate"
                        className="pb-3"
                      >
                        <Form.Label>NASCIMENTO</Form.Label>
                        <Form.Control
                          type="date"
                          value={values.birthdate}
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          isInvalid={touched.birthdate && !!errors.birthdate}
                          // isValid={touched.birthdate && !errors.birthdate}
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
                    </Row>
                    <Row>
                      <Form.Group
                        as={Col}
                        xs={12}
                        lg={8}
                        controlId="email"
                        className="pb-3"
                      >
                        <Form.Label>EMAIL</Form.Label>
                        <Form.Control
                          as={IMaskInput}
                          mask={/^\S*@?\S*$/}
                          type="text"
                          value={values.email}
                          // onChange={handleChange}
                          isInvalid={touched.email && !!errors.email}
                          // isValid={touched.email && !errors.email}
                          placeholder="Digite o email"
                          onBlur={(e) => {
                            setFieldValue(
                              'email',
                              e.target.value.toLowerCase()
                            ); // lowercase
                            handleBlur(e);
                          }}
                          onAccept={(value, mask) => {
                            setFieldValue(mask.el.input.id, mask.unmaskedValue);
                          }}
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
                        lg={4}
                        controlId="phone"
                        className="pb-3"
                      >
                        <Form.Label>TELEFONE</Form.Label>
                        <Form.Control
                          as={IMaskInput}
                          mask="(00) 0.0000-0000"
                          type="tel"
                          value={values.phone}
                          // onChange={handleChange}
                          isInvalid={touched.phone && !!errors.phone}
                          // isValid={touched.phone && !errors.phone}
                          placeholder="Digite o telefone"
                          onBlur={(e) => {
                            setFieldValue(
                              'phone',
                              e.target.value.toLowerCase()
                            ); // lowercase
                            handleBlur(e);
                          }}
                          onAccept={(value, mask) => {
                            setFieldValue(mask.el.input.id, mask.unmaskedValue);
                          }}
                        />
                        <Form.Control.Feedback
                          tooltip
                          type="invalid"
                          style={{ position: 'static' }}
                        >
                          {errors.phone}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Row>
                  </Col>
                </Row>

                <Row className="d-flex justify-content-center align-items-center">
                  <Col
                    xs={12}
                    className="text-center"
                    style={{ background: primaryDarkColor, color: 'white' }}
                  >
                    <span className="fs-6">CONTRATOS</span>
                  </Col>
                </Row>

                <Row className="justify-content-center pt-2 pb-4">
                  <>
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
                      <Button variant="success" type="submit">
                        Cadastrar
                      </Button>
                    </Col>
                  </>
                </Row>
              </Form>
            )}
          </Formik>
        </Row>
      </div>
    </>
  );
}
