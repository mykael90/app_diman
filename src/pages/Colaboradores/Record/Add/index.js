/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Form } from 'react-bootstrap';
import { IMaskInput } from 'react-imask';
import { FaPhone, FaPlus, FaTrashAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

import * as yup from 'yup'; // RulesValidation
import { Formik, Field, ErrorMessage, FieldArray } from 'formik'; // FormValidation
import axios from '../../../../services/axios';
import { primaryDarkColor } from '../../../../config/colors';
import Loading from '../../../../components/Loading';

export default function index({ submitReq }) {
  const [reqs, setReqs] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contacttypes, setContacttypes] = useState([]);
  const [jobtypes, setJobtypes] = useState([]);
  const [contracts, setContracts] = useState([]);

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
    WorkerContracts: {
      WorkerJobtypeId: '',
      start: '',
      ContractId: '',
    },
    WorkerContacts: [
      {
        contacttypeId: '',
        contact: '',
        obs: '',
        default: '',
      },
    ],
  };

  useEffect(() => {
    async function getContacttypes() {
      try {
        setIsLoading(true);
        const responseContact = await axios.get(`/workers/contacttypes`);
        const responseContract = await axios.get(`/workers/contracts`);
        const responseJob = await axios.get(`/workers/jobtypes`);

        setContacttypes(responseContact.data);
        setContracts(responseContract.data);
        setJobtypes(responseJob.data);

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
          <span className="fs-5">INFORMAÇÕES GERAIS</span>
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
                    md={4}
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
                  <Form.Group
                    as={Col}
                    xs={12}
                    md={4}
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
                    md={4}
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
                </Row>
                <hr />
                <Row
                  className="d-flex text-center"
                  style={{ background: primaryDarkColor, color: 'white' }}
                >
                  <span className="fs-6">CONTATOS</span>
                </Row>
                <Row className="justify-content-center pt-2 pb-4">
                  <FieldArray name="WorkerContacts">
                    {(fieldArrayProps) => {
                      const { push, remove } = fieldArrayProps;
                      return (
                        <Row>
                          {values.WorkerContacts.length > 0 &&
                            values.WorkerContacts.map((contato, i) => (
                              <>
                                <Form.Group
                                  as={Col}
                                  xs={12}
                                  md={3}
                                  controlId={`WorkerContacts[${i}].contacttypeId`}
                                >
                                  <Form.Select
                                    type="text"
                                    value={contato.contacttypes}
                                    onChange={handleChange}
                                    placeholder="Selecione o tipo"
                                    onBlur={handleBlur}
                                  >
                                    <option>Selecione o tipo</option>
                                    {contacttypes.map((types) => (
                                      <option key={types.id} value={types.id}>
                                        {types.type}
                                      </option>
                                    ))}
                                  </Form.Select>
                                </Form.Group>

                                <Form.Group
                                  as={Col}
                                  xs={12}
                                  md={3}
                                  controlId={`WorkerContacts[${i}].contact`}
                                >
                                  <Form.Control
                                    placeholder="Digite o contato"
                                    value={contato.contact}
                                    onChange={handleChange}
                                  />
                                </Form.Group>
                                <Form.Group
                                  as={Col}
                                  xs={12}
                                  md={3}
                                  controlId={`WorkerContacts[${i}].obs`}
                                >
                                  <Form.Control
                                    placeholder="Digite a observação"
                                    value={contato.obs}
                                    onChange={handleChange}
                                  />
                                </Form.Group>
                                <Form.Group
                                  as={Col}
                                  xs={12}
                                  md={2}
                                  controlId={`WorkerContacts[${i}].default`}
                                >
                                  <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    value={contato.default}
                                    label="Padrão"
                                  />
                                </Form.Group>
                                <Col sm>
                                  {values.WorkerContacts.length <= 1 ? (
                                    <Button
                                      size="sm"
                                      variant="success"
                                      onClick={() =>
                                        push({ contacttypeId: '', contact: '' })
                                      }
                                    >
                                      <FaPlus />
                                    </Button>
                                  ) : values.WorkerContacts.length - 1 < i ? (
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
                              </>
                            ))}
                        </Row>
                      );
                    }}
                  </FieldArray>
                </Row>
                <Row
                  className="d-flex text-center"
                  style={{ background: primaryDarkColor, color: 'white' }}
                >
                  <span className="fs-6">ENDEREÇOS</span>
                </Row>
                <Row className="justify-content-center pt-2 pb-4">
                  <Form.Group
                    as={Col}
                    xs={12}
                    md={4}
                    controlId="zipcode"
                    className="pt-2"
                  >
                    <Form.Label>CEP</Form.Label>
                    <Form.Control
                      type="text"
                      value={values.cpf}
                      onChange={handleChange}
                      // isInvalid={touched.cpf && !!errors.cpf}
                      // isValid={touched.cpf && !errors.cpf}
                      placeholder="Digite o CEP"
                      onBlur={handleBlur}
                    />
                    {/* <Form.Control.Feedback
                      tooltip
                      type="invalid"
                      style={{ position: 'static' }}
                    >
                      {errors.cpf}
                    </Form.Control.Feedback> */}
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    xs={12}
                    md={4}
                    controlId="street"
                    className="pt-2"
                  >
                    <Form.Label>LOGRADOURO</Form.Label>
                    <Form.Control
                      type="text"
                      value={values.rg}
                      onChange={handleChange}
                      // isInvalid={touched.rg && !!errors.rg}
                      // isValid={touched.rg && !errors.rg}
                      placeholder="Digite o Logradouro"
                      onBlur={handleBlur}
                    />
                    {/* <Form.Control.Feedback
                      tooltip
                      type="invalid"
                      style={{ position: 'static' }}
                    >
                      {errors.rg}
                    </Form.Control.Feedback> */}
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    xs={12}
                    md={4}
                    controlId="number"
                    className="pt-2"
                  >
                    <Form.Label>NÚMERO</Form.Label>
                    <Form.Control
                      type="number"
                      value={values.birthdate}
                      onChange={handleChange}
                      // isInvalid={touched.birthdate && !!errors.birthdate}
                      // isValid={touched.birthdate && !errors.birthdate}
                      placeholder="Digite o Número"
                      onBlur={handleBlur}
                    />
                    {/* <Form.Control.Feedback
                      tooltip
                      type="invalid"
                      style={{ position: 'static' }}
                    >
                      {errors.birthdate}
                    </Form.Control.Feedback> */}
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    xs={12}
                    controlId="complement"
                    className="pt-2"
                  >
                    <Form.Label>COMPLEMENTO</Form.Label>
                    <Form.Control
                      type="text"
                      value={values.name}
                      onChange={handleChange}
                      // isInvalid={touched.name && !!errors.name}
                      // isValid={touched.name && !errors.name}
                      placeholder="Digite o Complemento"
                      onBlur={handleBlur}
                    />
                    {/* <Form.Control.Feedback
                      tooltip
                      type="invalid"
                      style={{ position: 'static' }}
                    >
                      {errors.name}
                    </Form.Control.Feedback> */}
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    xs={12}
                    md={4}
                    controlId="district"
                    className="pt-2"
                  >
                    <Form.Label>BAIRRO</Form.Label>
                    <Form.Control
                      type="text"
                      value={values.cpf}
                      onChange={handleChange}
                      // isInvalid={touched.cpf && !!errors.cpf}
                      // isValid={touched.cpf && !errors.cpf}
                      placeholder="Digite o Bairro"
                      onBlur={handleBlur}
                    />
                    {/* <Form.Control.Feedback
                      tooltip
                      type="invalid"
                      style={{ position: 'static' }}
                    >
                      {errors.cpf}
                    </Form.Control.Feedback> */}
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    xs={12}
                    md={4}
                    controlId="city"
                    className="pt-2"
                  >
                    <Form.Label>CIDADE</Form.Label>
                    <Form.Control
                      type="text"
                      value={values.rg}
                      onChange={handleChange}
                      // isInvalid={touched.rg && !!errors.rg}
                      // isValid={touched.rg && !errors.rg}
                      placeholder="Digite a Cidade"
                      onBlur={handleBlur}
                    />
                    {/* <Form.Control.Feedback
                      tooltip
                      type="invalid"
                      style={{ position: 'static' }}
                    >
                      {errors.rg}
                    </Form.Control.Feedback> */}
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    xs={12}
                    md={4}
                    controlId="country"
                    className="pt-2"
                  >
                    <Form.Label>PAÍS</Form.Label>
                    <Form.Control
                      type="text"
                      value={values.birthdate}
                      onChange={handleChange}
                      // isInvalid={touched.birthdate && !!errors.birthdate}
                      // isValid={touched.birthdate && !errors.birthdate}
                      placeholder="Selecione o País"
                      onBlur={handleBlur}
                    />
                    {/* <Form.Control.Feedback
                      tooltip
                      type="invalid"
                      style={{ position: 'static' }}
                    >
                      {errors.birthdate}
                    </Form.Control.Feedback> */}
                  </Form.Group>
                </Row>
                <Row
                  className="d-flex text-center"
                  style={{ background: primaryDarkColor, color: 'white' }}
                >
                  <span className="fs-6">CONTRATOS</span>
                </Row>
                <Row className="justify-content-center pt-2 pb-4">
                  <Form.Group
                    as={Col}
                    xs={12}
                    md={4}
                    controlId="WorkerContracts.ContractId"
                    className="pt-2"
                  >
                    <Form.Label>NÚMERO DO CONTRATO</Form.Label>
                    <Form.Select
                      type="text"
                      value={values.WorkerContracts.ContractId}
                      onChange={handleChange}
                      placeholder="Selecione o Contrato"
                      onBlur={handleBlur}
                    >
                      <option>Selecione o Contrato</option>
                      {contracts.map((contract) => (
                        <option key={contract.id} value={contract.id}>
                          {contract.codigoSipac}
                        </option>
                      ))}
                    </Form.Select>
                    {/* <Form.Control.Feedback
                      tooltip
                      type="invalid"
                      style={{ position: 'static' }}
                    >
                      {errors.rg}
                    </Form.Control.Feedback> */}
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    xs={12}
                    md={4}
                    controlId="WorkerContracts.WorkerJobtypeId"
                    className="pt-2"
                  >
                    <Form.Label>FUNÇÃO</Form.Label>
                    <Form.Select
                      type="text"
                      value={values.WorkerContracts.WorkerJobtypeId}
                      onChange={handleChange}
                      placeholder="Selecione a Função"
                      onBlur={handleBlur}
                    >
                      <option>Selecione a Função</option>
                      {jobtypes.map((job) => (
                        <option key={job.id} value={job.id}>
                          {job.job}
                        </option>
                      ))}
                    </Form.Select>
                    {/* <Form.Control.Feedback
                      tooltip
                      type="invalid"
                      style={{ position: 'static' }}
                    >
                      {errors.rg}
                    </Form.Control.Feedback> */}
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    xs={12}
                    md={4}
                    controlId="WorkerContracts.start"
                    className="pt-2"
                  >
                    <Form.Label>INÍCIO</Form.Label>
                    <Form.Control
                      type="date"
                      dateFormat="YYYY-MM-DD"
                      value={values.WorkerContracts.start}
                      onChange={handleChange}
                      // isInvalid={touched.birthdate && !!errors.birthdate}
                      // isValid={touched.birthdate && !errors.birthdate}
                      placeholder="Digite o inicio do contrato"
                      onBlur={handleBlur}
                    />
                    {/* <Form.Control.Feedback
                      tooltip
                      type="invalid"
                      style={{ position: 'static' }}
                    >
                      {errors.birthdate}
                    </Form.Control.Feedback> */}
                  </Form.Group>
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
