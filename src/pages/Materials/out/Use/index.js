/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable react/prop-types */
import React, { useRef } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Button, Row, Col, Form } from 'react-bootstrap';

import * as yup from 'yup'; // RulesValidation
import { Formik } from 'formik'; // FormValidation
import {
  primaryDarkColor,
  body1Color,
  body2Color,
} from '../../../../config/colors';

export default function index({ submitReq }) {
  const inputRef = useRef();

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
    destination: yup.number().positive().integer().required('Requerido'),
    obs: yup.string(),
    // eslint-disable-next-line react/forbid-prop-types
    items: yup.array().of(
      yup.object().shape({
        quantity: yup.number().required('Requerido').positive().integer(),
      })
    ),
  });

  return (
    <Row className="bg-light border rounded d-flex justify-content-center pt-2">
      <Row
        className="px-0 mx-0 py-2 text-center"
        style={{ background: primaryDarkColor, color: 'white' }}
      >
        <span className="fs-5">SAÍDA DE MATERIAL</span>
      </Row>
      <Row className="px-0 pt-2">
        <Formik
          initialValues={{
            reqMaintenance: '',
          }}
          validationSchema={schema}
          onSubmit={(values, { resetForm }) => {
            submitReq(values, resetForm);
          }}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            touched,
            isValid,
            errors,
          }) => (
            <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <Form.Group controlId="reqMaintenance">
                <Row className="d-flex align-items-end pt-2">
                  <Col xs={8} md={6} lg={4} xl={3}>
                    <Form.Label>Nº REQUISIÇÃO DE MANUTENÇÃO</Form.Label>
                    <Form.Control
                      type="tel"
                      value={values.reqMaintenance}
                      onChange={handleChange}
                      isInvalid={!!errors.reqMaintenance}
                      isValid={values.reqMaintenance && !errors.reqMaintenance}
                      autoFocus
                      ref={inputRef}
                      placeholder="Código/ano"
                      // onBlur={handleBlur}
                    />
                    <Form.Control.Feedback
                      tooltip
                      type="invalid"
                      style={{ position: 'static' }}
                    >
                      {errors.reqMaintenance}
                    </Form.Control.Feedback>
                  </Col>
                  <Col xs="auto" className="ps-0 center-text">
                    <Button
                      variant="success"
                      type="submit"
                      aria-label="Add Req"
                      onClick={() => inputRef.current.focus()}
                    >
                      <FaPlus />
                    </Button>
                  </Col>
                </Row>
              </Form.Group>
            </Form>
          )}
        </Formik>
        <Formik
          initialValues={{
            removedBy: '',
            costUnit: '',
            destination: '',
            obs: '',
          }}
          validationSchema={schema}
          onSubmit={(values, { resetForm }) => {
            submitReq(values, resetForm);
          }}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            touched,
            isValid,
            errors,
          }) => (
            <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <hr />
              <Row>
                <Form.Group
                  as={Col}
                  xs={12}
                  md={6}
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
                  md={6}
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
                  controlId="destination"
                  className="pt-2"
                >
                  <Form.Label>DESTINO:</Form.Label>
                  <Form.Control
                    type="text"
                    value={values.destination}
                    onChange={handleChange}
                    isInvalid={touched.destination && !!errors.destination}
                    isValid={touched.destination && !errors.destination}
                    placeholder="Selecione o local"
                    onBlur={handleBlur}
                  />
                  <Form.Control.Feedback
                    tooltip
                    type="invalid"
                    style={{ position: 'static' }}
                  >
                    {errors.destination}
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
              <Row
                className="d-flex align-items-end py-2"
                style={{ background: body1Color }}
              >
                <Form.Group
                  as={Col}
                  xs={12}
                  sm={10}
                  controlId="search"
                  className="d-flex align-items-end pt-2"
                >
                  <Form.Label className="pe-2">PESQUISAR:</Form.Label>
                  <Form.Select
                    type="text"
                    value={values.search}
                    onChange={handleChange}
                    isInvalid={!!errors.search}
                    isValid={values.search && !errors.search}
                    placeholder="Selecione o profissional"
                    // onBlur={handleBlur}
                  >
                    <option>Selecione o material</option>
                    <option value="1">JOELHO</option>
                    <option value="2">TE</option>
                    <option value="3">CONEXAO</option>
                  </Form.Select>
                  <Form.Control.Feedback
                    tooltip
                    type="invalid"
                    style={{ position: 'static' }}
                  >
                    {errors.search}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group
                  as={Col}
                  xs={12}
                  sm={2}
                  controlId="reqMaterial"
                  className="d-flex align-items-end pt-2"
                >
                  <Form.Label className="pe-2">RM:</Form.Label>
                  <Form.Select
                    type="text"
                    value={values.reqMaterial}
                    onChange={handleChange}
                    isInvalid={!!errors.reqMaterial}
                    isValid={values.reqMaterial && !errors.reqMaterial}
                    placeholder="Selecione o profissional"
                    // onBlur={handleBlur}
                  >
                    <option>Selecione o material</option>
                    <option value="1">JOELHO</option>
                    <option value="2">TE</option>
                    <option value="3">CONEXAO</option>
                  </Form.Select>
                  <Form.Control.Feedback
                    tooltip
                    type="invalid"
                    style={{ position: 'static' }}
                  >
                    {errors.reqMaterial}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className="pt-2">
                <Col xs={4} sm={4} md={3} lg={2} className="border my-0 mx-0">
                  CODIGO
                </Col>
                <Col xs={8} sm={8} md={7} lg={8} className="border my-0 mx-0">
                  DENOMINAÇÃO
                </Col>
                <Col xs={4} sm={4} md={1} className="border my-0 mx-0">
                  UND
                </Col>
                <Col xs={4} sm={4} md={1} className="border my-0 mx-0">
                  QTD
                </Col>
              </Row>
              <Row style={{ background: body2Color }}>
                <Form.Group
                  as={Col}
                  xs={4}
                  sm={4}
                  md={3}
                  lg={2}
                  controlId="MaterialId"
                  className="py-0 px-0"
                >
                  <Form.Control
                    type="text"
                    size="sm"
                    value={values.MaterialId}
                    onChange={handleChange}
                    isInvalid={!!errors.MaterialId}
                    isValid={values.MaterialId && !errors.MaterialId}
                    placeholder="CODIGO"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback
                    tooltip
                    type="invalid"
                    style={{ position: 'static' }}
                  >
                    {errors.MaterialId}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Col}
                  xs={8}
                  sm={8}
                  md={7}
                  lg={8}
                  controlId="name"
                  className="py-0 px-0"
                >
                  <Form.Control
                    type="text"
                    size="sm"
                    value={values.name}
                    onChange={handleChange}
                    isInvalid={!!errors.name}
                    isValid={values.name && !errors.name}
                    placeholder="DENOMINAÇÃO"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback
                    tooltip
                    type="invalid"
                    style={{ position: 'static' }}
                  >
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Col}
                  xs={4}
                  sm={4}
                  md={1}
                  controlId="unit"
                  className="py-0 px-0"
                >
                  <Form.Control
                    type="text"
                    size="sm"
                    value={values.unit}
                    onChange={handleChange}
                    isInvalid={!!errors.unit}
                    isValid={values.unit && !errors.unit}
                    placeholder="UND"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback
                    tooltip
                    type="invalid"
                    style={{ position: 'static' }}
                  >
                    {errors.unit}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Col}
                  xs={4}
                  sm={4}
                  md={1}
                  controlId="quantity"
                  className="py-0 px-0"
                >
                  <Form.Control
                    type="text"
                    size="sm"
                    value={values.quantity}
                    onChange={handleChange}
                    isInvalid={!!errors.quantity}
                    isValid={values.quantity && !errors.quantity}
                    placeholder="QTD"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback
                    tooltip
                    type="invalid"
                    style={{ position: 'static' }}
                  >
                    {errors.quantity}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row style={{ background: body2Color }}>
                <Form.Group
                  as={Col}
                  xs={4}
                  sm={4}
                  md={3}
                  lg={2}
                  controlId="MaterialId"
                  className="py-0 px-0"
                >
                  <Form.Control
                    type="text"
                    size="sm"
                    value={values.MaterialId}
                    onChange={handleChange}
                    isInvalid={!!errors.MaterialId}
                    isValid={values.MaterialId && !errors.MaterialId}
                    placeholder="CODIGO"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback
                    tooltip
                    type="invalid"
                    style={{ position: 'static' }}
                  >
                    {errors.MaterialId}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Col}
                  xs={8}
                  sm={8}
                  md={7}
                  lg={8}
                  controlId="name"
                  className="py-0 px-0"
                >
                  <Form.Control
                    type="text"
                    size="sm"
                    value={values.name}
                    onChange={handleChange}
                    isInvalid={!!errors.name}
                    isValid={values.name && !errors.name}
                    placeholder="DENOMINAÇÃO"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback
                    tooltip
                    type="invalid"
                    style={{ position: 'static' }}
                  >
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Col}
                  xs={4}
                  sm={4}
                  md={1}
                  controlId="unit"
                  className="py-0 px-0"
                >
                  <Form.Control
                    type="text"
                    size="sm"
                    value={values.unit}
                    onChange={handleChange}
                    isInvalid={!!errors.unit}
                    isValid={values.unit && !errors.unit}
                    placeholder="UND"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback
                    tooltip
                    type="invalid"
                    style={{ position: 'static' }}
                  >
                    {errors.unit}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Col}
                  xs={4}
                  sm={4}
                  md={1}
                  controlId="quantity"
                  className="py-0 px-0"
                >
                  <Form.Control
                    type="text"
                    size="sm"
                    value={values.quantity}
                    onChange={handleChange}
                    isInvalid={!!errors.quantity}
                    isValid={values.quantity && !errors.quantity}
                    placeholder="QTD"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback
                    tooltip
                    type="invalid"
                    style={{ position: 'static' }}
                  >
                    {errors.quantity}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row style={{ background: body2Color }}>
                <Form.Group
                  as={Col}
                  xs={4}
                  sm={4}
                  md={3}
                  lg={2}
                  controlId="MaterialId"
                  className="py-0 px-0"
                >
                  <Form.Control
                    type="text"
                    size="sm"
                    value={values.MaterialId}
                    onChange={handleChange}
                    isInvalid={!!errors.MaterialId}
                    isValid={values.MaterialId && !errors.MaterialId}
                    placeholder="CODIGO"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback
                    tooltip
                    type="invalid"
                    style={{ position: 'static' }}
                  >
                    {errors.MaterialId}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Col}
                  xs={8}
                  sm={8}
                  md={7}
                  lg={8}
                  controlId="name"
                  className="py-0 px-0"
                >
                  <Form.Control
                    type="text"
                    size="sm"
                    value={values.name}
                    onChange={handleChange}
                    isInvalid={!!errors.name}
                    isValid={values.name && !errors.name}
                    placeholder="DENOMINAÇÃO"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback
                    tooltip
                    type="invalid"
                    style={{ position: 'static' }}
                  >
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Col}
                  xs={4}
                  sm={4}
                  md={1}
                  controlId="unit"
                  className="py-0 px-0"
                >
                  <Form.Control
                    type="text"
                    size="sm"
                    value={values.unit}
                    onChange={handleChange}
                    isInvalid={!!errors.unit}
                    isValid={values.unit && !errors.unit}
                    placeholder="UND"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback
                    tooltip
                    type="invalid"
                    style={{ position: 'static' }}
                  >
                    {errors.unit}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Col}
                  xs={4}
                  sm={4}
                  md={1}
                  controlId="quantity"
                  className="py-0 px-0"
                >
                  <Form.Control
                    type="text"
                    size="sm"
                    value={values.quantity}
                    onChange={handleChange}
                    isInvalid={!!errors.quantity}
                    isValid={values.quantity && !errors.quantity}
                    placeholder="QTD"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback
                    tooltip
                    type="invalid"
                    style={{ position: 'static' }}
                  >
                    {errors.quantity}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row style={{ background: body2Color }}>
                <Form.Group
                  as={Col}
                  xs={4}
                  sm={4}
                  md={3}
                  lg={2}
                  controlId="MaterialId"
                  className="py-0 px-0"
                >
                  <Form.Control
                    type="text"
                    size="sm"
                    value={values.MaterialId}
                    onChange={handleChange}
                    isInvalid={!!errors.MaterialId}
                    isValid={values.MaterialId && !errors.MaterialId}
                    placeholder="CODIGO"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback
                    tooltip
                    type="invalid"
                    style={{ position: 'static' }}
                  >
                    {errors.MaterialId}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Col}
                  xs={8}
                  sm={8}
                  md={7}
                  lg={8}
                  controlId="name"
                  className="py-0 px-0"
                >
                  <Form.Control
                    type="text"
                    size="sm"
                    value={values.name}
                    onChange={handleChange}
                    isInvalid={!!errors.name}
                    isValid={values.name && !errors.name}
                    placeholder="DENOMINAÇÃO"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback
                    tooltip
                    type="invalid"
                    style={{ position: 'static' }}
                  >
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Col}
                  xs={4}
                  sm={4}
                  md={1}
                  controlId="unit"
                  className="py-0 px-0"
                >
                  <Form.Control
                    type="text"
                    size="sm"
                    value={values.unit}
                    onChange={handleChange}
                    isInvalid={!!errors.unit}
                    isValid={values.unit && !errors.unit}
                    placeholder="UND"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback
                    tooltip
                    type="invalid"
                    style={{ position: 'static' }}
                  >
                    {errors.unit}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Col}
                  xs={4}
                  sm={4}
                  md={1}
                  controlId="quantity"
                  className="py-0 px-0"
                >
                  <Form.Control
                    type="text"
                    size="sm"
                    value={values.quantity}
                    onChange={handleChange}
                    isInvalid={!!errors.quantity}
                    isValid={values.quantity && !errors.quantity}
                    placeholder="QTD"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback
                    tooltip
                    type="invalid"
                    style={{ position: 'static' }}
                  >
                    {errors.quantity}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row style={{ background: body2Color }}>
                <Form.Group
                  as={Col}
                  xs={4}
                  sm={4}
                  md={3}
                  lg={2}
                  controlId="MaterialId"
                  className="py-0 px-0"
                >
                  <Form.Control
                    type="text"
                    size="sm"
                    value={values.MaterialId}
                    onChange={handleChange}
                    isInvalid={!!errors.MaterialId}
                    isValid={values.MaterialId && !errors.MaterialId}
                    placeholder="CODIGO"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback
                    tooltip
                    type="invalid"
                    style={{ position: 'static' }}
                  >
                    {errors.MaterialId}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Col}
                  xs={8}
                  sm={8}
                  md={7}
                  lg={8}
                  controlId="name"
                  className="py-0 px-0"
                >
                  <Form.Control
                    type="text"
                    size="sm"
                    value={values.name}
                    onChange={handleChange}
                    isInvalid={!!errors.name}
                    isValid={values.name && !errors.name}
                    placeholder="DENOMINAÇÃO"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback
                    tooltip
                    type="invalid"
                    style={{ position: 'static' }}
                  >
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Col}
                  xs={4}
                  sm={4}
                  md={1}
                  controlId="unit"
                  className="py-0 px-0"
                >
                  <Form.Control
                    type="text"
                    size="sm"
                    value={values.unit}
                    onChange={handleChange}
                    isInvalid={!!errors.unit}
                    isValid={values.unit && !errors.unit}
                    placeholder="UND"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback
                    tooltip
                    type="invalid"
                    style={{ position: 'static' }}
                  >
                    {errors.unit}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Col}
                  xs={4}
                  sm={4}
                  md={1}
                  controlId="quantity"
                  className="py-0 px-0"
                >
                  <Form.Control
                    type="text"
                    size="sm"
                    value={values.quantity}
                    onChange={handleChange}
                    isInvalid={!!errors.quantity}
                    isValid={values.quantity && !errors.quantity}
                    placeholder="QTD"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback
                    tooltip
                    type="invalid"
                    style={{ position: 'static' }}
                  >
                    {errors.quantity}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>

              <hr />
              <Row className="justify-content-center pt-2 pb-4">
                <Col xs="auto" className="text-center">
                  <Button variant="warning" onClick={console.log(`click`)}>
                    Limpar
                  </Button>
                </Col>
                <Col xs="auto" className="text-center">
                  <Button variant="success" onClick={console.log(`click`)}>
                    Confirmar saída
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </Row>
    </Row>
  );
}
