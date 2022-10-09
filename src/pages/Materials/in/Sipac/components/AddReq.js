/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable react/prop-types */
import React, { useRef } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Button, Row, Col, Form, Badge } from 'react-bootstrap';

import * as yup from 'yup'; // RulesValidation
import { Formik } from 'formik'; // FormValidation

export default function AddReq({ submitReq, handleClear }) {
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
          <Row>
            <Form.Group
              as={Col}
              xs={9}
              sm={8}
              md={4}
              lg={3}
              controlId="reqMaterial"
              className="pb-3"
            >
              <Form.Label>REQ. MATERIAL</Form.Label>

              <Form.Control
                type="tel"
                name="newReq"
                value={values.newReq}
                onChange={handleChange}
                // isInvalid={!!errors.newReq}
                // isValid={values.newReq && !errors.newReq}
                autoFocus
                ref={inputRef}
                placeholder="Nº RM"
                // onBlur={handleBlur}
              />
              {touched.newReq && !!errors.newReq ? (
                <Badge bg="danger">{errors.newReq}</Badge>
              ) : null}
            </Form.Group>
            <Col xs="auto" className="ps-1 pt-4">
              <Button
                variant="success"
                type="submit"
                aria-label="Add Req"
                onClick={() => inputRef.current.focus()}
                className="mt-2"
              >
                <FaPlus />
              </Button>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
}
