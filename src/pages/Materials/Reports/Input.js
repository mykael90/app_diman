/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import { toast } from 'react-toastify';

import { Table, Container, Row, Card } from 'react-bootstrap';

import axios from '../../../services/axios';
import Loading from '../../../components/Loading';

// import generic table from material's components with global filter and nested row
import TableGfilterNestedrow from '../components/TableGfilterNestedRow';
import TableNestedrow from '../components/TableNestedRow';

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const [reqs, setReqs] = useState([]);

  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true);
        const response = await axios.get('/materials/in/');
        setReqs(response.data);
        setIsLoading(false);
      } catch (err) {
        const errors = get(err, 'response.data.errors', []);
        errors.map((error) => toast.error(error));
        setIsLoading(false);
      }
    }

    getData();
  }, []);

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
        Header: 'Nº RM',
        accessor: 'req',
        width: 120,
        disableResizing: true,
      },
      {
        Header: 'Tipo',
        accessor: 'type',
        width: 120,
        disableResizing: true,
      },
      {
        Header: 'Valor',
        accessor: 'value',
        width: 120,
        disableResizing: true,
      },
      {
        Header: 'Pedido em:',
        accessor: 'registerDate',
        width: 120,
        disableResizing: true,
      },
      {
        Header: 'Pedido por:',
        accessor: 'requiredBy',
        width: 150,
        disableResizing: true,
      },
      {
        Header: 'Receb. em:',
        accessor: 'createdAt',
        width: 120,
        disableResizing: true,
      },
      {
        Header: 'Receb. por:',
        accessor: 'receivedBy',
        width: 150,
        disableResizing: true,
      },
      {
        Header: 'Unidade de Custo',
        accessor: 'costUnit',
        isVisible: window.innerWidth > 576,
      },
    ],
    []
  );

  const data = React.useMemo(() => reqs, [reqs]);

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
        id: 'req',
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
      <>
        <spam className="fw-bold">Especificação:</spam>{' '}
        {row.original.specification}
      </>
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
              <span {...row.getToggleRowExpandedProps()}>
                {row.isExpanded ? '▽' : '▷'}
              </span>
            ),
          },
          {
            Header: 'ID',
            accessor: 'material_id',
            width: 125,
            disableResizing: true,
            isVisible: window.innerWidth > 576,
          },
          { Header: 'Denominação', accessor: 'name', width: 500 },
          {
            Header: 'Unidade',
            accessor: 'unit',
            width: 100,
            disableResizing: true,
          },
          {
            Header: 'Qtd',
            accessor: 'quantity',
            width: 100,
            disableResizing: true,
          },
          {
            Header: 'Valor',
            accessor: 'value',
            width: 100,
            disableResizing: true,
          },
        ]}
        data={row.original.MaterialInItems}
        defaultColumn={{
          // Let's set up our default Filter UI
          // Filter: DefaultColumnFilter,
          minWidth: 30,
          width: 120,
          maxWidth: 800,
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
      <Loading isLoading={isLoading} />
      <Container>
        <Row className="text-center py-3">
          <Card.Title>Relatório de Entrada: Materiais</Card.Title>
          <Card.Text>
            Materiais com entrada registrada por SIPAC, Doação, Retorno, etc.
          </Card.Text>
        </Row>

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
