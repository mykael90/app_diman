/* eslint-disable react/prop-types */
/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import {
  FaLock,
  FaLockOpen,
  FaSearch,
  FaPencilAlt,
  FaCheck,
} from 'react-icons/fa';

import {
  Container,
  Form,
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

// Create an editable cell renderer
function EditableCell({
  value: initialValue,
  row: { index, original },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
  handleUpdateDatabase, // nao ta funcionando, diz que nao é funcao, vou jogar a atualização aqui pra dentro
}) {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);
  const userId = useSelector((state) => state.auth.user.id);

  // fiz aqui pq referenciando com handleUpdateDatabase nao deu certo
  const handleUpdateInitialQuantity = async (e, values, actualBalance) => {
    e.preventDefault();
    console.log(userId);
    const { materialId } = values;
    const updateInitialQuantity = {
      userIdInitialQuantity: userId,
      dateInitialQuantity: new Date().toISOString(),
      initialQuantity: Number(actualBalance) - Number(values.balance),
    };

    try {
      // FAZ A ATUALIZAÇÃO DA SEPARAÇÃO
      await axios.put(
        `/materials/inventory/${materialId}`,
        updateInitialQuantity
      );

      // getData();

      toast.success(`Saldo inicial atualizado com sucesso`);
    } catch (err) {
      // eslint-disable-next-line no-unused-expressions
      err.response?.data?.errors
        ? err.response.data.errors.map((error) => toast.error(error)) // errors -> resposta de erro enviada do backend (precisa se conectar com o back)
        : toast.error(err.message); // e.message -> erro formulado no front (é criado pelo front, não precisa de conexão)
    }
  };

  const handleUpdateAsk = (e, values) => {
    e.preventDefault();
    console.log(e);
    console.log(e.currentTarget);
    console.log(e.currentTarget.nextSibling);
    // if (userId !== values.userId)
    //   return toast.error(
    //     `Reserva só pode ser cancelada pelo usuário que a criou.`
    //   );
    const form = e.currentTarget.nextSibling.firstChild;
    const btn = e.currentTarget.nextSibling.firstChild.nextSibling;
    form.className = form.className.replace('d-none', 'd-block');
    btn.className = btn.className.replace('d-none', 'd-block');
    e.currentTarget.className += ' d-none';
    return true;

    // e.currentTarget.remove();
  };

  const onChange = (e) => {
    e.preventDefault();
    setValue(e.target.value);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = (e) => {
    e.preventDefault();
    if (value) {
      handleUpdateInitialQuantity(e, original, value);
      updateMyData(index, id, value);
    }
    e.currentTarget.className += ' d-none';
  };

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <>
      {' '}
      <OverlayTrigger
        placement="left"
        delay={{ show: 250, hide: 400 }}
        overlay={(props) => renderTooltip(props, 'Editar saldo')}
      >
        <Button
          size="sm"
          variant="outline-danger"
          className={`border-0 m-0 ${
            original.dateInitialQuantity ? '' : 'd-none'
          }
              `}
          onClick={handleUpdateAsk}
        >
          <FaPencilAlt />
        </Button>
      </OverlayTrigger>
      <Form className="d-flex" onSubmit={onBlur}>
        <Form.Control
          type="number"
          size="sm"
          value={value}
          onChange={onChange}
          // onBlur={onBlur}
          className={original.dateInitialQuantity ? 'd-none' : ''}
          style={{ width: '75px' }}
        />
        <Button
          type="submit"
          variant="outline-success"
          size="sm"
          className={
            original.dateInitialQuantity ? 'd-none border-0' : 'border-0'
          }
        >
          <FaCheck size={18} />
        </Button>
      </Form>
    </>
  );
}

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

// Define a custom filter filter function! Usar quando tiver tudo redondo, estoque e entradas. Por enquanto vou mostrar saldo negativo
function filterGreaterThan(rows, id, filterValue) {
  console.log(filterValue);
  return rows.filter((row) => {
    const rowValue = Number(row.values[id]);
    if (filterValue === 1) return rowValue !== 0; // fiz esse ajuste para mostrar saldo negativo também, ficou estranho filterGreatherThan, podia ser outro nome, mas deixa assim por enquanto
    return true;
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
  const userId = useSelector((state) => state.auth.user.id);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [materialIdModal, setMaterialIdModal] = useState('');
  const [skipPageReset, setSkipPageReset] = React.useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = (materialId) => {
    setMaterialIdModal(materialId);
    setShowModal(true);
  };

  const handleUpdateDatabase = async (e, values, actualBalance) => {
    e.preventDefault();
    console.log('aqui');
    const { materialId } = values;
    const updateInitialQuantity = {
      userIdInitialQuantity: userId,
      dateInitialQuantity: new Date().toISOString(),
      initialQuantity: Number(actualBalance) - Number(values.balance),
    };

    try {
      setIsLoading(true);

      // FAZ A ATUALIZAÇÃO DA SEPARAÇÃO
      await axios.put(
        `/materials/inventory/${materialId}`,
        updateInitialQuantity
      );

      setIsLoading(false);
      // getData();

      toast.success(`Saldo inicial atualizado com sucesso`);
    } catch (err) {
      // eslint-disable-next-line no-unused-expressions
      err.response?.data?.errors
        ? err.response.data.errors.map((error) => toast.error(error)) // errors -> resposta de erro enviada do backend (precisa se conectar com o back)
        : toast.error(err.message); // e.message -> erro formulado no front (é criado pelo front, não precisa de conexão)

      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true);
        const response = await axios.get(
          '/materials/raw/materialsrelevancebalance'
        );
        setData(response.data);
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

  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setSkipPageReset(true);
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          const date = new Date()
            .toISOString()
            .split('T')[0]
            .replace(/^(\d{4})-(\d{1,2})-(\d{1,2})$/, '$3/$2/$1');
          const time = new Date().toISOString().split('T')[1].substring(0, 5);
          return {
            ...old[rowIndex],
            initialQuantity: Number(value) - Number(old[rowIndex].balance),
            dateInitialQuantity: `${date} ${time}`,
          };
        }
        return row;
      })
    );
  };

  // After data chagnes, we turn the flag back off
  // so that if data actually changes when we're not
  // editing it, the page is reset
  React.useEffect(() => {
    setSkipPageReset(false);
  }, [data]);

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
        Header: 'ID',
        accessor: 'materialId',
        width: 125,
        disableResizing: true,
        isVisible: window.innerWidth > 576,
        disableSortBy: true,
        Filter: SelectColumnFilter,
        filter: 'groupMaterial',
        Cell: ({ value, row }) => (
          <div
            style={{
              color:
                row.original.freeInventory == 0
                  ? 'tomato'
                  : row.original.freeInventory < 0
                  ? 'red'
                  : 'inherit',
            }}
          >
            {' '}
            {value}
          </div>
        ),
      },
      {
        Header: 'Denominação',
        accessor: 'name',
        Cell: ({ value }) => <div className="text-start">{value}</div>,
        disableFilters: true,
      },
      {
        Header: 'Unidade',
        accessor: 'unit',
        width: 100,
        disableSortBy: true,
        disableResizing: true,
        disableFilters: true,
      },
      {
        Header: () => (
          // FORMAT HEADER
          <div className="p-auto text-center">Saldo Inicial</div>
        ),
        accessor: 'initialQuantity',
        width: 100,
        disableResizing: true,
        disableSortBy: true,
        disableFilters: true,
      },
      {
        Header: 'Definição Saldo',
        accessor: 'dateInitialQuantity',
        width: 100,
        disableSortBy: true,
        disableResizing: true,
        disableFilters: true,
      },

      {
        Header: () => (
          // FORMAT HEADER
          <div className="p-auto text-center">Frequência E/S</div>
        ),
        accessor: 'sumFrequency',
        width: 100,
        disableResizing: true,
        filterValue: 1,
        disableSortBy: true,
        disableFilters: true,
        isVisible: false,
      },
      {
        Header: () => (
          // FORMAT HEADER
          <div className="p-auto text-center">Saldo Teórico</div>
        ),
        accessor: 'balance',
        width: 100,
        disableResizing: true,
        disableSortBy: true,
        disableFilters: true,
        isVisible: false,
      },
      {
        Header: () => (
          // FORMAT HEADER
          <div className="p-auto text-center">Saldo Sisman</div>
        ),
        id: 'balancePlusInitital',
        width: 100,
        disableResizing: true,
        disableSortBy: true,
        disableFilters: true,
        isVisible: false,
        Cell: ({ value, row }) => (
          <span>
            {Number(row.original.balance) +
              Number(row.original.initialQuantity)}
          </span>
        ),
      },
      {
        // Make an expander cell
        Header: () => (
          // FORMAT HEADER
          <div className="p-auto text-center">Informar Saldo Real</div>
        ),
        id: 'actualBalance',
        width: 120,
        disableResizing: true,
        disableFilters: true,
        Cell: (value, row, column, updateMyData, handleUpdateDatabase) =>
          EditableCell(value, row, column, updateMyData, handleUpdateDatabase),
      },
    ],
    []
  );

  const dataTable = React.useMemo(() => data, [data]);

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
    // sortBy: [
    //   {
    //     id: 'name',
    //     asc: true,
    //   },
    // ],
    // filters: [{ id: 'totalInventory', value: 1 }],
    pageSize: 30,
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
          <Card.Title>Definir Saldo</Card.Title>
          <Card.Text>
            Informe o saldo real do estoque que automaticamente o sistema
            definirá o saldo inicial (saldo de início das operações em
            14/10/2022). <br />
            Isso se faz necessário uma vez que ao iniciar a operação do sistema,
            o almoxarifado já se encontrava em funcionamento.
          </Card.Text>
        </Row>

        <TableGfilterNestedRowHiddenRows
          columns={columns}
          data={dataTable}
          defaultColumn={defaultColumn}
          initialState={initialState}
          filterTypes={filterTypes}
          renderRowSubComponent={renderRowSubComponent}
          updateMyData={updateMyData}
        />
      </Container>
    </>
  );
}
