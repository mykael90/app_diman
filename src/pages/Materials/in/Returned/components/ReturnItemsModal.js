/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FaTrashAlt } from 'react-icons/fa';
import {
  Button,
  Row,
  Col,
  Form,
  Badge,
  Modal,
  Dropdown,
  ButtonGroup,
} from 'react-bootstrap';
import { toast } from 'react-toastify';

import * as yup from 'yup'; // RulesValidation
import { Formik, FieldArray } from 'formik'; // FormValidation
import axios from '../../../../../services/axios';
import { primaryDarkColor, body2Color } from '../../../../../config/colors';
import Loading from '../../../../../components/Loading';

export default function SearchModal(props) {
  const { show, handleCancelModal, handleClose, data } = props;
  const userId = useSelector((state) => state.auth.user.id);
  const [isLoading, setIsLoading] = useState(false);
  const [receiveFree, setReceiveFree] = useState(false);

  const handleStore = async (values, resetForm, free) => {
    console.log(free);
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
    formattedValues.MaterialInItems.forEach((item) => {
      Object.assign(item, { MaterialId: item.materialId }); // rename key
      item.value = item.value
        .replace(/\./g, '')
        .replace(/,/g, '.')
        .replace(/[^0-9\.]+/g, '');
    });
    formattedValues.value = formattedValues.MaterialInItems.reduce(
      (ac, item) => {
        ac += Number(item.quantity) * Number(item.value);
        return ac;
      },
      0
    );

    console.log(formattedValues);

    try {
      setIsLoading(true);

      const response = await axios.post(
        `/materials/in/general`,
        formattedValues
      );

      // DEIXA PARA USO COMUM DO ALMOXARIFADO SE FOR SINALIZADO PELO USUARIO NO RECEBIMENTO
      if (free) {
        const freeData = await response.data;
        delete Object.assign(freeData, { items: freeData.MaterialInItems })
          .MaterialInItems; // rename key
        delete Object.assign(freeData, { materialInId: freeData.id }).id; // rename key
        delete freeData.requiredBy;

        await axios.post(`/materials/release/`, freeData);
      }

      setIsLoading(false);
      setReceiveFree(false);
      resetForm();
      handleClose();

      toast.success(`Materiais retornados com sucesso`);
    } catch (err) {
      // eslint-disable-next-line no-unused-expressions
      err.response?.data?.errors
        ? err.response.data.errors.map((error) => toast.error(error)) // errors -> resposta de erro enviada do backend (precisa se conectar com o back)
        : toast.error(err.message); // e.message -> erro formulado no front (é criado pelo front, não precisa de conexão)

      setIsLoading(false);
      setReceiveFree(false);
    }
  };

  const handleQuantityChange = (e, balance, handleChange) => {
    if (Number(e.target.value) > Number(balance)) {
      toast.error(
        'O retorno não pode superar a quantidade de saída do material'
      );
      e.target.value = Number(balance);
      handleChange(e);
      return;
    }
    if (Number(e.target.value) < 0) {
      toast.error('A entrada não pode ser negativa');
      e.target.value = 0;
      handleChange(e);
      return;
    }
    handleChange(e);
  };

  const initialSchema = yup.object().shape({
    obs: yup.string(),
    // eslint-disable-next-line react/forbid-prop-types
    MaterialInItems: yup
      .array()
      .of(
        yup.object().shape({
          quantity: yup.number().required('Requerido').positive(),
        })
      )
      .required()
      .min(1, 'A lista de materiais não pode ser vazia'),
  });

  const dataItems = data.MaterialOutItems?.map((item) => ({
    materialId: item.materialId,
    name: item.name,
    specification: item.specification,
    unit: item.unit,
    outQuantity: item.quantity,
    quantity: 0,
    value: item.value,
  }));

  const initialValues = {
    reqMaintenance: data.reqMaintenance,
    req: data.reqMaterial,
    requiredBy: data.authorizerUsername,
    returnId: data.id,
    materialIntypeId: 3,
    obs: '',
    MaterialInItems: dataItems,
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
              <span className="fs-5">RETORNO DE MATERIAIS</span>
            </Row>
            <Row className="px-0 pt-2">
              <Formik // FORAM DEFINIFOS 2 FORMULÁRIOS POIS O SEGUNDO SÓ VAI APARECER AOÓS A INSERÇÃO DO PRIMEIRO
                initialValues={initialValues}
                validationSchema={initialSchema}
                onSubmit={(values, { resetForm }) => {
                  handleStore(values, resetForm, receiveFree);
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
                        <Form.Control type="tel" value={values.req} readOnly />
                        {touched.req && !!errors.req ? (
                          <Badge bg="danger">{errors.req}</Badge>
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

                    <Row
                      className="text-center"
                      style={{ background: primaryDarkColor, color: 'white' }}
                    >
                      <span className="fs-6">LISTA DE MATERIAIS</span>
                    </Row>
                    <FieldArray name="MaterialInItems">
                      {(fieldArrayProps) => {
                        const { remove } = fieldArrayProps;
                        return (
                          <Row style={{ background: body2Color }}>
                            {values.MaterialInItems.length > 0 &&
                              values.MaterialInItems.map((item, index) => (
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
                                      controlId={`MaterialInItems[${index}].materialId`}
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
                                      controlId={`MaterialInItems[${index}].name`}
                                      className="border-0 m-0 p-0"
                                    >
                                      {index === 0 ? (
                                        <Form.Label className="d-flex ps-2 py-1 border-bottom d-none d-sm-block">
                                          DESCRIÇÃO
                                        </Form.Label>
                                      ) : null}
                                      <div className="px-2">{item.name}</div>
                                    </Form.Group>
                                    <Form.Group
                                      as={Col}
                                      xs={12}
                                      sm={4}
                                      md={1}
                                      controlId={`MaterialInItems[${index}].unit`}
                                      className="border-0 m-0 p-0"
                                    >
                                      {index === 0 ? (
                                        <Form.Label className="d-flex ps-2 py-1 border-bottom d-none d-sm-block">
                                          UND
                                        </Form.Label>
                                      ) : null}
                                      <div className="px-2">{item.unit}</div>
                                    </Form.Group>
                                    <Form.Group
                                      as={Col}
                                      xs={10}
                                      sm={4}
                                      md="auto"
                                      controlId={`MaterialInItems[${index}].outQuantity`}
                                      className="border-0 m-0 p-0"
                                      style={{ width: '80px' }}
                                    >
                                      {' '}
                                      {index === 0 ? (
                                        <Form.Label className="d-flex ps-2 py-1 border-bottom d-none d-sm-block text-center">
                                          SAÍDA
                                        </Form.Label>
                                      ) : null}
                                      <Form.Control
                                        type="number"
                                        plaintext
                                        readOnly
                                        value={item.outQuantity}
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
                                      controlId={`MaterialInItems[${index}].quantity`}
                                      className="border-0 m-0 p-0"
                                      style={{ width: '80px' }}
                                    >
                                      {index === 0 ? (
                                        <Form.Label className="d-flex ps-2 py-1 border-bottom d-none d-sm-block text-center">
                                          RETORNO
                                        </Form.Label>
                                      ) : null}
                                      <Form.Control
                                        type="number"
                                        plaintext
                                        value={item.quantity}
                                        onChange={(e) =>
                                          handleQuantityChange(
                                            e,
                                            item.outQuantity,
                                            handleChange
                                          )
                                        }
                                        onBlur={handleBlur}
                                        placeholder="QTD"
                                        size="sm"
                                        className="p-0 m-0 ps-2 pe-2 text-end"
                                        step="any"
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
                        {typeof errors.MaterialInItems === 'string' ? (
                          <Badge bg="danger">{errors.MaterialInItems}</Badge>
                        ) : touched.MaterialInItems &&
                          errors.MaterialInItems ? (
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
                            handleCancelModal();
                          }}
                        >
                          Cancelar
                        </Button>
                      </Col>
                      <Col xs="auto" className="text-center pt-2 pb-4">
                        <Dropdown as={ButtonGroup}>
                          <Button
                            onClick={(e) => {
                              setReceiveFree(true);
                              submitForm(e);
                            }}
                            variant="success"
                          >
                            Repor Estoque
                          </Button>

                          {values.req ? (
                            <>
                              <Dropdown.Toggle
                                split
                                variant="success"
                                id="dropdown-split-basic"
                              />

                              <Dropdown.Menu>
                                <Dropdown.Item
                                  onClick={(e) => {
                                    submitForm(e);
                                  }}
                                >
                                  Receber Restrito
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </>
                          ) : null}
                        </Dropdown>
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
