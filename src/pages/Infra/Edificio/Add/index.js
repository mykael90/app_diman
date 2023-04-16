import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Row,
  Col,
  Button,
  Badge,
  OverlayTrigger,
  Tooltip,
  Form as BootstrapForm,
} from 'react-bootstrap';
import Select from 'react-select';
import { FaPhone, FaPlus, FaTrashAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

import axios from '../../../../services/axios';
import Loading from '../../../../components/Loading';
import { primaryDarkColor } from '../../../../config/colors';

const renderTooltip = (props, message) => (
  <Tooltip id="button-tooltip" {...props}>
    {message}
  </Tooltip>
);

const emptyValues = {
  sections: [],
};

// eslint-disable-next-line react/no-unstable-nested-components
function Recursive({
  values,
  setFieldValue,
  nameArray = 'sections',
  level = 0,
}) {
  return (
    <FieldArray name={nameArray}>
      {({ push, remove, swap }) => {
        const addChild = (section, index) => {
          section.sections.push({ name: '', email: '', sections: [] });
          // o método swap é só pra atualizar o estado pq nao utilizei funcao nativa do formik para adicionar o form filho
          swap(index, index);
        };
        return (
          <>
            <Row className="pb-3">
              {level === 0 ? (
                <Col xs="auto">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => push({ name: '', email: '', sections: [] })}
                    style={{ marginLeft: `${level * 20}px` }}
                  >
                    <FaPlus /> Divisão
                  </Button>
                </Col>
              ) : null}
            </Row>
            <Row>
              <Row>
                {values.sections.map((section, index) => (
                  <Row
                    key={index}
                    style={{ background: 'rgba(69, 98, 150, 0.25)' }}
                  >
                    <Row>
                      <BootstrapForm.Group
                        as={Col}
                        xs={4}
                        controlId={`${nameArray}.${index}.name`}
                        // className="border-0 m-0 p-0 d-none"
                      >
                        <BootstrapForm.Label
                        // htmlFor={`${nameArray}.${index}.name`}
                        // style={{ marginLeft: `${level * 20}px` }}
                        >
                          Name
                        </BootstrapForm.Label>
                        <Field
                          // id={`${nameArray}.${index}.name`}
                          name={`${nameArray}.${index}.name`}
                          type="text"
                          as={BootstrapForm.Control}
                          size="sm"
                        />
                      </BootstrapForm.Group>
                      <BootstrapForm.Group
                        as={Col}
                        xs={4}
                        controlId={`${nameArray}.${index}.email`}
                        //  className="border-0 m-0 p-0 d-none"
                      >
                        <BootstrapForm.Label
                        // htmlFor={`${nameArray}.${index}.email`}
                        >
                          Email
                        </BootstrapForm.Label>
                        <Field
                          // id={`${nameArray}.${index}.email`}
                          name={`${nameArray}.${index}.email`}
                          type="email"
                          as={BootstrapForm.Control}
                          size="sm"
                        />
                      </BootstrapForm.Group>
                      <Col xs={4}>
                        <Button type="button" onClick={() => remove(index)}>
                          Remove Section
                        </Button>
                        <Button
                          type="button"
                          onClick={() => addChild(section, index)}
                        >
                          Add Child
                        </Button>
                      </Col>
                    </Row>
                    <Row>
                      {' '}
                      {section.sections.length > 0 ? (
                        <Recursive
                          values={section}
                          setFieldValue={setFieldValue}
                          level={level + 1}
                          nameArray={`${nameArray}.${index}.sections`}
                        />
                      ) : null}
                    </Row>
                  </Row>
                ))}
              </Row>
            </Row>
          </>
        );
      }}
    </FieldArray>
  );
}

function MyForm({ initialValues = null }) {
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = !!initialValues;

  return (
    <>
      <Loading isLoading={isLoading} />
      <Container>
        <Row className="justify-content-center">
          <Col
            xs={12}
            className=" text-center"
            style={{ background: primaryDarkColor, color: 'white' }}
          >
            <span className="fs-5">
              {isEditMode ? 'Editar' : 'Adicionar'} Divisões em Instalações
              Físicas
            </span>
          </Col>
        </Row>
        <Row className="pt-2">
          <Formik initialValues={emptyValues}>
            {({
              values,
              errors,
              touched,
              setFieldValue,
              handleReset,
              handleChange,
              handleBlur,
              setFieldTouched,
            }) => (
              <Form as BootstrapForm onReset={handleReset}>
                <h3>PRÉDIO TAL</h3>
                <Recursive values={values} setFieldValue={setFieldValue} />
                <Row className="justify-content-center pt-2 pb-4">
                  <Col xs="auto" className="text-center">
                    <Button variant="danger" type="reset">
                      Limpar
                    </Button>
                  </Col>
                  <Col xs="auto" className="text-center">
                    <Button variant="success" type="submit">
                      {isEditMode ? 'Alterar' : 'Cadastrar'}
                    </Button>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </Row>
      </Container>
    </>
  );
}

export default MyForm;
