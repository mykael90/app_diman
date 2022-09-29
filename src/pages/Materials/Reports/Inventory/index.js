/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import { FaLock, FaLockOpen, FaSearch, FaChartLine } from 'react-icons/fa';

import {
  Container,
  Col,
  Row,
  Card,
  Button,
  Dropdown,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';

import TransactionsModal from './components/TransactionsModal';

import axios from '../../../../services/axios';
import Loading from '../../../../components/Loading';

// import generic table from material's components with global filter and nested row
import TableGfilterNestedRowHiddenRows from '../../components/TableGfilterNestedRowHiddenRows';
import { primaryDarkColor } from '../../../../config/colors';

const renderTooltip = (props, message) => (
  <Tooltip id="button-tooltip" {...props}>
    {message}
  </Tooltip>
);

// trigger to custom filter
function DefaultColumnFilter() {
  return <> </>;
} // as colunas padrao nao aplicam filtro

// This is a custom filter UI for selecting
// a unique option from a list
function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id].toString().substring(0, 4));
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    <Col>
      <OverlayTrigger
        placement="left"
        delay={{ show: 250, hide: 400 }}
        overlay={(props) =>
          renderTooltip(props, 'Filtragem por grupo de material')
        }
      >
        <Dropdown>
          <Dropdown.Toggle
            variant="outline-primary"
            size="sm"
            id="dropdown-group"
            className="border-0"
          >
            <FaSearch /> {filterValue}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => {
                setFilter('');
              }}
            >
              Remover Filtro
            </Dropdown.Item>
            {options.map((option, i) => (
              <Dropdown.Item
                key={i}
                onClick={() => {
                  setFilter(option || undefined);
                }}
              >
                {option}{' '}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </OverlayTrigger>
    </Col>
  );
}

// Define a custom filter filter function!
function filterGreaterThan(rows, id, filterValue) {
  return rows.filter((row) => {
    const rowValue = Number(row.values[id]);
    return rowValue >= filterValue;
  });
}

const FilterForTotal = ({
  column: { filterValue, preFilteredRows, setFilter, id },
}) =>
  React.useMemo(
    () => (
      <div>
        {filterValue === 1 ? (
          <OverlayTrigger
            placement="top"
            delay={{ show: 250, hide: 400 }}
            overlay={(props) =>
              renderTooltip(props, 'Clique para mostrar materiais sem saldo')
            }
          >
            <Button size="sm" variant="outline-primary" className="border-0">
              <FaLock cursor="pointer" onClick={() => setFilter(0)} />
            </Button>
          </OverlayTrigger>
        ) : (
          <OverlayTrigger
            placement="bottom"
            delay={{ show: 250, hide: 400 }}
            overlay={(props) =>
              renderTooltip(
                props,
                'Clique para não mostrar materiais sem saldo'
              )
            }
          >
            <Button size="sm" variant="outline-primary" className="border-0">
              <FaLockOpen cursor="pointer" onClick={() => setFilter(1)} />
            </Button>
          </OverlayTrigger>
        )}
      </div>
    ),
    [filterValue, setFilter]
  );

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const [inventorydata, setInventoryData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [materialIdModal, setMaterialIdModal] = useState('');

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = (materialId) => {
    setMaterialIdModal(materialId);
    setShowModal(true);
  };

  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true);
        const response = await axios.get('/materials/inventory/');
        setInventoryData(response.data);
        setIsLoading(false);
      } catch (err) {
        // eslint-disable-next-line no-unused-expressions
        err.response?.data?.errors
          ? err.response.data.errors.map((error) => toast.error(error)) // errors -> resposta de erro enviada do backend (precisa se conectar com o back)
          : toast.error(err.message); // e.message -> erro formulado no front (é criado pelo front, não precisa de conexão)
        setIsLoading(false);
      }
    }

    getData();
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: () => (
          // FORMAT HEADER
          <div className="p-auto text-center">Informações Gerais</div>
        ),
        id: 'Data',
        columns: [
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
            accessor: 'materialId',
            width: 125,
            disableResizing: true,
            isVisible: window.innerWidth > 576,
            disableSortBy: true,
            Filter: SelectColumnFilter,
            filter: 'groupMaterial',
          },
          { Header: 'Denominação', accessor: 'name', disableFilters: true },
          {
            Header: 'Unidade',
            accessor: 'unit',
            width: 100,
            disableSortBy: true,
            disableResizing: true,
            disableFilters: true,
          },
        ],
      },
      {
        Header: () => (
          // FORMAT HEADER
          <div className="p-auto text-center">Saldo</div>
        ),
        id: 'Saldo',
        columns: [
          {
            Header: () => (
              // FORMAT HEADER
              <div className="p-auto text-center">Comum</div>
            ),
            accessor: 'freeInventory',
            width: 100,
            disableResizing: true,
            disableFilters: true,
            disableSortBy: true,
            isVisible: window.innerWidth > 576,
            Cell: ({ value, row }) => (
              <div className="p-auto text-end">
                {value}{' '}
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 250, hide: 400 }}
                  overlay={(props) =>
                    renderTooltip(props, 'Consultar histórico de transações')
                  }
                >
                  <Button
                    size="sm"
                    variant="outline-success"
                    className="border-0"
                    onClick={() => {
                      handleShowModal(row.original.materialId);
                    }}
                  >
                    <FaChartLine />
                  </Button>
                </OverlayTrigger>
              </div>
            ),
          },
          {
            Header: () => (
              // FORMAT HEADER
              <div className="p-auto text-center">Restrito</div>
            ),
            accessor: 'restrictInventory',
            width: 100,
            disableResizing: true,
            disableFilters: true,
            disableSortBy: true,
            isVisible: window.innerWidth > 576,
            Cell: ({ value, row }) => (
              <div className="p-auto text-end">
                {value}{' '}
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 250, hide: 400 }}
                  overlay={(props) =>
                    renderTooltip(props, 'Consultar histórico de transações')
                  }
                >
                  <Button
                    size="sm"
                    variant="outline-danger"
                    className="border-0"
                    onClick={() => {
                      handleShowModal(row.original.materialId);
                    }}
                  >
                    <FaChartLine />
                  </Button>
                </OverlayTrigger>
              </div>
            ),
          },
          {
            Header: () => (
              // FORMAT HEADER
              <div className="p-auto text-center">Total</div>
            ),
            accessor: 'totalInventory',
            width: 100,
            disableResizing: true,
            filterValue: 1,
            disableSortBy: true,
            filter: filterGreaterThan,
            Filter: FilterForTotal,
            Cell: ({ value, row }) => (
              <div className="p-auto text-end">
                {value}{' '}
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 250, hide: 400 }}
                  overlay={(props) =>
                    renderTooltip(props, 'Consultar histórico de transações')
                  }
                >
                  <Button
                    size="sm"
                    variant="outline-primary"
                    className="border-0"
                    onClick={() => {
                      handleShowModal(row.original.materialId);
                    }}
                  >
                    <FaChartLine />
                  </Button>
                </OverlayTrigger>
              </div>
            ),
          },
        ],
      },
    ],
    []
  );

  const data = React.useMemo(() => inventorydata, [inventorydata]);

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
    filters: [{ id: 'totalInventory', value: 1 }],
    pageSize: 20,
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
      groupMaterial: (rows, ids, filterValue) => {
        rows = rows.filter((row) =>
          ids.some((id) => {
            const rowValue = row.values[id].toString().substring(0, 4);
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
    <>
      {' '}
      <Loading isLoading={isLoading} />
      <Container>
        <TransactionsModal // modal p/ pesquisa de materiais
          handleClose={handleCloseModal}
          show={showModal}
          materialId={materialIdModal}
        />
        <Row className="text-center py-3">
          <Card.Title>Inventário de Materiais</Card.Title>
          <Card.Text>
            Saldo comum, restrito e total do depósito transitório da DIMAN/INFRA
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
    </>
  );
}
