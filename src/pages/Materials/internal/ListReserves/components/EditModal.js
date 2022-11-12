/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { FaRegEdit } from 'react-icons/fa';
import { Button, Modal, Row, Col, Form, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';

import * as yup from 'yup'; // RulesValidation
import { Formik } from 'formik'; // FormValidation
import Select from 'react-select';
import { initial } from 'lodash';
import axios from '../../../../../services/axios';
import {
  primaryDarkColor,
  body1Color,
  body2Color,
} from '../../../../../config/colors';
import Loading from '../../../../../components/Loading';

const formatGroupLabel = (data) => (
  <Col className="d-flex justify-content-between">
    <span>{data.label}</span>
    <Badge bg="secondary">{data.options.length}</Badge>
  </Col>
);

export default function EditModal({ show, handleClose, data, handleSave }) {
  const userId = useSelector((state) => state.auth.user.id);
  const [users, setUsers] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [propertiesData, setPropertiesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef();

  console.log(data);

  const {
    id,
    reqMaintenance,
    authorizedBy,
    workerName,
    workerId,
    place,
    propertyId,
    buildingId,
    obs,
    intendedUse,
  } = data;

  const initialValues = {
    reqMaintenance,
    authorizedBy,
    workerName,
    workerId,
    place,
    propertyId,
    buildingId,
    obs,
    intendedUse,
  };

  initialValues.authorizedBy = {
    label: users.find(({ id }) => id === initialValues.authorizedBy)?.name,
    value: initialValues.authorizedBy,
  };

  initialValues.workerId = {
    label: initialValues.workerName,
    value: initialValues.workerId,
  };

  const propertySelected = propertiesData.find(
    ({ id }) => id === initialValues.propertyId
  );

  initialValues.propertyId = {
    label: propertySelected?.nomeImovel,
    value: initialValues.propertyId,
  };

  initialValues.buildingId = {
    label: propertySelected?.buildingsSipac.find(
      ({ id }) => id === initialValues.buildingId
    )?.name,
    value: initialValues.buildingId,
  };

  const schema = yup.object().shape({
    reqMaintenance: yup
      .string()
      .matches(/^[0-9]{1,5}$|^[0-9]+[/]{1}[0-9]{4}$/, 'Entrada inválida'),
    intendedUse: yup
      .date()
      .min(
        intendedUse ?? new Date().toISOString().split('T')[0],
        'A data alterada não pode ser anterior a data original'
      )
      .required('Requerido'),
    authorizedBy: yup.object().required('Requerido'),
    workerId: yup.object().when(['isAuthorizer'], {
      is: false,
      then: (validate) => validate.required('Requerido'),
      otherwise: (validate) => validate.notRequired(),
    }),

    obs: yup.string().nullable(),
  });

  useEffect(() => {
    // Focus on inputRef
    if (inputRef.current) {
      inputRef.current.focus();
    }

    async function getUsersData() {
      try {
        setIsLoading(true);
        const response = await axios.get('/users/');
        setUsers(response.data);
        setIsLoading(false);
      } catch (err) {
        // eslint-disable-next-line no-unused-expressions
        err.response?.data?.errors
          ? err.response.data.errors.map((error) => toast.error(error)) // errors -> resposta de erro enviada do backend (precisa se conectar com o back)
          : toast.error(err.message); // e.message -> erro formulado no front (é criado pelo front, não precisa de conexão)
        setIsLoading(false);
      }
    }
    async function getPropertiesData() {
      const propertiesOp = [];
      try {
        setIsLoading(true);
        const response = await axios.get('/properties/');
        const propertiesCities = response.data
          .filter(
            (value, index, arr) =>
              arr.findIndex((item) => item.municipio === value.municipio) ===
              index
          )
          .map((value) => value.municipio); // RETORNA OS DIFERENTES TRABALHOS

        propertiesCities.forEach((value) => {
          propertiesOp.push([
            value,
            response.data.filter((item) => item.municipio === value),
          ]);
        });
        setProperties(propertiesOp);
        setPropertiesData(response.data);
      } catch (err) {
        // eslint-disable-next-line no-unused-expressions
        err.response?.data?.errors
          ? err.response.data.errors.map((error) => toast.error(error)) // errors -> resposta de erro enviada do backend (precisa se conectar com o back)
          : toast.error(err.message); // e.message -> erro formulado no front (é criado pelo front, não precisa de conexão)
        setIsLoading(false);
      }
    }

    async function getWorkersData() {
      const workersOp = [];
      try {
        setIsLoading(true);
        const response = await axios.get('/workers/');

        const workersJobs = response.data
          .filter(
            (value, index, arr) =>
              arr.findIndex((item) => item.job === value.job) === index
          )
          .map((value) => value.job); // RETORNA OS DIFERENTES TRABALHOS

        workersJobs.forEach((value) => {
          workersOp.push([
            value,
            response.data.filter((item) => item.job === value),
          ]);
        });

        setWorkers(workersOp);
        setIsLoading(false);
      } catch (err) {
        // eslint-disable-next-line no-unused-expressions
        err.response?.data?.errors
          ? err.response.data.errors.map((error) => toast.error(error)) // errors -> resposta de erro enviada do backend (precisa se conectar com o back)
          : toast.error(err.message); // e.message -> erro formulado no front (é criado pelo front, não precisa de conexão)
        setIsLoading(false);
      }
    }

    getUsersData();
    getPropertiesData();
    getWorkersData();
  }, []);

  const handleUpdate = async (values) => {
    const formattedValues = {
      ...Object.fromEntries(
        Object.entries(values).filter(([_, v]) => v != null)
      ),
    }; // LIMPANDO CHAVES NULL E UNDEFINED

    Object.keys(formattedValues).forEach((key) => {
      if (formattedValues[key] === '') {
        delete formattedValues[key];
      }
    }); // LIMPANDO CHAVES `EMPTY STRINGS`

    formattedValues.userId = userId;
    formattedValues.workerId = formattedValues.workerId?.value;
    formattedValues.authorizedBy = formattedValues.authorizedBy?.value;
    formattedValues.propertyId = formattedValues.propertyId?.value;
    formattedValues.buildingId = formattedValues.buildingId?.value;

    try {
      setIsLoading(true);

      // FAZ A ATUALIZAÇÃO E RETORNA PARA A LISTAGEM
      await axios.put(`/materials/reserve/${id}`, formattedValues);

      setIsLoading(false);
      toast.success(`Edição de registro realizada com sucesso`);

      handleSave();
    } catch (err) {
      // eslint-disable-next-line no-unused-expressions
      err.response?.data?.errors
        ? err.response.data.errors.map((error) => toast.error(error)) // errors -> resposta de erro enviada do backend (precisa se conectar com o back)
        : toast.error(err.message); // e.message -> erro formulado no front (é criado pelo front, não precisa de conexão)

      setIsLoading(false);
    }
  };

  const formatReq = (req) => {
    if (!req) return;
    const currentYear = new Date().getFullYear();
    return req.includes('/') ? req : `${req}/${currentYear}`;
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      size="xl"
    >
      {/* <Modal.Header closeButton>
        <Modal.Title>Editar ... </Modal.Title>
      </Modal.Header> */}
      {/* <Modal.Body> */}
      <Loading isLoading={isLoading} />
      <Row className="bg-light border rounded d-flex justify-content-center pt-2">
        <Row
          className="px-0 mx-0 py-2 text-center"
          style={{ background: primaryDarkColor, color: 'white' }}
        >
          <span className="fs-5">
            <FaRegEdit className="pb-1" /> EDIÇÃO: RESERVA DE MATERIAL
          </span>
        </Row>
        <Row className="px-0 pt-2">
          <Formik
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={(values) => {
              handleUpdate(values);
            }}
            // enableReinitialize
          >
            {({
              submitForm,
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
                    controlId="reqMaintenance"
                    className="pb-3"
                  >
                    <Form.Label>MANUTENÇÃO</Form.Label>
                    <Form.Control
                      type="tel"
                      value={values.reqMaintenance}
                      onChange={handleChange}
                      autoFocus
                      ref={inputRef}
                      placeholder="Nº Requisição"
                      onBlur={(e) => {
                        setFieldValue(
                          'reqMaintenance',
                          formatReq(e.target.value)
                        );
                        handleBlur(e);
                      }}
                    />
                    {touched.reqMaintenance && !!errors.reqMaintenance ? (
                      <Badge bg="danger">{errors.reqMaintenance}</Badge>
                    ) : null}
                  </Form.Group>

                  <Form.Group
                    as={Col}
                    xs={12}
                    md={3}
                    lg={2}
                    className="pb-3"
                    controlId="intendedUse"
                  >
                    <Form.Label>RETIRAR EM:</Form.Label>
                    <Form.Control
                      type="date"
                      value={values.intendedUse}
                      onChange={handleChange}
                      // isInvalid={touched.intendedUse && !!errors.intendedUse}
                      // isValid={touched.place && !errors.place}
                      onBlur={handleBlur}
                      placeholder="Escolha a data"
                    />
                    {touched.intendedUse && !!errors.intendedUse ? (
                      <Badge bg="danger">{errors.intendedUse}</Badge>
                    ) : null}
                  </Form.Group>

                  <Col className="pb-3">
                    <Form.Group>
                      <Form.Label>AUTORIZADO POR:</Form.Label>
                      <Select
                        inputId="authorizedBy"
                        options={users.map((user) => ({
                          value: user.id,
                          label: user.name,
                        }))}
                        value={values.authorizedBy}
                        onChange={(selected) => {
                          setFieldValue('authorizedBy', selected);
                        }}
                        placeholder="Selecione o responsável"
                        onBlur={handleBlur}
                        isDisabled
                      />
                      {touched.authorizedBy && !!errors.authorizedBy ? (
                        <Badge bg="danger">{errors.authorizedBy}</Badge>
                      ) : null}
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Form.Group
                    as={Col}
                    xs={12}
                    md={4}
                    // controlId="workerId"
                    className="pb-3"
                  >
                    <Col className="d-flex align-items-stretch">
                      <Form.Label>RETIRADO POR:</Form.Label>
                    </Col>
                    <Select
                      // id="workerId"
                      inputId="workerId"
                      // name="workerId"
                      options={workers.map((value) => ({
                        label: value[0],
                        options: value[1].map((item) => ({
                          value: item.id,
                          label: item.name,
                        })),
                      }))}
                      formatGroupLabel={formatGroupLabel}
                      value={values.workerId}
                      onChange={(selected) => {
                        setFieldValue('workerId', selected);
                      }}
                      placeholder="Selecione o profissional"
                      onBlur={handleBlur}
                    />
                    {touched.workerId && !!errors.workerId ? (
                      <Badge bg="danger">{errors.workerId}</Badge>
                    ) : null}
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    xs={12}
                    md={8}
                    className="pb-3"
                    controlId="place"
                  >
                    <Form.Label>LOCAL DE USO:</Form.Label>
                    <Form.Control
                      type="text"
                      value={values.place}
                      onChange={(e) => {
                        setFieldValue('place', e.target.value.toUpperCase()); // UPPERCASE
                      }}
                      isInvalid={touched.place && !!errors.place}
                      // isValid={touched.place && !errors.place}
                      onBlur={handleBlur}
                      placeholder="Informações sobre a localização do serviço"
                    />
                    <Form.Control.Feedback
                      tooltip
                      type="invalid"
                      style={{ position: 'static' }}
                    >
                      {errors.place}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>

                {/* <Row>
                  <Form.Group
                    as={Col}
                    xs={12}
                    // controlId="propertyId"
                    className="pb-3"
                  >
                    <Form.Label>PROPRIEDADE:</Form.Label>
                    <Select
                      inputId="propertyId"
                      options={properties.map((value) => ({
                        label: value[0],
                        options: value[1].map((item) => ({
                          value: item.id,
                          label: item.nomeImovel,
                        })),
                      }))}
                      formatGroupLabel={formatGroupLabel}
                      value={values.propertyId}
                      onChange={(selected) => {
                        setFieldValue('propertyId', selected);
                        setFieldValue('buildingId', '');
                        setFieldTouched('buildingId', false);
                      }}
                      placeholder="Selecione a propriedade"
                      onBlur={handleBlur}
                      isDisabled={initialValues.propertyId?.value}
                    />
                    {touched.propertyId && !!errors.propertyId ? (
                      <Badge bg="danger">{errors.propertyId}</Badge>
                    ) : null}
                  </Form.Group>
                </Row>

                <Row>
                  <Form.Group
                    as={Col}
                    xs={12}
                    className="pb-3"
                    controlId="buildingId"
                  >
                    <Form.Label>PRÉDIO:</Form.Label>
                    <Select
                      inputId="buildingId"
                      options={propertiesData
                        .filter((property) =>
                          values.propertyId
                            ? property.id === values.propertyId.value
                            : false
                        )[0]
                        ?.buildingsSipac.map((building) => ({
                          value: building.id,
                          label: building.name,
                        }))}
                      value={values.buildingId}
                      onChange={(selected) => {
                        setFieldValue('buildingId', selected);
                      }}
                      placeholder="Selecione o prédio"
                      isDisabled={initialValues.buildingId?.value}
                    />
                  </Form.Group>
                </Row> */}

                <Row>
                  <Form.Group xs={12} className="pb-3" controlId="obs">
                    <Form.Label>OBSERVAÇÕES GERAIS:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      type="text"
                      value={values.obs}
                      onChange={handleChange}
                      isInvalid={touched.obs && !!errors.obs}
                      // isValid={touched.obs && !errors.obs}
                      placeholder="Observações gerais"
                      onBlur={(e) => {
                        setFieldValue('obs', e.target.value.toUpperCase()); // UPPERCASE
                        handleBlur(e);
                      }}
                    />
                    <Form.Control.Feedback
                      tooltip
                      type="invalid"
                      style={{ position: 'static' }}
                    >
                      {errors.obs}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <hr />

                <Row className="justify-content-center">
                  <Col xs="auto" className="text-center pt-2 pb-4">
                    <Button type="reset" variant="danger" onClick={handleClose}>
                      Cancelar
                    </Button>
                  </Col>
                  <Col xs="auto" className="text-center pt-2 pb-4">
                    <Button
                      variant="success"
                      onClick={(e) => {
                        submitForm(e);
                      }}
                    >
                      Salvar
                    </Button>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </Row>
      </Row>
      {/* </Modal.Body> */}
      {/* <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Fechar
        </Button>
        <Button variant="primary">Entendido</Button>
      </Modal.Footer> */}
    </Modal>
  );
}
