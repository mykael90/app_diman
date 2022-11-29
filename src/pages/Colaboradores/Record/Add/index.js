/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Row, Col, Form, Image } from 'react-bootstrap';
import { IMaskInput } from 'react-imask';
import { FaPhone, FaPlus, FaTrashAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

import * as yup from 'yup'; // RulesValidation
import { Formik, FieldArray } from 'formik'; // FormValidation
import axios from '../../../../services/axios';
import { primaryDarkColor } from '../../../../config/colors';
import Loading from '../../../../components/Loading';

import ProfilePhoto from './components/ProfilePhoto';

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);
  // const [contacttypes, setContacttypes] = useState([]);
  const [jobtypes, setJobtypes] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [photoURL, setPhotoURL] = useState(
    `${process.env.REACT_APP_BASE_AXIOS_REST}/workers/images/default.png`
  );
  const [photo, setPhoto] = React.useState('');
  const [initialValues, setInitialValues] = useState({
    name: '',
    email: '',
    birthdate: '',
    rg: '',
    cpf: '',
    filenamePhoto: '',
    WorkerContracts: {
      WorkerJobtypeId: '',
      start: '',
      ContractId: '',
    },
  });

  const { id } = useParams();
  console.log(id);

  const schema = yup.object().shape({
    name: yup.string().required('Requerido'),
    // email: yup.string().email('Digite um email válido').required('Requerido'),
    // rg: yup.string().required('Requerido'),
    // cpf: yup.string().required('Requerido'),
    // birthdate: yup
    //   .date()
    //   .max(new Date(), 'Não é possível incluir uma data futura')
    //   .required('Campo obrigatório'),
  });

  useEffect(() => {
    async function getData() {
      try {
        if (id) {
          setIsLoading(true);
          const responseWorker = await axios.get(`/workers/${id}`);
          setIsLoading(false);
          setInitialValues(responseWorker.data);
          if (responseWorker.data.filenamePhoto)
            setPhotoURL(
              `${process.env.REACT_APP_BASE_AXIOS_REST}/workers/images/${responseWorker.data.filenamePhoto}`
            );
        }
      } catch (err) {
        // eslint-disable-next-line no-unused-expressions
        err.response?.data?.errors
          ? err.response.data.errors.map((error) => toast.error(error)) // errors -> resposta de erro enviada do backend (precisa se conectar com o back)
          : toast.error(err.message); // e.message -> erro formulado no front (é criado pelo front, não precisa de conexão)
        setIsLoading(false);
      }
    }

    getData();

    async function getContracts() {
      try {
        setIsLoading(true);

        const responseContract = await axios.get(`/workers/contracts`);
        const responseJob = await axios.get(`/workers/jobtypes`);

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

    getContracts();
  }, []);

  function removeEmptyString(object) {
    Object.entries(object).forEach(([key, value]) => {
      if (value && typeof value === 'object') removeEmptyString(value);
      if (
        (value && typeof value === 'object' && !Object.keys(value).length) ||
        value === null ||
        value === undefined ||
        value.length === 0
      ) {
        if (Array.isArray(object)) object.splice(key, 1);
        else delete object[key];
      }
    });
    return object;
  }

  const handleStore = async (values, resetForm) => {
    const formattedValues = JSON.parse(JSON.stringify(values));
    removeEmptyString(formattedValues);

    console.log(formattedValues);

    function buildFormData(formData, data, parentKey) {
      if (
        data &&
        typeof data === 'object' &&
        !(data instanceof Date) &&
        !(data instanceof File) &&
        !(data instanceof Blob)
      ) {
        Object.keys(data).forEach((key) => {
          buildFormData(
            formData,
            data[key],
            parentKey ? `${parentKey}[${key}]` : key
          );
        });
      } else {
        const value = data == null ? '' : data;

        formData.append(parentKey, value);
      }
    }

    const formData = new FormData();
    // if (photo) {
    //   Object.entries(formattedValues).forEach((entry) => {
    //     formData.append(entry[0], entry[1]);
    //   });
    //   // passando todos os campos para o form virtual
    //   formData.append('photo', photo);
    // }
    if (photo) {
      buildFormData(formData, formattedValues);
      // passando todos os campos para o form virtual
      formData.append('photo', photo);
    }

    try {
      setIsLoading(true);
      if (photo) {
        await axios.post(`/workers/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await axios.post(`/workers/`, formattedValues);
      }

      resetForm();
      setPhoto('');
      setPhotoURL(
        `${process.env.REACT_APP_BASE_AXIOS_REST}/workers/images/default.png`
      );
      setIsLoading(false);
      toast.success('Colaborador Cadastrado Com Sucesso!');
    } catch (err) {
      // eslint-disable-next-line no-unused-expressions
      err.response?.data?.errors
        ? err.response.data.errors.map((error) => toast.error(error)) // errors -> resposta de erro enviada do backend (precisa se conectar com o back)
        : toast.error(err.message); // e.message -> erro formulado no front (é criado pelo front, não precisa de conexão)
      setIsLoading(false);
    }
  };

  const handleUpdate = async (values) => {
    const formattedValues = JSON.parse(JSON.stringify(values));
    removeEmptyString(formattedValues);

    const formData = new FormData();
    if (photo) {
      console.log('colocando as coisas');
      Object.entries(formattedValues).forEach((entry) => {
        formData.append(entry[0], entry[1]);
      });
      // passando todos os campos para o form virtual
      formData.append('photo', photo);
      console.log(formData);
    }

    try {
      setIsLoading(true);

      // FAZ A ATUALIZAÇÃO E RETORNA PARA A LISTAGEM

      if (photo) {
        console.log('axios correto');
        await axios.put(`/workers/${formattedValues.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await axios.put(`/workers/${formattedValues.id}`, formattedValues);
      }
      setIsLoading(false);
      toast.success(`Edição de registro realizada com sucesso`);
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
      <Row className="bg-light border rounded d-flex justify-content-center pt-2">
        <Row
          className="px-0 mx-0 my-2 py-2 text-center"
          style={{ background: primaryDarkColor, color: 'white' }}
        >
          <span className="fs-5">INFORMAÇÕES PESSOAIS</span>
        </Row>
        <Row className="px-0 pt-2">
          <Formik
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={(values, { resetForm }) => {
              if (id) {
                handleUpdate(values);
              } else {
                handleStore(values, resetForm);
              }
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
                  <Col
                    xs="12"
                    md="auto"
                    className="px-3 d-flex justify-content-center align-items-center"
                  >
                    <ProfilePhoto
                      setPhoto={setPhoto}
                      photoURL={photoURL}
                      setPhotoURL={setPhotoURL}
                    />
                  </Col>
                  <Col md={8} lg={6}>
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
                    </Row>
                    <Row>
                      <Form.Group
                        as={Col}
                        xs={12}
                        lg={4}
                        controlId="cpf"
                        className="pt-2"
                      >
                        <Form.Label>CPF</Form.Label>
                        <Form.Control
                          type="text"
                          as={IMaskInput}
                          mask="000.000.000-00"
                          value={values.cpf}
                          isInvalid={touched.cpf && !!errors.cpf}
                          isValid={touched.cpf && !errors.cpf}
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
                        className="pt-2"
                      >
                        <Form.Label>RG</Form.Label>
                        <Form.Control
                          type="text"
                          as={IMaskInput}
                          mask={Number}
                          value={values.rg}
                          isInvalid={touched.rg && !!errors.rg}
                          isValid={touched.rg && !errors.rg}
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
                        className="pt-2"
                      >
                        <Form.Label>NASCIMENTO</Form.Label>
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
                    </Row>
                    <Row>
                      <Form.Group
                        as={Col}
                        xs={12}
                        controlId="email"
                        className="pt-2"
                      >
                        <Form.Label>EMAIL</Form.Label>
                        <Form.Control
                          as={IMaskInput}
                          mask={/^\S*@?\S*$/}
                          type="text"
                          value={values.email}
                          // onChange={handleChange}
                          isInvalid={touched.email && !!errors.email}
                          isValid={touched.email && !errors.email}
                          placeholder="Digite o email"
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
                          {errors.email}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Row>
                  </Col>
                </Row>

                {/* <Row
                  className="d-flex text-center"
                  style={{ background: primaryDarkColor, color: 'white' }}
                >
                  <span className="fs-6">CONTATOS</span>
                </Row> */}

                {/* <Row className="justify-content-center pt-2 pb-4">
                  <FieldArray name="WorkerContacts">
                    {(fieldArrayProps) => {
                      const { push, remove } = fieldArrayProps;
                      return (
                        <Row>
                          {values.WorkerContacts?.length > 0 &&
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
                                    label="Padrão"
                                    onChange={handleChange}
                                    onBlur={handleChange}
                                    value={contato.default}
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
                </Row> */}

                {/*
                <Row
                  className="d-flex text-center"
                  style={{ background: primaryDarkColor, color: 'white' }}
                >
                  <span className="fs-6">ENDEREÇOS</span>
                </Row> */}

                {/* <Row className="justify-content-center pt-2 pb-4">
                  <Form.Group
                    as={Col}
                    xs={12}
                    md={4}
                    controlId="Addresses.zipcode"
                    className="pt-2"
                  >
                    <Form.Label>CEP</Form.Label>
                    <Form.Control
                      type="text"
                      value={values.Addresses?.zipcode}
                      onChange={handleChange}
                      placeholder="Digite o CEP"
                      onBlur={handleBlur}
                    />
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    xs={12}
                    md={4}
                    controlId="Addresses.street"
                    className="pt-2"
                  >
                    <Form.Label>LOGRADOURO</Form.Label>
                    <Form.Control
                      type="text"
                      value={values.Addresses?.street}
                      onChange={handleChange}
                      placeholder="Digite o Logradouro"
                      onBlur={handleBlur}
                    />
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    xs={12}
                    md={4}
                    controlId="Addresses.number"
                    className="pt-2"
                  >
                    <Form.Label>NÚMERO</Form.Label>
                    <Form.Control
                      type="number"
                      value={values.Addresses?.number}
                      onChange={handleChange}
                      placeholder="Digite o Número"
                      onBlur={handleBlur}
                    />
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    xs={12}
                    md={4}
                    controlId="Addresses.district"
                    className="pt-2"
                  >
                    <Form.Label>BAIRRO</Form.Label>
                    <Form.Control
                      type="text"
                      value={values.Addresses?.district}
                      onChange={handleChange}
                      placeholder="Digite o Bairro"
                      onBlur={handleBlur}
                    />
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    xs={12}
                    md={4}
                    controlId="Addresses.city"
                    className="pt-2"
                  >
                    <Form.Label>CIDADE</Form.Label>
                    <Form.Control
                      type="text"
                      value={values.Addresses?.city}
                      onChange={handleChange}
                      placeholder="Digite a Cidade"
                      onBlur={handleBlur}
                    />
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    xs={12}
                    md={4}
                    controlId="Addresses.country"
                    className="pt-2"
                  >
                    <Form.Label>PAÍS</Form.Label>
                    <Form.Control
                      type="text"
                      value={values.Addresses?.country}
                      onChange={handleChange}
                      placeholder="Selecione o País"
                      onBlur={handleBlur}
                    />
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    xs={8}
                    controlId="Addresses.complement"
                    className="pt-2"
                  >
                    <Form.Label>COMPLEMENTO</Form.Label>
                    <Form.Control
                      type="text"
                      value={values.Addresses?.complement}
                      onChange={handleChange}
                      placeholder="Digite o Complemento"
                      onBlur={handleBlur}
                    />
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    xs={4}
                    controlId="Addresses.WorkerAddress.title"
                    className="pt-2"
                  >
                    <Form.Label>Titulo</Form.Label>
                    <Form.Control
                      type="text"
                      value={values.Addresses?.WorkerAddress.title}
                      onChange={handleChange}
                      placeholder="Digite o Titulo do Endereço"
                      onBlur={handleBlur}
                    />
                  </Form.Group>
                </Row> */}
                {id ? null : (
                  <>
                    {' '}
                    <Row
                      className="d-flex text-center"
                      style={{ background: primaryDarkColor, color: 'white' }}
                    >
                      <span className="fs-6">CONTRATO</span>
                    </Row>
                    <Row className="d-flex justify-content-center align-items-center pt-2 pb-4">
                      <Form.Group
                        as={Col}
                        xs={12}
                        md={4}
                        lg={3}
                        controlId="WorkerContracts.ContractId"
                        className="pt-2"
                      >
                        <Form.Label>NÚMERO DO CONTRATO</Form.Label>
                        <Form.Select
                          type="text"
                          value={values.WorkerContracts?.ContractId}
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
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        xs={12}
                        md={4}
                        lg={3}
                        controlId="WorkerContracts.WorkerJobtypeId"
                        className="pt-2"
                      >
                        <Form.Label>FUNÇÃO</Form.Label>
                        <Form.Select
                          type="text"
                          value={values.WorkerContracts?.WorkerJobtypeId}
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
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        xs={12}
                        md={4}
                        lg={2}
                        controlId="WorkerContracts.start"
                        className="pt-2"
                      >
                        <Form.Label>INÍCIO</Form.Label>
                        <Form.Control
                          type="date"
                          dateFormat="YYYY-MM-DD"
                          value={values.WorkerContracts?.start}
                          onChange={handleChange}
                          placeholder="Digite o inicio do contrato"
                          onBlur={handleBlur}
                        />
                      </Form.Group>
                    </Row>
                    <hr />
                  </>
                )}

                <Row className="justify-content-center pt-2 pb-4">
                  <Col xs="auto" className="text-center">
                    <Button
                      variant="warning"
                      onClick={() => {
                        resetForm();
                        setPhoto('');
                        setPhotoURL(
                          `${process.env.REACT_APP_BASE_AXIOS_REST}/workers/images/default.png`
                        );
                      }}
                    >
                      Limpar
                    </Button>
                  </Col>
                  {id ? (
                    <Col xs="auto" className="text-center">
                      <Button variant="success" type="submit">
                        Alterar
                      </Button>
                    </Col>
                  ) : (
                    <Col xs="auto" className="text-center">
                      <Button variant="success" type="submit">
                        Cadastrar
                      </Button>
                    </Col>
                  )}
                </Row>
              </Form>
            )}
          </Formik>
        </Row>
      </Row>
    </>
  );
}
