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
      freeInventory: row.value.freeInventory,
      reserveInventory: row.value.reserveInventory,
      restrictInventory: row.value.restrictInventory,
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
      .min(1, 'Escolha o material a ser transformado na situação inicial'),
    MaterialOutItems: yup
      .array()
      .of(
        yup.object().shape({
          quantity: yup.number().required('Requerido').positive(),
        })
      )
      .required()
      .min(1, 'Escolha o material a ser transformado na situação final'),
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
    if (Number(e.target.value) > Number(balance)) {
      toast.error('A quantidade não pode superar o saldo comum do material');
      e.target.value = Number(balance);
      handleChange(e);
      return;
    } // LIBERAR POR ENQUANTO QUE NAO TEM O SALDO INICIAL
    if (e.target.value < 0) {
      toast.error('A quantidade não pode ser negativa');
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

    formattedValues.userId = userId;

    // DEFININDO ENTRADA DE MATERIAL
    formattedValues.materialIntypeId = 7;
    formattedValues.MaterialInItems.forEach((item) => {
      Object.assign(item, { MaterialId: item.materialId }); // rename key
    });

    // DEFININDO SAÍDA DE MATERIAL
    formattedValues.materialOuttypeId = 9; // SAÍDA PARA USO

    formattedValues.MaterialOutItems.forEach((item) => {
      Object.assign(item, { MaterialId: item.materialId }); // rename key
    });

    // valor de entrada e saída deve ser o mesmo, afinal é uma operação interna
    formattedValues.value = formattedValues.MaterialOutItems.reduce(
      (ac, item) => {
        ac += Number(item.quantity) * Number(item.value);
        return ac;
      },
      0
    );

    try {
      setIsLoading(true);

      // SAÍDA
      const resultOut = await axios.post(`/materials/out/`, formattedValues);

      console.log(resultOut);

      formattedValues.returnId = resultOut.data.id;

      // ENTRADA
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
                  <Col xs={12} lg={6}>
                    <Col
                      className="text-center"
                      style={{ background: primaryDarkColor, color: 'white' }}
                    >
                      <span className="fs-6">SITUAÇÃO INICIAL</span>
                    </Col>
                    <FieldArray name="MaterialOutItems">
                      {(fieldArrayProps) => {
                        const { remove, push } = fieldArrayProps;
                        return (
                          <>
                            <div className="d-flex align-items-center pt-1 pb-1 mb-2 bg-white border-bottom">
                              <Col>
                                {' '}
                                {values.MaterialOutItems.length ? null : (
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
                                        values.MaterialOutItems
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
                              {values.MaterialOutItems.length > 0 &&
                                values.MaterialOutItems.map((item, index) => (
                                  <div
                                    key={index}
                                    className="my-3 p-4 border"
                                    // style={{ background: '#E9EFFA' }}
                                  >
                                    {/* <Row>
                                      <Col className="fs-5 text-center">
                                        <Badge bg="info" text="white">
                                          Nº {index + 1}
                                        </Badge>
                                      </Col>
                                    </Row> */}

                                    <div key={index}>
                                      <Row className="d-flex justify-content-center align-items-center mb-5">
                                        <Form.Group
                                          as={Col}
                                          xs={12}
                                          lg={4}
                                          controlId={`MaterialOutItems[${index}].quantity`}
                                        >
                                          <Form.Label className="fs-4">
                                            TRANSFORMAR
                                          </Form.Label>

                                          <Form.Control
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) =>
                                              handleQuantityChange(
                                                e,
                                                item.freeInventory,
                                                handleChange
                                              )
                                            }
                                            onBlur={handleBlur}
                                            placeholder="QTD"
                                            size="sm"
                                            step="any"
                                            className="fs-2"
                                          />
                                        </Form.Group>
                                      </Row>
                                      <Row className="d-flex justify-content-start align-items-center mt-2">
                                        <Form.Group
                                          as={Col}
                                          xs={6}
                                          lg={4}
                                          className="pb-3"
                                          controlId={`MaterialOutItems[${index}].materialId`}
                                        >
                                          <Form.Label>CODIGO</Form.Label>

                                          <Form.Control
                                            type="text"
                                            readOnly
                                            value={item.materialId}
                                            onChange={handleChange}
                                            placeholder="Selecione o ID material"
                                            onBlur={handleBlur}
                                            size="sm"
                                            tabindex="-1"
                                          />
                                        </Form.Group>
                                        <Form.Group
                                          as={Col}
                                          xs={12}
                                          lg={4}
                                          controlId={`MaterialOutItems[${index}].unit`}
                                          className="pb-3"
                                        >
                                          <Form.Label>UNIDADE</Form.Label>

                                          <Form.Control
                                            type="text"
                                            readOnly
                                            value={item.unit}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            size="sm"
                                            tabindex="-1"
                                          />
                                        </Form.Group>
                                      </Row>
                                      <Row className="d-flex justify-content-center align-items-center">
                                        <Form.Group
                                          as={Col}
                                          xs={12}
                                          controlId={`MaterialOutItems[${index}].name`}
                                          className="pb-3"
                                        >
                                          <Form.Label>DESCRIÇÃO</Form.Label>

                                          <Form.Control
                                            type="text"
                                            readOnly
                                            value={item.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            size="sm"
                                            tabindex="-1"
                                          />
                                        </Form.Group>
                                      </Row>
                                      <Row className="d-flex justify-content-center align-items-center">
                                        <Form.Group
                                          as={Col}
                                          xs={12}
                                          lg={3}
                                          controlId={`MaterialOutItems[${index}].value`}
                                          className="pb-3"
                                        >
                                          <Form.Label>PREÇO R$</Form.Label>

                                          <Form.Control
                                            type="text"
                                            readOnly
                                            value={item.value}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            size="sm"
                                            tabindex="-1"
                                          />
                                        </Form.Group>

                                        <Form.Group
                                          as={Col}
                                          xs={12}
                                          lg={3}
                                          controlId={`MaterialOutItems[${index}].freeInventory`}
                                          className="pb-3"
                                        >
                                          <Form.Label>SALDO COMUM</Form.Label>
                                          <Form.Control
                                            type="number"
                                            readOnly
                                            value={item.freeInventory}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="SALDO"
                                            size="sm"
                                            tabindex="-1"
                                          />
                                        </Form.Group>
                                        <Form.Group
                                          as={Col}
                                          xs={12}
                                          lg={3}
                                          controlId={`MaterialOutItems[${index}].reserveInventory`}
                                          className="pb-3"
                                        >
                                          <Form.Label>SD RESERVADO</Form.Label>
                                          <Form.Control
                                            type="number"
                                            readOnly
                                            value={item.reserveInventory}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="SALDO"
                                            size="sm"
                                            tabindex="-1"
                                          />
                                        </Form.Group>
                                        <Form.Group
                                          as={Col}
                                          xs={12}
                                          lg={3}
                                          controlId={`MaterialOutItems[${index}].restrictInventory`}
                                          className="pb-3"
                                        >
                                          <Form.Label>SD RESTRITO</Form.Label>
                                          <Form.Control
                                            type="number"
                                            readOnly
                                            value={item.restrictInventory}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="SALDO"
                                            size="sm"
                                            tabindex="-1"
                                          />
                                        </Form.Group>
                                      </Row>
                                      <Row className="d-flex justify-content-center align-items-center" />
                                      <Row className="d-flex justify-content-center align-items-center">
                                        <Form.Group
                                          as={Col}
                                          xs={12}
                                          lg={1}
                                          controlId={`MaterialOutItems[${index}].value`}
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
                                      </Row>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </>
                        );
                      }}
                    </FieldArray>
                    <Row className="pt-4">
                      <Col xs="auto">
                        {touched.MaterialOutItems &&
                        typeof errors.MaterialOutItems === 'string' ? (
                          <Badge bg="danger">{errors.MaterialOutItems}</Badge>
                        ) : touched.MaterialOutItems &&
                          errors.MaterialOutItems ? (
                          <Badge bg="danger">
                            A quantidade/preço do item não pode ser igual ou
                            infeior a 0
                          </Badge>
                        ) : null}
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={12} lg={6}>
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
                                  <div
                                    key={index}
                                    className="my-3 p-4 border"
                                    // style={{ background: '#E9EFFA' }}
                                  >
                                    {/* <Row>
                                      <Col className="fs-5 text-center">
                                        <Badge bg="info" text="white">
                                          Nº {index + 1}
                                        </Badge>
                                      </Col>
                                    </Row> */}

                                    <div key={index}>
                                      <Row className="d-flex justify-content-center align-items-center mb-5">
                                        <Form.Group
                                          as={Col}
                                          xs={12}
                                          lg={4}
                                          controlId={`MaterialInItems[${index}].quantity`}
                                        >
                                          <Form.Label className="fs-4">
                                            EM
                                          </Form.Label>

                                          <Form.Control
                                            type="number"
                                            value={item.quantity}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="QTD"
                                            size="sm"
                                            step="any"
                                            className="fs-2"
                                          />
                                        </Form.Group>
                                      </Row>
                                      <Row className="d-flex justify-content-start align-items-center mt-2">
                                        <Form.Group
                                          as={Col}
                                          xs={6}
                                          lg={4}
                                          className="pb-3"
                                          controlId={`MaterialInItems[${index}].materialId`}
                                        >
                                          <Form.Label>CODIGO</Form.Label>

                                          <Form.Control
                                            type="text"
                                            readOnly
                                            value={item.materialId}
                                            onChange={handleChange}
                                            placeholder="Selecione o ID material"
                                            onBlur={handleBlur}
                                            size="sm"
                                            tabindex="-1"
                                          />
                                        </Form.Group>
                                        <Form.Group
                                          as={Col}
                                          xs={12}
                                          lg={4}
                                          controlId={`MaterialInItems[${index}].unit`}
                                          className="pb-3"
                                        >
                                          <Form.Label>UNIDADE</Form.Label>

                                          <Form.Control
                                            type="text"
                                            readOnly
                                            value={item.unit}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            size="sm"
                                            tabindex="-1"
                                          />
                                        </Form.Group>
                                      </Row>
                                      <Row className="d-flex justify-content-center align-items-center">
                                        <Form.Group
                                          as={Col}
                                          xs={12}
                                          controlId={`MaterialInItems[${index}].name`}
                                          className="pb-3"
                                        >
                                          <Form.Label>DESCRIÇÃO</Form.Label>

                                          <Form.Control
                                            type="text"
                                            readOnly
                                            value={item.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            size="sm"
                                            tabindex="-1"
                                          />
                                        </Form.Group>
                                      </Row>
                                      <Row className="d-flex justify-content-center align-items-center">
                                        <Form.Group
                                          as={Col}
                                          xs={12}
                                          lg={3}
                                          controlId={`MaterialInItems[${index}].value`}
                                          className="pb-3"
                                        >
                                          <Form.Label>PREÇO R$</Form.Label>

                                          <Form.Control
                                            type="text"
                                            readOnly
                                            value={item.value}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            size="sm"
                                            tabindex="-1"
                                          />
                                        </Form.Group>

                                        <Form.Group
                                          as={Col}
                                          xs={12}
                                          lg={3}
                                          controlId={`MaterialInItems[${index}].freeInventory`}
                                          className="pb-3"
                                        >
                                          <Form.Label>SALDO COMUM</Form.Label>
                                          <Form.Control
                                            type="number"
                                            readOnly
                                            value={item.freeInventory}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="SALDO"
                                            size="sm"
                                            tabindex="-1"
                                          />
                                        </Form.Group>
                                        <Form.Group
                                          as={Col}
                                          xs={12}
                                          lg={3}
                                          controlId={`MaterialInItems[${index}].reserveInventory`}
                                          className="pb-3"
                                        >
                                          <Form.Label>SD RESERVADO</Form.Label>
                                          <Form.Control
                                            type="number"
                                            readOnly
                                            value={item.reserveInventory}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="SALDO"
                                            size="sm"
                                            tabindex="-1"
                                          />
                                        </Form.Group>
                                        <Form.Group
                                          as={Col}
                                          xs={12}
                                          lg={3}
                                          controlId={`MaterialInItems[${index}].restrictInventory`}
                                          className="pb-3"
                                        >
                                          <Form.Label>SD RESTRITO</Form.Label>
                                          <Form.Control
                                            type="number"
                                            readOnly
                                            value={item.restrictInventory}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="SALDO"
                                            size="sm"
                                            tabindex="-1"
                                          />
                                        </Form.Group>
                                      </Row>
                                      <Row className="d-flex justify-content-center align-items-center" />
                                      <Row className="d-flex justify-content-center align-items-center">
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
                                      </Row>
                                    </div>
                                  </div>
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
