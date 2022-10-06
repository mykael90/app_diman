/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaTrashAlt } from 'react-icons/fa';
import { Button, Row, Col, Form, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';

import * as yup from 'yup'; // RulesValidation
import { Formik, FieldArray } from 'formik'; // FormValidation
import Select from 'react-select';
import axios from '../../../../services/axios';
import { primaryDarkColor, body2Color } from '../../../../config/colors';
import Loading from '../../../../components/Loading';

export default function RestrictItems({
  data = {
    reqMaintenance: '63/2022',
    authorizedBy: {
      value: 26,
      label: 'Maria Fernandes',
    },
    workerId: {
      value: 36,
      label: 'JOSE ALVES PAULO',
    },
    place: '',
    buildingId: '',
    reqMaterial: '1000/2022',
    obs: '',
    items: [
      {
        materialId: 304200006640,
        name: 'DISCO DE CORTE DIAMANTADO LISO - 110MM X 20MM',
        unit: 'UNIDADE',
        balance: '2.00',
        value: 'R$ 7,98',
        quantity: '1',
      },
      {
        materialId: 302400002700,
        name: 'ENGATE PLASTICO DE 1/2" COM 40CM',
        unit: 'UNIDADE',
        balance: '5.00',
        value: 'R$ 3,61',
        quantity: '2',
      },
      {
        materialId: 302400029247,
        name: 'REJUNTE BRANCO - EMBALAGEM COM 1KG',
        unit: 'UNIDADE',
        balance: '2.00',
        value: 'R$ 1,84',
        quantity: '1',
      },
    ],
  },
}) {
  const userId = useSelector((state) => state.auth.user.id);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleStore = async (values, resetForm) => {
    const formattedValues = Object.fromEntries(
      Object.entries(values).filter(([_, v]) => v != null)
    ); // LIMPANDO CHAVES NULL E UNDEFINED

    Object.keys(formattedValues).forEach((key) => {
      if (formattedValues[key] === '') {
        delete formattedValues[key];
      }
    }); // LIMPANDO CHAVES `EMPTY STRINGS`

    formattedValues.userId = userId;
    formattedValues.authorizedBy = formattedValues.authorizedBy?.value;
    formattedValues.items.forEach((item) => {
      delete Object.assign(item, { MaterialId: item.materialId }).materialId; // rename key
      item.value = item.value
        .replace(/\./g, '')
        .replace(/,/g, '.')
        .replace(/[^0-9\.]+/g, '');
    });

    formattedValues.value = formattedValues.items.reduce((ac, item) => {
      ac += Number(item.quantity) * Number(item.value);
      return ac;
    }, 0);

    try {
      setIsLoading(true);

      // RECEBE, ATUALIZA O INVENTARIO E JA BLOQUEIA
      await axios.post(`/materials/out/`, formattedValues);

      setIsLoading(false);
      resetForm();

      toast.success(`Saída de material realizada com sucesso`);
    } catch (err) {
      // eslint-disable-next-line no-unused-expressions
      err.response?.data?.errors
        ? err.response.data.errors.map((error) => toast.error(error)) // errors -> resposta de erro enviada do backend (precisa se conectar com o back)
        : toast.error(err.message); // e.message -> erro formulado no front (é criado pelo front, não precisa de conexão)

      setIsLoading(false);
    }
  };

  useEffect(() => {
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

    getUsersData();
  }, []);

  const handleQuantityChange = (e, balance, handleChange) => {
    if (e.target.value > balance) {
      toast.error('A saída não pode superar o saldo do material');
      e.target.value = balance;
      handleChange(e);
      return;
    }
    if (e.target.value < 0) {
      toast.error('A saída não pode ser negativa');
      e.target.value = 0;
      handleChange(e);
      return;
    }
    handleChange(e);
  };

  const initialSchema = yup.object().shape({
    obs: yup.string(),
    // eslint-disable-next-line react/forbid-prop-types
    items: yup
      .array()
      .of(
        yup.object().shape({
          quantity: yup.number().required('Requerido').positive(),
        })
      )
      .required()
      .min(1, 'A lista de materiais não pode ser vazia'),
  });

  const initialValues = {
    materialInId: 10,
    reqMaterial: data.reqMaterial,
    reqMaintenance: data.reqMaintenance,
    authorizedBy: '',
    obs: '',
    items: data.items,
  };
  return (
    <>
      <Loading isLoading={isLoading} />
      <Row className="bg-light border rounded d-flex justify-content-center pt-2">
        <Row
          className="px-0 mx-0 py-2 text-center"
          style={{ background: primaryDarkColor, color: 'white' }}
        >
          <span className="fs-5">LIBERAR MATERIAL PARA SALDO COMUM</span>
        </Row>
        <Row className="px-0 pt-2">
          <Formik // FORAM DEFINIFOS 2 FORMULÁRIOS POIS O SEGUNDO SÓ VAI APARECER AOÓS A INSERÇÃO DO PRIMEIRO
            initialValues={initialValues}
            validationSchema={initialSchema}
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
                      readOnly
                    />
                    {touched.reqMaintenance && !!errors.reqMaintenance ? (
                      <Badge bg="danger">{errors.reqMaintenance}</Badge>
                    ) : null}
                  </Form.Group>

                  <Form.Group
                    as={Col}
                    xs={5}
                    sm={5}
                    md={3}
                    lg={2}
                    controlId="reqMaterial"
                    className="pb-3"
                  >
                    <Form.Label>RM:</Form.Label>
                    <Form.Control
                      type="tel"
                      value={values.reqMaterial}
                      readOnly
                    />
                    {touched.reqMaterial && !!errors.reqMaterial ? (
                      <Badge bg="danger">{errors.reqMaterial}</Badge>
                    ) : null}
                  </Form.Group>

                  <Form.Group as={Col} className="pb-3">
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
                    />
                    {touched.authorizedBy && !!errors.authorizedBy ? (
                      <Badge bg="danger">{errors.authorizedBy}</Badge>
                    ) : null}
                  </Form.Group>
                </Row>

                <Row>
                  <Form.Group xs={12} className="pb-3" controlId="obs">
                    <Form.Label>OBSERVAÇÕES GERAIS:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      type="text"
                      value={values.obs}
                      onChange={handleChange}
                      isInvalid={touched.obs && !!errors.obs}
                      // isValid={touched.obs && !errors.obs}
                      placeholder="Observações gerais"
                      onBlur={handleBlur}
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

                <Row
                  className="text-center"
                  style={{ background: primaryDarkColor, color: 'white' }}
                >
                  <span className="fs-6">LISTA DE MATERIAIS</span>
                </Row>
                <FieldArray name="items">
                  {(fieldArrayProps) => {
                    const { remove } = fieldArrayProps;
                    return (
                      <Row style={{ background: body2Color }}>
                        {values.items.length > 0 &&
                          values.items.map((item, index) => (
                            <>
                              <Row className="d-block d-sm-none">
                                <Col className="fw-bold">
                                  Item nº {index + 1}
                                </Col>
                              </Row>
                              <Row
                                key={item.materialId}
                                className="d-flex p-0 m-0 border-bottom"
                              >
                                <Form.Group
                                  as={Col}
                                  xs={12}
                                  sm={4}
                                  md={3}
                                  lg={2}
                                  controlId={`items[${index}].materialId`}
                                  className="border-0 m-0 p-0"
                                >
                                  {index === 0 ? (
                                    <Form.Label className="d-flex ps-2 py-1 border-bottom d-none d-sm-block">
                                      CODIGO
                                    </Form.Label>
                                  ) : null}
                                  <Form.Control
                                    type="text"
                                    plaintext
                                    readOnly
                                    value={item.materialId}
                                    onChange={handleChange}
                                    placeholder="Selecione o ID material"
                                    onBlur={handleBlur}
                                    size="sm"
                                    className="p-0 m-0 ps-2"
                                  />
                                </Form.Group>
                                <Form.Group
                                  as={Col}
                                  controlId={`items[${index}].name`}
                                  className="border-0 m-0 p-0"
                                >
                                  {index === 0 ? (
                                    <Form.Label className="d-flex ps-2 py-1 border-bottom d-none d-sm-block">
                                      DESCRIÇÃO
                                    </Form.Label>
                                  ) : null}
                                  <Form.Control
                                    type="text"
                                    plaintext
                                    readOnly
                                    value={item.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Selecione o ID material"
                                    size="sm"
                                    className="p-0 m-0 ps-2"
                                  />
                                </Form.Group>
                                <Form.Group
                                  as={Col}
                                  xs={12}
                                  sm={4}
                                  md={1}
                                  controlId={`items[${index}].unit`}
                                  className="border-0 m-0 p-0"
                                >
                                  {index === 0 ? (
                                    <Form.Label className="d-flex ps-2 py-1 border-bottom d-none d-sm-block">
                                      UND
                                    </Form.Label>
                                  ) : null}
                                  <Form.Control
                                    type="text"
                                    plaintext
                                    readOnly
                                    value={item.unit}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="UND"
                                    size="sm"
                                    className="p-0 m-0 ps-2"
                                  />
                                </Form.Group>
                                <Form.Group
                                  as={Col}
                                  xs={12}
                                  sm={4}
                                  md={1}
                                  controlId={`items[${index}].balance`}
                                  className="d-none"
                                >
                                  <Form.Control
                                    type="number"
                                    plaintext
                                    value={item.balance}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="SALDO"
                                    size="sm"
                                    className="p-0 m-0 ps-2"
                                  />
                                </Form.Group>
                                <Form.Group
                                  as={Col}
                                  xs={10}
                                  sm={4}
                                  md="auto"
                                  controlId={`items[${index}].quantity`}
                                  className="border-0 m-0 p-0"
                                  style={{ width: '70px', zIndex: 100 }}
                                >
                                  {index === 0 ? (
                                    <Form.Label className="d-flex ps-2 py-1 border-bottom d-none d-sm-block text-center">
                                      QTD
                                    </Form.Label>
                                  ) : null}
                                  <Form.Control
                                    type="number"
                                    plaintext
                                    value={item.quantity}
                                    onChange={(e) =>
                                      handleQuantityChange(
                                        e,
                                        item.balance,
                                        handleChange
                                      )
                                    }
                                    onBlur={handleBlur}
                                    placeholder="QTD"
                                    size="sm"
                                    className="p-0 m-0 ps-2 text-end"
                                  />
                                </Form.Group>
                                <Col
                                  as={Col}
                                  xs="2"
                                  sm="auto"
                                  className="border-0 m-0 p-0 text-center"
                                >
                                  {index === 0 ? (
                                    <Row>
                                      <Col xs="auto" className="d-flex">
                                        <div
                                          className="d-none d-sm-block"
                                          style={{
                                            width: '6px',
                                            height: '34px',
                                          }}
                                        />
                                      </Col>
                                    </Row>
                                  ) : null}
                                  <Row>
                                    <Col xs="auto">
                                      <Button
                                        onClick={() => remove(index)}
                                        variant="outline-danger"
                                        size="sm"
                                        className="border-0"
                                      >
                                        <FaTrashAlt size={18} />
                                      </Button>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            </>
                          ))}
                      </Row>
                    );
                  }}
                </FieldArray>
                <Row className="pt-4">
                  <Col xs="auto">
                    {touched.items && typeof errors.items === 'string' ? (
                      <Badge bg="danger">{errors.items}</Badge>
                    ) : touched.items && errors.items ? (
                      <Badge bg="danger">
                        A quantidade de item não pode ser 0.
                      </Badge>
                    ) : null}
                  </Col>
                </Row>

                <Row className="justify-content-center">
                  <Col xs="auto" className="text-center pt-2 pb-4">
                    <Button
                      type="reset"
                      variant="danger"
                      onClick={() => {
                        resetForm();
                        initialSchema();
                      }}
                    >
                      Cancelar
                    </Button>
                  </Col>
                  <Col xs="auto" className="text-center pt-2 pb-4">
                    <Button variant="success" onClick={submitForm}>
                      Liberar
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
