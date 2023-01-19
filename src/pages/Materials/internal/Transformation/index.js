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

const formatGroupLabel = (data) => (
  <Col className="d-flex justify-content-between">
    <span>{data.label}</span>
    <Badge bg="secondary">{data.options.length}</Badge>
  </Col>
);

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
  const [unidades, setUnidades] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef();

  const handlePushItem = (push, row, list) => {
    // não incluir repetido na lista
    // console.log(row);
    // console.log(list);
    if (list.length > 0) {
      let exists = false;

      list.every((item) => {
        if (item.materialId === row.value.materialId) {
          exists = true;
          return false;
        }
        return true;
      });

      if (exists) {
        toast.error('Item já incluído');
        return;
      }
    }

    // adicionar na lista de saída
    push({
      materialId: row.value.materialId,
      name: row.value.name,
      unit: row.value.unit,
      balancedQuantity: row.value.freeInventory,
      value: row.value.value
        .replace(/\./g, '')
        .replace(/,/g, '.')
        .replace(/[^0-9\.]+/g, ''),
      quantity: row.value.quantity ?? '',
    });
  };

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
        const response = await axios.get('/materials/inventory');
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

    getMaterialsData();
  }, []);

  const handleQuantityChange = (e, balance, handleChange) => {
    // if (Number(e.target.value) > Number(balance)) {
    //   toast.error('A reserva não pode superar o saldo do material');
    //   e.target.value = Number(balance);
    //   handleChange(e);
    //   return;
    // } //LIBERAR POR ENQUANTO QUE NAO TEM O SALDO INICIAL
    if (e.target.value < 0) {
      toast.error('A reserva não pode ser negativa');
      e.target.value = 0;
      handleChange(e);
      return;
    }
    handleChange(e);
  };

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
    MaterialOutItems: [],
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
          <span className="fs-5">TRANSFORMACÃO DE MATERIAL</span>
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
                <Row className="my-4">
                  <Col xs={6}>
                    <Col
                      className="text-center"
                      style={{ background: primaryDarkColor, color: 'white' }}
                    >
                      <span className="fs-6">SITUAÇÃO INICIAL</span>
                    </Col>
                    <FieldArray name="MaterialInItems">
                      {(fieldArrayProps) => {
                        const { remove, push } = fieldArrayProps;
                        return (
                          <>
                            <div className="d-flex align-items-center pt-1 pb-1 mb-2 bg-white border-bottom">
                              <Col>
                                {' '}
                                {values.MaterialInItems.length ? null : (
                                  <Select
                                    inputId="searchMaterial"
                                    options={inventoryData.map((material) => ({
                                      value: material,
                                      label: `(${material.materialId}) ${material.name}`,
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
                                    onBlur={() =>
                                      setFieldValue('searchMaterial', '')
                                    }
                                    escapeClearsValue
                                    filterOption={filterOptions}
                                  />
                                )}
                              </Col>
                            </div>
                            <div style={{ background: body2Color }}>
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
                                      <Form.Group
                                        as={Col}
                                        xs={12}
                                        lg={1}
                                        controlId={`MaterialInItems[${index}].balancedQuantity`}
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
                                          tabindex="-1"
                                        />
                                      </Form.Group>
                                      <Form.Group
                                        as={Col}
                                        xs={12}
                                        lg={1}
                                        controlId={`MaterialInItems[${index}].value`}
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
                                          tabindex="-1"
                                        />
                                      </Form.Group>
                                      <Col
                                        xs={12}
                                        lg={2}
                                        className="d-flex justify-content-between"
                                      >
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
                                            <Form.Label className="d-flex ps-2 py-1 border-bottom d-none d-lg-block text-center">
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
                            </div>
                          </>
                        );
                      }}
                    </FieldArray>
                    <Row className="pt-4">
                      <Col xs="auto">
                        {touched.MaterialInItems &&
                        typeof errors.MaterialInItems === 'string' ? (
                          <Badge bg="danger">{errors.MaterialInItems}</Badge>
                        ) : touched.MaterialInItems &&
                          errors.MaterialInItems ? (
                          <Badge bg="danger">
                            A quantidade/preço do item não pode ser 0.
                          </Badge>
                        ) : null}
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={6}>
                    <Col
                      className="text-center"
                      style={{ background: primaryDarkColor, color: 'white' }}
                    >
                      <span className="fs-6">SITUAÇÃO FINAL</span>
                    </Col>
                    <FieldArray name="MaterialInItems">
                      {(fieldArrayProps) => {
                        const { remove, push } = fieldArrayProps;
                        return (
                          <>
                            <div className="d-flex align-items-center pt-1 pb-1 mb-2 bg-white border-bottom">
                              <Col>
                                <Select
                                  inputId="searchMaterial"
                                  options={inventoryData.map((material) => ({
                                    value: material,
                                    label: `(${material.materialId}) ${material.name}`,
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
                                  onBlur={() =>
                                    setFieldValue('searchMaterial', '')
                                  }
                                  escapeClearsValue
                                  filterOption={filterOptions}
                                />
                              </Col>
                            </div>
                            <div style={{ background: body2Color }}>
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
                                      <Form.Group
                                        as={Col}
                                        xs={12}
                                        lg={1}
                                        controlId={`MaterialInItems[${index}].balancedQuantity`}
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
                                          tabindex="-1"
                                        />
                                      </Form.Group>
                                      <Form.Group
                                        as={Col}
                                        xs={12}
                                        lg={1}
                                        controlId={`MaterialInItems[${index}].value`}
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
                                          tabindex="-1"
                                        />
                                      </Form.Group>
                                      <Col
                                        xs={12}
                                        lg={2}
                                        className="d-flex justify-content-between"
                                      >
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
                                            <Form.Label className="d-flex ps-2 py-1 border-bottom d-none d-lg-block text-center">
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
                            </div>
                          </>
                        );
                      }}
                    </FieldArray>
                    <Row className="pt-4">
                      <Col xs="auto">
                        {touched.MaterialInItems &&
                        typeof errors.MaterialInItems === 'string' ? (
                          <Badge bg="danger">{errors.MaterialInItems}</Badge>
                        ) : touched.MaterialInItems &&
                          errors.MaterialInItems ? (
                          <Badge bg="danger">
                            A quantidade/preço do item não pode ser 0.
                          </Badge>
                        ) : null}
                      </Col>
                    </Row>
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
                      Confirmar transformação
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
