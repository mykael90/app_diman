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
    newReq: yup
      .string()
      .required('Requerido')
      .matches(
        /^[0-9]{1,5}$|^[0-9]+[/]{1}[0-9]{4}$/,
        'Formato de requisição não permitido'
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
            newReq: '',
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
              <Form.Group controlId="validationFormik01">
                <Row className="d-flex align-items-end pt-2">
                  <Col xs={8} md={6} lg={4} xl={3}>
                    <Form.Label>Nº REQUISIÇÃO DE MANUTENÇÃO</Form.Label>
                    <Form.Control
                      type="tel"
                      name="newReq"
                      value={values.newReq}
                      onChange={handleChange}
                      isInvalid={!!errors.newReq}
                      isValid={values.newReq && !errors.newReq}
                      autoFocus
                      ref={inputRef}
                      placeholder="Código/ano"
                      // onBlur={handleBlur}
                    />
                    <Form.Control.Feedback tooltip type="invalid">
                      {errors.newReq}
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
              <hr />
              <Row>
                <Form.Group
                  as={Col}
                  xs={12}
                  md={6}
                  controlId="validationFormik01"
                  className="pt-2"
                >
                  <Form.Label>RETIRADO POR:</Form.Label>
                  <Form.Select
                    type="text"
                    name="newReq"
                    value={values.newReq}
                    onChange={handleChange}
                    isInvalid={!!errors.newReq}
                    isValid={values.newReq && !errors.newReq}
                    placeholder="Selecione o profissional"
                    // onBlur={handleBlur}
                  >
                    <option>Selecione o profissional</option>
                    <option value="1">JOSE FERREIRA</option>
                    <option value="2">MARCONDES</option>
                    <option value="3">DANIEL</option>
                  </Form.Select>
                  <Form.Control.Feedback tooltip type="invalid">
                    {errors.newReq}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group
                  as={Col}
                  xs={12}
                  md={6}
                  controlId="validationFormik01"
                  className="pt-2"
                >
                  <Form.Label>UIDADE DE CUSTO:</Form.Label>
                  <Form.Control
                    type="text"
                    name="newReq"
                    value={values.newReq}
                    onChange={handleChange}
                    isInvalid={!!errors.newReq}
                    isValid={values.newReq && !errors.newReq}
                    placeholder="Selecione o local"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback tooltip type="invalid">
                    {errors.newReq}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group
                  as={Col}
                  xs={12}
                  controlId="validationFormik01"
                  className="pt-2"
                >
                  <Form.Label>DESTINO:</Form.Label>
                  <Form.Control
                    type="text"
                    name="newReq"
                    value={values.newReq}
                    onChange={handleChange}
                    isInvalid={!!errors.newReq}
                    isValid={values.newReq && !errors.newReq}
                    placeholder="Selecione o local"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback tooltip type="invalid">
                    {errors.newReq}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group
                  xs={12}
                  controlId="validationFormik01"
                  className="pt-2"
                >
                  <Form.Label>OBSERVAÇÕES GERAIS:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    type="text"
                    name="newReq"
                    value={values.newReq}
                    onChange={handleChange}
                    isInvalid={!!errors.newReq}
                    isValid={values.newReq && !errors.newReq}
                    placeholder="Selecione o local"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback tooltip type="invalid">
                    {errors.newReq}
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
                  controlId="validationFormik01"
                  className="d-flex align-items-end pt-2"
                >
                  <Form.Label className="pe-2">PESQUISAR:</Form.Label>
                  <Form.Select
                    type="text"
                    name="newReq"
                    value={values.newReq}
                    onChange={handleChange}
                    isInvalid={!!errors.newReq}
                    isValid={values.newReq && !errors.newReq}
                    placeholder="Selecione o profissional"
                    // onBlur={handleBlur}
                  >
                    <option>Selecione o material</option>
                    <option value="1">JOELHO</option>
                    <option value="2">TE</option>
                    <option value="3">CONEXAO</option>
                  </Form.Select>
                  <Form.Control.Feedback tooltip type="invalid">
                    {errors.newReq}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group
                  as={Col}
                  xs={12}
                  sm={2}
                  controlId="validationFormik01"
                  className="d-flex align-items-end pt-2"
                >
                  <Form.Label className="pe-2">RM:</Form.Label>
                  <Form.Select
                    type="text"
                    name="newReq"
                    value={values.newReq}
                    onChange={handleChange}
                    isInvalid={!!errors.newReq}
                    isValid={values.newReq && !errors.newReq}
                    placeholder="Selecione o profissional"
                    // onBlur={handleBlur}
                  >
                    <option>Selecione o material</option>
                    <option value="1">JOELHO</option>
                    <option value="2">TE</option>
                    <option value="3">CONEXAO</option>
                  </Form.Select>
                  <Form.Control.Feedback tooltip type="invalid">
                    {errors.newReq}
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
                  controlId="validationFormik01"
                  className="py-0 px-0"
                >
                  <Form.Control
                    type="text"
                    size="sm"
                    name="newReq"
                    value={values.newReq}
                    onChange={handleChange}
                    isInvalid={!!errors.newReq}
                    isValid={values.newReq && !errors.newReq}
                    placeholder="CODIGO"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback tooltip type="invalid">
                    {errors.newReq}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Col}
                  xs={8}
                  sm={8}
                  md={7}
                  lg={8}
                  controlId="validationFormik01"
                  className="py-0 px-0"
                >
                  <Form.Control
                    type="text"
                    size="sm"
                    name="newReq"
                    value={values.newReq}
                    onChange={handleChange}
                    isInvalid={!!errors.newReq}
                    isValid={values.newReq && !errors.newReq}
                    placeholder="DENOMINAÇÃO"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback tooltip type="invalid">
                    {errors.newReq}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Col}
                  xs={4}
                  sm={4}
                  md={1}
                  controlId="validationFormik01"
                  className="py-0 px-0"
                >
                  <Form.Control
                    type="text"
                    size="sm"
                    name="newReq"
                    value={values.newReq}
                    onChange={handleChange}
                    isInvalid={!!errors.newReq}
                    isValid={values.newReq && !errors.newReq}
                    placeholder="UND"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback tooltip type="invalid">
                    {errors.newReq}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Col}
                  xs={4}
                  sm={4}
                  md={1}
                  controlId="validationFormik01"
                  className="py-0 px-0"
                >
                  <Form.Control
                    type="text"
                    size="sm"
                    name="newReq"
                    value={values.newReq}
                    onChange={handleChange}
                    isInvalid={!!errors.newReq}
                    isValid={values.newReq && !errors.newReq}
                    placeholder="QTD"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback tooltip type="invalid">
                    {errors.newReq}
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
                  controlId="validationFormik01"
                  className="py-0 px-0"
                >
                  <Form.Control
                    type="text"
                    size="sm"
                    name="newReq"
                    value={values.newReq}
                    onChange={handleChange}
                    isInvalid={!!errors.newReq}
                    isValid={values.newReq && !errors.newReq}
                    placeholder="CODIGO"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback tooltip type="invalid">
                    {errors.newReq}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Col}
                  xs={8}
                  sm={8}
                  md={7}
                  lg={8}
                  controlId="validationFormik01"
                  className="py-0 px-0"
                >
                  <Form.Control
                    type="text"
                    size="sm"
                    name="newReq"
                    value={values.newReq}
                    onChange={handleChange}
                    isInvalid={!!errors.newReq}
                    isValid={values.newReq && !errors.newReq}
                    placeholder="DENOMINAÇÃO"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback tooltip type="invalid">
                    {errors.newReq}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Col}
                  xs={4}
                  sm={4}
                  md={1}
                  controlId="validationFormik01"
                  className="py-0 px-0"
                >
                  <Form.Control
                    type="text"
                    size="sm"
                    name="newReq"
                    value={values.newReq}
                    onChange={handleChange}
                    isInvalid={!!errors.newReq}
                    isValid={values.newReq && !errors.newReq}
                    placeholder="UND"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback tooltip type="invalid">
                    {errors.newReq}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Col}
                  xs={4}
                  sm={4}
                  md={1}
                  controlId="validationFormik01"
                  className="py-0 px-0"
                >
                  <Form.Control
                    type="text"
                    size="sm"
                    name="newReq"
                    value={values.newReq}
                    onChange={handleChange}
                    isInvalid={!!errors.newReq}
                    isValid={values.newReq && !errors.newReq}
                    placeholder="QTD"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback tooltip type="invalid">
                    {errors.newReq}
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
                  controlId="validationFormik01"
                  className="py-0 px-0"
                >
                  <Form.Control
                    type="text"
                    size="sm"
                    name="newReq"
                    value={values.newReq}
                    onChange={handleChange}
                    isInvalid={!!errors.newReq}
                    isValid={values.newReq && !errors.newReq}
                    placeholder="CODIGO"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback tooltip type="invalid">
                    {errors.newReq}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Col}
                  xs={8}
                  sm={8}
                  md={7}
                  lg={8}
                  controlId="validationFormik01"
                  className="py-0 px-0"
                >
                  <Form.Control
                    type="text"
                    size="sm"
                    name="newReq"
                    value={values.newReq}
                    onChange={handleChange}
                    isInvalid={!!errors.newReq}
                    isValid={values.newReq && !errors.newReq}
                    placeholder="DENOMINAÇÃO"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback tooltip type="invalid">
                    {errors.newReq}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Col}
                  xs={4}
                  sm={4}
                  md={1}
                  controlId="validationFormik01"
                  className="py-0 px-0"
                >
                  <Form.Control
                    type="text"
                    size="sm"
                    name="newReq"
                    value={values.newReq}
                    onChange={handleChange}
                    isInvalid={!!errors.newReq}
                    isValid={values.newReq && !errors.newReq}
                    placeholder="UND"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback tooltip type="invalid">
                    {errors.newReq}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Col}
                  xs={4}
                  sm={4}
                  md={1}
                  controlId="validationFormik01"
                  className="py-0 px-0"
                >
                  <Form.Control
                    type="text"
                    size="sm"
                    name="newReq"
                    value={values.newReq}
                    onChange={handleChange}
                    isInvalid={!!errors.newReq}
                    isValid={values.newReq && !errors.newReq}
                    placeholder="QTD"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback tooltip type="invalid">
                    {errors.newReq}
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
                  controlId="validationFormik01"
                  className="py-0 px-0"
                >
                  <Form.Control
                    type="text"
                    size="sm"
                    name="newReq"
                    value={values.newReq}
                    onChange={handleChange}
                    isInvalid={!!errors.newReq}
                    isValid={values.newReq && !errors.newReq}
                    placeholder="CODIGO"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback tooltip type="invalid">
                    {errors.newReq}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Col}
                  xs={8}
                  sm={8}
                  md={7}
                  lg={8}
                  controlId="validationFormik01"
                  className="py-0 px-0"
                >
                  <Form.Control
                    type="text"
                    size="sm"
                    name="newReq"
                    value={values.newReq}
                    onChange={handleChange}
                    isInvalid={!!errors.newReq}
                    isValid={values.newReq && !errors.newReq}
                    placeholder="DENOMINAÇÃO"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback tooltip type="invalid">
                    {errors.newReq}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Col}
                  xs={4}
                  sm={4}
                  md={1}
                  controlId="validationFormik01"
                  className="py-0 px-0"
                >
                  <Form.Control
                    type="text"
                    size="sm"
                    name="newReq"
                    value={values.newReq}
                    onChange={handleChange}
                    isInvalid={!!errors.newReq}
                    isValid={values.newReq && !errors.newReq}
                    placeholder="UND"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback tooltip type="invalid">
                    {errors.newReq}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Col}
                  xs={4}
                  sm={4}
                  md={1}
                  controlId="validationFormik01"
                  className="py-0 px-0"
                >
                  <Form.Control
                    type="text"
                    size="sm"
                    name="newReq"
                    value={values.newReq}
                    onChange={handleChange}
                    isInvalid={!!errors.newReq}
                    isValid={values.newReq && !errors.newReq}
                    placeholder="QTD"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback tooltip type="invalid">
                    {errors.newReq}
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
                  controlId="validationFormik01"
                  className="py-0 px-0"
                >
                  <Form.Control
                    type="text"
                    size="sm"
                    name="newReq"
                    value={values.newReq}
                    onChange={handleChange}
                    isInvalid={!!errors.newReq}
                    isValid={values.newReq && !errors.newReq}
                    placeholder="CODIGO"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback tooltip type="invalid">
                    {errors.newReq}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Col}
                  xs={8}
                  sm={8}
                  md={7}
                  lg={8}
                  controlId="validationFormik01"
                  className="py-0 px-0"
                >
                  <Form.Control
                    type="text"
                    size="sm"
                    name="newReq"
                    value={values.newReq}
                    onChange={handleChange}
                    isInvalid={!!errors.newReq}
                    isValid={values.newReq && !errors.newReq}
                    placeholder="DENOMINAÇÃO"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback tooltip type="invalid">
                    {errors.newReq}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Col}
                  xs={4}
                  sm={4}
                  md={1}
                  controlId="validationFormik01"
                  className="py-0 px-0"
                >
                  <Form.Control
                    type="text"
                    size="sm"
                    name="newReq"
                    value={values.newReq}
                    onChange={handleChange}
                    isInvalid={!!errors.newReq}
                    isValid={values.newReq && !errors.newReq}
                    placeholder="UND"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback tooltip type="invalid">
                    {errors.newReq}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Col}
                  xs={4}
                  sm={4}
                  md={1}
                  controlId="validationFormik01"
                  className="py-0 px-0"
                >
                  <Form.Control
                    type="text"
                    size="sm"
                    name="newReq"
                    value={values.newReq}
                    onChange={handleChange}
                    isInvalid={!!errors.newReq}
                    isValid={values.newReq && !errors.newReq}
                    placeholder="QTD"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback tooltip type="invalid">
                    {errors.newReq}
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
                  controlId="validationFormik01"
                  className="py-0 px-0"
                >
                  <Form.Control
                    type="text"
                    size="sm"
                    name="newReq"
                    value={values.newReq}
                    onChange={handleChange}
                    isInvalid={!!errors.newReq}
                    isValid={values.newReq && !errors.newReq}
                    placeholder="CODIGO"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback tooltip type="invalid">
                    {errors.newReq}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Col}
                  xs={8}
                  sm={8}
                  md={7}
                  lg={8}
                  controlId="validationFormik01"
                  className="py-0 px-0"
                >
                  <Form.Control
                    type="text"
                    size="sm"
                    name="newReq"
                    value={values.newReq}
                    onChange={handleChange}
                    isInvalid={!!errors.newReq}
                    isValid={values.newReq && !errors.newReq}
                    placeholder="DENOMINAÇÃO"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback tooltip type="invalid">
                    {errors.newReq}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Col}
                  xs={4}
                  sm={4}
                  md={1}
                  controlId="validationFormik01"
                  className="py-0 px-0"
                >
                  <Form.Control
                    type="text"
                    size="sm"
                    name="newReq"
                    value={values.newReq}
                    onChange={handleChange}
                    isInvalid={!!errors.newReq}
                    isValid={values.newReq && !errors.newReq}
                    placeholder="UND"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback tooltip type="invalid">
                    {errors.newReq}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Col}
                  xs={4}
                  sm={4}
                  md={1}
                  controlId="validationFormik01"
                  className="py-0 px-0"
                >
                  <Form.Control
                    type="text"
                    size="sm"
                    name="newReq"
                    value={values.newReq}
                    onChange={handleChange}
                    isInvalid={!!errors.newReq}
                    isValid={values.newReq && !errors.newReq}
                    placeholder="QTD"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback tooltip type="invalid">
                    {errors.newReq}
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
