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

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const [resultData, setResultData] = useState([]);
  const inputRef = useRef();

  const schema = yup.object().shape({
    startDate: yup
      .date()
      .max(
        new Date().toISOString().split('T')[0],
        'Escolha uma data passada para a data de início'
      ),
    endDate: yup
      .date()
      .max(
        new Date().toISOString().split('T')[0],
        'Escolha uma data passada para a data final'
      ),
  });
  const initialValues = {
    startDate: new Date(new Date().getFullYear(), 0, 1)
      .toISOString()
      .split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    deficit: true,
  };

  useEffect(() => {
    // Focus on inputRef
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  async function getData(values) {
    const formattedValues = { ...values };
    const date = new Date(formattedValues.endDate);
    // Add a day (because between dont include limits)
    date.setDate(date.getDate() + 1);
    formattedValues.endDate = date.toISOString().split('T')[0];
    try {
      setIsLoading(true);
      const response = await axios.post(
        '/materials/raw/maintenanceBalanceOutput',
        formattedValues
      );

      setIsLoading(false);

      const groupData = response.data
        .filter(
          (value, index, arr) =>
            arr.findIndex(
              (item) => item.reqMaintenance === value.reqMaintenance
            ) === index
        )
        .map((value) => ({
          reqMaintenance: value.reqMaintenance,
          workerName: value.workerName,
          authorizedBy: value.authorizedBy,
          maxCreatedAt: value.maxCreatedAtOut,
          place: value.place,
        })); // RETORNA AS DIFERENTES REQUISIÇÕES

      groupData.forEach((req) => {
        req.materials = response.data.filter(
          (value) => req.reqMaintenance === value.reqMaintenance
        );
      });
      console.log(groupData);

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
        Header: () => null, // No header
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
        Header: 'Req. Man.',
        accessor: 'reqMaintenance',
        width: 120,
        disableResizing: true,
      },
      {
        Header: 'Última Saída',
        accessor: 'maxCreatedAt',
        width: 150,
        disableResizing: true,
      },
      {
        Header: 'Profissional',
        accessor: 'workerName',
        Cell: ({ value }) => <div className="text-start">{value}</div>,
      },
      {
        Header: 'Responsável',
        accessor: 'authorizedBy',
        width: 200,
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
        Header: 'Local',
        accessor: 'place',
        width: 250,
        disableResizing: true,
      },
    ],
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
        id: 'maxCreatedAt',
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
            // Make an expander cell
            Header: () => null, // No header
            id: 'expander', // It needs an ID
            width: 30,
            disableResizing: true,
            Cell: ({ row }) => (
              // Use Cell to render an expander for each row.
              // We can use the getToggleRowExpandedProps prop-getter
              // to build the expander.
              <Row>
                <span {...row.getToggleRowExpandedProps()}>
                  {row.isExpanded ? '▽' : '▷'}
                </span>
              </Row>
            ),
          },
          {
            Header: 'ID',
            accessor: 'materialIdOut',
            width: 125,
            disableResizing: true,
            isVisible: window.innerWidth > 576,
          },
          { Header: 'Denominação', accessor: 'name' },
          {
            Header: 'Unidade',
            accessor: 'unit',
            width: 100,
            disableResizing: true,
          },
          {
            Header: 'Entradas',
            accessor: 'SumQuantitySipac',
            width: 100,
            disableResizing: true,
          },
          {
            Header: 'Saídas',
            accessor: 'sumEffectiveQuantityOut',
            width: 100,
            disableResizing: true,
          },
          {
            Header: 'Balanço',
            accessor: 'quantityBalance',
            width: 100,
            disableResizing: true,
          },
        ]}
        data={row.original.materials}
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

  return (
    <>
      {' '}
      <Loading isLoading={isLoading} />
      <Container>
        <Row className="text-center py-3">
          <Card.Title>Balanço de Saída por Requisição de Manutenção</Card.Title>
          <Card.Text>
            Balanço para realizar reposição, saídas efetivas (descontados os
            retornos).
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
                      onChange={handleChange}
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
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Início"
                    />
                    {touched.endDate && !!errors.endDate ? (
                      <Badge bg="danger">{errors.endDate}</Badge>
                    ) : null}
                  </Form.Group>
                  <Col xs="12" sm="auto" className="mt-3 align-self-end">
                    <Form.Check
                      name="deficit"
                      type="checkbox"
                      id="deficit"
                      label="Mostrar apenas déficits"
                      value={values.deficit}
                      onChange={handleChange}
                      defaultChecked
                    />
                  </Col>
                  <Col xs="12" sm="auto" className="align-self-end">
                    <Button type="submit" variant="outline-primary">
                      <FaSearch /> Consultar
                    </Button>
                  </Col>
                </Row>
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
