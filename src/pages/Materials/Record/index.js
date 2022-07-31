/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { useTable, useSortBy } from 'react-table';
import { Container, Row } from 'react-bootstrap';

import data3024 from '../../../assets/JSON/materials3024JSON.json';

export default function index() {
  const data = React.useMemo(() => data3024.sipac, []);

  const columns = React.useMemo(
    () => [
      { Header: 'ID', accessor: 'id_sipac' },
      { Header: 'Denominação', accessor: 'name' },
      { Header: 'Unidade', accessor: 'unit' },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);

  return (
    <Container>
      <Row className="my-4 py-4" style={{ backgroundColor: 'white' }}>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    style={{
                      borderBottom: 'solid 3px red',
                      color: 'black',
                    }}
                  >
                    {column.render('Header')}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? '🔽'
                          : '🔼'
                        : ''}
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
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps()}
                      style={{
                        padding: '10px',
                        border: 'solid 1px gray',
                      }}
                    >
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </Row>
    </Container>
  );
}
