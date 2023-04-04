/* eslint-disable react/prop-types */
import React from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Row,
  Col,
  Button,
  Badge,
  Form as BootstrapForm,
} from 'react-bootstrap';
import Select from 'react-select';
import { FaPhone, FaPlus, FaTrashAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

import { primaryDarkColor } from '../../../../config/colors';

const emptyValues = {
  reqMaintenance: '',
  title: '',
  description: '',
  start: '',
  end: '',
  place: '',
  propertySipacId: '',
  buildingSipacId: '',
  extraActivity: null,
  WorkerTasktype: '',
  WorkerTaskItem: [],
};

const riskOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const validationSchema = Yup.object().shape({
  reqMaintenance: Yup.string().required('Número de requisição obrigatória'),
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
      <div className="bg-light border rounded pt-2 px-3">
        <Row className="justify-content-center">
          <Col
            xs={12}
            className=" text-center"
            style={{ background: primaryDarkColor, color: 'white' }}
          >
            <span className="fs-5">
              {isEditMode ? 'Editar' : 'Adicionar'} Tarefa
            </span>
          </Col>
        </Row>
        <Row className="pt-2">
          <Formik
            initialValues={initialValues || emptyValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            onReset={handleResetAll}
            enableReinitialize
          >
            {({
              values,
              errors,
              touched,
              setFieldValue,
              handleReset,
              handleChange,
              handleBlur,
            }) => (
              <Form as BootstrapForm onReset={handleReset}>
                <Row className="d-flex justify-content-center align-items-top">
                  <BootstrapForm.Group
                    controlId="reqMaintenance"
                    as={Col}
                    xs={12}
                    md={3}
                    className="pb-3"
                  >
                    <BootstrapForm.Label>Req. Manutenção</BootstrapForm.Label>
                    <Field
                      xs={6}
                      className={
                        errors.reqMaintenance && touched.reqMaintenance
                          ? 'is-invalid'
                          : null
                      }
                      type="text"
                      name="reqMaintenance"
                      as={BootstrapForm.Control}
                      placeholder="Código"
                    />
                    <ErrorMessage
                      name="reqMaintenance"
                      component="div"
                      className="invalid-feedback"
                    />
                  </BootstrapForm.Group>

                  <BootstrapForm.Group
                    controlId="WorkerTasktype"
                    as={Col}
                    xs={12}
                    md={3}
                    className="pb-3"
                  >
                    <BootstrapForm.Label>Tipo</BootstrapForm.Label>

                    <Field name="WorkerTasktype">
                      {({ field }) => (
                        <Select
                          {...field}
                          className={
                            errors.WorkerTasktype && touched.WorkerTasktype
                              ? 'is-invalid'
                              : null
                          }
                          options={riskOptions}
                          value={values.riskLevel}
                          onChange={(selectedOption) =>
                            setFieldValue('WorkerTasktype', selectedOption)
                          }
                          onReset={() => setFieldValue('WorkerTasktype', null)}
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

                  <BootstrapForm.Group
                    controlId="title"
                    as={Col}
                    xs={12}
                    md={6}
                    className="pb-3"
                  >
                    <BootstrapForm.Label>Título</BootstrapForm.Label>
                    <Field
                      className={
                        errors.title && touched.title ? 'is-invalid' : null
                      }
                      type="text"
                      name="title"
                      as={BootstrapForm.Control}
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="invalid-feedback"
                    />
                  </BootstrapForm.Group>
                </Row>

                <Row className="d-flex justify-content-center align-items-top">
                  <BootstrapForm.Group
                    controlId="place"
                    as={Col}
                    xs={12}
                    md={6}
                    className="pb-3"
                  >
                    <BootstrapForm.Label>Local</BootstrapForm.Label>
                    <Field
                      className={
                        errors.place && touched.place ? 'is-invalid' : null
                      }
                      type="text"
                      name="place"
                      as={BootstrapForm.Control}
                    />
                    <ErrorMessage
                      name="place"
                      component="div"
                      className="invalid-feedback"
                    />
                  </BootstrapForm.Group>

                  <BootstrapForm.Group
                    controlId="start"
                    as={Col}
                    xs={12}
                    md={2}
                    className="pb-3"
                  >
                    <BootstrapForm.Label>Data de início</BootstrapForm.Label>
                    <Field
                      xs={6}
                      className={
                        errors.start && touched.start ? 'is-invalid' : null
                      }
                      type="date"
                      name="start"
                      as={BootstrapForm.Control}
                      placeholder="Código"
                    />
                    <ErrorMessage
                      name="start"
                      component="div"
                      className="invalid-feedback"
                    />
                  </BootstrapForm.Group>

                  <BootstrapForm.Group
                    controlId="end"
                    as={Col}
                    xs={12}
                    md={2}
                    className="pb-3"
                  >
                    <BootstrapForm.Label>Data final</BootstrapForm.Label>
                    <Field
                      xs={6}
                      className={
                        errors.end && touched.end ? 'is-invalid' : null
                      }
                      type="date"
                      name="end"
                      as={BootstrapForm.Control}
                      placeholder="Código"
                    />
                    <ErrorMessage
                      name="end"
                      component="div"
                      className="invalid-feedback"
                    />
                  </BootstrapForm.Group>

                  <BootstrapForm.Group
                    controlId="extraActivity"
                    as={Col}
                    xs={12}
                    md={2}
                    className="pb-3"
                  >
                    <BootstrapForm.Label>Atividade extra</BootstrapForm.Label>
                    <Field
                      xs={6}
                      // className={
                      //   errors.extraActivity && touched.extraActivity
                      //     ? 'is-invalid'
                      //     : null
                      // }
                      type="switch"
                      name="extraActivity"
                      as={BootstrapForm.Check}
                      placeholder="Código"
                      // className="border"
                    />
                    <ErrorMessage
                      name="extraActivity"
                      component="div"
                      className="invalid-feedback"
                    />
                  </BootstrapForm.Group>
                </Row>

                <Row className="d-flex justify-content-center align-items-top">
                  <BootstrapForm.Group
                    controlId="description"
                    as={Col}
                    xs={12}
                    className="pb-3"
                  >
                    <BootstrapForm.Label>Descrição</BootstrapForm.Label>
                    <BootstrapForm.Control
                      as="textarea"
                      rows={2}
                      type="text"
                      value={values.description}
                      onChange={handleChange}
                      placeholder="Descrição sucinta da tarefa"
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="invalid-feedback"
                    />
                  </BootstrapForm.Group>
                </Row>

                <Row className="d-flex justify-content-center align-items-top">
                  <BootstrapForm.Group
                    controlId="propertySipacId"
                    as={Col}
                    xs={12}
                    md={4}
                    className="pb-3"
                  >
                    <BootstrapForm.Label>Imóvel</BootstrapForm.Label>

                    <Field name="propertySipacId">
                      {({ field }) => (
                        <Select
                          {...field}
                          className={
                            errors.propertySipacId && touched.propertySipacId
                              ? 'is-invalid'
                              : null
                          }
                          options={riskOptions}
                          value={values.propertySipacId}
                          onChange={(selectedOption) =>
                            setFieldValue('propertySipacId', selectedOption)
                          }
                          onReset={() => setFieldValue('propertySipacId', null)}
                          isClearable
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="propertySipacId"
                      component="div"
                      className="invalid-feedback"
                    />
                  </BootstrapForm.Group>

                  <BootstrapForm.Group
                    controlId="buildingSipacId"
                    as={Col}
                    xs={12}
                    md={8}
                    className="pb-3"
                  >
                    <BootstrapForm.Label>Instalação Física</BootstrapForm.Label>

                    <Field name="buildingSipacId">
                      {({ field }) => (
                        <Select
                          {...field}
                          className={
                            errors.buildingSipacId && touched.buildingSipacId
                              ? 'is-invalid'
                              : null
                          }
                          options={riskOptions}
                          value={
                            values.buildingSipacId
                              ? riskOptions.find(
                                  (option) =>
                                    option.value === values.buildingSipacId
                                )
                              : null
                          }
                          onChange={(selectedOption) =>
                            setFieldValue(
                              'buildingSipacId',
                              selectedOption.value
                            )
                          }
                          onReset={() => setFieldValue('buildingSipacId', null)}
                          isClearable
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="buildingSipacId"
                      component="div"
                      className="invalid-feedback"
                    />
                  </BootstrapForm.Group>
                </Row>

                <Button variant="primary" type="submit">
                  {isEditMode ? 'Save' : 'Add'}
                </Button>
                <Button variant="danger" type="reset">
                  Reset
                </Button>
              </Form>
            )}
          </Formik>
        </Row>
      </div>
    </Container>
  );
}
