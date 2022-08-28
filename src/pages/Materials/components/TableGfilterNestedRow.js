/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import React, { useRef } from 'react';
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  useFlexLayout,
  useResizeColumns,
  useExpanded,
} from 'react-table';
import { Form, Table, Row, Col } from 'react-bootstrap';
import {
  FaFilter,
  FaSortAlphaDown,
  FaSortAlphaUp,
  FaSort,
} from 'react-icons/fa';

export function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const inputRef = useRef();
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  // eslint-disable-next-line no-shadow
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <Form onSubmit={(e) => e.preventDefault()}>
      <Form.Group
        as={Row}
        className="d-flex align-items-center"
        controlId="searchForm"
      >
        <Form.Label column xs="auto" className="pe-0">
          <FaFilter className="text-dark" />
        </Form.Label>
        <Col>
          <Form.Control
            size="sm"
            type="text"
            value={value || ''}
            onChange={(e) => {
              setValue(e.target.value.toUpperCase());
              onChange(e.target.value);
            }}
            placeholder={` ${count} registros...`}
            className="border-0"
            autoComplete="off"
            autoFocus
            ref={inputRef}
          />
        </Col>
      </Form.Group>
    </Form>
  );
}

export default function TableGfilterNestedrow({
  columns,
  data,
  defaultColumn,
  filterTypes,
  initialState,
  renderRowSubComponent,
}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      globalFilter: 'text',
      filterTypes,
      initialState,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    useFlexLayout,
    useResizeColumns,
    useExpanded
  );

  return (
    <>
      <Row className="justify-content-center">
        <Col
          xs={10}
          sm={8}
          md={6}
          className="bg-light py-3 px-3 border rounded"
        >
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        </Col>
      </Row>

      <Row className="py-3">
        <Table bordered hover size="sm" {...getTableProps()} responsive="sm">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    <span>
                      {' '}
                      <FaSort />
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <FaSortAlphaUp />
                        ) : (
                          <FaSortAlphaDown />
                        )
                      ) : (
                        ''
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <>
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td
                        className="py-3"
                        style={{
                          verticalAlign: 'middle',
                        }}
                        {...cell.getCellProps()}
                      >
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                  {/*
                    If the row is in an expanded state, render a row with a
                    column that fills the entire length of the table.
                  */}
                  {row.isExpanded ? (
                    <tr {...row.getRowProps()} className="border-0">
                      <td
                        colSpan={visibleColumns.length}
                        style={{ borderColor: 'rgb(222,226,230)' }}
                      >
                        {/*
                          Inside it, call our renderRowSubComponent function. In reality,
                          you could pass whatever you want as props to
                          a component like this, including the entire
                          table instance. But for this example, we'll just
                          pass the row
                        */}
                        {renderRowSubComponent({ row })}
                      </td>
                    </tr>
                  ) : null}
                </>
              );
            })}
          </tbody>
        </Table>
      </Row>
    </>
  );
}
