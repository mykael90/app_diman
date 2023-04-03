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
                          value={values.buildingSipacId}
                          onChange={(selectedOption) =>
                            setFieldValue('buildingSipacId', selectedOption)
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

                <Row className="d-flex justify-content-center align-items-center">
                  <Col
                    xs={12}
                    className="text-center"
                    style={{ background: primaryDarkColor, color: 'white' }}
                  >
                    <span className="fs-6">CONTRATOS</span>
                  </Col>

                  <FieldArray name="WorkerTaskItem">
                    {(fieldArrayProps) => {
                      const { remove, push } = fieldArrayProps;
                      return (
                        <Row className="d-flex justify-content-center align-items-center">
                          <Col md={12} lg={10}>
                            {values.WorkerTaskItem?.length > 0 &&
                              values.WorkerTaskItem?.map((item, index) => (
                                <div
                                  key={index}
                                  className="my-3 p-4 border"
                                  // style={{ background: '#E9EFFA' }}
                                >
                                  <Row>
                                    <Col className="fs-5 text-center">
                                      <Badge bg="info" text="white">
                                        Nº {index + 1}
                                      </Badge>
                                    </Col>
                                  </Row>

                                  <div key={index}>
                                    <Row className="d-flex justify-content-center align-items-center mt-2">
                                      <Form.Group
                                        as={Col}
                                        xs={12}
                                        md={12}
                                        lg={4}
                                        className="pb-3"
                                        controlId={`WorkerTaskItem[${index}].ContractId`}
                                      >
                                        <Form.Label>CONTRATO</Form.Label>
                                        {/* {console.log(
                                          touched.WorkerTaskItem[index]
                                            ?.ContractId,
                                          errors.WorkerTaskItem
                                        )} */}
                                        <Form.Select
                                          type="text"
                                          value={item.ContractId}
                                          onChange={(e) => {
                                            handleChange(e);
                                            checkUpdate(
                                              e.target.id,
                                              e.target.value.toUpperCase()
                                            );
                                          }}
                                          placeholder="Selecione o Contrato"
                                          onBlur={handleBlur}
                                          disabled={
                                            initialValues.WorkerTaskItem[index]
                                              ?.end ||
                                            initialValues.WorkerTaskItem[index]
                                              ?.ContractId
                                          }
                                        >
                                          <option>Selecione o Contrato</option>
                                          {contracts.map((contract) => (
                                            <option
                                              key={contract.id}
                                              value={contract.id}
                                            >
                                              {contract.codigoSipac} |{' '}
                                              {contract.objeto.slice(
                                                0,
                                                contract.objeto.length < 60
                                                  ? contract.objeto.length
                                                  : 60
                                              )}
                                            </option>
                                          ))}
                                        </Form.Select>
                                      </Form.Group>
                                      <Form.Group
                                        as={Col}
                                        xs={12}
                                        md={12}
                                        lg={4}
                                        controlId={`WorkerTaskItem[${index}].WorkerJobtypeId`}
                                        className="pb-3"
                                      >
                                        <Form.Label>FUNÇÃO</Form.Label>
                                        <Form.Select
                                          type="text"
                                          value={item.WorkerJobtypeId}
                                          onChange={(e) => {
                                            handleChange(e);
                                            checkUpdate(
                                              e.target.id,
                                              e.target.value.toUpperCase()
                                            );
                                          }}
                                          placeholder="Selecione a Função"
                                          onBlur={handleBlur}
                                          disabled={
                                            initialValues.WorkerTaskItem[index]
                                              ?.WorkerJobtypeId
                                          }
                                        >
                                          <option>Selecione a Função</option>
                                          {jobtypes.map((job) => (
                                            <option key={job.id} value={job.id}>
                                              {job.job}
                                            </option>
                                          ))}
                                        </Form.Select>
                                      </Form.Group>
                                      <Form.Group
                                        as={Col}
                                        xs={12}
                                        md={12}
                                        lg={4}
                                        controlId={`WorkerTaskItem[${index}].acting`}
                                        className="pb-3"
                                      >
                                        <Form.Label>ATUAÇÃO</Form.Label>
                                        <Form.Select
                                          type="text"
                                          value={item.acting}
                                          onChange={(e) => {
                                            handleChange(e);
                                            checkUpdate(
                                              e.target.id,
                                              e.target.value.toUpperCase()
                                            );
                                          }}
                                          placeholder="Selecione a atuação"
                                          onBlur={handleBlur}
                                          disabled={
                                            initialValues.WorkerTaskItem[index]
                                              ?.acting
                                          }
                                        >
                                          <option>Selecione a atuação</option>

                                          <option value="ALTA TENSÃO">
                                            ALTA TENSÃO
                                          </option>
                                          <option value="LÓGICA DE DADOS">
                                            LÓGICA DE DADOS
                                          </option>
                                          <option value="CENÁRIOS">
                                            CENÁRIOS
                                          </option>
                                        </Form.Select>
                                      </Form.Group>
                                    </Row>
                                    <Row className="d-flex justify-content-center align-items-center">
                                      <Form.Group
                                        as={Col}
                                        xs={12}
                                        md={12}
                                        lg={4}
                                        controlId={`WorkerTaskItem[${index}].WorkerContractRegimeId`}
                                        className="pb-3"
                                      >
                                        <Form.Label>REGIME</Form.Label>
                                        <Form.Select
                                          type="text"
                                          value={item.WorkerContractRegimeId}
                                          onChange={(e) => {
                                            handleChange(e);
                                            checkUpdate(
                                              e.target.id,
                                              e.target.value.toUpperCase()
                                            );
                                          }}
                                          placeholder="Selecione o regime"
                                          onBlur={handleBlur}
                                          disabled={
                                            initialValues.WorkerTaskItem[index]
                                              ?.end
                                          }
                                        >
                                          <option>Selecione o regime</option>
                                          {contractsRegimes.map((regime) => (
                                            <option
                                              key={regime.id}
                                              value={regime.id}
                                            >
                                              {regime.regime}
                                            </option>
                                          ))}
                                        </Form.Select>
                                      </Form.Group>
                                      <Form.Group
                                        as={Col}
                                        xs={12}
                                        md={12}
                                        lg={4}
                                        controlId={`WorkerTaskItem[${index}].WorkerContractDangerId`}
                                        className="pb-3"
                                      >
                                        <Form.Label>PERICULOSIDADE</Form.Label>
                                        <Form.Select
                                          type="text"
                                          value={item.WorkerContractDangerId}
                                          onChange={(e) => {
                                            handleChange(e);
                                            checkUpdate(
                                              e.target.id,
                                              e.target.value.toUpperCase()
                                            );
                                          }}
                                          placeholder="Selecione a periculosidade"
                                          onBlur={handleBlur}
                                          disabled={
                                            initialValues.WorkerTaskItem[index]
                                              ?.end
                                          }
                                        >
                                          <option>
                                            Selecione a periculosidade
                                          </option>
                                          {contractsDangers.map((danger) => (
                                            <option
                                              key={danger.id}
                                              value={danger.id}
                                            >
                                              {danger.danger}
                                            </option>
                                          ))}
                                        </Form.Select>
                                      </Form.Group>
                                      <Form.Group
                                        as={Col}
                                        xs={12}
                                        md={12}
                                        lg={4}
                                        controlId={`WorkerTaskItem[${index}].WorkerContractUnhealthyId`}
                                        className="pb-3"
                                      >
                                        <Form.Label>INSALUBRIDADE</Form.Label>
                                        <Form.Select
                                          type="text"
                                          value={item.WorkerContractUnhealthyId}
                                          onChange={(e) => {
                                            handleChange(e);
                                            checkUpdate(
                                              e.target.id,
                                              e.target.value.toUpperCase()
                                            );
                                          }}
                                          placeholder="Selecione a insalubridade"
                                          onBlur={handleBlur}
                                          disabled={
                                            initialValues.WorkerTaskItem[index]
                                              ?.end
                                          }
                                        >
                                          <option>
                                            Selecione a insalubridade
                                          </option>
                                          {contractsUnhealthies.map(
                                            (unhealthy) => (
                                              <option
                                                key={unhealthy.id}
                                                value={unhealthy.id}
                                              >
                                                {unhealthy.unhealthy}
                                              </option>
                                            )
                                          )}
                                        </Form.Select>
                                      </Form.Group>
                                    </Row>
                                    <Row className="d-flex justify-content-center align-items-center">
                                      <Form.Group
                                        as={Col}
                                        xs={12}
                                        md={12}
                                        lg={6}
                                        controlId={`WorkerTaskItem[${index}].unidadeId`}
                                        className="pb-3"
                                      >
                                        <Form.Label>LOTAÇÃO</Form.Label>
                                        <Form.Select
                                          type="text"
                                          value={item.unidadeId}
                                          onChange={(e) => {
                                            handleChange(e);
                                            checkUpdate(
                                              e.target.id,
                                              e.target.value.toUpperCase()
                                            );
                                          }}
                                          placeholder="Selecione a unidade de lotação"
                                          onBlur={handleBlur}
                                          disabled={
                                            initialValues.WorkerTaskItem[index]
                                              ?.end
                                          }
                                        >
                                          <option>
                                            Selecione a unidade de lotação
                                          </option>
                                          {unidades.map((unidade) => (
                                            <option
                                              key={unidade.id}
                                              value={unidade.id}
                                            >
                                              {unidade.id} |{' '}
                                              {unidade.nomeUnidade.slice(
                                                0,
                                                unidade.nomeUnidade.length < 60
                                                  ? unidade.nomeUnidade.length
                                                  : 60
                                              )}
                                            </option>
                                          ))}
                                        </Form.Select>
                                      </Form.Group>
                                      <Form.Group
                                        as={Col}
                                        xs={12}
                                        md={12}
                                        lg={3}
                                        controlId={`WorkerTaskItem[${index}].start`}
                                        className="pb-3"
                                      >
                                        <Form.Label>INÍCIO</Form.Label>
                                        <Form.Control
                                          type="date"
                                          value={item.start}
                                          onChange={(e) => {
                                            handleChange(e);
                                            checkUpdate(
                                              e.target.id,
                                              e.target.value.toUpperCase()
                                            );
                                          }}
                                          placeholder="Digite o inicio do contrato"
                                          onBlur={handleBlur}
                                          disabled={
                                            initialValues.WorkerTaskItem[index]
                                              ?.end
                                          }
                                        />
                                      </Form.Group>
                                      <Form.Group
                                        as={Col}
                                        xs={12}
                                        md={12}
                                        lg={3}
                                        controlId={`WorkerTaskItem[${index}].end`}
                                        className="pb-3"
                                      >
                                        <Form.Label>FIM</Form.Label>{' '}
                                        <OverlayTrigger
                                          placement="top"
                                          delay={{ show: 250, hide: 400 }}
                                          overlay={(props) =>
                                            renderTooltip(
                                              props,
                                              'Utilizar para desligamento do funcionário e mudança de função ou contrato'
                                            )
                                          }
                                        >
                                          <Button
                                            className="px-1 py-0"
                                            size="sm"
                                            variant="outline-dark"
                                            style={{ height: '20px' }}
                                          >
                                            ?
                                          </Button>
                                        </OverlayTrigger>
                                        <Form.Control
                                          type="date"
                                          value={item.end}
                                          onChange={(e) => {
                                            handleChange(e);
                                            checkUpdate(
                                              e.target.id,
                                              e.target.value.toUpperCase()
                                            );
                                          }}
                                          placeholder="Digite o fim do contrato"
                                          onBlur={handleBlur}
                                          disabled={
                                            initialValues.WorkerTaskItem[index]
                                              ?.end
                                          }
                                        />
                                      </Form.Group>
                                    </Row>

                                    <Row>
                                      <Form.Group
                                        xs={12}
                                        className="pb-3"
                                        controlId={`WorkerTaskItem[${index}].obs`}
                                      >
                                        <Form.Label>OBSERVAÇÕES:</Form.Label>
                                        <Form.Control
                                          as="textarea"
                                          rows={2}
                                          type="text"
                                          value={item.obs}
                                          onChange={(e) => {
                                            handleChange(e);
                                            checkUpdate(
                                              e.target.id,
                                              e.target.value.toUpperCase()
                                            );
                                          }}
                                          placeholder="Observações do contrato"
                                          onBlur={(e) => {
                                            setFieldValue(
                                              `WorkerTaskItem[${index}].obs`,
                                              e.target.value.toUpperCase()
                                            ); // UPPERCASE
                                            handleBlur(e);
                                          }}
                                          disabled={
                                            initialValues.WorkerTaskItem[index]
                                              ?.end
                                          }
                                        />
                                      </Form.Group>
                                    </Row>
                                    <Row className="d-flex justify-content-end pb-3">
                                      {initialValues.WorkerTaskItem[
                                        index
                                      ] ? null : (
                                        <Col xs="auto">
                                          <Button
                                            size="sm"
                                            variant="outline-danger"
                                            onClick={() => remove(index)}
                                          >
                                            <FaTrashAlt />
                                          </Button>
                                        </Col>
                                      )}
                                    </Row>
                                  </div>
                                  {touched.WorkerTaskItem &&
                                  errors.WorkerTaskItem
                                    ? errors.WorkerTaskItem[index]
                                      ? Object.values(
                                          errors.WorkerTaskItem[index]
                                        ).map((value) => (
                                          <Badge bg="danger" className="me-2">
                                            {value}
                                          </Badge>
                                        ))
                                      : null
                                    : null}
                                </div>
                              ))}
                            {id ? (
                              <Row className="mt-2">
                                <Col xs="auto">
                                  {' '}
                                  <Button
                                    size="sm"
                                    variant="outline-primary"
                                    onClick={(e) => {
                                      if (
                                        values.WorkerTaskItem.find(
                                          ({ end }) => end == null
                                        )
                                      ) {
                                        toast.error(
                                          'Para vincular um novo contrato ao colaborador, o contrato ativo precisa ser encerrado!'
                                        );
                                      } else {
                                        push(e);
                                      }
                                    }}
                                  >
                                    <FaPlus /> Novo contrato
                                  </Button>
                                </Col>
                              </Row>
                            ) : null}
                          </Col>
                        </Row>
                      );
                    }}
                  </FieldArray>
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
