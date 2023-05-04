/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Formik } from 'formik'; // FormValidation
import * as yup from 'yup'; // RulesValidation
import { toast } from 'react-toastify';
import Select from 'react-select';

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

import ModalEdit from './components/ModalEdit';

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

const formatGroupLabel = (data) => (
  <Col className="d-flex justify-content-between">
    <span>{data.label}</span>
    <Badge bg="secondary">{data.options.length}</Badge>
  </Col>
);

const filterOptions = (row, filterValue) => {
  const arrayFilter = String(filterValue).split(' ');

  return arrayFilter.reduce((res, cur) => {
    // res -> response; cur -> currency (atual)
    res =
      res &&
      String(row.label).toLowerCase().includes(String(cur).toLowerCase());
    return res;
  }, true);
};

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
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [dataEdit, setDataEdit] = useState({});
  const [workers, setWorkers] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const inputRef = useRef();

  async function getWorkers() {
    try {
      setIsLoading(true);
      const response = await axios.get(`/workers/actives`);
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

  // cancel modal -> don't update data
  const handleCancelModal = () => {
    setShowModalEdit(false);
  };

  // close modal -> update data
  const handleSaveModal = () => {
    setShowModalEdit(false);
    getWorkers();
  };

  const handleShowModalEdit = (item) => {
    setDataEdit(item);
    setShowModalEdit(true);
  };

  useEffect(() => {
    getWorkers();

    // Focus on inputRef
    if (inputRef.current) {
      inputRef.current.focus();
    }

    async function getData() {
      const workersOp = [];
      try {
        setIsLoading(true);
        const response = await axios.get('/workers/actives');

        const workersJobs = response.data
          .filter(
            (value, index, arr) =>
              arr.findIndex((item) => item.job === value.job) === index
          )
          .map((value) => value.job); // RETORNA OS DIFERENTES TRABALHOS

        workersJobs.forEach((value) => {
          workersOp.push([
            value,
            response.data.filter((item) => item.job === value),
          ]);
        });

        const differentsContracts = Array.from(
          new Set(
            response.data.map((w) =>
              JSON.stringify(w.WorkerContracts[0]?.Contract)
            )
          )
        ).map((json) => JSON.parse(json));
        const differentsUnidades = Array.from(
          new Set(
            response.data.map((w) =>
              JSON.stringify(
                w.WorkerContracts[0]?.Unidade
                  ? w.WorkerContracts[0]?.Unidade
                  : ''
              )
            )
          )
        ).map((json) => JSON.parse(json));

        setWorkers(workersOp);
        setContracts(differentsContracts.filter((item) => item));
        setUnidades(differentsUnidades.filter((item) => item));

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
        // Make an expander cell
        Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }) => (
          <span {...getToggleAllRowsExpandedProps()}>
            {isAllRowsExpanded ? '▽' : '▷'}
          </span>
        ),
        id: 'expander', // It needs an ID
        width: 30,
        disableResizing: true,
        isVisible: window.innerWidth > 768,
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
        isVisible: window.innerWidth > 768,
      },
      {
        Header: 'Idade',
        id: 'age',
        width: 70,
        disableResizing: true,
        accessor: (originalRow) =>
          originalRow.birthdate
            ? Math.floor(
                (new Date() - new Date(originalRow.birthdate).getTime()) /
                  3.15576e10
              )
            : null,
        isVisible: window.innerWidth > 768,
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
        isVisible: window.innerWidth > 768,
      },
      {
        Header: 'Contrato',
        id: 'contract',
        width: 100,
        disableResizing: true,
        disableSortBy: true,
        accessor: (originalRow) => {
          const index = originalRow.WorkerContracts.length;
          if (index === 0) return 'INATIVO';
          if (originalRow.WorkerContracts[index - 1]?.end) return 'DESLIGADO';
          return originalRow.WorkerContracts[index - 1]?.Contract?.codigoSipac;
        },
        Filter: SelectColumnFilter,
        filter: 'includes',
        isVisible: window.innerWidth > 768,
      },
      {
        Header: 'Função',
        id: 'job',
        width: 200,
        disableResizing: true,
        disableSortBy: true,
        accessor: (originalRow) => {
          const index = originalRow.WorkerContracts.length;
          if (index === 0) return 'INDEFINIDO';
          return originalRow.WorkerContracts[index - 1]?.WorkerJobtype?.job;
        },
        Filter: SelectColumnFilter,
        filter: 'exactText',
        isVisible: window.innerWidth > 768,
      },
      {
        Header: 'Regime',
        id: 'regime',
        width: 140,
        disableResizing: true,
        disableSortBy: true,
        accessor: (originalRow) => {
          const index = originalRow.WorkerContracts.length;
          if (index === 0) return '';
          if (!originalRow.WorkerContracts[index - 1]?.WorkerContractRegime)
            return '';
          return originalRow.WorkerContracts[index - 1]?.WorkerContractRegime
            .regime;
        },
        Filter: SelectColumnFilter,
        filter: 'exactText',
        isVisible: window.innerWidth > 768,
      },
      // {
      //   Header: 'Phone',
      //   accessor: 'phone',
      //   width: 140,
      //   disableResizing: true,
      //   disableSortBy: true,
      //   Cell: ({ value }) => {
      //     if (!value) return null;
      //     const custom = value.replace(
      //       /(\d{2})(\d{1})(\d{4})(\d{4})/gm,
      //       '($1) $2.$3-$4'
      //     ); // deixar só os dois primeiros nomes
      //     return <span> {custom}</span>;
      //   },
      //   Filter: InputColumnFilter,
      //   filter: 'text',
      //   isVisible: window.innerWidth > 768,
      // },
      {
        Header: 'Atuação',
        id: 'acting',
        width: 200,
        disableResizing: true,
        disableSortBy: true,
        accessor: (originalRow) => {
          const index = originalRow.WorkerContracts.length;
          if (index === 0) return '';
          if (!originalRow.WorkerContracts[index - 1]?.acting) return '';
          return originalRow.WorkerContracts[index - 1]?.acting;
        },
        Filter: SelectColumnFilter,
        filter: 'exactText',
        isVisible: window.innerWidth > 768,
      },
      // {
      //   Header: 'E-mail',
      //   accessor: 'email',
      //   width: 160,
      //   disableResizing: true,
      //   disableSortBy: true,
      //   Filter: InputColumnFilter,
      //   filter: 'text',
      //   isVisible: window.innerWidth > 768,
      // },
      {
        Header: 'Unidade',
        id: 'unit',
        width: 120,
        disableResizing: true,
        disableSortBy: true,
        accessor: (originalRow) => {
          const index = originalRow.WorkerContracts.length;
          return `${originalRow.WorkerContracts[index - 1]?.Unidade?.id}-${
            originalRow.WorkerContracts[index - 1]?.Unidade?.sigla
          }`;
        },
        Filter: SelectColumnFilter,
        filter: 'includes',
        isVisible: window.innerWidth > 768,
      },
      {
        Header: ({ value, row }) => (
          <div className="text-center">Nome - Função - Contrato</div>
        ),
        id: 'mobile',
        width: 100,
        disableResizing: false,
        disableSortBy: true,
        defaultCanFilter: true,
        isVisible: window.innerWidth < 768,
        Cell: ({ value, row }) => {
          const index = row.original.WorkerContracts.length;
          return (
            <>
              <Row>
                <Col className="d-flex justify-content-center">
                  <Image
                    crossOrigin=""
                    src={row.original.urlPhoto}
                    alt="Foto de perfil do colaborador"
                    width="270"
                    rounded="true"
                  />
                </Col>
              </Row>
              <Row className="d-flex justify-content-center py-2">
                <Col xs="11" className="text-center bg-light mx-2">
                  {row.original.name}
                </Col>
              </Row>

              <Row className="d-flex justify-content-center">
                <Col xs="auto" className="mt-0 pt-0 text-center">
                  <Badge
                    className="text-dark bg-light"
                    style={{
                      fontSize: '0.8em',
                    }}
                  >
                    {index > 0
                      ? row.original.WorkerContracts[index - 1]?.WorkerJobtype
                          ?.job
                      : 'INDEFINIDO'}
                  </Badge>
                </Col>
                <Col xs="auto" className="mt-0 pt-0">
                  <Badge
                    className="text-dark bg-light"
                    style={{
                      fontSize: '0.8em',
                    }}
                  >
                    {index === 0
                      ? 'INATIVO'
                      : row.original.WorkerContracts[index - 1]?.end
                      ? 'DESLIGADO'
                      : row.original.WorkerContracts[index - 1]?.Contract
                          ?.codigoSipac}
                  </Badge>
                </Col>
              </Row>
              {/* <Row className="d-flex justify-content-end">
                <Col xs="auto">
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    className="border-0 m-0"
                    onClick={(e) => handleShowModalEdit(row.original)}
                  >
                    <FaPencilAlt />
                  </Button>
                </Col>
              </Row> */}
            </>
          );
        },
      },
      // {
      //   // Make an expander cell
      //   Header: () => null, // No header
      //   id: 'actions', // It needs an ID
      //   width: 40,
      //   disableResizing: true,
      //   Cell: ({ row }) => (
      //     // Use Cell to render an expander for each row.
      //     // We can use the getToggleRowExpandedProps prop-getter
      //     // to build the expander.
      //     // <Link to={`/collaborator/record/update/${row.original.id}`}>
      //     <Button
      //       size="sm"
      //       variant="outline-secondary"
      //       className="border-0 m-0"
      //       onClick={(e) => handleShowModalEdit(row.original)}
      //     >
      //       <FaPencilAlt />
      //     </Button>
      //     // </Link>
      //   ),
      // },
    ],
    []
  );

  // Create a function that will render our row sub components
  const renderRowSubComponent = React.useCallback(({ row }) => {
    const columns = [
      {
        Header: 'Contrato',
        id: 'contract',
        width: 125,
        disableResizing: true,
        disableSortBy: true,
        accessor: (originalRow) => originalRow.Contract?.codigoSipac,
        isVisible: window.innerWidth > 768,
      },
      {
        Header: 'Função',
        id: 'job',
        accessor: (originalRow) => originalRow.WorkerJobtype?.job,
        disableSortBy: true,
        isVisible: window.innerWidth > 768,
        // eslint-disable-next-line react/destructuring-assignment
      },
      {
        Header: 'Início',
        id: 'startBr',
        accessor: (originalRow) => originalRow.startBr,
        width: 100,
        disableResizing: true,
        disableSortBy: true,
        isVisible: window.innerWidth > 768,
      },
      {
        Header: 'Fim',
        accessor: 'endBr',
        width: 100,
        disableResizing: true,
        disableSortBy: true,
        isVisible: window.innerWidth > 768,
        // eslint-disable-next-line react/destructuring-assignment
      },
      {
        Header: 'Lotado',
        id: 'unidade',
        width: 200,
        disableResizing: true,
        disableSortBy: true,
        accessor: (originalRow) =>
          `${originalRow.Unidade?.id}-${originalRow.Unidade?.sigla}`,
        isVisible: window.innerWidth > 768,
        // eslint-disable-next-line react/destructuring-assignment
      },
      {
        Header: ({ value, row }) => (
          <div className="text-start">Contrato - Função - Inicio - Fim</div>
        ),
        id: 'mobile',
        width: 100,
        disableResizing: false,
        disableSortBy: true,
        defaultCanFilter: true,
        isVisible: window.innerWidth < 768,
        Cell: ({ value, row }) => (
          <Row>
            <Col xs="auto" className="text-start mb-0 pb-0">
              {row.original.Contract?.codigoSipac}
            </Col>
            <Col xs="auto" className="mt-0 pt-0">
              <Badge
                className="text-dark bg-light"
                style={{
                  fontSize: '0.8em',
                }}
              >
                {row.original.WorkerJobtype?.job}
              </Badge>
            </Col>
            <Col xs="auto" className="mt-0 pt-0">
              <Badge
                className="text-dark bg-success text-white"
                style={{
                  fontSize: '0.8em',
                }}
              >
                {row.original.startBr}
              </Badge>
            </Col>
            <Col xs="auto" className="mt-0 pt-0">
              <Badge
                className="text-dark bg-danger text-white"
                style={{
                  fontSize: '0.8em',
                }}
              >
                {row.original.endBr}
              </Badge>
            </Col>
          </Row>
        ),
      },
    ];
    return (
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
              columns={columns}
              data={row.original.WorkerContracts}
              defaultColumn={{
                // Let's set up our default Filter UI
                // Filter: DefaultColumnFilter,
                minWidth: 30,
                width: 50,
                maxWidth: 800,
              }}
              initialState={{
                // sortBy: [
                //   {
                //     id: 'name',
                //     asc: true,
                //   },
                // ],
                hiddenColumns: [
                  ...columns
                    .filter((col) => col.isVisible === false)
                    .map((col) => col.id),
                  ...columns
                    .filter((col) => col.isVisible === false)
                    .map((col) => col.accessor),
                ],
              }}
              filterTypes={filterTypes}
            />
          </Col>
        </Row>
      </>
    );
  }, []);

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
    hiddenColumns: [
      ...columns.filter((col) => col.isVisible === false).map((col) => col.id),
      ...columns
        .filter((col) => col.isVisible === false)
        .map((col) => col.accessor),
    ],
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
        <ModalEdit // modal p/ liberação de materiais
          handleCancelModal={handleCancelModal}
          handleSaveModal={handleSaveModal}
          show={showModalEdit}
          data={dataEdit}
        />
        <Row>
          <Formik
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={(values) => {
              // getData(values);
              console.log(values);
            }}
          >
            {({
              handleSubmit,
              handleChange,
              handleBlur,
              values,
              touched,
              errors,
              setFieldValue,
            }) => (
              <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Row className="align-items-top">
                  <Form.Group
                    as={Col}
                    xs={12}
                    lg={3}
                    // controlId="workerId"
                    className="pb-3"
                  >
                    <Form.Label>CONTRATO:</Form.Label>
                    <Select
                      inputId="ContractId"
                      options={contracts.map((contract) => ({
                        value: contract.id,
                        label: `${contract.codigoSipac} - ${contract.objeto} `,
                      }))}
                      value={
                        values.ContractId
                          ? unidades.find(
                              (option) => option.value === values.ContractId
                            )
                          : null
                      }
                      onChange={(selected) => {
                        setFieldValue('ContractId', selected.value);
                      }}
                      placeholder="Selecione o contrato"
                      onBlur={handleBlur}
                    />
                    {touched.ContractId && !!errors.ContractId ? (
                      <Badge bg="danger">{errors.ContractId}</Badge>
                    ) : null}
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    xs={12}
                    lg={4}
                    // controlId="workerId"
                    className="pb-3"
                  >
                    <Form.Label>UNIDADE:</Form.Label>
                    <Select
                      inputId="UnidadeId"
                      options={unidades.map((unidade) => ({
                        value: unidade.id,
                        label: `${unidade.id} - ${unidade.nomeUnidade} `,
                      }))}
                      value={
                        values.UnidadeId
                          ? unidades.find(
                              (option) => option.value === values.UnidadeId
                            )
                          : null
                      }
                      onChange={(selected) => {
                        setFieldValue('UnidadeId', selected.value);
                        setFieldValue(
                          'date',
                          new Date().toISOString().split('T')[0]
                        );
                      }}
                      placeholder="Selecione a unidade"
                      onBlur={(e) => {
                        handleBlur(e);
                      }}
                    />
                    {touched.UnidadeId && !!errors.UnidadeId ? (
                      <Badge bg="danger">{errors.UnidadeId}</Badge>
                    ) : null}
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    xs={12}
                    lg={2}
                    controlId="startDate"
                    className="pb-3"
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
                    lg={2}
                    controlId="endDate"
                    className="pb-3"
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
                  <Col xs="12" sm="auto" lg={1} className="align-self-end pb-3">
                    <Button type="submit" variant="outline-primary">
                      <FaSearch />
                    </Button>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </Row>
        <Row className="text-center py-3">
          <Card.Title>Colaboradores com contrato vigente</Card.Title>
          <Card.Text>
            Listagem de todos os colabores que se encontram com contrato ativo e
            válido.
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
