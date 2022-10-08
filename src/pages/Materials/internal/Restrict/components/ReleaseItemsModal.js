/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaTrashAlt } from 'react-icons/fa';
import { Button, Row, Col, Form, Badge, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

import * as yup from 'yup'; // RulesValidation
import { Formik, FieldArray } from 'formik'; // FormValidation
import Select from 'react-select';
import { forEach } from 'lodash';
import axios from '../../../../../services/axios';
import { primaryDarkColor, body2Color } from '../../../../../config/colors';
import Loading from '../../../../../components/Loading';

export default function SearchModal(props) {
  const { show, handleClose, data } = props;
  const userId = useSelector((state) => state.auth.user.id);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // CALCULANDO O SALDO DE MATERIAL RESTRITO QUE PODE SER LIBERADO
  let RestrictItems = [];
  let ReleaseItems = [];

  data.MaterialRestricts?.forEach((value) => {
    RestrictItems = [...RestrictItems, ...value.MaterialRestrictItems];
  });
  data.MaterialReleases?.forEach((value) => {
    ReleaseItems = [...ReleaseItems, ...value.MaterialReleaseItems];
  });

  const RestrictItemsSum = Array.from(
    RestrictItems.reduce(
      (m, { materialId, quantity }) =>
        m.set(materialId, (m.get(materialId) || 0) + quantity),
      new Map()
    ),
    ([materialId, quantity]) => ({ materialId, quantity })
  );

  const ReleaseItemsSum = Array.from(
    ReleaseItems.reduce(
      (m, { materialId, quantity }) =>
        m.set(materialId, (m.get(materialId) || 0) + quantity),
      new Map()
    ),
    ([materialId, quantity]) => ({ materialId, quantity })
  );
  // ires = item restricted
  // irel = item released
  const balanceItems = RestrictItemsSum.map((ires) => {
    const balancedQuantity =
      ires.quantity -
      ReleaseItemsSum.reduce((ac, irel) => {
        if (irel.materialId === ires.materialId) {
          ac += irel.quantity;
        }
        return ac;
      }, 0);
    return {
      materialId: ires.materialId,
      balancedQuantity,
      quantity: balancedQuantity,
    };
  });
  // i1 = item 1
  // i2 = item 2
  // Colocando nome e unidade no vetor balanceItems
  RestrictItems.forEach((i1) => {
    balanceItems.forEach((i2) => {
      if (i1.materialId === i2.materialId) {
        i2.name = i1.name;
        i2.unit = i1.unit;
        i2.specification = i1.specification;
        i2.value = i1.value;
      }
    });
  });

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
    formattedValues.requiredBy = formattedValues.requiredBy?.value;
    formattedValues.items.forEach((item) => {
      delete Object.assign(item, { MaterialId: item.materialId }).materialId; // rename key
      item.value = item.value
        .replace(/\./g, '')
        .replace(/,/g, '.')
        .replace(/[^0-9\.]+/g, '');
    });

    try {
      setIsLoading(true);

      // LIBERAÇÃO DO SALDO BLOQUEADO
      await axios.post(`/materials/release/`, formattedValues);

      setIsLoading(false);
      resetForm();
      handleClose();

      toast.success(`Materiais liberados com sucesso`);
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
    materialInId: data.id,
    reqMaterial: data.req,
    reqMaintenance: data.reqMaintenance,
    requiredBy: '',
    obs: '',
    items: balanceItems.filter((item) => item.quantity > 0) ?? '',
  };

  return (
    <>
      <Loading isLoading={isLoading} />
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="xl"
      >
        <Modal.Body>
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
                        <Form.Label>REQUERIDO POR:</Form.Label>
                        <Select
                          inputId="requiredBy"
                          options={users.map((user) => ({
                            value: user.id,
                            label: user.name,
                          }))}
                          value={values.requiredBy}
                          onChange={(selected) => {
                            setFieldValue('requiredBy', selected);
                          }}
                          placeholder="Selecione o responsável"
                          onBlur={handleBlur}
                        />
                        {touched.requiredBy && !!errors.requiredBy ? (
                          <Badge bg="danger">{errors.requiredBy}</Badge>
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
                                      xs={10}
                                      sm={4}
                                      md="auto"
                                      controlId={`items[${index}].balancedQuantity`}
                                      className="border-0 m-0 p-0"
                                      style={{ width: '80px' }}
                                    >
                                      {' '}
                                      {index === 0 ? (
                                        <Form.Label className="d-flex ps-2 py-1 border-bottom d-none d-sm-block text-center">
                                          RESTRITO
                                        </Form.Label>
                                      ) : null}
                                      <Form.Control
                                        type="number"
                                        plaintext
                                        readOnly
                                        value={item.balancedQuantity}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="SALDO"
                                        size="sm"
                                        className="p-0 m-0 ps-2 text-end"
                                      />
                                    </Form.Group>
                                    <Form.Group
                                      as={Col}
                                      xs={10}
                                      sm={4}
                                      md="auto"
                                      controlId={`items[${index}].quantity`}
                                      className="border-0 m-0 p-0"
                                      style={{ width: '80px' }}
                                    >
                                      {index === 0 ? (
                                        <Form.Label className="d-flex ps-2 py-1 border-bottom d-none d-sm-block text-center">
                                          LIBERAR
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
                                        className="p-0 m-0 ps-2 pe-2 text-end"
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
                        {values.items.length === 0 ? (
                          <Badge bg="danger">
                            Não há materiais bloqueados para liberar.
                          </Badge>
                        ) : null}

                        {typeof errors.items === 'string' ? (
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
                            handleClose();
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
        </Modal.Body>
      </Modal>
    </>
  );
}
