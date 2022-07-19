/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react';
import { get } from 'lodash';
import { Container, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';

import Loading from '../../../../components/Loading';
import ImportSipac from './ImportSipac';
import ResponseSipac from './ResponseSipac';

export default function inputMaterial() {
  const dataTest = {
    dadosJSON: {
      'Número da Requisição': '16013/2022',
      Tipo: 'REQUISIÇÃO DE MATERIAL',
      Convênio: 'Não',
      'Grupo de Material': '(0)',
      'Unidade de Custo': 'PRÓ-REITORIA DE ASSUNTOS ESTUDANTIS (PROAE) (11.31)',
      'Unidade Requisitante':
        'DIRETORIA DE MANUTENÇÃO DE INSTALAÇÕES FÍSICAS (11.08.05)',
      'Destino da Requisição':
        'SUSTENTAÇÃO DE ESTOQUE DO ALMOXARIFADO DA SUP. INFRAESTRUTURA (11.89)',
      Usuário: 'jonatas.silva -JONATAS HENRIQUE CAMARA DA SILVA(Ramal',
      Email: 'jonatasufrn@yahoo.com',
      'Data de Cadastro': '14/07/2022',
      'Data de Envio': '14/07/2022',
      'Valor da Requisição': 'R$ 2.322,99',
      'Opção Orçamentária': 'SOLICITAR AUTORIZAÇÃO ORÇAMENTÁRIA',
      'Número da Requisição Relacionada': '903/2022 (REQUISIÇÃO DE MANUTENÇÃO)',
      Local:
        'Central de Atendimento ao Discente - CADIS (Antigo Relógio do Sol).',
      Observações: 'Executado.',
      'Status Atual': 'AGUARD. AUTORIZAÇÃO ORÇAMENTÁRIA',
    },
    itensJSON: [
      {
        Nr: '1',
        Código: '302400026791',
        Denominação: 'ADESIVO SILICONE PARA VEDAÇÃO - 280G.',
        'Unid. Med.': 'UNIDADE',
        'Qt.': '2',
        Valor: 'R$ 13,91',
        Total: 'R$ 27,82',
        A: '0',
        D: '0',
        C: '0',
        Status: 'CADASTRADO',
      },
      {
        Nr: '2',
        Código: '304200002741',
        Denominação: 'BROCA DE AÇO RÁPIDO - 3,5MM (1/8")',
        'Unid. Med.': 'UNIDADE',
        'Qt.': '1',
        Valor: 'R$ 1,50',
        Total: 'R$ 1,50',
        A: '0',
        D: '0',
        C: '0',
        Status: 'CADASTRADO',
      },
      {
        Nr: '3',
        Código: '304200002768',
        Denominação: 'BROCA DE AÇO RÁPIDO - 5MM (3/16")',
        'Unid. Med.': 'UNIDADE',
        'Qt.': '1',
        Valor: 'R$ 2,77',
        Total: 'R$ 2,77',
        A: '0',
        D: '0',
        C: '0',
        Status: 'CADASTRADO',
      },
      {
        Nr: '4',
        Código: '302400016159',
        Denominação: 'BUCHA DE FIXAÇÃO EM NYLON D-12 COM PARAFUSO',
        'Unid. Med.': 'UNIDADE',
        'Qt.': '52',
        Valor: 'R$ 1,10',
        Total: 'R$ 57,20',
        A: '0',
        D: '0',
        C: '0',
        Status: 'CADASTRADO',
      },
      {
        Nr: '5',
        Código: '302400029767',
        Denominação: 'CAIBRO DE MASSARANDUBA - 3CM X 5CM X 3METROS',
        'Unid. Med.': 'UNIDADE',
        'Qt.': '10',
        Valor: 'R$ 35,70',
        Total: 'R$ 357,00',
        A: '0',
        D: '0',
        C: '0',
        Status: 'CADASTRADO',
      },
      {
        Nr: '6',
        Código: '302400029837',
        Denominação: 'LINHA EM MASSARANDUBA 5CM X 13CM X 4,50M',
        'Unid. Med.': 'UNIDADE',
        'Qt.': '2',
        Valor: 'R$ 236,00',
        Total: 'R$ 472,00',
        A: '0',
        D: '0',
        C: '0',
        Status: 'CADASTRADO',
      },
      {
        Nr: '7',
        Código: '3024000001161',
        Denominação:
          'PARAFUSO PHILLIPS, BICROMATIZADO, CABEÇA CHATA, ROSCA AUTO PERFURANTE, TIPO CHIPBOARD - 6,0 X 90MM',
        'Unid. Med.': 'UNIDADE',
        'Qt.': '112',
        Valor: 'R$ 1,50',
        Total: 'R$ 168,00',
        A: '0',
        D: '0',
        C: '0',
        Status: 'CADASTRADO',
      },
      {
        Nr: '8',
        Código: '302400001151',
        Denominação: 'PREGO COM CABEÇA 2.1/2" X 10 - EMBALAGEM COM 1KG',
        'Unid. Med.': 'Kg',
        'Qt.': '1',
        Valor: 'R$ 20,50',
        Total: 'R$ 20,50',
        A: '0',
        D: '0',
        C: '0',
        Status: 'CADASTRADO',
      },
      {
        Nr: '9',
        Código: '302400014113',
        Denominação: 'REBITE DE REPUXO EM ALUMÍNIO - REF. 312',
        'Unid. Med.': 'UNIDADE',
        'Qt.': '60',
        Valor: 'R$ 0,02',
        Total: 'R$ 1,20',
        A: '0',
        D: '0',
        C: '0',
        Status: 'CADASTRADO',
      },
      {
        Nr: '10',
        Código: '302400002441',
        Denominação: 'TELHA FIBROCIMENTO ONDULADA - 183CM X 110CM X 8MM',
        'Unid. Med.': 'UNIDADE',
        'Qt.': '10',
        Valor: 'R$ 74,00',
        Total: 'R$ 740,00',
        A: '0',
        D: '0',
        C: '0',
        Status: 'CADASTRADO',
      },
      {
        Nr: '11',
        Código: '302400029845',
        Denominação: 'TELHA ONDULADA TRANSPARENTE 1,83 X 1,10M',
        'Unid. Med.': 'UNIDADE',
        'Qt.': '5',
        Valor: 'R$ 95,00',
        Total: 'R$ 475,00',
        A: '0',
        D: '0',
        C: '0',
        Status: 'CADASTRADO',
      },
    ],
  };

  const [reqmat, setReqmat] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sipac, setSipac] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const requisicoes = { requisicoes: reqmat.split(',') };
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_AXIOS_SIPAC}/reqmaterial`,
        requisicoes
      );
      if (typeof response.data === 'string') {
        toast.error('A requisição procurada não existe');
        setIsLoading(false);
        return;
      }
      setSipac([...sipac, ...response.data]);

      setIsLoading(false);
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
    const novoSipac = [...sipac];
    novoSipac.splice(index, 1);
    setSipac([...novoSipac]);
  };

  const handleClear = async (e) => {
    e.preventDefault();
    setReqmat('');
    setSipac([]);
  };

  return (
    <>
      <Loading isLoading={isLoading} />
      <Container>
        <Card.Title>Entrada de material via almoxarifado central</Card.Title>
        <Card.Text>
          Referências e quantitativos de materiais automaticamente extraídos via
          SIPAC.
        </Card.Text>

        {sipac.length === 0 ? (
          <ImportSipac
            handleSubmit={handleSubmit}
            handleClear={handleClear}
            reqmat={reqmat}
            setReqmat={setReqmat}
          />
        ) : (
          <ResponseSipac sipac={sipac} handleDelete={handleDelete} />
        )}
      </Container>
    </>
  );
}
