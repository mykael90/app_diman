/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { FaTrashAlt, FaPlus, FaSearch, FaSync } from 'react-icons/fa';
import {
  Button,
  Row,
  Col,
  Form,
  Badge,
  Collapse,
  Accordion,
  useAccordionButton,
  Card,
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
import ReleaseItemsModal from './components/ReleaseItemsModal';
import ListReserves from './components/ListReserves';

function CustomToggle({ children, eventKey }) {
  const decoratedOnClick = useAccordionButton(eventKey, () =>
    console.log('totally custom!')
  );

  return (
    <Button type="button" variant="primary" onClick={decoratedOnClick}>
      {children}
    </Button>
  );
}

const formatGroupLabel = (data) => (
  <Col className="d-flex justify-content-between">
    <span>{data.label}</span>
    <Badge bg="secondary">{data.options.length}</Badge>
  </Col>
);

export default function Index() {
  const userId = useSelector((state) => state.auth.user.id);
  const [inventoryData, setinventoryData] = useState([]);
  const [initialValues, setInitialValues] = useState({
    reqMaintenance: '',
    authorizedBy: '',
    isAuthorizer: false,
    workerId: '',
    propertyId: '',
    place: '',
    buildingId: '',
    reqMaterial: '',
    obs: '',
    items: [],
  });
  const [users, setUsers] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [propertiesData, setPropertiesData] = useState([]);
  const [reqRMs, setReqRMs] = useState([]);
  const [reserves, setReserves] = useState([]);
  const [schema, setSchema] = useState(
    yup.object().shape({
      reqMaintenance: yup
        .string()
        .matches(/^[0-9]{1,5}$|^[0-9]+[/]{1}[0-9]{4}$/, 'Entrada inválida'),
      authorizedBy: yup.object().required('Requerido'),
      isAuthorizer: yup.boolean(),
      workerId: yup.object().when(['isAuthorizer'], {
        is: false,
        then: (validate) => validate.required('Requerido'),
        otherwise: (validate) => validate.notRequired(),
      }),

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
  const [showModalSearch, setShowModalSearch] = useState(false);
  const [showModalRel, setShowModalRel] = useState(false);
  const [reqInModal, setReqInModal] = useState('');
  const [openCollapse, setOpenCollapse] = useState(false);
  const inputRef = useRef();

  const handleCancelModal = () => {
    setShowModalRel(false);
    setShowModalSearch(false);
  };

  const handleCloseModalRel = () => {
    setShowModalRel(false);
  };

  const handleCloseModalSearch = () => setShowModalSearch(false);

  const handleShowModalRel = (reqIn) => {
    setReqInModal(reqIn);
    setShowModalRel(true);
  };

  const handleShowModalSearch = () => setShowModalSearch(true);

  const initialSchema = () => {
    setSchema(
      yup.object().shape({
        reqMaintenance: yup
          .string()
          .matches(/^[0-9]{1,5}$|^[0-9]+[/]{1}[0-9]{4}$/, 'Entrada inválida'),
        authorizedBy: yup.object().required('Requerido'),
        isAuthorizer: yup.boolean(),
        workerId: yup.object().when(['isAuthorizer'], {
          is: false,
          then: (validate) => validate.required('Requerido'),
          otherwise: (validate) => validate.notRequired(),
        }),

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

  async function getReservesData() {
    try {
      setIsLoading(true);
      const response = await axios.get('/materials/reserve/actives');
      setReserves(response.data);
      setIsLoading(false);
    } catch (err) {
      // eslint-disable-next-line no-unused-expressions
      err.response?.data?.errors
        ? err.response.data.errors.map((error) => toast.error(error)) // errors -> resposta de erro enviada do backend (precisa se conectar com o back)
        : toast.error(err.message); // e.message -> erro formulado no front (é criado pelo front, não precisa de conexão)
      setIsLoading(false);
    }
  }

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

    getReservesData();
    getMaterialsData();
    getUsersData();
    getPropertiesData();
    getWorkersData();
  }, []);

  const handleStore = async (values, resetForm) => {
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
    formattedValues.materialOuttypeId = 1; // SAÍDA PARA USO
    formattedValues.workerId = formattedValues.workerId?.value;
    formattedValues.authorizedBy = formattedValues.authorizedBy?.value;
    formattedValues.reqMaterial = formattedValues.reqMaterial?.value;
    formattedValues.propertyId = formattedValues.propertyId?.value;
    formattedValues.buildingId = formattedValues.buildingId?.value;
    formattedValues.items.forEach((item) => {
      Object.assign(item, { MaterialId: item.materialId }); // rename key
    });

    Object.assign(formattedValues, {
      MaterialOutItems: formattedValues.items,
    });

    formattedValues.value = formattedValues.items.reduce((ac, item) => {
      ac += Number(item.quantity) * Number(item.value);
      return ac;
    }, 0);

    try {
      setIsLoading(true);

      // FAZ A SAÍDA, ATUALIZA O INVENTARIO E JA BLOQUEIA
      await axios.post(`/materials/out/`, formattedValues);

      setIsLoading(false);
      setOpenCollapse(false);
      resetForm();
      initialSchema();
      setInitialValues({
        reqMaintenance: '',
        authorizedBy: '',
        isAuthorizer: false,
        workerId: '',
        propertyId: '',
        place: '',
        buildingId: '',
        reqMaterial: '',
        obs: '',
        items: [],
      });
      getMaterialsData();

      toast.success(`Saída de material realizada com sucesso`);
    } catch (err) {
      // eslint-disable-next-line no-unused-expressions
      err.response?.data?.errors
        ? err.response.data.errors.map((error) => toast.error(error)) // errors -> resposta de erro enviada do backend (precisa se conectar com o back)
        : toast.error(err.message); // e.message -> erro formulado no front (é criado pelo front, não precisa de conexão)

      setIsLoading(false);
    }
  };

  async function getReqMaterialsData(reqMaintenance) {
    try {
      setIsLoading(true);
      const response = await axios.get(`/materials/in/rl/${reqMaintenance}`);
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
    // if (Number(e.target.value) > Number(balance)) {
    //   toast.error('A saída não pode superar o saldo do material');
    //   e.target.value = Number(balance);
    //   handleChange(e);
    //   return;
    // } //LIBERAR POR ENQUANTO QUE NAO TEM O SALDO INICIAL
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
    propertyId: yup.object().required('Requerido'),
  });

  const apllySchema = (addSchema) => {
    const newSchema = schema.concat(addSchema);
    setSchema(newSchema);
  };

  return (
    <>
      <Loading isLoading={isLoading} />
      <Row className="bg-light border rounded d-flex justify-content-center pt-2">
        <Row
          className="px-0 mx-0 py-2 text-center"
          style={{ background: primaryDarkColor, color: 'white' }}
        >
          <span className="fs-5">SAÍDA DE MATERIAL: USO</span>
        </Row>
        <Row className="px-0 pt-2">
          <Formik // FORAM DEFINIFOS 2 FORMULÁRIOS POIS O SEGUNDO SÓ VAI APARECER AOÓS A INSERÇÃO DO PRIMEIRO
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={(values, { resetForm }) => {
              handleStore(values, resetForm);
            }}
            enableReinitialize
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
                <ReleaseItemsModal // modal p/ liberação de materiais
                  handleCancelModal={handleCancelModal}
                  handleClose={handleCloseModalRel}
                  show={showModalRel}
                  setFieldValue={setFieldValue}
                  data={reqInModal}
                />
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
                      onBlur={handleBlur}
                      readOnly={!!openCollapse}
                    />
                    {touched.reqMaintenance && !!errors.reqMaintenance ? (
                      <Badge bg="danger">{errors.reqMaintenance}</Badge>
                    ) : null}
                  </Form.Group>

                  {!openCollapse ? (
                    <Col xs="auto" className="ps-1 pt-4">
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
                        className="mt-2"
                      >
                        <FaPlus />
                      </Button>
                    </Col>
                  ) : null}

                  {!openCollapse ? (
                    <Col xs="auto" className="ps-1 pt-4">
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
                        className="mt-2"
                      >
                        Avulso
                      </Button>
                    </Col>
                  ) : null}

                  <Col xs={12} md={3} lg={2} className="pb-3">
                    {' '}
                    {!!values.reqMaintenance && openCollapse ? (
                      <Form.Group controlId="reqMaterial">
                        <Form.Label>RMs VINCULADAS</Form.Label>
                        <Select
                          inputId="reqMaterial"
                          options={reqRMs.map((reqRM) => ({
                            value: reqRM.req,
                            label: reqRM.req,
                          }))}
                          value={values.reqMaterial}
                          onChange={(selected) => {
                            handleShowModalRel(
                              reqRMs.find(
                                (item) => item.req === selected.value
                              ) ?? []
                            );
                          }}
                          onBlur={handleBlur}
                          placeholder="Selecione a RM"
                          isDisabled={values.items.length > 0}
                        />
                      </Form.Group>
                    ) : null}
                  </Col>

                  <Col className="pb-3">
                    {openCollapse ? (
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
                        />
                        {touched.authorizedBy && !!errors.authorizedBy ? (
                          <Badge bg="danger">{errors.authorizedBy}</Badge>
                        ) : null}
                      </Form.Group>
                    ) : null}
                  </Col>
                </Row>

                <Collapse in={openCollapse}>
                  <Col id="collapse-form">
                    <Row>
                      <Form.Group
                        as={Col}
                        xs={12}
                        md={4}
                        // controlId="workerId"
                        className="pb-3"
                      >
                        <Col className="d-flex align-items-stretch">
                          <Form.Label>RETIRADO POR: (Autorizador </Form.Label>
                          <Form.Check
                            name="isAuthorizer"
                            type="checkbox"
                            id="isAuthorizer"
                            label=")"
                            onChange={(e) => {
                              handleChange(e);
                              setFieldValue('workerId', '');
                            }}
                            className="mx-2 pb-2"
                            checked={values.isAuthorizer}
                          />
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
                          isDisabled={values.isAuthorizer}
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
                          onChange={handleChange}
                          isInvalid={touched.place && !!errors.place}
                          // isValid={touched.place && !errors.place}
                          onBlur={(e) => {
                            setFieldValue(
                              'place',
                              e.target.value.toUpperCase()
                            ); // UPPERCASE
                            handleBlur(e);
                          }}
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
                      <Row>
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
                          />
                          {touched.propertyId && !!errors.propertyId ? (
                            <Badge bg="danger">{errors.propertyId}</Badge>
                          ) : null}
                        </Form.Group>
                      </Row>
                    ) : null}
                    {!values.reqMaintenance && openCollapse ? (
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
                          />
                        </Form.Group>
                      </Row>
                    ) : null}

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
                    <FieldArray name="items">
                      {(fieldArrayProps) => {
                        const { remove, push } = fieldArrayProps;
                        return (
                          <Row style={{ background: body2Color }}>
                            <SearchModal // modal p/ pesquisa de materiais
                              handleClose={handleCloseModalSearch}
                              show={showModalSearch}
                              push={push}
                              hiddenItems={values.items?.map(
                                (item) => item.materialId
                              )}
                              inventoryData={inventoryData}
                            />

                            {values.items?.length > 0 &&
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
                                      controlId={`items[${index}].balancedQuantity`}
                                      className="d-none"
                                    >
                                      <Form.Control
                                        type="number"
                                        plaintext
                                        value={item.balancedQuantity}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="SALDO"
                                        size="sm"
                                        className="p-0 m-0 ps-2"
                                      />
                                    </Form.Group>
                                    <Form.Group
                                      as={Col}
                                      xs={12}
                                      sm={4}
                                      md={1}
                                      controlId={`items[${index}].value`}
                                      className="d-none"
                                    >
                                      <Form.Control
                                        type="number"
                                        plaintext
                                        value={item.value}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="VALOR"
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
                                      style={{ width: '70px' }}
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
                                            item.balancedQuantity,
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
                        {touched.items && typeof errors.items === 'string' ? (
                          <Badge bg="danger">{errors.items}</Badge>
                        ) : touched.items && errors.items ? (
                          <Badge bg="danger">
                            A quantidade de item não pode ser 0.
                          </Badge>
                        ) : null}
                      </Col>
                    </Row>
                    <Row>
                      <Col xs="auto" className="text-center py-2">
                        <Button
                          variant="outline-secondary"
                          onClick={() => {
                            handleShowModalSearch();
                            setFieldTouched('items');
                          }}
                        >
                          <FaSearch /> Pesquisar no saldo comum
                        </Button>
                      </Col>
                    </Row>
                    <hr />

                    <Row className="justify-content-center">
                      <Col xs="auto" className="text-center pt-2 pb-4">
                        <Button
                          type="reset"
                          variant="warning"
                          onClick={() => {
                            resetForm();
                            initialSchema();
                            setInitialValues({
                              reqMaintenance: '',
                              authorizedBy: '',
                              isAuthorizer: false,
                              workerId: '',
                              propertyId: '',
                              place: '',
                              buildingId: '',
                              reqMaterial: '',
                              obs: '',
                              items: [],
                            });
                            setOpenCollapse(false);
                          }}
                        >
                          Limpar
                        </Button>
                      </Col>
                      <Col xs="auto" className="text-center pt-2 pb-4">
                        <Button
                          variant="success"
                          onClick={(e) => {
                            submitForm(e);
                            setFieldTouched('propertyId'); // tive que "tocar" a força, por algum motivo nao ta disparando o touch no propertyId quando submit
                          }}
                        >
                          Confirmar saída
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Collapse>
              </Form>
            )}
          </Formik>
        </Row>
      </Row>

      <Row className="bg-light border rounded d-flex justify-content-center py-2 mt-4">
        <Accordion defaultActiveKey="0">
          <CustomToggle eventKey="1">
            Reservas <Badge bg="secondary">{reserves.length}</Badge>
            <span className="visually-hidden">número de reservas</span>
          </CustomToggle>
          <Button
            onClick={() => getReservesData()}
            variant="outline-success"
            // size="sm"
            className="ms-1 border-0"
          >
            <FaSync size={18} />
          </Button>

          <Accordion.Collapse eventKey="1">
            <Card.Body>
              <ListReserves
                reserves={reserves}
                getReservesData={getReservesData}
                userId={userId}
                setInitialValues={setInitialValues}
                setOpenCollapse={setOpenCollapse}
              />
            </Card.Body>
          </Accordion.Collapse>
        </Accordion>
      </Row>
    </>
  );
}
