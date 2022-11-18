/* eslint-disable no-param-reassign */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
  FaExclamationTriangle,
  FaExclamation,
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

import axios from '../../../../services/axios';
import Loading from '../../../../components/Loading';

import EditModal from './components/EditModal';

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
  const [reqs, setReqs] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [dataModal, setDataModal] = useState('');

  async function getData() {
    try {
      setIsLoading(true);
      const response = await axios.get('/materials/out/');
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

  const handleCloseEditModal = () => setShowEditModal(false);
  const handleSaveEditModal = () => {
    setShowEditModal(false);
    getData();
  };
  const handleShowEditModal = (data) => {
    setDataModal(data);
    setShowEditModal(true);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleAskUpdateUserReplacement = (e, values) => {
    e.preventDefault();
    const exclamation = e.currentTarget.nextSibling;
    exclamation.className = exclamation.className.replace('d-none', 'd-inline');
    e.currentTarget.className += ' d-none';
    return true;

    // e.currentTarget.remove();
  };

  const handleUpdateUserReplacement = async (e, values) => {
    e.preventDefault();
    const { id } = values;
    const updateSeparation = {
      userReplacementId: userId,
    };
    const btn = e.currentTarget;

    try {
      setIsLoading(true);

      // FAZ A ATUALIZAÇÃO DA SEPARAÇÃO
      await axios.put(`/materials/out/${id}`, updateSeparation);

      setIsLoading(false);
      btn.class += 'd-none';
      btn.remove();
      // getData();

      toast.success(`Reposição informada com sucesso`);
    } catch (err) {
      // eslint-disable-next-line no-unused-expressions
      err.response?.data?.errors
        ? err.response.data.errors.map((error) => toast.error(error)) // errors -> resposta de erro enviada do backend (precisa se conectar com o back)
        : toast.error(err.message); // e.message -> erro formulado no front (é criado pelo front, não precisa de conexão)

      setIsLoading(false);
    }
  };

  const data = React.useMemo(() => reqs, [reqs]);

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
        Cell: ({ value, row }) => (
          <div>
            {value}{' '}
            {row.original.MaterialReturned.length ? (
              <OverlayTrigger
                placement="right"
                delay={{ show: 250, hide: 400 }}
                overlay={(props) => renderTooltip(props, 'Houve retorno')}
              >
                <Button
                  size="sm"
                  variant="outline-warning"
                  className="border-0 m-0"
                >
                  <FaExclamationTriangle />
                </Button>
              </OverlayTrigger>
            ) : null}
          </div>
        ),
        disableSortBy: true,
      },
      {
        Header: 'Tipo',
        accessor: 'type',
        width: 80,
        disableResizing: true,
        disableSortBy: true,
        Cell: ({ value }) => {
          switch (value) {
            case 'USO':
              return <Badge bg="success">{value}</Badge>;
            case 'EMPRÉSTIMO':
              return <Badge bg="secondary">{value}</Badge>;
            case 'DESCARTE':
              return <Badge bg="warning">{value}</Badge>;
            case 'DOAÇÃO':
              return <Badge bg="info">{value}</Badge>;
            case 'DEVOLUÇÃO':
              return <Badge bg="dark">{value}</Badge>;
            case 'EXTRAVIO':
              return <Badge bg="danger">{value}</Badge>;
            default:
              return <Badge>{value}</Badge>;
          }
        },
      },
      {
        Header: 'Retira',
        accessor: 'createdAtBr',
        width: 120,
        disableResizing: true,
        disableSortBy: true,
      },
      {
        Header: 'Profissional',
        accessor: 'removedBy',
        width: 200,
        disableResizing: true,
        Cell: ({ value, row }) => (
          <OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 400 }}
            overlay={(props) =>
              renderTooltip(
                props,
                row.original.Worker?.WorkerContracts[0].WorkerJobtype.job
              )
            }
          >
            <Row
              onClick={(e) => alert('Funcionalidade em implantação')}
              style={{ cursor: 'pointer' }}
            >
              <Col>{value || row.original.authorizerUsername} </Col>
            </Row>
          </OverlayTrigger>
        ),
        disableSortBy: true,
      },
      {
        Header: 'Autorização',
        accessor: 'authorizerUsername',
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
      },
      {
        Header: 'Expedição',
        accessor: 'userUsername',
        width: 150,
        disableResizing: true,
        Cell: ({ value }) => {
          const custom = String(value).replace(
            /(^[a-z]*)\.([a-z]*).*/gm,
            '$1.$2'
          ); // deixar só os dois primeiros nomes
          return <span> {custom}</span>;
        },
        disableSortBy: true,
      },
      {
        Header: 'Local',
        accessor: 'place',
        disableSortBy: true,
      },
      {
        Header: 'Valor',
        accessor: 'valueBr',
        width: 120,
        disableResizing: true,
        // eslint-disable-next-line react/destructuring-assignment
        Cell: ({ value }) => <div className="text-end">{value}</div>,
      },
      {
        Header: 'Ações',
        id: 'actions',
        width: 110,
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
              {row.original.userReplacementId ||
              row.original.reqMaterial ? null : (
                <>
                  <OverlayTrigger
                    placement="left"
                    delay={{ show: 250, hide: 400 }}
                    overlay={(props) =>
                      renderTooltip(
                        props,
                        'Informar RM de reposição criada no SIPAC'
                      )
                    }
                  >
                    <Button
                      size="sm"
                      variant="outline-success"
                      className="border-0 m-0"
                      onClick={(e) => {
                        handleAskUpdateUserReplacement(e);
                      }}
                    >
                      <FaRedoAlt />
                    </Button>
                  </OverlayTrigger>
                  <OverlayTrigger
                    placement="left"
                    delay={{ show: 250, hide: 400 }}
                    overlay={(props) =>
                      renderTooltip(props, 'Confirmar informação de RM criada!')
                    }
                  >
                    <Button
                      size="sm"
                      variant="outline-warning"
                      className="border-0 m-0 d-none"
                      onClick={(e) => {
                        handleUpdateUserReplacement(e, row.original);
                      }}
                    >
                      <FaExclamation />
                    </Button>
                  </OverlayTrigger>
                </>
              )}
            </Col>
            <Col xs="auto" className="text-center m-0 p-0 px-1">
              <OverlayTrigger
                placement="left"
                delay={{ show: 250, hide: 400 }}
                overlay={(props) => renderTooltip(props, 'Editar saída')}
              >
                <Button
                  size="sm"
                  variant="outline-secondary"
                  className="border-0 m-0"
                  onClick={() => {
                    if (
                      userId !== row.original.authorizedBy &&
                      userId !== row.original.userId
                    ) {
                      return toast.error(
                        `Saída só pode ser editada pelo expedidor ou autorizador.`
                      );
                    }
                    return handleShowEditModal(row.original);
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

  const renderRowSubSubComponent = React.useCallback(
    ({ row }) => (
      <>
        <span className="fw-bold">Especificação:</span>{' '}
        {row.original.specification}
      </>
    ),
    []
  );

  const renderRowSubSub1Component = React.useCallback(
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
              id: 'id',
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

  // Create a function that will render our row sub components
  const renderRowSubComponent = React.useCallback(
    ({ row }) => (
      <>
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
          data={row.original.MaterialOutItems}
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

        {row.original.MaterialReturned.length ? (
          <>
            <br />
            <Row>
              <Col className="text-center">
                <span className="text-center fw-bold">RETORNOS:</span>
              </Col>
            </Row>
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
                  Header: 'Retorno em:',
                  accessor: 'createdAtBr',
                  width: 160,
                  disableResizing: true,
                },
                {
                  Header: 'Valor',
                  accessor: 'valueBr',
                  width: 120,
                  disableResizing: true,
                },
                // {
                //   Header: 'Receb. por:',
                //   accessor: 'receivedBy',
                //   width: 150,
                //   disableResizing: true,
                //   Cell: (props) => {
                //     const custom = String(props.value).replace(
                //       /(^[a-z]*)\.([a-z]*).*/gm,
                //       '$1.$2'
                //     ); // deixar só os dois primeiros nomes
                //     return <span> {custom}</span>;
                //   },
                // },
                // {
                //   Header: 'Unidade de Custo',
                //   accessor: 'costUnit',
                //   isVisible: window.innerWidth > 768,
                //   // eslint-disable-next-line react/destructuring-assignment
                //   Cell: (props) => {
                //     const custom = String(props.value).replace(
                //       /([0-9]{2})/gm,
                //       '$1.'
                //     );
                //     return props.value ? (
                //       <span title={props.row.original.costUnitNome}>
                //         {custom} {props.row.original.costUnitSigla}
                //       </span>
                //     ) : null;
                //   },
                // },
              ]}
              data={row.original.MaterialReturned}
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
              renderRowSubComponent={renderRowSubSub1Component}
            />
          </>
        ) : null}
      </>
    ),
    []
  );

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
        id: 'createdAt',
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
              row.original.MaterialOutItems?.length > 0
            ) {
              const [, ...arrayFilterSub] = arrayFilter;
              const materials = row.original.MaterialOutItems;

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

  return (
    <>
      <Loading isLoading={isLoading} />
      <Container>
        <EditModal // modal p/ pesquisa de materiais
          handleClose={handleCloseEditModal}
          show={showEditModal}
          data={dataModal}
          handleSave={handleSaveEditModal}
        />
        <Row className="text-center py-3">
          <Card.Title>Relatório de Saída: Materiais</Card.Title>
          <Card.Text>
            Materiais com saída registrada por Uso, Descarte, Devolução, Doação,
            Extravio, Empréstimo, etc.
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
