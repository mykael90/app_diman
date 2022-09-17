/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import {
  Button,
  Row,
  Col,
  Form,
  Badge,
  Dropdown,
  ButtonGroup,
} from 'react-bootstrap';
import { toast } from 'react-toastify';

import * as yup from 'yup'; // RulesValidation
import { Formik, FieldArray } from 'formik'; // FormValidation
import axios from '../../../../services/axios';
import {
  primaryDarkColor,
  body1Color,
  body2Color,
} from '../../../../config/colors';
import Loading from '../../../../components/Loading';

import SearchModal from './components/SearchModal';

export default function Index() {
  const [materialsBalance, setMaterialsBalance] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true);
        const response = await axios.get('/materials/in/items');
        setMaterialsBalance(response.data);
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

  const inputRef = useRef();
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const schema = yup.object().shape({
    reqMaintenance: yup
      .string()
      .required('Requerido')
      .matches(
        /^[0-9]{1,5}$|^[0-9]+[/]{1}[0-9]{4}$/,
        'Formato de requisição não permitido'
      ),
    removedBy: yup.number().positive().integer().required('Requerido'),
    costUnit: yup.number().positive().integer().required('Requerido'),
    property: yup.number().positive().integer().required('Requerido'),
    building: yup.number().positive().integer().required('Requerido'),
    obs: yup.string(),
    // eslint-disable-next-line react/forbid-prop-types
    items: yup
      .array()
      .of(
        yup.object().shape({
          MaterialId: yup.number().required('Requerido').positive().integer(),
          name: yup.string().required('Requerido'),
          unit: yup.string().required('Requerido'),
          quantity: yup.number().required('Requerido').positive().integer(),
        })
      )
      .required('A lista de materiais não pode ser vazia'),
  });

  const initialValues = {
    reqMaintenance: '',
    removedBy: '',
    costUnit: '',
    property: '',
    building: '',
    obs: '',
    items: [],
  };
  return (
    <>
      <Loading isLoading={isLoading} />
      <Row className="bg-light border rounded d-flex justify-content-center pt-2">
        <Row
          className="px-0 mx-0 py-2 text-center"
          style={{ background: primaryDarkColor, color: 'white' }}
        >
          <span className="fs-5">SAÍDA DE MATERIAL</span>
        </Row>
        <Row className="px-0 pt-2">
          <Formik // FORAM DEFINIFOS 2 FORMULÁRIOS POIS O SEGUNDO SÓ VAI APARECER AOÓS A INSERÇÃO DO PRIMEIRO
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={(values, { resetForm }) => {
              resetForm();
            }}
          >
            {({
              resetForm,
              handleSubmit,
              handleChange,
              handleBlur,
              values,
              touched,
              isValid,
              errors,
            }) => (
              <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Row>
                  <Form.Group controlId="reqMaintenance">
                    <Row className="d-flex align-items-end pt-2">
                      <Col xs={8} md={6} lg={4} xl={3}>
                        <Form.Label>Nº REQUISIÇÃO DE MANUTENÇÃO</Form.Label>
                        <Form.Control
                          type="tel"
                          value={values.reqMaintenance}
                          onChange={handleChange}
                          isInvalid={
                            touched.reqMaintenance && !!errors.reqMaintenance
                          }
                          isValid={
                            touched.reqMaintenance && !errors.reqMaintenance
                          }
                          autoFocus
                          ref={inputRef}
                          placeholder="Código/ano"
                          onBlur={handleBlur}
                        />
                        <Form.Control.Feedback
                          tooltip
                          type="invalid"
                          style={{ position: 'static' }}
                        >
                          {errors.reqMaintenance}
                        </Form.Control.Feedback>
                      </Col>
                    </Row>
                  </Form.Group>

                  <Form.Group
                    as={Col}
                    xs={12}
                    md={4}
                    controlId="removedBy"
                    className="pt-2"
                  >
                    <Form.Label>RETIRADO POR:</Form.Label>
                    <Form.Select
                      type="text"
                      value={values.removedBy}
                      onChange={handleChange}
                      isInvalid={touched.removedBy && !!errors.removedBy}
                      isValid={touched.removedBy && !errors.removedBy}
                      placeholder="Selecione o profissional"
                      onBlur={handleBlur}
                    >
                      <option>Selecione o profissional</option>
                      <option value="1">JOSE FERREIRA</option>
                      <option value="2">MARCONDES</option>
                      <option value="3">DANIEL</option>
                    </Form.Select>
                    <Form.Control.Feedback
                      tooltip
                      type="invalid"
                      style={{ position: 'static' }}
                    >
                      {errors.removedBy}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group
                    as={Col}
                    xs={12}
                    md={8}
                    controlId="costUnit"
                    className="pt-2"
                  >
                    <Form.Label>UIDADE DE CUSTO:</Form.Label>
                    <Form.Control
                      type="text"
                      value={values.costUnit}
                      onChange={handleChange}
                      isInvalid={touched.costUnit && !!errors.costUnit}
                      isValid={touched.costUnit && !errors.costUnit}
                      placeholder="Selecione o local"
                      onBlur={handleBlur}
                    />
                    <Form.Control.Feedback
                      tooltip
                      type="invalid"
                      style={{ position: 'static' }}
                    >
                      {errors.costUnit}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group
                    as={Col}
                    xs={12}
                    md={4}
                    controlId="property"
                    className="pt-2"
                  >
                    <Form.Label>IMÓVEL:</Form.Label>
                    <Form.Control
                      type="text"
                      value={values.property}
                      onChange={handleChange}
                      isInvalid={touched.property && !!errors.property}
                      isValid={touched.property && !errors.property}
                      placeholder="Selecione o local"
                      onBlur={handleBlur}
                    />
                    <Form.Control.Feedback
                      tooltip
                      type="invalid"
                      style={{ position: 'static' }}
                    >
                      {errors.property}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    xs={12}
                    md={8}
                    controlId="building"
                    className="pt-2"
                  >
                    <Form.Label>PRÉDIO:</Form.Label>
                    <Form.Control
                      type="text"
                      value={values.building}
                      onChange={handleChange}
                      isInvalid={touched.building && !!errors.building}
                      isValid={touched.building && !errors.building}
                      placeholder="Selecione o local"
                      onBlur={handleBlur}
                    />
                    <Form.Control.Feedback
                      tooltip
                      type="invalid"
                      style={{ position: 'static' }}
                    >
                      {errors.building}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group xs={12} controlId="obs" className="pt-2">
                    <Form.Label>OBSERVAÇÕES GERAIS:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      type="text"
                      value={values.obs}
                      onChange={handleChange}
                      isInvalid={touched.obs && !!errors.obs}
                      isValid={touched.obs && !errors.obs}
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
                <hr />

                <Row
                  className="d-flex text-center"
                  style={{ background: primaryDarkColor, color: 'white' }}
                >
                  <span className="fs-6">LISTA DE MATERIAIS</span>
                </Row>

                <FieldArray name="items">
                  {(fieldArrayProps) => {
                    const { remove, push } = fieldArrayProps;
                    return (
                      <Row style={{ background: body2Color }}>
                        <SearchModal // modal p/ pesquisa de materiais
                          handleClose={handleCloseModal}
                          show={showModal}
                          push={push}
                          hiddenItems={values.items.map(
                            (item) => item.MaterialId
                          )}
                          materialsBalance={materialsBalance}
                        />
                        <Row
                          className="p-0 m-0 py-2"
                          style={{ background: body1Color }}
                        >
                          <Col xs="auto">
                            <Dropdown as={ButtonGroup}>
                              <Button variant="light" onClick={handleShowModal}>
                                Pesquisar
                              </Button>

                              <Dropdown.Toggle
                                split
                                variant="light"
                                id="dropdown-split-basic"
                              />

                              <Dropdown.Menu>
                                <Dropdown.Item href="#/action-1">
                                  Material sem saldo
                                </Dropdown.Item>
                                <Dropdown.Item href="#/action-2">
                                  Importar de outras RMs
                                </Dropdown.Item>
                                <Dropdown.Item href="#/action-3">
                                  Importar de outras saídas
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </Col>
                          <Col xs="auto">
                            <Dropdown>
                              <Dropdown.Toggle
                                variant="light"
                                id="dropdown-basic"
                              >
                                Importar RM Associada{' '}
                                <Badge bg="primary">3</Badge>
                                <span className="visually-hidden">
                                  unread messages
                                </span>
                              </Dropdown.Toggle>

                              <Dropdown.Menu>
                                <Dropdown.Item href="#/action-1">
                                  RM 1564
                                </Dropdown.Item>
                                <Dropdown.Item href="#/action-2">
                                  RM 4875
                                </Dropdown.Item>
                                <Dropdown.Item href="#/action-3">
                                  RM 1567
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </Col>
                        </Row>
                        <Row className="p-0 m-0 pt-2">
                          <Col
                            xs={4}
                            sm={4}
                            md={3}
                            lg={2}
                            className="border my-0 mx-0"
                          >
                            CODIGO
                          </Col>
                          <Col className="border my-0 mx-0">DENOMINAÇÃO</Col>
                          <Col
                            xs={4}
                            sm={4}
                            md={1}
                            className="border my-0 mx-0"
                          >
                            UND
                          </Col>
                          <Col
                            xs={4}
                            sm={4}
                            md={1}
                            className="border my-0 mx-0"
                          >
                            QTD
                          </Col>
                          <Col xs="auto" className="border my-0 mx-0">
                            R
                          </Col>
                        </Row>
                        {values.items.length > 0 &&
                          values.items.map((item, index) => (
                            <Row
                              key={item.MaterialId}
                              className="d-flex p-0 m-0"
                            >
                              <Form.Group
                                as={Col}
                                xs={4}
                                sm={4}
                                md={3}
                                lg={2}
                                controlId={`items[${index}].MaterialId`}
                                className="border m-0 p-0"
                              >
                                <Form.Control
                                  type="text"
                                  plaintext
                                  readOnly
                                  value={item.MaterialId}
                                  onChange={handleChange}
                                  // isInvalid={
                                  //   touched.items &&
                                  //   !!errors.items[index].MaterialId
                                  // }
                                  // isValid={
                                  //   touched.items &&
                                  //   !errors.items[index].MaterialId
                                  // }
                                  placeholder="Selecione o ID material"
                                  onBlur={handleBlur}
                                  size="sm"
                                  className="p-0 m-0 ps-2"
                                />
                              </Form.Group>
                              <Form.Group
                                as={Col}
                                controlId={`items[${index}].name`}
                                className="border m-0 p-0"
                              >
                                <Form.Control
                                  type="text"
                                  plaintext
                                  // readOnly
                                  value={item.name}
                                  onChange={handleChange}
                                  // isInvalid={
                                  //   touched.items &&
                                  //   !!errors.items[index].name
                                  // }
                                  // isValid={
                                  //   touched.items && !errors.items[index].name
                                  // }
                                  onBlur={handleBlur}
                                  placeholder="Selecione o ID material"
                                  size="sm"
                                  className="p-0 m-0 ps-2"
                                />
                              </Form.Group>
                              <Form.Group
                                as={Col}
                                xs={4}
                                sm={4}
                                md={1}
                                controlId={`items[${index}].unit`}
                                className="border m-0 p-0"
                              >
                                <Form.Control
                                  type="text"
                                  plaintext
                                  // readOnly
                                  value={item.unit}
                                  onChange={handleChange}
                                  // isInvalid={
                                  //   touched.items &&
                                  //   !!errors.items[index].name
                                  // }
                                  // isValid={
                                  //   touched.items && !errors.items[index].name
                                  // }
                                  onBlur={handleBlur}
                                  placeholder="UND"
                                  size="sm"
                                  className="p-0 m-0 ps-2"
                                />
                              </Form.Group>
                              <Form.Group
                                as={Col}
                                xs={4}
                                sm={4}
                                md={1}
                                controlId={`items[${index}].quantity`}
                                className="border m-0 p-0"
                              >
                                <Form.Control
                                  type="number"
                                  plaintext
                                  // readOnly
                                  value={item.quantity}
                                  onChange={handleChange}
                                  // isInvalid={
                                  //   touched.items &&
                                  //   !!errors.items[index].quantity
                                  // }
                                  // isValid={
                                  //   touched.items && !errors.items[index].quantity
                                  // }
                                  onBlur={handleBlur}
                                  placeholder="QTD"
                                  size="sm"
                                  className="p-0 m-0 ps-2"
                                />
                              </Form.Group>
                              <Col xs="auto" className="border m-0 p-0">
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
                          ))}
                      </Row>
                    );
                  }}
                </FieldArray>

                <hr />
                <Row className="justify-content-center pt-2 pb-4">
                  <Col xs="auto" className="text-center">
                    <Button type="reset" variant="warning" onClick={resetForm}>
                      Limpar
                    </Button>
                  </Col>
                  <Col xs="auto" className="text-center">
                    <Button
                      type="submit"
                      variant="success"
                      onClick={() => {
                        toast.success(
                          'Saída de material realizada com sucesso'
                        );
                      }}
                    >
                      Confirmar saída
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
