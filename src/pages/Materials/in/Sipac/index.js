/* eslint-disable no-useless-escape */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react';
import { get } from 'lodash';
import { Container, Row, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useSelector } from 'react-redux';
import axiosRest from '../../../../services/axios';

import Loading from '../../../../components/Loading';
import ImportSipac from './components/ImportSipac';
import ResponseSipac from './components/ResponseSipac';

import ModalLoginSipac from './components/ModalLoginSipac';

export default function inputMaterial() {
  const userId = useSelector((state) => state.auth.user.id);
  const [reqs, setReqs] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sipac, setSipac] = useState({});

  const [showModalLoginSipac, setShowModalLoginSipac] = useState(false);
  const [RMModal, setRMModal] = useState([]);
  const [userSipac, setUserSipac] = useState({});

  const handleCancelModal = () => {
    setShowModalLoginSipac(false);
  };

  const handleCloseModalLoginSipac = () => setShowModalLoginSipac(false);

  const handleShowModalLoginSipac = (RM) => {
    setRMModal(RM);
    setShowModalLoginSipac(true);
  };

  const handleSaveModalLoginSipac = (setFieldValue, credentials) => {
    // eslint-disable-next-line no-use-before-define
    importRMSipac(RMModal, setFieldValue, credentials);
    setShowModalLoginSipac(false);
  };

  function getCredentials(values) {
    setUserSipac(values);
  }

  const showErrorsSipac = (errorsArray) => {
    errorsArray.forEach((error) =>
      toast.error(error, {
        autoClose: false,
        draggable: true,
        closeOnClick: true,
      })
    );
  };

  async function importRMSipac(requisicoes, setFieldValue, credentials) {
    try {
      setIsLoading(true);

      const payload = {
        requisicoes,
        user: credentials,
      };

      console.log('payload', payload);

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_AXIOS_SIPAC}/reqmaterial`,
        payload
      );

      setSipac({ ...sipac, ...response.data });

      setReqs('');
      setIsLoading(false);
      if (response.data.errors) showErrorsSipac(response.data.errors);
    } catch (err) {
      const status = get(err, 'response.status', 0);

      if (status === 401) {
        toast.error('Você precisa fazer login');
      } else {
        toast.error(err.message);
      }

      setIsLoading(false);
    }
  }

  const addReq = (req) => {
    const currentYear = new Date().getFullYear();
    const formatReq = req.includes('/') ? req : `${req}/${currentYear}`;

    // limitar a 10 itens
    if (reqs.length > 9) {
      toast.error('Lista de importação limitada a 10 itens', {
        autoClose: false,
        draggable: true,
        closeOnClick: true,
      });
      return;
    }

    // não incluir repetido na lista
    if (reqs.length > 0) {
      let exists = false;

      reqs.every((value) => {
        if (Object.values(value).includes(formatReq)) {
          exists = true;
          return false;
        }
        return true;
      });

      if (exists) {
        toast.error('Item já incluído na lista de importação', {
          autoClose: false,
          draggable: true,
          closeOnClick: true,
        });
        return;
      }
    }

    const id = reqs.length ? reqs[reqs.length - 1].id + 1 : 1;
    const newReq = { id, req: formatReq };
    const listReqs = [...reqs, newReq];
    setReqs(listReqs);
  };

  const deleteReq = (id) => {
    // forma diferente de escrever, poderia usar splice
    const listReqs = reqs.filter((req) => req.id !== id);
    setReqs(listReqs);
  };
  const submitReq = ({ newReq }, resetForm) => {
    if (!newReq) return;
    addReq(newReq);
    resetForm();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requisicoes = Object.values(reqs).map((item) => item.req);

    handleShowModalLoginSipac(requisicoes);
    console.log(requisicoes);
  };

  const handleDelete = async (e, index) => {
    e.preventDefault();
    const novoSipac = { ...sipac };
    const req = novoSipac.info.splice(index, 1)[0];
    toast.warning(
      `A requisição ${req.dadosJSON['Número da Requisição']} foi excluída da lista`
    );
    setSipac({ ...novoSipac });
  };

  const handleStore = async (e, index, free = false) => {
    e.preventDefault();
    const novoSipac = { ...sipac };
    const req = novoSipac.info.splice(index, 1)[0];

    const renamedReq = {
      materialIntypeId: '1',
      req: req.dadosJSON['Número da Requisição'],
      userId, // pegar id user context
      value: req.dadosJSON['Valor do Total Atendido']
        .replace(/\./g, '')
        .replace(/,/g, '.')
        .replace(/[^0-9\.]+/g, ''),
      requiredBy: req.dadosJSON['Usuário'].substring(
        0,
        req.dadosJSON['Usuário'].indexOf(' ')
      ),
      reqMaintenance: req.dadosJSON[
        'Número da Requisição Relacionada'
      ].substring(
        0,
        req.dadosJSON['Número da Requisição Relacionada'].indexOf(' ')
      ),
      reqUnit: req.dadosJSON['Unidade Requisitante'].replace(/[^0-9]+/g, ''), // ajustar regex
      costUnit: req.dadosJSON['Unidade de Custo'].replace(/[^0-9]+/g, ''), // ajustar regex
      registerDate: req.dadosJSON['Data de Cadastro'].replace(
        /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
        '$3-$2-$1'
      ), // ajustar regex
    };

    renamedReq.items = req.itensJSON.map((item) => ({
      MaterialId: item['Código'],
      quantity: item.A.replace(/,/g, '.'), // ajustar regex
      value: item['Valor A.']
        .replace(/\./g, '')
        .replace(/,/g, '.')
        .replace(/[^0-9\.]+/g, ''), // ajustar regex
      name: item['Denominação'],
      unit: item['Unid. Med.'],
    }));

    try {
      setIsLoading(true);

      // RECEBE, ATUALIZA O INVENTARIO E JA BLOQUEIA
      const response = await axiosRest.post(`/materials/in/`, renamedReq);

      // DEIXA PARA USO COMUM DO ALMOXARIFADO SE FOR SINALIZADO PELO USUARIO NO RECEBIMENTO
      if (free) {
        const freeData = await response.data;
        delete Object.assign(freeData, { items: freeData.MaterialInItems })
          .MaterialInItems; // rename key
        delete Object.assign(freeData, { materialInId: freeData.id }).id; // rename key
        delete freeData.requiredBy;

        await axiosRest.post(`/materials/release/`, freeData);
      }

      setSipac({ ...novoSipac });
      setIsLoading(false);

      toast.success(
        `Material da requisição ${response.data.req} recebido com sucesso`
      );
    } catch (err) {
      // eslint-disable-next-line no-unused-expressions
      err.response?.data?.errors
        ? err.response.data.errors.map((error) => toast.error(error)) // errors -> resposta de erro enviada do backend (precisa se conectar com o back)
        : toast.error(err.message); // e.message -> erro formulado no front (é criado pelo front, não precisa de conexão)

      setIsLoading(false);
    }
  };

  const handleClear = async (e) => {
    e.preventDefault();
    setReqs('');
  };

  return (
    <>
      <Loading isLoading={isLoading} />
      <Container>
        <ModalLoginSipac // modal p/ importar RM do sipac através de login
          handleClose={handleCloseModalLoginSipac}
          show={showModalLoginSipac}
          handleCancelModal={handleCancelModal}
          handleSaveModal={handleSaveModalLoginSipac}
          // eslint-disable-next-line react/jsx-no-bind
          getCredentials={getCredentials}
          // push={push}
          // hiddenItems={values.MaterialReserveItems.map(
          //   (item) => item.materialId
          // )}
          // inventoryData={inventoryData}
        />
        {!sipac.info?.length ? (
          <ImportSipac
            handleSubmit={handleSubmit}
            handleClear={handleClear}
            reqs={reqs}
            deleteReq={deleteReq}
            submitReq={submitReq}
          />
        ) : (
          <ResponseSipac
            sipac={sipac}
            handleStore={handleStore}
            handleDelete={handleDelete}
          />
        )}
      </Container>
    </>
  );
}
