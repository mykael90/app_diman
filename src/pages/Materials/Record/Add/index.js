/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  Row,
  Col,
  Form,
  Badge,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import { IMaskInput } from 'react-imask';
import { toast } from 'react-toastify';

import * as yup from 'yup'; // RulesValidation
import { Formik } from 'formik'; // FormValidation
import axios from '../../../../services/axios';
import { primaryDarkColor } from '../../../../config/colors';
import Loading from '../../../../components/Loading';

import removeAccent from '../../../../assets/script/removeAccent';

import ProfilePhoto from './components/ProfilePhoto';

const renderTooltip = (props, message) => (
  <Tooltip id="button-tooltip" {...props}>
    {message}
  </Tooltip>
);

export default function Index({ data, handleCancelModal, handleSaveModal }) {
  const [isLoading, setIsLoading] = useState(false);
  const [photoURL, setPhotoURL] = useState(
    `${process.env.REACT_APP_BASE_AXIOS_REST}/materials/images/default.png`
  );
  const [photo, setPhoto] = React.useState('');
  const template = {
    name: '',
    specification: '',
    unit: '',
    filenamePhoto: '',
  };
  const [initialValues, setInitialValues] = useState(template);

  const id = data?.id;

  const updateValues = useRef({});

  const schema = yup.object().shape({
    name: yup.string().required('Requerido'),
    specification: yup.string().required('Requerido'),
    unit: yup.string().required('Requerido'),
    // cpf: yup
    //   .string()
    //   .test('is-valid', 'CPF inválido', (cpf) => validateCPF(cpf)),
    // birthdate: yup
    //   .date()
    //   .max(new Date(), 'Não é possível incluir uma data futura')
    //   .required('Campo obrigatório'),
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
          const responseMaterial = await axios.get(`/materials/${id}`);
          setInitialValues(responseMaterial.data);
          if (responseMaterial.data.filenamePhoto)
            setPhotoURL(
              `${process.env.REACT_APP_BASE_AXIOS_REST}/materials/images/${responseMaterial.data.filenamePhoto}`
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
        await axios.post(`/materials/temporary`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await axios.post(`/materials/temporary`, formattedValues);
      }

      resetForm();
      setPhoto('');
      setPhotoURL(
        `${process.env.REACT_APP_BASE_AXIOS_REST}/materials/images/default.png`
      );
      setIsLoading(false);
      toast.success('Material provisório cadastrado com sucesso!');
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
        await axios.put(`/materials/${formattedValues.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await axios.put(`/materials/${formattedValues.id}`, formattedValues);
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
        <Row>
          <Col
            xs={12}
            className=" text-center"
            style={{ background: primaryDarkColor, color: 'white' }}
          >
            <span className="fs-5">INFORMAÇÕES DO MATERIAL</span>
          </Col>
        </Row>
        <Row className="pt-2">
          <Formik
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={(values, { resetForm }) => {
              if (id) {
                handleUpdate(updateValues.current);
                handleSaveModal();
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
                        <Form.Label>DENOMINAÇÃO</Form.Label>
                        <Form.Control
                          type="text"
                          value={values.name}
                          onChange={(e) => {
                            handleChange(e);
                            checkUpdate(
                              e.target.id,
                              removeAccent(e.target.value).toUpperCase()
                            );
                          }}
                          isInvalid={touched.name && !!errors.name}
                          isValid={touched.name && !errors.name}
                          placeholder="Digite o nome completo"
                          onBlur={(e) => {
                            setFieldValue(
                              'name',
                              removeAccent(e.target.value).toUpperCase()
                            ); // UPPERCASE
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
                        controlId="specification"
                        className="pb-3"
                      >
                        <Form.Label>ESPECIFICAÇÃO</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          type="text"
                          value={values.specification}
                          onChange={(e) => {
                            handleChange(e);
                            checkUpdate(
                              e.target.id,
                              removeAccent(e.target.value).toUpperCase()
                            );
                          }}
                          isInvalid={
                            touched.specification && !!errors.specification
                          }
                          isValid={
                            touched.specification && !errors.specification
                          }
                          placeholder="Digite a especificação"
                          onBlur={(e) => {
                            setFieldValue(
                              'specification',
                              removeAccent(e.target.value).toUpperCase()
                            );
                            handleBlur(e);
                          }}
                        />
                        <Form.Control.Feedback
                          tooltip
                          type="invalid"
                          style={{ position: 'static' }}
                        >
                          {errors.specification}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Row>
                    <Row>
                      <Form.Group
                        as={Col}
                        xs={6}
                        lg={4}
                        controlId="unit"
                        className="pb-3"
                      >
                        <Form.Label>UNIDADE</Form.Label>
                        <Form.Control
                          type="text"
                          value={values.unit}
                          onChange={(e) => {
                            handleChange(e);
                            checkUpdate(
                              e.target.id,
                              removeAccent(e.target.value).toUpperCase()
                            );
                          }}
                          isInvalid={touched.unit && !!errors.unit}
                          isValid={touched.unit && !errors.unit}
                          placeholder="Digite a unidade"
                          onBlur={(e) => {
                            setFieldValue(
                              'unit',
                              removeAccent(e.target.value).toUpperCase()
                            ); // UPPERCASE
                            handleBlur(e);
                          }}
                        />
                        <Form.Control.Feedback
                          tooltip
                          type="invalid"
                          style={{ position: 'static' }}
                        >
                          {errors.unit}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Row>
                  </Col>
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
                            handleCancelModal();
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
                              `${process.env.REACT_APP_BASE_AXIOS_REST}/materials/images/default.png`
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
