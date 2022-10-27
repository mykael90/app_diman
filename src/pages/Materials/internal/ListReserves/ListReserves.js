/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-param-reassign */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaExclamation, FaInfo, FaTimes } from 'react-icons/fa';

import { Row, Col, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';

import axios from '../../../../services/axios';
import Loading from '../../../../components/Loading';

// import generic table from material's components with global filter and nested row
import TableGfilterNestedrow from '../../components/TableGfilterNestedRow';
import TableNestedrow from '../../components/TableNestedRow';

const renderTooltip = (props, message) => (
  <Tooltip id="button-tooltip" {...props}>
    {message}
  </Tooltip>
);

export default function Index() {
  const userId = useSelector((state) => state.auth.user.id);
  const [isLoading, setIsLoading] = useState(false);
  const [reserves, setReserves] = useState([]);
  const inputRef = useRef();

  async function getReservesData() {
    try {
      setIsLoading(true);
      const response = await axios.get('/materials/reserve');
      setReserves(response.data);
      setIsLoading(false);
    } catch (err) {
      // eslint-disable-next-line no-unused-expressions
      err.response?.data?.errors
        ? err.response.data.errors.map((error) => toast.error(error)) // errors -> resposta de erro enviada do backend (precisa se conectar com o back)
        : toast.error(err.message); // e.message -> erro formulado no front (é criado pelo front, não precisa de conexão)
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // Focus on inputRef
    if (inputRef.current) {
      inputRef.current.focus();
    }

    getReservesData();
  }, []);

  const handleUpdateSeparetedAt = async (values) => {
    const { id: materialReserveId } = values;
    const updateSeparation = {
      separatedAt: new Date().toISOString(),
    };

    try {
      setIsLoading(true);

      // FAZ A ATUALIZAÇÃO DA SEPARAÇÃO
      await axios.put(
        `/materials/reserve/${materialReserveId}`,
        updateSeparation
      );

      setIsLoading(false);
      getReservesData();

      toast.success(`Separação realizada com sucesso`);
    } catch (err) {
      // eslint-disable-next-line no-unused-expressions
      err.response?.data?.errors
        ? err.response.data.errors.map((error) => toast.error(error)) // errors -> resposta de erro enviada do backend (precisa se conectar com o back)
        : toast.error(err.message); // e.message -> erro formulado no front (é criado pelo front, não precisa de conexão)

      setIsLoading(false);
    }
  };

  const handleCancelAsk = (e, values) => {
    e.preventDefault();
    if (userId !== values.userId)
      return toast.error(
        `Reserva só pode ser cancelada pelo usuário que a criou.`
      );
    const exclamation = e.currentTarget.nextSibling;
    exclamation.className = exclamation.className.replace('d-none', 'd-inline');
    e.currentTarget.className += ' d-none';
    return true;

    // e.currentTarget.remove();
  };

  const handleCancelReserve = async (values) => {
    const updateCanceledAt = {
      canceledAt: new Date().toISOString(),
    };

    const formattedValues = {
      ...Object.fromEntries(
        Object.entries(values).filter(([_, v]) => v != null)
      ),
    }; // LIMPANDO CHAVES NULL E UNDEFINED

    delete Object.assign(formattedValues, {
      materialReserveId: formattedValues.id,
    }).id; // id de saída gerado automaticamente, se deixar vai usar o id da reserva

    formattedValues.MaterialReserveItems.forEach((item) => {
      delete Object.assign(item, { MaterialId: item.materialId }).materialId; // rename key
      item.value = item.value
        .replace(/\./g, '')
        .replace(/,/g, '.')
        .replace(/[^0-9\.]+/g, '');
    });

    try {
      setIsLoading(true);

      // ATUALIZAR QUANTIDADES DO INVENTARIO
      for (const item of formattedValues.MaterialReserveItems) {
        const response = await axios.get(
          `/materials/inventory/${item.MaterialId}`
        );
        const { releaseInventory, reserveInventory } = response.data;
        const updateInventory = {
          releaseInventory: Number(releaseInventory) + Number(item.quantity),
          reserveInventory: Number(reserveInventory) - Number(item.quantity),
        };

        await axios.put(
          `/materials/inventory/${item.MaterialId}`,
          updateInventory
        );
      }

      // ATUALIZA DATA DE CANCELAMENTO DA RESERVA
      await axios.put(
        `/materials/reserve/${formattedValues.materialReserveId}`,
        updateCanceledAt
      );

      setIsLoading(false);
      getReservesData();

      return toast.info(`Cancelamento de reserva realizado`);
    } catch (err) {
      // eslint-disable-next-line no-unused-expressions
      err.response?.data?.errors
        ? err.response.data.errors.map((error) => toast.error(error)) // errors -> resposta de erro enviada do backend (precisa se conectar com o back)
        : toast.error(err.message); // e.message -> erro formulado no front (é criado pelo front, não precisa de conexão)

      setIsLoading(false);
    }
  };

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
        Header: 'Previsão:',
        accessor: 'intendedUseBr',
        width: 120,
        disableResizing: true,
      },
      {
        Header: 'Reservado por:',
        accessor: 'userUsername',
        width: 140,
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
        Header: 'Reserva para:',
        accessor: 'workerName',
      },
      {
        Header: 'Autorização:',
        accessor: 'authorizerUsername',
        width: 140,
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
        Header: 'Separação:',
        accessor: 'separatedAtBr',
        width: 100,
        disableResizing: true,
        Cell: ({ value, row }) => (
          <Row>
            <Col className="p-auto text-center">
              {value ? <span>{value}</span> : <span>(não)</span>}
            </Col>
          </Row>
        ),
      },
      {
        Header: 'Utilizada:',
        accessor: 'withdrawnAtBr',
        width: 100,
        disableResizing: true,
        Cell: ({ value, row }) => (
          <Row>
            <Col className="p-auto text-center">
              {value ? (
                <span>{value}</span>
              ) : (
                <span>
                  {row.original?.canceledAtBr ? '(cancelada)' : '(não)'}
                </span>
              )}
            </Col>
          </Row>
        ),
      },

      {
        Header: 'Cancelada:',
        accessor: 'canceledAtBr',
        width: 100,
        disableResizing: true,
        Cell: ({ value, row }) => (
          <Row>
            <Col className="p-auto text-center">
              {value ? (
                <span>{value}</span>
              ) : (
                <>
                  {' '}
                  {row.original?.withdrawnAtBr ? (
                    '(utilizada)'
                  ) : (
                    <>
                      <OverlayTrigger
                        placement="top"
                        delay={{ show: 250, hide: 400 }}
                        overlay={(props) =>
                          renderTooltip(props, 'Cancelar reserva')
                        }
                      >
                        <Button
                          size="sm"
                          variant="outline-danger"
                          className="border-0"
                          onClick={(e) => {
                            handleCancelAsk(e, row.original);
                          }}
                        >
                          <FaTimes />
                        </Button>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="top"
                        delay={{ show: 250, hide: 400 }}
                        overlay={(props) =>
                          renderTooltip(props, 'Confirmar ação')
                        }
                      >
                        <Button
                          size="sm"
                          variant="outline-warning"
                          className="border-0 d-none"
                          onClick={() => {
                            handleCancelReserve(row.original);
                          }}
                        >
                          <FaExclamation />
                        </Button>
                      </OverlayTrigger>
                    </>
                  )}{' '}
                </>
              )}
            </Col>
          </Row>
        ),
      },
      {
        Header: 'Valor',
        accessor: 'valueBr',
        width: 120,
        disableResizing: true,
        // eslint-disable-next-line react/destructuring-assignment
      },
      {
        Header: 'Local',
        accessor: 'place',
        width: 150,
        disableResizing: true,
        // eslint-disable-next-line react/destructuring-assignment
      },
      {
        Header: 'Obs',
        id: 'obs',
        width: 40,
        disableResizing: true,
        disableSortBy: true,
        Cell: ({ value, row }) => (
          <Row>
            {' '}
            <Col xs="auto" className="p-auto text-end">
              {row.original.obs ? (
                <>
                  {' '}
                  <OverlayTrigger
                    placement="left"
                    delay={{ show: 250, hide: 400 }}
                    overlay={(props) => renderTooltip(props, row.original.obs)}
                  >
                    <Button
                      size="sm"
                      variant="outline-warning"
                      className="border-0 m-0"
                    >
                      <FaInfo />
                    </Button>
                  </OverlayTrigger>
                </>
              ) : null}
            </Col>
          </Row>
        ),
      },
    ],
    []
  );

  const data = React.useMemo(() => reserves, [reserves]);

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
            accessor: 'materialId',
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
            // eslint-disable-next-line react/destructuring-assignment
          },
        ]}
        data={row.original.MaterialReserveItems}
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
        renderRowSubComponent={renderRowSubSubComponent}
      />
    ),
    []
  );

  return (
    <>
      <Loading isLoading={isLoading} />

      <TableGfilterNestedrow
        columns={columns}
        data={data}
        defaultColumn={defaultColumn}
        initialState={initialState}
        filterTypes={filterTypes}
        renderRowSubComponent={renderRowSubComponent}
      />
    </>
  );
}