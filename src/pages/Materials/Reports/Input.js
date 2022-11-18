/* eslint-disable no-param-reassign */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  FaCommentDots,
  FaInfo,
  FaDirections,
  FaPencilAlt,
  FaRedoAlt,
  FaSyncAlt,
  FaRegEdit,
  FaEdit,
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
} from 'react-bootstrap';

import axios from '../../../services/axios';
import Loading from '../../../components/Loading';

// import generic table from material's components with global filter and nested row
import TableGfilterNestedrow from '../components/TableGfilterNestedRow';
import TableNestedrow from '../components/TableNestedRow';

const renderTooltip = (props, message) => (
  <Tooltip id="button-tooltip" {...props}>
    {message}
  </Tooltip>
);

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
        disableSortBy: true,
      },
      {
        Header: 'Nº RM',
        accessor: 'req',
        width: 120,
        disableResizing: true,
        disableSortBy: true,
      },
      {
        Header: () => <div className="p-auto text-center">Tipo</div>,
        accessor: 'type',
        width: 120,
        disableResizing: true,
        disableSortBy: true,
        Cell: ({ value }) => {
          switch (value) {
            case 'RM AUTO':
              return <Badge bg="success">{value}</Badge>;
            case 'RETORNO':
              return <Badge bg="secondary">{value}</Badge>;
            case 'FORNECEDOR':
              return <Badge bg="warning">{value}</Badge>;
            case 'DOACAO':
              return <Badge bg="info">{value}</Badge>;
            default:
              return <Badge>{value}</Badge>;
          }
        },
      },
      {
        Header: () => (
          <div className="p-auto text-center">Data de recebimento</div>
        ),
        accessor: 'createdAt',
        width: 120,
        disableResizing: true,
        disableSortBy: true,
        Cell: ({ value }) => <div className="p-auto text-center">{value}</div>,
      },
      {
        Header: () => <div className="p-auto text-center">Conferente</div>,
        accessor: 'receivedBy',
        width: 150,
        disableResizing: true,
        Cell: (props) => {
          const custom = String(props.value).replace(
            /(^[a-z]*)\.([a-z]*).*/gm,
            '$1.$2'
          ); // deixar só os dois primeiros nomes
          return <span> {custom}</span>;
        },
        disableSortBy: true,
        Cell: ({ value }) => <div className="p-auto text-center">{value}</div>,
      },
      {
        Header: () => (
          <div className="p-auto text-center">Usuário resp. pedido</div>
        ),
        accessor: 'requiredBy',
        width: 150,
        disableResizing: true,
        Cell: (props) => {
          const custom = String(props.value).replace(
            /(^[a-z]*)\.([a-z]*).*/gm,
            '$1.$2'
          ); // deixar só os dois primeiros nomes
          return <div className="p-auto text-center"> {custom}</div>;
        },
        disableSortBy: true,
      },
      {
        Header: () => <div className="p-auto text-center">Data de pedido</div>,
        accessor: 'registerDate',
        width: 120,
        disableResizing: true,
        disableSortBy: true,
        Cell: ({ value }) => <div className="p-auto text-center">{value}</div>,
      },

      {
        Header: () => (
          <div className="p-auto text-center">Unidade de custo</div>
        ),
        accessor: 'costUnit',
        isVisible: window.innerWidth > 768,
        // eslint-disable-next-line react/destructuring-assignment
        Cell: (props) => {
          const custom = String(props.value).replace(/([0-9]{2})/gm, '$1.');
          return props.value ? (
            <span title={props.row.original.costUnitNome}>
              {custom} {props.row.original.costUnitSigla}
            </span>
          ) : null;
        },
        disableSortBy: true,
      },
      {
        Header: 'Valor',
        accessor: 'value',
        width: 120,
        disableResizing: true,
        Cell: ({ value }) => <div className="p-auto text-end">{value}</div>,
      },
      {
        Header: () => <div className="p-auto text-center">Ações</div>,
        id: 'actions',
        width: 70,
        disableResizing: true,
        Cell: ({ value, row }) => (
          <Row className="d-flex flex-nowrap">
            <Col xs="auto" className="text-center m-0 p-0 px-1 ps-2">
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
                      variant="outline-info"
                      className="border-0 m-0"
                    >
                      <FaInfo />
                    </Button>
                  </OverlayTrigger>
                </>
              ) : null}
            </Col>
            <Col xs="auto" className="text-center m-0 p-0 px-1">
              <OverlayTrigger
                placement="left"
                delay={{ show: 250, hide: 400 }}
                overlay={(props) => renderTooltip(props, 'Editar entrada')}
              >
                <Button
                  size="sm"
                  variant="outline-secondary"
                  className="border-0 m-0"
                  onClick={() => {
                    alert('Funcionalidade em implantação...');
                  }}
                >
                  <FaPencilAlt />
                </Button>
              </OverlayTrigger>
            </Col>
          </Row>
        ),
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
        id: 'id',
        desc: true,
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
          ids.some((id, index) => {
            // console.log(row.original.MaterialOutItems, id);

            const rowValue = row.values[id];
            const arrayFilter = String(filterValue).split(' ');

            if (
              !index && // TESTAR SO NO 0 PARA ECONOMIZAR MEMORIA
              filterValue.substring(1, 0) === '*' && // PARA PESQUISAR NA SUBROW DO NOME DO MATERIAL TEM Q UTILIZAR O * NO INÍCIO DA CONSULTA SEGUIDO DE ESPAÇO
              row.original.MaterialInItems?.length > 0
            ) {
              const [, ...arrayFilterSub] = arrayFilter;
              const materials = row.original.MaterialInItems;

              return materials.reduce((ac, mat) => {
                // ac -> acumulador; mat -> material
                ac =
                  ac ||
                  arrayFilterSub.reduce((res, cur) => {
                    // res -> response; cur -> currency (atual)
                    res =
                      res &&
                      String(mat.name)
                        .toLowerCase()
                        .includes(String(cur).toLowerCase());
                    return res;
                  }, true);
                return ac;
              }, false);

              // return arrayFilterSub.reduce((res, cur) => {
              //   // res -> response; cur -> currency (atual)
              //   res =
              //     res &&
              //     String(materials[0].name)
              //       .toLowerCase()
              //       .includes(String(cur).toLowerCase());
              //   return res;
              // }, true);

              // return true;
            }

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
        <span className="fw-bold">Especificação:</span>{' '}
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
            accessor: 'materialId',
            width: 125,
            disableResizing: true,
            isVisible: window.innerWidth > 768,
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
        data={row.original.MaterialInItems}
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
