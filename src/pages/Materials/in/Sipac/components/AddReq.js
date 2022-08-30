/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable react/prop-types */
import React, { useRef } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Button, Row, Col, Form } from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

import * as yup from 'yup'; // RulesValidation
import { Formik, useFormikContext } from 'formik'; // FormValidation

export function Logger() {
  const formik = useFormikContext();

  React.useEffect(() => {
    // console.group('Formik State');
    // console.log('values', formik.values);
    // console.log('errors', formik.errors);
    // console.groupEnd();
  }, [formik.values, formik.errors]);
  return null;
}

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
          <Logger />
          <Form.Group controlId="validationFormik01">
            <Row className="d-flex align-items-center">
              <Col>
                <FloatingLabel label="Nº RM">
                  <Form.Control
                    type="tel"
                    name="newReq"
                    value={values.newReq}
                    onChange={handleChange}
                    isInvalid={!!errors.newReq}
                    isValid={values.newReq && !errors.newReq}
                    autoFocus
                    ref={inputRef}
                    placeholder="codigo/ano"
                    // onBlur={handleBlur}
                  />
                  <Form.Control.Feedback tooltip type="invalid">
                    {errors.newReq}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Col>
              <Col xs="auto" className="center-text ps-0">
                <Button
                  size="sm"
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
  );
}
