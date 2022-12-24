/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Row, Col, Form, Badge } from 'react-bootstrap';
import { IMaskInput } from 'react-imask';
import { FaPhone, FaPlus, FaTrashAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

import * as yup from 'yup'; // RulesValidation
import { Formik, FieldArray } from 'formik'; // FormValidation
import Select from 'react-select';
import { update } from 'lodash';
import { computeReshapedDimensions } from 'face-api.js/build/commonjs/utils';
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
  const template = {
    name: '',
    email: '',
    birthdate: '',
    rg: '',
    cpf: '',
    filenamePhoto: '',
    WorkerContracts: [
      {
        ContractId: '',
        WorkerJobtypeId: '',
        located: '',
        start: '',
        end: '',
      },
    ],
  };
  const [initialValues, setInitialValues] = useState(template);

  const { id } = useParams();

  const updateValues = useRef({});

  const schema = yup.object().shape({
    name: yup.string().required('Requerido'),
    // email: yup.string().email('Digite um email válido').required('Requerido'),
    // rg: yup.string().required('Requerido'),
    // cpf: yup.string().required('Requerido'),
    // birthdate: yup
    //   .date()
    //   .max(new Date(), 'Não é possível incluir uma data futura')
    //   .required('Campo obrigatório'),
    WorkerContracts: yup
      .array()
      .of(
        yup.object().shape({
          ContractId: yup.number().required('Requerido').positive(),
          WorkerJobtypeId: yup.number().required('Requerido').positive(),
          located: yup.string().required('Requerido'),
          start: yup
            .date()
            .required('Requerido')
            // .min(
            //   // the month is 0-indexed
            //   new Date(2022, 9, 14).toISOString().split('T')[0],
            //   'Escolha uma data superior a data de início do sistema'
            // )
            .max(
              new Date().toISOString().split('T')[0],
              'Escolha uma data passada para o início do contrato'
            ),
        })
      )
      .required()
      .min(1, 'A lista de materiais não pode ser vazia'),
  });

  const cleanEmpty = (obj) => {
    if (Array.isArray(obj)) {
      return (
        obj
          .map((v) => (v && typeof v === 'object' ? cleanEmpty(v) : v))
          // eslint-disable-next-line eqeqeq
          .filter((v) => !(v == null || v == ''))
      );
    }
    return (
      Object.entries(obj)
        .map(([k, v]) => [k, v && typeof v === 'object' ? cleanEmpty(v) : v])
        // eslint-disable-next-line no-return-assign, eqeqeq, no-param-reassign
        .reduce((a, [k, v]) => (v == null || v == '' ? a : ((a[k] = v), a)), {})
    );
  };
  // LIMPANDO CHAVES NULL, UNDEFINED, EMPTY STRINGS

  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true);
        if (id) {
          const responseWorker = await axios.get(`/workers/${id}`);
          setInitialValues(responseWorker.data);
          if (responseWorker.data.filenamePhoto)
            setPhotoURL(
              `${process.env.REACT_APP_BASE_AXIOS_REST}/workers/images/${responseWorker.data.filenamePhoto}`
            );
        }
        setIsLoading(false);
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

  const checkUpdate = (key, value) => {
    const arr = key.split('.');

    if (arr.length === 1) {
      if (initialValues[key] !== value) {
        updateValues.current[key] = value;
      }
    } else {
      const arrObj = arr[0].match(/[a-zA-Z0-9]+/)[0];
      // se não existir, crie o array para ser preenchido
      if (!updateValues.current[arrObj]) updateValues.current[arrObj] = [{}];
      // eslint-disable-next-line no-useless-escape
      const index = arr[0].match(/[\[\d\]]+/)[0].match(/[0-9]+/)[0];
      const newKey = arr[1];
      while (updateValues.current[arrObj].length - 1 < index) {
        updateValues.current[arrObj].push({});
      }
      updateValues.current[arrObj][index][newKey] = value;
    }
  };

  const toFormData = ((f) => f(f))((h) => (f) => f((x) => h(h)(f)(x)))(
    (f) => (fd) => (pk) => (d) => {
      if (d instanceof Object) {
        Object.keys(d).forEach((k) => {
          const v = d[k];
          if (pk) k = `${pk}[${k}]`;
          if (
            v instanceof Object &&
            !(v instanceof Date) &&
            !(v instanceof File)
          ) {
            return f(fd)(k)(v);
          }
          fd.append(k, v);
        });
      }
      return fd;
    }
  )(new FormData())();

  const handleStore = async (values, resetForm) => {
    const formattedValues = {
      ...cleanEmpty(values),
    };

    Object.entries(formattedValues).forEach((item) => {
      if (
        Array.isArray(item[1]) &&
        typeof item[1] === 'object' &&
        Object.keys(item[1]).length === 1 &&
        Object.keys(item[1][0]).length === 0
      ) {
        delete formattedValues[item[0]];
      }
    }); // LIMPANDO ARRAYS NULOS (tabelas vinculadas para nao dar erro)

    const formData = toFormData(formattedValues);
    if (photo) {
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
    const formattedValues = {
      ...values,
    };

    formattedValues.id = id;

    const formData = toFormData(formattedValues);
    if (photo) {
      formData.append('photo', photo);
    }

    try {
      setIsLoading(true);

      // FAZ A ATUALIZAÇÃO E RETORNA PARA A LISTAGEM
      if (photo) {
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
      <div className="bg-light border rounded pt-2 px-3">
        <Col
          xs={12}
          className=" text-center"
          style={{ background: primaryDarkColor, color: 'white' }}
        >
          <span className="fs-5">INFORMAÇÕES PESSOAIS</span>
        </Col>
        <Row className="pt-2">
          <Formik
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={(values, { resetForm }) => {
              if (id) {
                handleUpdate(updateValues.current);
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
                        className="pb-3"
                      >
                        <Form.Label>NOME</Form.Label>
                        <Form.Control
                          type="text"
                          value={values.name}
                          onChange={(e) => {
                            handleChange(e);
                            checkUpdate(e.target.id, e.target.value);
                          }}
                          isInvalid={touched.name && !!errors.name}
                          isValid={touched.name && !errors.name}
                          placeholder="Digite o nome completo"
                          onBlur={(e) => {
                            setFieldValue('name', e.target.value.toUpperCase()); // UPPERCASE
                            handleBlur(e);
                          }}
                        />
                        {touched.name && !!errors.name ? (
                          <Badge bg="danger">{errors.name}</Badge>
                        ) : null}
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
                            checkUpdate(mask.el.input.id, mask.unmaskedValue);
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
                            checkUpdate(mask.el.input.id, mask.unmaskedValue);
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
                            checkUpdate(e.target.id, e.target.value);
                          }}
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
                          isValid={touched.email && !errors.email}
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
                            checkUpdate(mask.el.input.id, mask.unmaskedValue);
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

                <Row className="d-flex justify-content-center align-items-center">
                  <Col
                    xs={12}
                    className="text-center"
                    style={{ background: primaryDarkColor, color: 'white' }}
                  >
                    <span className="fs-6">CONTRATOS</span>
                  </Col>

                  <FieldArray name="WorkerContracts">
                    {(fieldArrayProps) => {
                      const { remove, push } = fieldArrayProps;
                      return (
                        <Row className="d-flex justify-content-center align-items-center">
                          <Col md={12} lg={10}>
                            {values.WorkerContracts?.length > 0 &&
                              values.WorkerContracts?.map((item, index) => (
                                <div
                                  className="my-3 p-4"
                                  style={{ background: '#E9EFFA' }}
                                >
                                  <Row>
                                    <Col className="fs-5 text-center">
                                      <Badge bg="light" text="dark">
                                        Nº {index + 1}
                                      </Badge>
                                    </Col>
                                  </Row>

                                  <Row key={index}>
                                    <Row className="d-flex justify-content-center align-items-center mt-2">
                                      <Form.Group
                                        as={Col}
                                        xs={12}
                                        md={12}
                                        lg={8}
                                        className="pb-3"
                                      >
                                        <Form.Label>CONTRATO</Form.Label>
                                        {/* {console.log(
                                          touched.WorkerContracts[index]
                                            ?.ContractId,
                                          errors.WorkerContracts
                                        )} */}
                                        <Select
                                          inputId={`WorkerContracts[${index}].ContractId`}
                                          options={contracts.map(
                                            (contract) => ({
                                              value: contract.id,
                                              label: `${contract.codigoSipac} | ${contract.objeto}`,
                                            })
                                          )}
                                          // pesquisa o valor e devolve o objeto do jeito que o react-select espera{ label, value}
                                          value={
                                            contracts
                                              .filter(
                                                (contract) =>
                                                  contract.id ===
                                                  item.ContractId
                                              )
                                              .map((vector) => ({
                                                value: vector.id,
                                                label: `${vector.codigoSipac} | ${vector.objeto}`,
                                              }))[0]
                                          }
                                          onChange={(selected) => {
                                            setFieldValue(
                                              `WorkerContracts[${index}].ContractId`,
                                              selected.value
                                            );
                                            checkUpdate(
                                              `WorkerContracts[${index}].ContractId`,
                                              selected.value
                                            );
                                          }}
                                          placeholder="Selecione o Contrato"
                                          onBlur={handleBlur}
                                          isDisabled={
                                            initialValues.WorkerContracts[index]
                                              ?.end ||
                                            initialValues.WorkerContracts[index]
                                              ?.ContractId
                                          }
                                        />
                                      </Form.Group>
                                      <Form.Group
                                        as={Col}
                                        xs={12}
                                        md={12}
                                        lg={4}
                                        controlId={`WorkerContracts[${index}].WorkerJobtypeId`}
                                        className="pb-3"
                                      >
                                        <Form.Label>FUNÇÃO</Form.Label>
                                        <Form.Select
                                          type="text"
                                          value={item.WorkerJobtypeId}
                                          onChange={(e) => {
                                            handleChange(e);
                                            checkUpdate(
                                              e.target.id,
                                              e.target.value
                                            );
                                          }}
                                          placeholder="Selecione a Função"
                                          onBlur={handleBlur}
                                          disabled={
                                            initialValues.WorkerContracts[index]
                                              ?.WorkerJobtypeId
                                          }
                                        >
                                          <option>Selecione a Função</option>
                                          {jobtypes.map((job) => (
                                            <option key={job.id} value={job.id}>
                                              {job.job}
                                            </option>
                                          ))}
                                        </Form.Select>
                                      </Form.Group>
                                    </Row>
                                    <Row className="d-flex justify-content-center align-items-center">
                                      <Form.Group
                                        as={Col}
                                        xs={12}
                                        md={12}
                                        lg={6}
                                        controlId={`WorkerContracts[${index}].located`}
                                        className="pb-3"
                                      >
                                        <Form.Label>LOTAÇÃO</Form.Label>
                                        <Form.Control
                                          type="text"
                                          value={item.located}
                                          onChange={(e) => {
                                            handleChange(e);
                                            checkUpdate(
                                              e.target.id,
                                              e.target.value
                                            );
                                          }}
                                          placeholder="Digite a lotação"
                                          onBlur={(e) => {
                                            setFieldValue(
                                              'WorkerContracts.located',
                                              e.target.value.toUpperCase()
                                            ); // UPPERCASE
                                            handleBlur(e);
                                          }}
                                          // onBlur={handleBlur}
                                          disabled={
                                            initialValues.WorkerContracts[index]
                                              ?.end
                                          }
                                        />
                                      </Form.Group>
                                      <Form.Group
                                        as={Col}
                                        xs={12}
                                        md={12}
                                        lg={3}
                                        controlId={`WorkerContracts[${index}].start`}
                                        className="pb-3"
                                      >
                                        <Form.Label>INÍCIO</Form.Label>
                                        <Form.Control
                                          type="date"
                                          dateFormat="YYYY-MM-DD"
                                          value={item.start}
                                          onChange={(e) => {
                                            handleChange(e);
                                            checkUpdate(
                                              e.target.id,
                                              e.target.value
                                            );
                                          }}
                                          placeholder="Digite o inicio do contrato"
                                          onBlur={handleBlur}
                                          disabled={
                                            initialValues.WorkerContracts[index]
                                              ?.end
                                          }
                                        />
                                      </Form.Group>
                                      <Form.Group
                                        as={Col}
                                        xs={12}
                                        md={12}
                                        lg={3}
                                        controlId={`WorkerContracts[${index}].end`}
                                        className="pb-3"
                                      >
                                        <Form.Label>ENCERRAMENTO</Form.Label>
                                        <Form.Control
                                          type="date"
                                          dateFormat="YYYY-MM-DD"
                                          value={item.end}
                                          onChange={(e) => {
                                            handleChange(e);
                                            checkUpdate(
                                              e.target.id,
                                              e.target.value
                                            );
                                          }}
                                          placeholder="Digite o fim do contrato"
                                          onBlur={handleBlur}
                                          disabled={
                                            initialValues.WorkerContracts[index]
                                              ?.end
                                          }
                                        />
                                      </Form.Group>
                                    </Row>
                                    <Row className="d-flex justify-content-end pb-3">
                                      {initialValues.WorkerContracts[
                                        index
                                      ] ? null : (
                                        <Col xs="auto">
                                          <Button
                                            size="sm"
                                            variant="outline-danger"
                                            onClick={() => remove(index)}
                                          >
                                            <FaTrashAlt />
                                          </Button>
                                        </Col>
                                      )}
                                    </Row>
                                  </Row>
                                  {touched.WorkerContracts &&
                                  errors.WorkerContracts
                                    ? // falta ajeitar aqui
                                      errors.WorkerContracts.forEach((wk) => {
                                        Object.values(wk).map((error) => {
                                          console.log(error);
                                          return (
                                            <Badge bg="danger" className="me-2">
                                              {error}
                                            </Badge>
                                          );
                                        });
                                      })
                                    : null}
                                </div>
                              ))}
                            {id ? (
                              <Row className="mt-2">
                                <Col xs="auto">
                                  {' '}
                                  <Button
                                    size="sm"
                                    variant="outline-primary"
                                    onClick={push}
                                  >
                                    <FaPlus /> Novo contrato
                                  </Button>
                                </Col>
                              </Row>
                            ) : null}
                          </Col>
                        </Row>
                      );
                    }}
                  </FieldArray>
                </Row>

                <Row className="justify-content-center pt-2 pb-4">
                  {id ? (
                    <>
                      <Col xs="auto" className="text-center">
                        <Button
                          variant="danger"
                          onClick={() => {
                            updateValues.current = {};
                            resetForm();
                          }}
                        >
                          Cancelar
                        </Button>
                      </Col>
                      <Col xs="auto" className="text-center">
                        <Button variant="success" type="submit">
                          Alterar
                        </Button>
                      </Col>
                    </>
                  ) : (
                    <>
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
                      <Col xs="auto" className="text-center">
                        <Button variant="success" type="submit">
                          Cadastrar
                        </Button>
                      </Col>
                    </>
                  )}
                </Row>
              </Form>
            )}
          </Formik>
        </Row>
      </div>
    </>
  );
}
