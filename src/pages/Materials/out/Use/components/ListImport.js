/* eslint-disable react/prop-types */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { FaPlus } from 'react-icons/fa';

import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';

// import generic table from material's components with global filter and nested row
import TableGfilterNestedRowHiddenRows from '../../../components/TableGfilterNestedRowHiddenRows';

export default function Index(props) {
  const { push, hiddenItems, materialsBalance } = props;

  const [hiddenRows, setHiddenRows] = useState(hiddenItems);
  const oldQuantity = useRef(0);

  const handleQuantityChange = (e, row) => {
    const errors = [];
    if (e.target.value > row.values.total)
      errors.push('A saída não pode superar o saldo do material');
    if (e.target.value < 0) errors.push('A saída não pode ser negativa');

    if (errors.length > 0) {
      errors.map((error) => toast.error(error));
      e.target.value = oldQuantity.current;
      return;
    }
    oldQuantity.current = e.target.value;
    row.values.quantity = oldQuantity.current;
  };

  const handlePushItem = React.useMemo(
    () => (e, row) => {
      if (row.isExpanded === true) {
        toast.error('Feche a linha de especificação para poder inserir o item');
        return;
      }

      // row.isExpanded ? row.isExpanded = false;
      // não incluir repetido na lista (não precisa mais pq nao aparece)
      if (hiddenRows.length > 0) {
        let exists = false;

        hiddenRows.every((value) => {
          if (value.MaterialId === row.values.material_id) {
            exists = true;
            return false;
          }
          return true;
        });

        if (exists) {
          toast.error('Item já incluído na lista de saída');
          return;
        }
      }

      // adicionar na lista de saída
      push({
        MaterialId: row.values.material_id,
        name: row.values.name,
        unit: row.values.unit,
        balance: row.values.total,
        quantity: row.values.quantity ?? 0,
      });

      const newHiddenRows = [...hiddenRows, row.values.material_id];
      setHiddenRows(newHiddenRows);
    },
    [hiddenRows, push]
  );

  // Define a custom filter filter function!
  function filterDifferentThan(rows, id) {
    return rows.filter((row) => {
      const rowValue = row.values[id];
      return !hiddenRows.includes(rowValue);
    });
  }

  // trigger to custom filter
  function DefaultColumnFilter() {
    return <> </>;
  } // as colunas padrao nao aplicam filtro

  function FilterForId({ column: { setFilter } }) {
    useEffect(() => {
      setFilter('');
    }, []);
    return <> </>;
  }

  const columns = React.useMemo(
    () => [
      {
        // Make an expander cell
        Header: () => null, // No header
        id: 'expander', // It needs an ID
        width: 30,
        disableResizing: true,
        canFilter: false,
        filterable: false,
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
        filter: filterDifferentThan,
        Filter: FilterForId,
      },
      { Header: 'Denominação', accessor: 'name', disableFilters: true },
      {
        Header: 'Unidade',
        accessor: 'unit',
        width: 100,
        disableResizing: true,
        disableFilters: true,
      },
      {
        Header: 'Saldo',
        accessor: 'total',
        width: 80,
        disableResizing: true,
        disableFilters: true,
      },
      {
        // Make an expander cell
        Header: 'Saída', // No header
        id: 'quantity', // It needs an ID
        width: 120,
        disableResizing: true,
        disableFilters: true,
        Cell: ({ row }) => (
          <Col className="d-flex">
            <Form.Control
              id={`s_${row.values.material_id}`}
              size="sm"
              type="number"
              onChange={(e) => handleQuantityChange(e, row)}
            />
            <Button
              onClick={(e) => handlePushItem(e, row)}
              variant="outline-success"
              size="sm"
              className="border-0"
            >
              <FaPlus size={18} />
            </Button>
          </Col>
        ),
      },
    ],
    [handlePushItem]
  );

  const data = React.useMemo(() => materialsBalance, [materialsBalance]);

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter, // coloca filtro para todas as colunas
      minWidth: 30,
      width: 120,
      maxWidth: 800,
    }),
    []
  );

  const initialState = {
    sortBy: [
      {
        id: 'name',
        asc: true,
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

  // Create a function that will render our row sub components
  const renderRowSubComponent = React.useCallback(
    ({ row }) => (
      <>
        <span className="fw-bold">Especificação:</span>{' '}
        {row.original.specification}
      </>
    ),
    []
  );

  return (
    <Container>
      <Row className="text-center py-3">
        <Card.Title>Materiais Cadastrados</Card.Title>
        <Card.Text>
          Referências extraídas via SIPAC (grupos: 3024, 3026).
        </Card.Text>
      </Row>
      <TableGfilterNestedRowHiddenRows
        columns={columns}
        data={data}
        defaultColumn={defaultColumn}
        initialState={initialState}
        filterTypes={filterTypes}
        renderRowSubComponent={renderRowSubComponent}
      />
    </Container>
  );
}