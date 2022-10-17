/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaTrashAlt, FaSearch } from 'react-icons/fa';
import { Button, Row, Col, Form, Badge } from 'react-bootstrap';
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

export default function Index() {
  const userId = useSelector((state) => state.auth.user.id);
  const [inventoryData, setinventoryData] = useState([]);
  const [providers, setProviders] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModalSearch, setShowModalSearch] = useState(false);
  const inputRef = useRef();

  const handleCloseModalSearch = () => setShowModalSearch(false);

  const handleShowModalSearch = () => setShowModalSearch(true);

  const schema = yup.object().shape({
    registerDate: yup
      .date()
      .max(
        new Date().toISOString().split('T')[0],
        'Escolha uma data passada para o pleito'
      ),
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

  useEffect(() => {
    // Focus on inputRef
    if (inputRef.current) {
      inputRef.current.focus();
    }

    async function getMaterialsData() {
      try {
        setIsLoading(true);
        const response = await axios.get('/materials/');
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

    async function getProvidersData() {
      try {
        setIsLoading(true);
        const response = await axios.get('/providers/');
        setProviders(response.data);
        setIsLoading(false);
      } catch (err) {
        // eslint-disable-next-line no-unused-expressions
        err.response?.data?.errors
          ? err.response.data.errors.map((error) => toast.error(error)) // errors -> resposta de erro enviada do backend (precisa se conectar com o back)
          : toast.error(err.message); // e.message -> erro formulado no front (é criado pelo front, não precisa de conexão)
        setIsLoading(false);
      }
    }

    async function getUnidadesData() {
      try {
        setIsLoading(true);
        const response = await axios.get('/unidades/');
        setUnidades(response.data);
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
    getProvidersData();
    getUnidadesData();
    getUsersData();
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

    formattedValues.materialIntypeId = 5;
    formattedValues.userId = userId;
    formattedValues.providerId = formattedValues.providerId?.value;
    formattedValues.costUnit = formattedValues.costUnit?.value;
    formattedValues.requiredBy = formattedValues.requiredBy?.value;
    formattedValues.MaterialInItems.forEach((item) => {
      Object.assign(item, { MaterialId: item.materialId }); // rename key
    });

    formattedValues.value = formattedValues.MaterialInItems.reduce(
      (ac, item) => {
        ac += Number(item.quantity) * Number(item.value);
        return ac;
      },
      0
    );

    try {
      setIsLoading(true);

      console.log(formattedValues);
      await axios.post(`/materials/in/general`, formattedValues);

      setIsLoading(false);
      resetForm();

      toast.success(`Entrada de material realizada com sucesso`);
    } catch (err) {
      // eslint-disable-next-line no-unused-expressions
      console.log(err);
      err.response?.data?.errors
        ? err.response.data.errors.map((error) => toast.error(error)) // errors -> resposta de erro enviada do backend (precisa se conectar com o back)
        : toast.error(err.message); // e.message -> erro formulado no front (é criado pelo front, não precisa de conexão)

      setIsLoading(false);
    }
  };

  const initialValues = {
    providerId: '',
    costUnit: '',
    requiredBy: '',
    registerDate: '',
    obs: '',
    MaterialInItems: [],
  };
  return (
    <>
      <Loading isLoading={isLoading} />
      <Row className="bg-light border rounded d-flex justify-content-center pt-2">
        <Row
          className="px-0 mx-0 py-2 text-center"
          style={{ background: primaryDarkColor, color: 'white' }}
        >
          <span className="fs-5">ENTRADA DE MATERIAL: DOAÇÃO</span>
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
                <Row>
                  <Form.Group as={Col} xs={12} md={6} className="pb-3">
                    <Form.Label>EMPRESA DOADORA:</Form.Label>
                    <Select
                      inputId="providerId"
                      options={providers.map((provider) => ({
                        value: provider.id,
                        label: provider.nomeFantasia,
                      }))}
                      value={values.providerId}
                      onChange={(selected) => {
                        setFieldValue('providerId', selected);
                      }}
                      placeholder="Selecione o fornecedor"
                      onBlur={handleBlur}
                    />
                    {touched.providerId && !!errors.providerId ? (
                      <Badge bg="danger">{errors.providerId}</Badge>
                    ) : null}
                  </Form.Group>
                  <Form.Group as={Col} xs={12} md={6} className="pb-3">
                    <Form.Label>UNIDADE DOADORA:</Form.Label>
                    <Select
                      inputId="costUnit"
                      options={unidades.map((unidade) => ({
                        value: unidade.id,
                        label: `${unidade.id} - ${unidade.nomeUnidade}`,
                      }))}
                      value={values.costUnit}
                      onChange={(selected) => {
                        setFieldValue('costUnit', selected);
                      }}
                      placeholder="Selecione o fornecedor"
                      onBlur={handleBlur}
                    />
                    {touched.costUnit && !!errors.costUnit ? (
                      <Badge bg="danger">{errors.costUnit}</Badge>
                    ) : null}
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group
                    as={Col}
                    xs={12}
                    md={3}
                    lg={2}
                    className="pb-3"
                    controlId="registerDate"
                  >
                    <Form.Label>DATA PLEITO:</Form.Label>
                    <Form.Control
                      type="date"
                      value={values.registerDate}
                      onChange={handleChange}
                      // isInvalid={touched.registerDate && !!errors.registerDate}
                      // isValid={touched.place && !errors.place}
                      onBlur={handleBlur}
                      placeholder="Escolha a data"
                    />
                    {touched.registerDate && !!errors.registerDate ? (
                      <Badge bg="danger">{errors.registerDate}</Badge>
                    ) : null}
                  </Form.Group>

                  <Form.Group as={Col} xs={12} md={9} lg={10} className="pb-3">
                    <Form.Label>PLEITEADO POR:</Form.Label>
                    <Select
                      inputId="requiredBy"
                      options={users.map((user) => ({
                        value: user.username,
                        label: user.name,
                      }))}
                      value={values.requiredBy}
                      onChange={(selected) => {
                        setFieldValue('requiredBy', selected);
                      }}
                      placeholder="Selecione o requerinte"
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
                      onChange={(e) => {
                        setFieldValue('obs', e.target.value.toUpperCase()); // UPPERCASE
                      }}
                      isInvalid={touched.obs && !!errors.obs}
                      // isValid={touched.obs && !errors.obs}
                      placeholder="Conferente | Entrega parcial? | Placa de carro | Nome de motorista"
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
                <FieldArray name="MaterialInItems">
                  {(fieldArrayProps) => {
                    const { remove, push } = fieldArrayProps;
                    return (
                      <Row style={{ background: body2Color }}>
                        <SearchModal // modal p/ pesquisa de materiais
                          handleClose={handleCloseModalSearch}
                          show={showModalSearch}
                          push={push}
                          hiddenItems={values.MaterialInItems.map(
                            (item) => item.materialId
                          )}
                          inventoryData={inventoryData}
                        />

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
                                  controlId={`MaterialInItems[${index}].unit`}
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
                                  controlId={`MaterialInItems[${index}].quantity`}
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
                                    onChange={handleChange}
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
                    {touched.MaterialInItems &&
                    typeof errors.MaterialInItems === 'string' ? (
                      <Badge bg="danger">{errors.MaterialInItems}</Badge>
                    ) : touched.MaterialInItems && errors.MaterialInItems ? (
                      <Badge bg="danger">
                        A quantidade/preço do item não pode ser 0.
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
                        setFieldTouched('MaterialInItems');
                      }}
                    >
                      <FaSearch /> Pesquisar no cadastro
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
                      }}
                    >
                      Limpar
                    </Button>
                  </Col>
                  <Col xs="auto" className="text-center pt-2 pb-4">
                    <Button variant="success" onClick={submitForm}>
                      Confirmar recebimento
                    </Button>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </Row>
        <tableExample />
      </Row>
    </>
  );
}
