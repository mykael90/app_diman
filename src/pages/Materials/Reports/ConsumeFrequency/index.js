/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Formik } from 'formik'; // FormValidation
import * as yup from 'yup'; // RulesValidation

import { FaSearch } from 'react-icons/fa';

import {
  Container,
  Col,
  Row,
  Card,
  Button,
  Form,
  Badge,
} from 'react-bootstrap';

import axios from '../../../../services/axios';
import Loading from '../../../../components/Loading';

// import generic table from material's components with global filter and nested row
import TableGfilterNestedrow from '../../components/TableGfilterNestedRow';
import TableNestedrow from '../../components/TableNestedRow';

function mydiff(date1, date2, interval) {
  // diferença entre datas
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const workDay = week / 5;
  const year = day * 365;
  const month = year / 12;
  date1 = new Date(date1);
  date2 = new Date(date2);
  const timediff = date2 - date1;
  if (isNaN(timediff)) return NaN;
  switch (interval) {
    case 'years':
      return (timediff / year).toFixed(4);
    case 'months':
      return (timediff / month).toFixed(4);
    case 'weeks':
      return (timediff / week).toFixed(4);
    case 'days':
      return Math.floor(timediff / day).toFixed(4);
    case 'workDays':
      return Math.floor(timediff / workDay).toFixed(4);
    case 'hours':
      return Math.floor(timediff / hour).toFixed(4);
    case 'minutes':
      return Math.floor(timediff / minute).toFixed(4);
    case 'seconds':
      return Math.floor(timediff / second).toFixed(4);
    default:
      return undefined;
  }
}

const updatePeriods = (startDate, endDate) => ({
  workDays: mydiff(startDate, endDate, 'workDays'),
  weeks: mydiff(startDate, endDate, 'weeks'),
  months: mydiff(startDate, endDate, 'months'),
  years: mydiff(startDate, endDate, 'years'),
});

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const [resultData, setResultData] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [medias, setMedias] = useState(false);
  const inputRef = useRef();

  const schema = yup.object().shape({
    startDate: yup
      .date()
      .min(
        // the month is 0-indexed
        new Date(2022, 9, 14).toISOString().split('T')[0],
        'Data inferior ao início do sistema'
      )
      .max(
        new Date().toISOString().split('T')[0],
        'Escolha uma data passada para a data início'
      ),
    endDate: yup
      .date()
      .min(
        // the month is 0-indexed
        new Date(2022, 9, 14).toISOString().split('T')[0],
        'Escolha uma data superior a data de início do sistema'
      )
      .max(
        new Date().toISOString().split('T')[0],
        'Escolha uma data passada para a data final'
      ),
  });
  const initialValues = {
    startDate: '2022-10-14',
    endDate: new Date().toISOString().split('T')[0],
    medias: false,
  };

  useEffect(() => {
    // Focus on inputRef
    if (inputRef.current) {
      inputRef.current.focus();
    }

    setPeriods(
      updatePeriods('2022-10-14', new Date().toISOString().split('T')[0])
    );
  }, []);

  async function getData(values) {
    try {
      setIsLoading(true);
      const response = await axios.post('/materials/raw/consumeOutput', values);

      setIsLoading(false);

      const groupData = response.data
        .filter(
          (value, index, arr) =>
            arr.findIndex(
              (item) => item.materialIdOut === value.materialIdOut
            ) === index
        )
        .map((value) => ({
          materialIdOut: value.materialIdOut,
          name: value.name,
          unit: value.unit,
        })); // RETORNA OS DIFERENTES MATERIAIS

      groupData.forEach((mat) => {
        mat.output = response.data.filter(
          (value) => mat.materialIdOut === value.materialIdOut
        );
      });

      groupData.forEach((mat) => {
        mat.totalConsume = mat.output
          .reduce((ac, value) => {
            ac += Number(value.sumEffectiveQuantityOut);
            return ac;
          }, 0)
          .toFixed(2);
        mat.totalPrice = mat.output
          .reduce((ac, value) => {
            ac += Number(value.totalPrice);
            return ac;
          }, 0)
          .toFixed(2);
        mat.totalFrequency = mat.output
          .reduce((ac, value) => {
            ac += Number(value.outputFrequency);
            return ac;
          }, 0)
          .toFixed(2);
        mat.CF = (mat.totalConsume / mat.totalFrequency).toFixed(2);
      });

      setResultData(groupData);
    } catch (err) {
      // eslint-disable-next-line no-unused-expressions
      err.response?.data?.errors
        ? err.response.data.errors.map((error) => toast.error(error)) // errors -> resposta de erro enviada do backend (precisa se conectar com o back)
        : toast.error(err.message); // e.message -> erro formulado no front (é criado pelo front, não precisa de conexão)
      setIsLoading(false);
    }
  }

  const columns = React.useMemo(
    () => [
      {
        // Make an expander cell
        // Make an expander cell
        Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }) => (
          <span {...getToggleAllRowsExpandedProps()}>
            {isAllRowsExpanded ? '▽' : '▷'}
          </span>
        ),
        id: 'expander', // It needs an ID
        width: 30,
        disableResizing: true,
        Cell: ({ row }) => (
          // Use Cell to render an expander for each row.
          // We can use the getToggleRowExpandedProps prop-getter
          // to build the expander.
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? '▽' : '▷'}
          </span>
        ),
      },
      {
        Header: 'ID',
        accessor: 'materialIdOut',
        width: 125,
        disableResizing: true,
      },
      {
        Header: 'Denominação',
        accessor: 'name',
        Cell: ({ value }) => <div className="text-start">{value}</div>,
      },
      {
        Header: 'Unidade',
        accessor: 'unit',
        width: 100,
        disableResizing: true,
      },
      {
        Header: 'Consumo Total',
        accessor: 'totalConsume',
        width: 100,
        disableResizing: true,
        Cell: ({ value }) => (
          <div className="text-center">
            <Row>
              {' '}
              <Col>{value}</Col>
            </Row>
            {medias ? (
              <>
                <Row>
                  <Col>{(value / periods.workDays).toFixed(2)}/dia</Col>
                </Row>
                <Row>
                  <Col>{(value / periods.weeks).toFixed(2)}/sem</Col>
                </Row>
                <Row>
                  <Col>{(value / periods.months).toFixed(2)}/mes</Col>
                </Row>
                <Row>
                  <Col>{(value / periods.years).toFixed(2)}/ano</Col>
                </Row>
              </>
            ) : null}
          </div>
        ),
      },
      {
        Header: 'Frequência Total',
        accessor: 'totalFrequency',
        width: 100,
        disableResizing: true,
        Cell: ({ value }) => (
          <div className="text-center">
            <Row>
              {' '}
              <Col>{value}</Col>
            </Row>
            {medias ? (
              <>
                <Row>
                  <Col>{(value / periods.workDays).toFixed(2)}/dia</Col>
                </Row>
                <Row>
                  <Col>{(value / periods.weeks).toFixed(2)}/sem</Col>
                </Row>
                <Row>
                  <Col>{(value / periods.months).toFixed(2)}/mes</Col>
                </Row>
                <Row>
                  <Col>{(value / periods.years).toFixed(2)}/ano</Col>
                </Row>
              </>
            ) : null}
          </div>
        ),
      },
      {
        Header: 'Cons./Freq.',
        accessor: 'CF',
        width: 100,
        disableResizing: true,
        Cell: ({ value }) => (
          <div className="text-center">
            <Row>
              {' '}
              <Col>{value}</Col>
            </Row>
          </div>
        ),
      },
      {
        Header: 'Valor Total',
        accessor: 'totalPrice',
        width: 150,
        disableResizing: true,
        Cell: ({ value }) => (
          <div className="text-end">
            <Row>
              <Col>R$ {value.replace('.', ',')}</Col>
            </Row>
            {medias ? (
              <>
                <Row>
                  <Col>
                    R$ {(value / periods.workDays).toFixed(2).replace('.', ',')}
                    /dia
                  </Col>
                </Row>
                <Row>
                  <Col>
                    R$ {(value / periods.weeks).toFixed(2).replace('.', ',')}
                    /sem
                  </Col>
                </Row>
                <Row>
                  <Col>
                    R$ {(value / periods.months).toFixed(2).replace('.', ',')}
                    /mes
                  </Col>
                </Row>
                <Row>
                  <Col>
                    R$ {(value / periods.years).toFixed(2).replace('.', ',')}
                    /ano
                  </Col>
                </Row>
              </>
            ) : null}
          </div>
        ),
      },
    ],
    [medias]
  );

  const renderRowSubSubComponent = React.useCallback(
    ({ row }) => (
      <div>
        <span className="fw-bold">Especificação:</span>{' '}
        {row.original.specification}
      </div>
    ),
    []
  );

  // Create a function that will render our row sub components
  const renderRowSubComponent = React.useCallback(
    ({ row }) => (
      <TableNestedrow
        style={{ padding: 0, margin: 0 }}
        columns={[
          {
            Header: 'Data',
            accessor: 'createdAtOutBr',
            width: 120,
            disableResizing: true,
          },
          {
            Header: 'Req. Manut.',
            accessor: 'reqMaintenance',
            width: 100,
            disableResizing: true,
          },
          {
            Header: 'Profissional',
            accessor: 'workerName',
          },
          {
            Header: 'Responsável',
            accessor: 'authorizedBy',
            width: 150,
            disableResizing: true,
            Cell: ({ value }) => {
              const custom = String(value).replace(
                /(^[a-z]*)\.([a-z]*).*/gm,
                '$1.$2'
              ); // deixar só os dois primeiros nomes
              return <span> {custom}</span>;
            },
          },
          {
            Header: 'Consumo',
            accessor: 'sumEffectiveQuantityOut',
            width: 100,
            disableResizing: true,
          },
          {
            Header: 'Frequência',
            accessor: 'outputFrequency',
            width: 100,
            disableResizing: true,
          },
          {
            Header: 'Local',
            accessor: 'place',
            width: 200,
            disableResizing: true,
          },
          {
            Header: 'Preço Unit.',
            accessor: 'maxPriceValueOutBr',
            width: 100,
            disableResizing: true,
          },
          {
            Header: 'Preço Total',
            accessor: 'totalPrice',
            width: 100,
            disableResizing: true,
            Cell: ({ value }) => (
              <span>R$ {value.toFixed(2).replace('.', ',')}</span>
            ),
          },
        ]}
        data={row.original.output}
        defaultColumn={{
          // Let's set up our default Filter UI
          // Filter: DefaultColumnFilter,
          minWidth: 30,
          width: 50,
          maxWidth: 600,
        }}
        initialState={{
          sortBy: [
            {
              id: 'name',
              asc: true,
            },
          ],
          hiddenColumns: columns
            .filter((col) => col.isVisible === false)
            .map((col) => col.accessor),
        }}
        filterTypes={filterTypes}
        renderRowSubComponent={renderRowSubSubComponent}
      />
    ),
    []
  );

  const data = React.useMemo(() => resultData, [resultData]);

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      // Filter: DefaultColumnFilter,
      minWidth: 30,
      width: 120,
      maxWidth: 800,
    }),
    []
  );

  const initialState = {
    sortBy: [
      {
        id: 'totalFrequency',
        desc: true,
      },
    ],
    hiddenColumns: columns
      .filter((col) => col.isVisible === false)
      .map((col) => col.accessor),
  };

  const filterTypes = React.useMemo(
    () => ({
      // Override the default text filter to use
      // "startWith"
      text: (rows, ids, filterValue) => {
        rows = rows.filter((row) =>
          ids.some((id) => {
            const rowValue = row.values[id];
            const arrayFilter = String(filterValue).split(' ');

            return arrayFilter.reduce((res, cur) => {
              // res -> response; cur -> currency (atual)
              res =
                res &&
                String(rowValue)
                  .toLowerCase()
                  .includes(String(cur).toLowerCase());
              return res;
            }, true);
          })
        );
        return rows;
      },
    }),
    []
  );

  return (
    <>
      {' '}
      <Loading isLoading={isLoading} />
      <Container>
        <Row className="text-center py-3">
          <Card.Title>Consumos e frequências de uso de materiais</Card.Title>
          <Card.Text>
            Consumos (descontados os retornos) e frequências (nº de vezes que o
            material constou em saídas para uso) para o período informado.{' '}
            <br /> Data de início do sistema em 14/10/2022.
          </Card.Text>
        </Row>

        <Row>
          <Formik
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={(values) => {
              getData(values);
            }}
          >
            {({
              handleSubmit,
              handleChange,
              handleBlur,
              values,
              touched,
              errors,
            }) => (
              <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Row className="align-items-top">
                  <Form.Group
                    as={Col}
                    xs={12}
                    md={3}
                    lg={2}
                    controlId="startDate"
                    className="mt-2"
                  >
                    <Form.Label>DATA INÍCIO:</Form.Label>
                    <Form.Control
                      type="date"
                      value={values.startDate}
                      autoFocus
                      ref={inputRef}
                      onChange={(e) => {
                        handleChange(e);
                        setPeriods(
                          updatePeriods(values.startDate, values.endDate)
                        );
                      }}
                      onBlur={handleBlur}
                      placeholder="Início"
                    />
                    {touched.startDate && !!errors.startDate ? (
                      <Badge bg="danger">{errors.startDate}</Badge>
                    ) : null}
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    xs={12}
                    md={3}
                    lg={2}
                    controlId="endDate"
                    className="mt-2"
                  >
                    <Form.Label>DATA FINAL:</Form.Label>
                    <Form.Control
                      type="date"
                      value={values.endDate}
                      onChange={(e) => {
                        handleChange(e);
                        setPeriods(
                          updatePeriods(values.startDate, values.endDate)
                        );
                      }}
                      onBlur={handleBlur}
                      placeholder="Início"
                    />
                    {touched.endDate && !!errors.endDate ? (
                      <Badge bg="danger">{errors.endDate}</Badge>
                    ) : null}
                  </Form.Group>
                  <Col xs="12" sm="auto" className="mt-3 align-self-end">
                    <Form.Check
                      name="medias"
                      type="checkbox"
                      id="medias"
                      label="Mostrar médias"
                      value={values.medias}
                      onChange={(e) => {
                        handleChange(e);
                        setMedias(!medias);
                      }}
                    />
                  </Col>
                  <Col xs="12" sm="auto" className="mt-2 align-self-end">
                    <Button type="submit" variant="outline-primary">
                      <FaSearch /> Consultar
                    </Button>
                  </Col>
                </Row>

                {medias ? (
                  <Row className="pt-2">
                    <Col>
                      Valores considerados para cálculo de médias:
                      <Badge bg="secondary" className="px-2 mx-1">
                        Dias úteis (5 dias/semana): {periods.workDays}
                      </Badge>
                      <Badge bg="secondary" className="px-2 mx-1">
                        Semanas: {periods.weeks}
                      </Badge>
                      <Badge bg="secondary" className="px-2 mx-1">
                        Meses: {periods.months}
                      </Badge>
                      <Badge bg="secondary" className="px-2 mx-1">
                        Anos: {periods.years}
                      </Badge>
                    </Col>
                  </Row>
                ) : null}
              </Form>
            )}
          </Formik>
        </Row>

        <br />

        <TableGfilterNestedrow
          columns={columns}
          data={data}
          defaultColumn={defaultColumn}
          initialState={initialState}
          filterTypes={filterTypes}
          renderRowSubComponent={renderRowSubComponent}
        />
      </Container>
    </>
  );
}
