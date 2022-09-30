/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaTrashAlt, FaPlus } from 'react-icons/fa';
import {
  Button,
  Row,
  Col,
  Form,
  Badge,
  Dropdown,
  ButtonGroup,
  Collapse,
} from 'react-bootstrap';
import { toast } from 'react-toastify';

import * as yup from 'yup'; // RulesValidation
import { Formik, FieldArray } from 'formik'; // FormValidation
import Select from 'react-select';
import axios from '../../../../services/axios';
import {
  primaryDarkColor,
  body1Color,
  body2Color,
} from '../../../../config/colors';
import Loading from '../../../../components/Loading';

import SearchModal from './components/SearchModal';

import workers from '../../../../assets/JSON/workers_example.json';
import imoveis from '../../../../assets/JSON/imoveis.json';

const propertyOptions = imoveis.map((property) => ({
  value: property.id,
  label: property.nome_imovel,
}));

const workersOptions = workers.map((worker) => ({
  value: worker.id,
  label: worker.name,
}));

export default function Index() {
  const userId = useSelector((state) => state.auth.user.id);
  const [inventoryData, setinventoryData] = useState([]);
  const [users, setUsers] = useState([]);
  const [reqRMs, setReqRMs] = useState([]);
  const [schema, setSchema] = useState(
    yup.object().shape({
      reqMaintenance: yup
        .string()
        .matches(
          /^[0-9]{1,5}$|^[0-9]+[/]{1}[0-9]{4}$/,
          'Formato de requisição não permitido'
        ),
      workerId: yup.object().required('Requerido'),
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
    })
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [openCollapse, setOpenCollapse] = useState(false);
  const inputRef = useRef();

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

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
    formattedValues.materialOuttypeId = 1; // SAÍDA PARA USO
    formattedValues.workerId = formattedValues.workerId?.value;
    formattedValues.authorizedBy = formattedValues.authorizedBy?.value;
    formattedValues.propertyId = formattedValues.propertyId?.value;
    formattedValues.buildingId = formattedValues.buildingId?.value;

    formattedValues.items.forEach((item) => {
      delete Object.assign(item, { MaterialId: item.materialId }).materialId; // rename key
    });

    try {
      setIsLoading(true);

      // RECEBE, ATUALIZA O INVENTARIO E JA BLOQUEIA
      await axios.post(`/materials/out/`, formattedValues);

      setIsLoading(false);
      setOpenCollapse(false);
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
    async function getMaterialsData() {
      try {
        setIsLoading(true);
        const response = await axios.get('/materials/inventory/');
        setinventoryData(response.data);
        setIsLoading(false);
      } catch (err) {
        // eslint-disable-next-line no-unused-expressions
        err.response?.data?.errors
          ? err.response.data.errors.map((error) => toast.error(error)) // errors -> resposta de erro enviada do backend (precisa se conectar com o back)
          : toast.error(err.message); // e.message -> erro formulado no front (é criado pelo front, não precisa de conexão)
        setIsLoading(false);
      }
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

    getMaterialsData();
    getUsersData();
  }, []);

  async function getReqMaterialsData(reqMaintenance) {
    try {
      setIsLoading(true);
      const response = await axios.get(`/materials/in/${reqMaintenance}`);
      setReqRMs(response.data);
      setIsLoading(false);
    } catch (err) {
      // eslint-disable-next-line no-unused-expressions
      err.response?.data?.errors
        ? err.response.data.errors.map((error) => toast.error(error)) // errors -> resposta de erro enviada do backend (precisa se conectar com o back)
        : toast.error(err.message); // e.message -> erro formulado no front (é criado pelo front, não precisa de conexão)
      setIsLoading(false);
    }
  }

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

  const formatReq = (req) => {
    const currentYear = new Date().getFullYear();
    return req.includes('/') ? req : `${req}/${currentYear}`;
  };

  const schemaSingleOutput = yup.object().shape({
    authorizedBy: yup.object().required('Requerido'),
    propertyId: yup.object().required('Requerido'),
  });

  const initialSchema = () => {
    setSchema(
      yup.object().shape({
        reqMaintenance: yup
          .string()
          .matches(
            /^[0-9]{1,5}$|^[0-9]+[/]{1}[0-9]{4}$/,
            'Formato de requisição não permitido'
          ),
        workerId: yup.object().required('Requerido'),
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
      })
    );
  };

  const apllySchema = (addSchema) => {
    const newSchema = schema.concat(addSchema);
    setSchema(newSchema);
  };

  const initialValues = {
    reqMaintenance: '',
    authorizedBy: '',
    workerId: '',
    place: '',
    buildingId: '',
    reqMaterial: '',
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
              setFieldTouched,
            }) => (
              <Form noValidate autoComplete="off">
                {JSON.stringify(errors)}
                <br />
                {JSON.stringify(!values.workerId)}
                <Row className="d-flex justify-content-between pb-3">
                  <Col
                    xs="12"
                    sm="10"
                    md="6"
                    className="d-flex justify-content-start"
                  >
                    <Form.Group
                      as={Col}
                      xs={6}
                      sm={5}
                      md={3}
                      controlId="reqMaintenance"
                    >
                      <Form.Label>REQ. MANUTENÇÃO</Form.Label>
                      <Form.Control
                        type="tel"
                        value={values.reqMaintenance}
                        onChange={handleChange}
                        isInvalid={
                          touched.reqMaintenance && !!errors.reqMaintenance
                        }
                        autoFocus
                        ref={inputRef}
                        placeholder="Insira o número"
                        onBlur={handleBlur}
                        readOnly={!!openCollapse}
                      />
                      <Form.Control.Feedback
                        tooltip
                        type="invalid"
                        style={{ position: 'static' }}
                      >
                        {errors.reqMaintenance}
                      </Form.Control.Feedback>
                    </Form.Group>

                    {!openCollapse ? (
                      <Col xs="auto" className="ps-2 align-self-end">
                        <Button
                          type="submit"
                          variant="success"
                          onClick={() => {
                            if (
                              !!values.reqMaintenance &&
                              !errors.reqMaintenance
                            ) {
                              setOpenCollapse(!openCollapse);
                              setFieldValue(
                                'reqMaintenance',
                                formatReq(values.reqMaintenance) // formatar o numero da requisicao
                              );
                              getReqMaterialsData(
                                formatReq(values.reqMaintenance)
                              );
                            }
                          }}
                          aria-controls="collapse-form"
                          aria-expanded={openCollapse}
                        >
                          <FaPlus />
                        </Button>
                      </Col>
                    ) : null}

                    {!openCollapse ? (
                      <Col xs="auto" className="ps-2 align-self-end">
                        <Button
                          variant="secondary"
                          onClick={() => {
                            !values.reqMaintenance &&
                              !errors.reqMaintenance && // verficcar se é vazio e n tem erro
                              setOpenCollapse(!openCollapse);
                            !values.reqMaintenance &&
                              !errors.reqMaintenance && // verficcar se é vazio e n tem erro
                              apllySchema(schemaSingleOutput);
                          }}
                          aria-controls="collapse-form"
                          aria-expanded={openCollapse}
                        >
                          Saída Avulsa
                        </Button>
                      </Col>
                    ) : null}
                    {!!values.reqMaintenance && openCollapse ? (
                      <Form.Group
                        as={Col}
                        xs={12}
                        md={4}
                        controlId="reqMaterial"
                        className="ps-4"
                      >
                        <Form.Label>RMs VINCULADAS</Form.Label>

                        <Form.Select
                          type="text"
                          value={values.reqMaterial}
                          onChange={handleChange}
                          isInvalid={
                            touched.reqMaterial && !!errors.reqMaterial
                          }
                          // isValid={touched.reqMaterial && !errors.reqMaterial}
                          onBlur={handleBlur}
                        >
                          <option>Selecione a RM</option>
                          {reqRMs.map((reqRM) => (
                            <option key={reqRM.id} value={reqRM.id}>
                              {reqRM.req}
                            </option>
                          ))}
                        </Form.Select>

                        <Form.Control.Feedback
                          tooltip
                          type="invalid"
                          style={{ position: 'static' }}
                        >
                          {errors.reqMaterial}
                        </Form.Control.Feedback>
                      </Form.Group>
                    ) : null}
                  </Col>

                  <Col xs="12" md="4" className="d-flex me-4">
                    {!values.reqMaintenance && openCollapse ? (
                      <Form.Group as={Col} xs={12} controlId="authorizedBy">
                        <Form.Label>AUTORIZADO POR:</Form.Label>
                        <Select
                          id="authorizedBy"
                          options={users.map((user) => ({
                            value: user.id,
                            label: user.name,
                          }))}
                          value={values.authorizedBy}
                          onChange={(selected) => {
                            setFieldValue('authorizedBy', selected);
                            setFieldTouched('authorizedBy');
                          }}
                          isInvalid={
                            touched.authorizedBy && !!errors.authorizedBy
                          }
                          isValid={touched.authorizedBy && !errors.authorizedBy}
                          placeholder="Selecione o responsável"
                          onBlur={handleBlur}
                        />
                        <Form.Control.Feedback
                          tooltip
                          type="invalid"
                          style={{ position: 'static' }}
                        >
                          {errors.authorizedBy}
                        </Form.Control.Feedback>
                      </Form.Group>
                    ) : null}
                  </Col>
                </Row>
                <Collapse in={openCollapse}>
                  <div id="collapse-form">
                    <Row className="pb-3">
                      <Row className="pb-3">
                        <Form.Group
                          as={Col}
                          xs={12}
                          md={4}
                          // controlId="workerId"
                        >
                          <Form.Label>RETIRADO POR:</Form.Label>
                          <Select
                            id="workerId"
                            inputId="workerId"
                            name="workerId"
                            as={Form.Select}
                            options={workersOptions}
                            value={values.workerId}
                            onChange={(selected) => {
                              setFieldValue('workerId', selected);
                              setFieldTouched('workerId');
                            }}
                            isInvalid={touched.workerId && !!errors.workerId}
                            isValid={touched.workerId && !errors.workerId}
                            placeholder="Selecione o profissional"
                            onBlur={handleBlur}
                          />
                          <Form.Control.Feedback
                            tooltip
                            type="invalid"
                            style={{ position: 'static' }}
                          >
                            {errors.workerId}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} xs={12} md={8} controlId="place">
                          <Form.Label>LOCAL DE USO:</Form.Label>
                          <Form.Control
                            type="text"
                            value={values.place}
                            onChange={handleChange}
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

                      {!values.reqMaintenance && openCollapse ? (
                        <Row className="pb-3">
                          <Form.Group as={Col} xs={12} controlId="propertyId">
                            <Form.Label>PROPRIEDADE:</Form.Label>
                            <Select
                              id="propertyId"
                              options={propertyOptions}
                              value={values.propertyId}
                              onChange={(selected) => {
                                setFieldValue('propertyId', selected);
                                setFieldTouched('propertyId');
                              }}
                              isInvalid={
                                touched.propertyId && !!errors.propertyId
                              }
                              isValid={touched.propertyId && !errors.propertyId}
                              placeholder="Selecione a propriedade"
                            />
                            <Form.Control.Feedback
                              tooltip
                              type="invalid"
                              style={{ position: 'static' }}
                            >
                              {errors.buildingId}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Row>
                      ) : null}
                      {!values.reqMaintenance && openCollapse ? (
                        <Row className="pb-3">
                          <Form.Group as={Col} xs={12} controlId="buildingId">
                            <Form.Label>PRÉDIO:</Form.Label>
                            <Select
                              id="buildingId"
                              options={workersOptions}
                              value={values.buildingId}
                              onChange={(selected) => {
                                setFieldValue('buildingId', selected);
                                setFieldTouched('buildingId');
                              }}
                              isInvalid={
                                touched.buildingId && !!errors.buildingId
                              }
                              isValid={touched.buildingId && !errors.buildingId}
                              placeholder="Selecione o prédio"
                            />
                            <Form.Control.Feedback
                              tooltip
                              type="invalid"
                              style={{ position: 'static' }}
                            >
                              {errors.buildingId}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Row>
                      ) : null}

                      <Row className="pb-3">
                        <Form.Group xs={12} controlId="obs">
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
                    </Row>
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
                                (item) => item.materialId
                              )}
                              inventoryData={inventoryData}
                            />
                            <Row
                              className="p-0 m-0 py-2"
                              style={{ background: body1Color }}
                            >
                              <Col xs="auto">
                                <Dropdown as={ButtonGroup}>
                                  <Button
                                    variant="light"
                                    onClick={handleShowModal}
                                  >
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
                            </Row>
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
                                      md={1}
                                      controlId={`items[${index}].quantity`}
                                      className="border-0 m-0 p-0"
                                    >
                                      {index === 0 ? (
                                        <Form.Label className="d-flex ps-2 py-1 border-bottom d-none d-sm-block">
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
                                        className="p-0 m-0 ps-2"
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
                      {typeof errors.items === 'string' ? (
                        <span>
                          {errors.items} <hr />
                        </span>
                      ) : errors.items ? (
                        <span>
                          A quantidade de nenhum item pode ser igual ou menor a
                          zero. <hr />
                        </span>
                      ) : null}
                    </Row>

                    <Row className="justify-content-center pt-2 pb-4">
                      <Col xs="auto" className="text-center">
                        <Button
                          type="reset"
                          variant="warning"
                          onClick={() => {
                            resetForm();
                            initialSchema();
                            setOpenCollapse(false);
                          }}
                        >
                          Limpar
                        </Button>
                      </Col>
                      <Col xs="auto" className="text-center">
                        <Button variant="success" onClick={submitForm}>
                          Confirmar saída
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </Collapse>
              </Form>
            )}
          </Formik>
        </Row>
      </Row>
    </>
  );
}
