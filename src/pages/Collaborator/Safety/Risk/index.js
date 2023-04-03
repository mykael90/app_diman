/* eslint-disable react/prop-types */
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Row,
  Col,
  Button,
  Form as BootstrapForm,
} from 'react-bootstrap';
import Select from 'react-select';

const emptyValues = { task: '', description: '', riskLevel: null };

const riskOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const validationSchema = Yup.object().shape({
  task: Yup.string().required('Task is required'),
  description: Yup.string().required('Description is required'),
  // riskLevel: Yup.string().required('Risk level is required'),
});

export default function RiskTaskForm({ initialValues = null }) {
  const isEditMode = !!initialValues;

  const handleSubmit = (values) => {
    if (isEditMode) {
      // In edit mode, merge the new values with the existing ones
      const mergedValues = { ...initialValues, ...values };
      console.log(mergedValues);
    } else {
      console.log(values);
    }
  };

  const handleResetAll = (values) => {
    console.log(values);
    // colocar outras coisas após o reset que precisar
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={8}>
          <h1>{isEditMode ? 'Edit' : 'Add'} Risk Task</h1>
          <Formik
            initialValues={initialValues || emptyValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            onReset={handleResetAll}
            enableReinitialize
          >
            {({ values, errors, touched, setFieldValue, handleReset }) => (
              <Form as BootstrapForm onReset={handleReset}>
                <BootstrapForm.Group controlId="task">
                  <BootstrapForm.Label>Task</BootstrapForm.Label>
                  <Field
                    className={
                      errors.task && touched.task ? 'is-invalid' : null
                    }
                    type="text"
                    name="task"
                    as={BootstrapForm.Control}
                  />
                  <ErrorMessage
                    name="task"
                    component="div"
                    className="invalid-feedback"
                  />
                </BootstrapForm.Group>

                <BootstrapForm.Group controlId="description">
                  <BootstrapForm.Label>Description</BootstrapForm.Label>
                  <Field
                    className={
                      errors.description && touched.description
                        ? 'is-invalid'
                        : null
                    }
                    rows={3}
                    name="description"
                    as={BootstrapForm.Control}
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="invalid-feedback"
                  />
                </BootstrapForm.Group>

                <BootstrapForm.Group controlId="riskLevel">
                  <BootstrapForm.Label>Risk Level</BootstrapForm.Label>

                  <Field name="riskLevel">
                    {({ field }) => (
                      <Select
                        {...field}
                        className={
                          errors.riskLevel && touched.riskLevel
                            ? 'is-invalid'
                            : null
                        }
                        options={riskOptions}
                        value={values.riskLevel}
                        onChange={(selectedOption) =>
                          setFieldValue('riskLevel', selectedOption)
                        }
                        onReset={() => setFieldValue('riskLevel', null)}
                        isClearable
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="riskLevel"
                    component="div"
                    className="invalid-feedback"
                  />
                </BootstrapForm.Group>

                <Button variant="primary" type="submit">
                  {isEditMode ? 'Save' : 'Add'}
                </Button>
                <Button variant="danger" type="reset">
                  Reset
                </Button>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
}
