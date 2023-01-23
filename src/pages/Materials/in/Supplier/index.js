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
import PreviewMultipleImages from '../../../../components/PreviewMultipleImages';

import SearchModal from './components/SearchModal';

const filterOptions = (row, filterValue) => {
  const arrayFilter = String(filterValue).split(' ');

  return arrayFilter.reduce((res, cur) => {
    // res -> response; cur -> currency (atual)
    res =
      res &&
      String(row.label).toLowerCase().includes(String(cur).toLowerCase());
    return res;
  }, true);
};

export default function Index() {
  const userId = useSelector((state) => state.auth.user.id);
  const [inventoryData, setinventoryData] = useState([]);
  const [providers, setProviders] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModalSearch, setShowModalSearch] = useState(false);
  const [files, setFiles] = useState([]);
  const inputRef = useRef();

  const handleCloseModalSearch = () => setShowModalSearch(false);

  const handleShowModalSearch = () => setShowModalSearch(true);

  const handlePushItem = (push, row, list) => {
    // não incluir repetido na lista
    // console.log(row);
    // console.log(list);
    if (list.length > 0) {
      let exists = false;

      list.every((item) => {
        if (item.materialId === row.value.id) {
          exists = true;
          return false;
        }
        return true;
      });

      if (exists) {
        toast.error('Item já incluído na lista de reserva');
        return;
      }
    }

    // adicionar na lista de saída
    push({
      materialId: row.value.id,
      name: row.value.name,
      unit: row.value.unit,
      value: '',
      quantity: row.value.quantity ?? '',
    });
  };

  const schema = yup.object().shape({
    req: yup
      .string()
      .matches(/^[0-9]{1,5}$|^[0-9]+[/]{1}[0-9]{4}$/, 'Entrada inválida'),
    invoice: yup.number().typeError('Digite apenas números'),
    registerDate: yup
      .date()
      .max(
        new Date().toISOString().split('T')[0],
        'Escolha uma data passada para empenho'
      ),
    providerId: yup.object().required('Requerido'),
    obs: yup.string(),
    // eslint-disable-next-line react/forbid-prop-types
    MaterialInItems: yup
      .array()
      .of(
        yup.object().shape({
          quantity: yup.number().required('Requerido').positive(),
          value: yup.number().required('Requerido').positive(),
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
    getUsersData();
  }, []);

  const formatReq = (req) => {
    if (!req) return;
    const currentYear = new Date().getFullYear();
    return req.includes('/') ? req : `${req}/${currentYear}`;
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
      ...Object.fromEntries(
        Object.entries(values).filter(([_, v]) => v != null)
      ),
    }; // LIMPANDO CHAVES NULL E UNDEFINED

    Object.keys(formattedValues).forEach((key) => {
      if (formattedValues[key] === '') {
        delete formattedValues[key];
      }
    }); // LIMPANDO CHAVES `EMPTY STRINGS`

    formattedValues.materialIntypeId = 4;
    formattedValues.userId = userId;
    formattedValues.providerId = formattedValues.providerId?.value;
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

    let formData;
    if (files.length > 0) {
      formData = toFormData(formattedValues);
      // eslint-disable-next-line no-restricted-syntax
      for (const file of files) {
        formData.append('photos', file.file);
      }
    }

    try {
      setIsLoading(true);

      if (files.length > 0) {
        await axios.post(`/materials/in/general`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        // for (const pair of formData.entries()) {
        //   console.log(`${pair[0]} - ${pair[1]}`);
        // }
      } else {
        console.log(formattedValues);
        await axios.post(`/materials/in/general`, formattedValues);
      }

      setIsLoading(false);
      setFiles([]);
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
    req: '',
    invoice: '',
    providerId: '',
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
          <span className="fs-5">ENTRADA DE MATERIAL: FORNECIMENTO DIRETO</span>
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
                  <Form.Group
                    as={Col}
                    xs={5}
                    sm={5}
                    md={3}
                    lg={2}
                    controlId="req"
                    className="pb-3"
                  >
                    <Form.Label>RM PR/CT</Form.Label>
                    <Form.Control
                      type="tel"
                      value={values.req}
                      onChange={handleChange}
                      autoFocus
                      ref={inputRef}
                      placeholder="Nº Requisição"
                      onBlur={(e) => {
                        setFieldValue('req', formatReq(e.target.value));
                        handleBlur(e);
                      }}
                    />
                    {touched.req && !!errors.req ? (
                      <Badge bg="danger">{errors.req}</Badge>
                    ) : null}
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    xs={5}
                    sm={5}
                    md={3}
                    lg={2}
                    controlId="invoice"
                    className="pb-3"
                  >
                    <Form.Label>NOTA FISCAL</Form.Label>
                    <Form.Control
                      type="tel"
                      value={values.invoice}
                      onChange={handleChange}
                      placeholder="Nº Nota Fiscal"
                      onBlur={handleBlur}
                    />
                    {touched.invoice && !!errors.invoice ? (
                      <Badge bg="danger">{errors.invoice}</Badge>
                    ) : null}
                  </Form.Group>
                  <Form.Group as={Col} xs={12} md={6} lg={8} className="pb-3">
                    <Form.Label>FORNECEDOR:</Form.Label>
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
                    <Form.Label>DATA EMPENHO:</Form.Label>
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
                    <Form.Label>PEDIDO POR:</Form.Label>
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
                      onChange={handleChange}
                      isInvalid={touched.obs && !!errors.obs}
                      // isValid={touched.obs && !errors.obs}
                      placeholder="Conferente | Entrega parcial? | Placa de carro | Nome de motorista"
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
                    const { remove, push } = fieldArrayProps;
                    return (
                      <>
                        <Row className="d-flex align-items-center pt-1 pb-1 mb-2 bg-white border-bottom">
                          <Col sm="12" md="auto">
                            PESQUISA RÁPIDA:
                          </Col>
                          <Col>
                            {' '}
                            <Select
                              inputId="searchMaterial"
                              options={inventoryData.map((material) => ({
                                value: material,
                                label: `(${material.id}) ${material.name} - ${material.unit}`,
                              }))}
                              value={values.searchMaterial}
                              onChange={(selected, action) => {
                                handlePushItem(
                                  push,
                                  selected,
                                  values.MaterialInItems
                                );
                                setFieldValue('searchMaterial', '');
                              }}
                              placeholder="Selecione o material"
                              onBlur={() => setFieldValue('searchMaterial', '')}
                              escapeClearsValue
                              filterOption={filterOptions}
                            />
                          </Col>
                        </Row>
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
                                <Row className="d-block d-lg-none">
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
                                    lg={2}
                                    controlId={`MaterialInItems[${index}].materialId`}
                                    className="border-0 m-0 p-0"
                                  >
                                    {index === 0 ? (
                                      <Form.Label className="d-flex ps-2 py-1 border-bottom d-none d-sm-none d-md-none d-lg-block">
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
                                      tabindex="-1"
                                    />
                                  </Form.Group>
                                  <Form.Group
                                    as={Col}
                                    controlId={`MaterialInItems[${index}].name`}
                                    className="border-0 m-0 p-0"
                                  >
                                    {index === 0 ? (
                                      <Form.Label className="d-flex ps-2 py-1 border-bottom d-none d-lg-block">
                                        DESCRIÇÃO
                                      </Form.Label>
                                    ) : null}
                                    <div className="px-2">{item.name}</div>
                                  </Form.Group>
                                  <Form.Group
                                    as={Col}
                                    xs={12}
                                    lg={1}
                                    controlId={`MaterialInItems[${index}].unit`}
                                    className="border-0 m-0 p-0"
                                  >
                                    {index === 0 ? (
                                      <Form.Label className="d-flex ps-2 py-1 border-bottom d-none d-lg-block">
                                        UND
                                      </Form.Label>
                                    ) : null}
                                    <div className="px-2">{item.unit}</div>
                                  </Form.Group>

                                  <Col
                                    xs={12}
                                    lg="auto"
                                    className="d-flex justify-content-between"
                                  >
                                    <Col xs="10" sm="auto" className="d-flex">
                                      <Form.Group
                                        as={Col}
                                        xs="auto"
                                        controlId={`MaterialInItems[${index}].value`}
                                        className="border-0 m-0 p-0"
                                      >
                                        {index === 0 ? (
                                          <Form.Label className="d-flex ps-2 py-1 border-bottom d-none d-lg-block text-center">
                                            PREÇO
                                          </Form.Label>
                                        ) : null}
                                        <Form.Control
                                          type="number"
                                          step=".01"
                                          plaintext
                                          value={item.value}
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          placeholder="PREÇO"
                                          size="sm"
                                          className="p-0 m-0 ps-2 text-end"
                                          style={{ width: '100px' }}
                                        />
                                      </Form.Group>
                                      <Form.Group
                                        as={Col}
                                        xs="auto"
                                        controlId={`MaterialInItems[${index}].quantity`}
                                        className="border-0 m-0 p-0"
                                        style={{ width: '100px' }}
                                      >
                                        {index === 0 ? (
                                          <Form.Label className="d-flex ps-2 py-1 border-bottom d-none d-lg-block text-center">
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
                                          step="any"
                                        />
                                      </Form.Group>
                                    </Col>
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
                                              className="d-none d-lg-block"
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
                                            tabindex="-1"
                                          >
                                            <FaTrashAlt size={18} />
                                          </Button>
                                        </Col>
                                      </Row>
                                    </Col>
                                  </Col>
                                </Row>
                              </>
                            ))}
                        </Row>
                      </>
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

                <Row
                  className="text-center mt-3"
                  style={{ background: primaryDarkColor, color: 'white' }}
                >
                  <span className="fs-6">REGISTROS FOTOGRÁFICOS</span>
                </Row>

                <Row>
                  <PreviewMultipleImages files={files} setFiles={setFiles} />
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
