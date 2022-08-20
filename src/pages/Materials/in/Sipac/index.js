/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react';
import { get } from 'lodash';
import { Container, Row, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';

import Loading from '../../../../components/Loading';
import ImportSipac from './components/ImportSipac';
import ResponseSipac from './components/ResponseSipac';

export default function inputMaterial() {
  const [reqs, setReqs] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sipac, setSipac] = useState({});

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

  const showErrorsSipac = (errorsArray) => {
    errorsArray.forEach((error) =>
      toast.error(error, {
        autoClose: false,
        draggable: true,
        closeOnClick: true,
      })
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const requisicoes = {
        requisicoes: Object.values(reqs).map((item) => item.req),
      };
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_AXIOS_SIPAC}/reqmaterial`,
        requisicoes
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
        toast.error(
          'Ocorreu um erro ao importar a requisição, verifique a conexão'
        );
      }

      setIsLoading(false);
    }
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

  const handleStore = async (e, index) => {
    e.preventDefault();
    const novoSipac = { ...sipac };
    const req = novoSipac.info.splice(index, 1)[0];
    toast.success(
      `Material da requisição ${req.dadosJSON['Número da Requisição']} recebido com sucesso`
    );
    setSipac({ ...novoSipac });
  };

  const handleClear = async (e) => {
    e.preventDefault();
    setReqs('');
  };

  return (
    <>
      <Loading isLoading={isLoading} />
      <Container>
        <Row>
          <Card.Title>Entrada de material via almoxarifado central</Card.Title>
          <Card.Text>
            Referências e quantitativos de materiais automaticamente extraídos
            via SIPAC.
          </Card.Text>
        </Row>

        <Row>
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
        </Row>
      </Container>
    </>
  );
}
