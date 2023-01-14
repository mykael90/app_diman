/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  FaPencilAlt,
  FaSearch,
  FaSearchPlus,
  FaSearchMinus,
} from 'react-icons/fa';

import {
  Container,
  Row,
  Card,
  Col,
  Button,
  OverlayTrigger,
  Tooltip,
  Badge,
  Image,
  Dropdown,
  Form,
} from 'react-bootstrap';

import axios from '../../../../services/axios';
import Loading from '../../../../components/Loading';

// import generic table from material's components with global filter and nested row
import TableGfilterNestedRowHiddenRows from '../../../Materials/components/TableGfilterNestedRowHiddenRows';
import TableNestedrow from '../../../Materials/components/TableNestedRow';

// trigger to custom filter
function DefaultColumnFilter() {
  return <> </>;
} // as colunas padrao nao aplicam filtro

function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);
  // Render a multi-select box
  return (
    <Col>
      <OverlayTrigger
        placement="left"
        delay={{ show: 250, hide: 400 }}
        overlay={(props) => renderTooltip(props, `Filter for ${id}`)}
      >
        <Dropdown>
          <Dropdown.Toggle
            variant="outline-primary"
            size="sm"
            id="dropdown-group"
            className="border-0"
          >
            {filterValue ? <span>{filterValue}</span> : <FaSearch />}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => {
                setFilter('');
              }}
            >
              Remover Filtro
            </Dropdown.Item>
            {options.sort().map((option, i) => (
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

function InputColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);
  // Render a multi-select box
  return (
    <Row>
      <Col xs="auto" className="pe-0">
        <OverlayTrigger
          placement="left"
          delay={{ show: 250, hide: 400 }}
          overlay={(props) => renderTooltip(props, `Filter for ${id}`)}
        >
          <Button
            variant="outline-primary"
            size="sm"
            id="dropdown-group"
            className="border-0"
            onClick={(e) => {
              e.preventDefault();
              const searchInput = e.currentTarget.parentElement.nextSibling;

              if (searchInput.className.includes('d-none')) {
                searchInput.className = searchInput.className.replace(
                  'd-none',
                  'd-inline'
                );
              } else {
                searchInput.className = searchInput.className.replace(
                  'd-inline',
                  'd-none'
                );
                setFilter(undefined);
              }

              return true;
            }}
          >
            {!filterValue ? <FaSearchPlus /> : <FaSearchMinus />}
          </Button>
        </OverlayTrigger>
      </Col>
      <Col className="ps-1 d-none">
        <Form.Control
          type="text"
          size="sm"
          value={filterValue || ''}
          onChange={(e) => {
            setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
          }}
        />
      </Col>
    </Row>
  );
}
function InputDateColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);
  // Render a multi-select box
  return (
    <>
      <Row className="py-0 my-0">
        <Col xs="auto" className="pe-0 my-0 py-0">
          <OverlayTrigger
            placement="left"
            delay={{ show: 250, hide: 400 }}
            overlay={(props) => renderTooltip(props, `Filter for ${id}`)}
          >
            <Button
              variant="outline-primary"
              size="sm"
              id="dropdown-group"
              className="border-0"
              onClick={(e) => {
                e.preventDefault();
                const searchInputAfter =
                  e.currentTarget.parentElement.parentElement.nextSibling;
                const searchInputBefore =
                  e.currentTarget.parentElement.parentElement.nextSibling
                    .nextSibling;

                if (searchInputAfter.className.includes('d-none')) {
                  searchInputAfter.className =
                    searchInputAfter.className.replace('d-none', 'd-block');
                  searchInputBefore.className =
                    searchInputBefore.className.replace('d-none', 'd-block');
                } else {
                  searchInputAfter.className =
                    searchInputAfter.className.replace('d-block', 'd-none');
                  searchInputBefore.className =
                    searchInputBefore.className.replace('d-block', 'd-none');
                  setFilter(undefined);
                }

                return true;
              }}
            >
              {!filterValue ? <FaSearchPlus /> : <FaSearchMinus />}
            </Button>
          </OverlayTrigger>
        </Col>
      </Row>
      <Row className="d-none">
        <Col className="fw-normal">De:</Col>
        <Col xs={12}>
          <Form.Control
            type="date"
            size="sm"
            value={filterValue?.after || ''}
            onChange={(e) => {
              setFilter(
                { after: e.target.value, before: filterValue?.before } ||
                  undefined
              ); // Set undefined to remove the filter entirely
            }}
            style={{ width: '110px' }}
          />
        </Col>
      </Row>
      <Row className="d-none">
        <Col className="fw-normal">Até:</Col>
        <Col xs={12}>
          <Form.Control
            type="date"
            size="sm"
            value={filterValue?.before || ''}
            onChange={(e) => {
              setFilter(
                { after: filterValue?.after, before: e.target.value } ||
                  undefined
              ); // Set undefined to remove the filter entirely
            }}
            style={{ width: '110px' }}
          />
        </Col>
      </Row>
    </>
  );
}
function InputValueColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);
  // Render a multi-select box
  return (
    <>
      <Row className="py-0 my-0">
        <Col xs="auto" className="pe-0 my-0 py-0">
          <OverlayTrigger
            placement="left"
            delay={{ show: 250, hide: 400 }}
            overlay={(props) => renderTooltip(props, `Filter for ${id}`)}
          >
            <Button
              variant="outline-primary"
              size="sm"
              id="dropdown-group"
              className="border-0"
              onClick={(e) => {
                e.preventDefault();
                const searchInputAfter =
                  e.currentTarget.parentElement.parentElement.nextSibling;
                const searchInputBefore =
                  e.currentTarget.parentElement.parentElement.nextSibling
                    .nextSibling;

                if (searchInputAfter.className.includes('d-none')) {
                  searchInputAfter.className =
                    searchInputAfter.className.replace('d-none', 'd-block');
                  searchInputBefore.className =
                    searchInputBefore.className.replace('d-none', 'd-block');
                } else {
                  searchInputAfter.className =
                    searchInputAfter.className.replace('d-block', 'd-none');
                  searchInputBefore.className =
                    searchInputBefore.className.replace('d-block', 'd-none');
                  setFilter(undefined);
                }

                return true;
              }}
            >
              {!filterValue ? <FaSearchPlus /> : <FaSearchMinus />}
            </Button>
          </OverlayTrigger>
        </Col>
      </Row>
      <Row className="d-none">
        <Col className="fw-normal">Mín R$:</Col>
        <Col xs={12}>
          <Form.Control
            type="number"
            size="sm"
            value={filterValue?.after || ''}
            onChange={(e) => {
              setFilter(
                { after: e.target.value, before: filterValue?.before } ||
                  undefined
              ); // Set undefined to remove the filter entirely
            }}
            style={{ width: '110px' }}
            step="any"
          />
        </Col>
      </Row>
      <Row className="d-none">
        <Col className="fw-normal">Máx R$:</Col>
        <Col xs={12}>
          <Form.Control
            type="number"
            size="sm"
            value={filterValue?.before || ''}
            onChange={(e) => {
              setFilter(
                { after: filterValue?.after, before: e.target.value } ||
                  undefined
              ); // Set undefined to remove the filter entirely
            }}
            style={{ width: '110px' }}
            step="any"
          />
        </Col>
      </Row>
    </>
  );
}

const renderTooltip = (props, message) => (
  <Tooltip id="button-tooltip" {...props}>
    {message}
  </Tooltip>
);

const renderTooltipImage = (props, message, src) => (
  <Tooltip id="button-tooltip" className="opacity-100" {...props}>
    <Image
      crossOrigin=""
      src={src}
      alt="Foto de perfil do colaborador"
      width="150"
      rounded="true"
    />

    <div>{message}</div>
  </Tooltip>
);

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const [workersFormated, setWorkersFormated] = useState([]);

  useEffect(() => {
    async function getWorkers() {
      try {
        setIsLoading(true);
        const response = await axios.get(`/workers/`);
        setWorkersFormated(response.data);
        setIsLoading(false);
      } catch (err) {
        // eslint-disable-next-line no-unused-expressions
        err.response?.data?.errors
          ? err.response.data.errors.map((error) => toast.error(error)) // errors -> resposta de erro enviada do backend (precisa se conectar com o back)
          : toast.error(err.message); // e.message -> erro formulado no front (é criado pelo front, não precisa de conexão)
        setIsLoading(false);
      }
    }

    getWorkers();
  }, []);

  const columns = React.useMemo(
    () => [
      {
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
        Header: ({ value, row }) => <div className="text-start">Nome</div>,
        accessor: 'name',
        disableSortBy: true,
        Cell: ({ value, row }) => (
          <OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 400 }}
            overlay={(props) =>
              renderTooltipImage(
                props,
                value.split(' ')[0],
                `${process.env.REACT_APP_BASE_AXIOS_REST}/workers/images/${
                  row.original.filenamePhoto ?? 'default.png'
                }`
              )
            }
          >
            <Row
              onClick={(e) => alert('Funcionalidade em implantação')}
              style={{ cursor: 'pointer' }}
            >
              <Col className="text-start">{value} </Col>
            </Row>
          </OverlayTrigger>
        ),
        Filter: InputColumnFilter,
        filter: 'text',
      },
      {
        Header: 'Função',
        width: 200,
        disableResizing: true,
        disableSortBy: true,
        accessor: (originalRow) => {
          const index = originalRow.WorkerContracts.length;
          if (index === 0) return 'INDEFINIDO';
          return originalRow.WorkerContracts[index - 1]?.WorkerJobtype?.job;
        },
        Filter: SelectColumnFilter,
        filter: 'includes',
      },
      // {
      //   Header: ({ value, row }) => <div className="text-start">Nome</div>,
      //   accessor: 'name',
      //   disableSortBy: true,
      //   Cell: ({ value, row }) => (
      //     <Row>
      //       <Col xs="12" className="text-start mb-0 pb-0">
      //         {value}
      //       </Col>
      //       <Col xs="auto" className="mt-0 pt-0">
      //         <Badge
      //           className="text-dark bg-light mt-0 pt-0"
      //           style={{
      //             fontSize: '0.6em',
      //           }}
      //         >
      //           {row.original.job}
      //         </Badge>
      //       </Col>
      //     </Row>
      //   ),
      // },
      {
        Header: 'Idade',
        width: 70,
        disableResizing: true,
        accessor: (originalRow) =>
          originalRow.birthdate
            ? Math.floor(
                (new Date() - new Date(originalRow.birthdate).getTime()) /
                  3.15576e10
              )
            : null,
      },
      {
        Header: 'CPF',
        accessor: 'cpf',
        width: 130,
        disableResizing: true,
        disableSortBy: true,
        Cell: ({ value }) => {
          if (!value) return null;
          const custom = value.replace(
            /(\d{3})(\d{3})(\d{3})(\d{2})/gm,
            '$1.$2.$3-$4'
          ); // deixar só os dois primeiros nomes
          return <span> {custom}</span>;
        },
        Filter: InputColumnFilter,
        filter: 'text',
      },
      {
        Header: 'Telefone',
        accessor: 'phone',
        width: 140,
        disableResizing: true,
        disableSortBy: true,
        Cell: ({ value }) => {
          if (!value) return null;
          const custom = value.replace(
            /(\d{2})(\d{1})(\d{4})(\d{4})/gm,
            '($1) $2.$3-$4'
          ); // deixar só os dois primeiros nomes
          return <span> {custom}</span>;
        },
        Filter: InputColumnFilter,
        filter: 'text',
      },
      {
        Header: 'E-mail',
        accessor: 'email',
        width: 160,
        disableResizing: true,
        disableSortBy: true,
        Filter: InputColumnFilter,
        filter: 'text',
      },
      {
        Header: 'Contrato',
        width: 100,
        disableResizing: true,
        disableSortBy: true,
        accessor: (originalRow) => {
          const index = originalRow.WorkerContracts.length;
          if (index === 0) return 'INATIVO';
          console.log(originalRow.WorkerContracts[index - 1]?.end);
          if (originalRow.WorkerContracts[index - 1]?.end) return 'DESLIGADO';
          return originalRow.WorkerContracts[index - 1]?.Contract?.codigoSipac;
        },
        Filter: SelectColumnFilter,
        filter: 'includes',
      },
      {
        Header: 'Lotado',
        width: 120,
        disableResizing: true,
        disableSortBy: true,
        accessor: (originalRow) => {
          const index = originalRow.WorkerContracts.length;
          return `${originalRow.WorkerContracts[index - 1]?.Unidade?.id}-${
            originalRow.WorkerContracts[index - 1]?.Unidade?.sigla
          }`;
        },
        Filter: InputColumnFilter,
        filter: 'text',
      },
      {
        // Make an expander cell
        Header: () => null, // No header
        id: 'actions', // It needs an ID
        width: 40,
        disableResizing: true,
        Cell: ({ row }) => (
          // Use Cell to render an expander for each row.
          // We can use the getToggleRowExpandedProps prop-getter
          // to build the expander.
          <Link to={`/collaborator/record/update/${row.original.id}`}>
            <Button
              size="sm"
              variant="outline-secondary"
              className="border-0 m-0"
            >
              <FaPencilAlt />
            </Button>
          </Link>
        ),
      },
    ],
    []
  );

  // Create a function that will render our row sub components
  const renderRowSubComponent = React.useCallback(
    ({ row }) => (
      <>
        <Row className="mb-2">
          <Col>
            {' '}
            <Badge>CONTRATOS VINCULADOS AO COLABORADOR</Badge>
          </Col>
        </Row>
        <Row>
          <Col>
            <TableNestedrow
              style={{ padding: 0, margin: 0 }}
              columns={[
                {
                  Header: 'Contrato',
                  width: 125,
                  disableResizing: true,
                  disableSortBy: true,
                  accessor: (originalRow) => originalRow.Contract?.codigoSipac,
                },
                {
                  Header: 'JobId',
                  accessor: (originalRow) => originalRow.WorkerJobtype?.job,
                  disableSortBy: true,
                  // eslint-disable-next-line react/destructuring-assignment
                },
                {
                  Header: 'Início',
                  accessor: 'startBr',
                  width: 100,
                  disableResizing: true,
                  disableSortBy: true,
                },
                {
                  Header: 'Fim',
                  accessor: 'endBr',
                  width: 100,
                  disableResizing: true,
                  disableSortBy: true,
                  // eslint-disable-next-line react/destructuring-assignment
                },
                {
                  Header: 'Lotado',
                  width: 180,
                  disableResizing: true,
                  disableSortBy: true,
                  accessor: (originalRow) =>
                    `${originalRow.Unidade?.id}-${originalRow.Unidade?.sigla}`,
                  // eslint-disable-next-line react/destructuring-assignment
                },
              ]}
              data={row.original.WorkerContracts}
              defaultColumn={{
                // Let's set up our default Filter UI
                // Filter: DefaultColumnFilter,
                minWidth: 30,
                width: 50,
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
            />
          </Col>
        </Row>
      </>
    ),
    []
  );

  const data = React.useMemo(() => workersFormated, [workersFormated]);

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
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
    pageSize: 50,
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

      rangeDate: (rows, ids, filterValue) => {
        rows = rows.filter((row) =>
          ids.some((id, index) => {
            const rowValue = row.values[id];

            // Date row
            const rowDate = rowValue.split('/');
            const day = Number(rowDate[0]);
            const month = Number(rowDate[1]) - 1;
            const year = Number(rowDate[2].substring(0, 4));
            const rowDateFormated = new Date(year, month, day);
            console.log(
              row.values[id],
              rowDateFormated,
              rowDateFormated.getTime()
            );

            // Date After
            let dateAfterFormated;
            if (filterValue.after) {
              const dateAfter = filterValue.after?.split('-');
              const dayAfter = Number(dateAfter[2]);
              const monthAfter = Number(dateAfter[1]) - 1;
              const yearAfter = Number(dateAfter[0].substring(0, 4));
              dateAfterFormated = new Date(yearAfter, monthAfter, dayAfter);
              console.log(
                filterValue.after,
                dateAfterFormated,
                dateAfterFormated.getTime()
              );
            }

            // Date Before
            let dateBeforeFormated;
            if (filterValue.before) {
              const dateBefore = filterValue.before?.split('-');
              const dayBefore = Number(dateBefore[2]);
              const monthBefore = Number(dateBefore[1]) - 1;
              const yearBefore = Number(dateBefore[0].substring(0, 4));
              dateBeforeFormated = new Date(yearBefore, monthBefore, dayBefore);
              console.log(
                filterValue.before,
                dateBeforeFormated,
                dateBeforeFormated.getTime()
              );
            }

            if (filterValue.after && filterValue.before)
              return (
                rowDateFormated.getTime() >= dateAfterFormated.getTime() &&
                rowDateFormated.getTime() <= dateBeforeFormated.getTime()
              );

            if (filterValue.after)
              return rowDateFormated.getTime() >= dateAfterFormated.getTime();

            if (filterValue.before)
              return rowDateFormated.getTime() <= dateBeforeFormated.getTime();

            return true;
          })
        );
        return rows;
      },

      rangeValue: (rows, ids, filterValue) => {
        rows = rows.filter((row) =>
          ids.some((id, index) => {
            const rowValue = row.values[id];

            // Value row
            let rowValueFormated;
            if (row.values[id]) {
              rowValueFormated = Number(
                rowValue.split(' ')[1].replace(',', '.')
              );
              console.log(row.values[id], rowValueFormated);
            }

            // Value After
            let valueAfterFormated;
            if (filterValue.after) {
              valueAfterFormated = Number(filterValue.after);
              console.log(filterValue.after, valueAfterFormated);
            }

            // Value Before
            let valueBeforeFormated;
            if (filterValue.before) {
              valueBeforeFormated = Number(filterValue.before);
              console.log(filterValue.before, valueBeforeFormated);
            }

            if (filterValue.after && filterValue.before)
              return (
                rowValueFormated >= valueAfterFormated &&
                rowValueFormated <= valueBeforeFormated
              );

            if (filterValue.after)
              return rowValueFormated >= valueAfterFormated;

            if (filterValue.before)
              return rowValueFormated <= valueBeforeFormated;

            return true;
          })
        );
        return rows;
      },
    }),
    []
  );

  return (
    <>
      <Loading isLoading={isLoading} />
      <Container>
        <Row className="text-center py-3">
          <Card.Title>Colaboradores Cadastrados</Card.Title>
          <Card.Text>
            Listagem de todos os colabores que já foram registrados no sistema,
            inclusive desligados. Se deseja visualizar apenas colaboradoes
            ativos realize a filtragem por contrato.
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
