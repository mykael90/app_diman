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
  const dataTest = [
    {
      dadosJSON: {
        'Número da Requisição': '15160/2022',
        Tipo: 'REQUISIÇÃO DE MATERIAL',
        Convênio: 'Não',
        'Grupo de Material': '(0)',
        'Unidade de Custo':
          'MANUTENÇÃO E CONSERVAÇÃO DA INFRA-ESTRUTURA FÍSICA (11.38.05)',
        'Unidade Requisitante':
          'DIRETORIA DE MANUTENÇÃO DE INSTALAÇÕES FÍSICAS (11.08.05)',
        'Destino da Requisição':
          'SUSTENTAÇÃO DE ESTOQUE DO ALMOXARIFADO DA SUP. INFRAESTRUTURA (11.89)',
        Usuário: 'dennis.ferreira -DENNIS FERREIRA SILVA(Ramal',
        Email: 'dennis.ferreira@ufrn.br',
        'Data de Cadastro': '06/07/2022',
        'Data de Envio': '06/07/2022',
        'Valor da Requisição': 'R$ 23,27',
        'Opção Orçamentária': 'SOLICITAR AUTORIZAÇÃO ORÇAMENTÁRIA',
        'Número da Requisição Relacionada':
          '1559/2022 (REQUISIÇÃO DE MANUTENÇÃO)',
        Local: 'UFRN',
        Observações: '',
        'Status Atual': 'AGUARD. AUTORIZAÇÃO ORÇAMENTÁRIA',
      },
      itensJSON: [
        {
          Nr: '1',
          Código: '302400002280',
          Denominação: 'AREIA DE GRANULOMETRIA MÉDIA',
          'Unid. Med.': 'METRO CÚBICO',
          'Qt.': '0,4',
          Valor: 'R$ 58,17',
          Total: 'R$ 23,27',
          A: '0',
          D: '0',
          C: '0',
          Status: 'CADASTRADO',
        },
      ],
    },
    {
      dadosJSON: {
        'Número da Requisição': '15154/2022',
        Tipo: 'REQUISIÇÃO DE MATERIAL',
        Convênio: 'Não',
        'Grupo de Material': '(0)',
        'Unidade de Custo':
          'CENTRO DE CIÊNCIAS HUMANAS, LETRAS E ARTES (13.00)',
        'Unidade Requisitante':
          'DIRETORIA DE MANUTENÇÃO DE INSTALAÇÕES FÍSICAS (11.08.05)',
        'Destino da Requisição':
          'SUSTENTAÇÃO DE ESTOQUE DO ALMOXARIFADO DA SUP. INFRAESTRUTURA (11.89)',
        Usuário: 'jonatas.silva -JONATAS HENRIQUE CAMARA DA SILVA(Ramal',
        Email: 'jonatasufrn@yahoo.com',
        'Data de Cadastro': '06/07/2022',
        'Data de Envio': '06/07/2022',
        'Valor da Requisição': 'R$ 7,50',
        'Valor do Total Atendido': 'R$ 7,50',
        'Opção Orçamentária': 'SOLICITAR AUTORIZAÇÃO ORÇAMENTÁRIA',
        'Número da Requisição Relacionada':
          '1985/2022 (REQUISIÇÃO DE MANUTENÇÃO)',
        Local: 'LABORATÓRIO DE COMUNICAÇÃO (LABCOM) - Por trás da TVU',
        Observações: 'Executado.',
        'Status Atual': 'FINALIZADA',
      },
      itensJSON: [
        {
          Nr: '1',
          Código: '304200007964',
          Denominação: 'BROCA DE AÇO RÁPIDO - 4MM',
          'Unid. Med.': 'UNIDADE',
          'Qt.': '3',
          Valor: 'R$ 1,70',
          Total: 'R$ 5,10',
          A: '3',
          D: '0',
          C: '0',
          'Valor A.': 'R$ 1,70',
        },
        {
          Nr: '2',
          Código: '302400030155',
          Denominação: 'REBITE DE REPUXO EM ALUMÍNIO - REF. 416',
          'Unid. Med.': 'UNIDADE',
          'Qt.': '60',
          Valor: 'R$ 0,04',
          Total: 'R$ 2,40',
          A: '60',
          D: '0',
          C: '0',
          'Valor A.': 'R$ 0,04',
        },
      ],
    },
    {
      dadosJSON: {
        'Número da Requisição': '15155/2022',
        Tipo: 'REQUISIÇÃO DE MATERIAL',
        Convênio: 'Não',
        'Grupo de Material': '(0)',
        'Unidade de Custo':
          'PRÓ-REITORIA DE ASSUNTOS ESTUDANTIS (PROAE) (11.31)',
        'Unidade Requisitante':
          'DIRETORIA DE MANUTENÇÃO DE INSTALAÇÕES FÍSICAS (11.08.05)',
        'Destino da Requisição':
          'SUSTENTAÇÃO DE ESTOQUE DO ALMOXARIFADO DA SUP. INFRAESTRUTURA (11.89)',
        Usuário: 'dennis.ferreira -DENNIS FERREIRA SILVA(Ramal',
        Email: 'dennis.ferreira@ufrn.br',
        'Data de Cadastro': '06/07/2022',
        'Data de Envio': '06/07/2022',
        'Valor da Requisição': 'R$ 11,50',
        'Valor do Total Atendido': 'R$ 11,50',
        'Opção Orçamentária': 'SOLICITAR AUTORIZAÇÃO ORÇAMENTÁRIA',
        'Número da Requisição Relacionada':
          '4027/2022 (REQUISIÇÃO DE MANUTENÇÃO)',
        Local: 'PRÉDIO DCE. (EM FRENTE A CANTINA DO SETOR I)',
        Observações: '',
        'Status Atual': 'FINALIZADA',
      },
      itensJSON: [
        {
          Nr: '1',
          Código: '302400021411',
          Denominação: 'TIJOLO MACIÇO BRANCO, DE 1A. QUALIDADE',
          'Unid. Med.': 'UNIDADE',
          'Qt.': '25',
          Valor: 'R$ 0,46',
          Total: 'R$ 11,50',
          A: '25',
          D: '0',
          C: '0',
          'Valor A.': 'R$ 0,46',
        },
      ],
    },
    {
      dadosJSON: {
        'Número da Requisição': '15144/2022',
        Tipo: 'REQUISIÇÃO DE MATERIAL',
        Convênio: 'Não',
        'Grupo de Material': '(0)',
        'Unidade de Custo':
          'CENTRO DE CIÊNCIAS HUMANAS, LETRAS E ARTES (13.00)',
        'Unidade Requisitante':
          'DIRETORIA DE MANUTENÇÃO DE INSTALAÇÕES FÍSICAS (11.08.05)',
        'Destino da Requisição':
          'SUSTENTAÇÃO DE ESTOQUE DO ALMOXARIFADO DA SUP. INFRAESTRUTURA (11.89)',
        Usuário: 'dennis.ferreira -DENNIS FERREIRA SILVA(Ramal',
        Email: 'dennis.ferreira@ufrn.br',
        'Data de Cadastro': '06/07/2022',
        'Data de Envio': '06/07/2022',
        'Valor da Requisição': 'R$ 223,30',
        'Valor do Total Atendido': 'R$ 223,30',
        'Opção Orçamentária': 'SOLICITAR AUTORIZAÇÃO ORÇAMENTÁRIA',
        'Número da Requisição Relacionada':
          '946/2022 (REQUISIÇÃO DE MANUTENÇÃO)',
        Local: 'Estacionamento em frente ao Instituto Ágora',
        Observações: '',
        'Status Atual': 'FINALIZADA',
      },
      itensJSON: [
        {
          Nr: '1',
          Código: '302400007915',
          Denominação: 'CIMENTO PORTLAND CP II-E-32 COM 50KG',
          'Unid. Med.': 'Saco',
          'Qt.': '7',
          Valor: 'R$ 31,90',
          Total: 'R$ 223,30',
          A: '7',
          D: '0',
          C: '0',
          'Valor A.': 'R$ 31,90',
        },
      ],
    },
    {
      dadosJSON: {
        'Número da Requisição': '15080/2022',
        Tipo: 'REQUISIÇÃO DE MATERIAL',
        Convênio: 'Não',
        'Grupo de Material': '(0)',
        'Unidade de Custo': 'DEPARTAMENTO DE ENGENHARIA MECANICA (14.20)',
        'Unidade Requisitante':
          'DIRETORIA DE MANUTENÇÃO DE INSTALAÇÕES FÍSICAS (11.08.05)',
        'Destino da Requisição':
          'SUSTENTAÇÃO DE ESTOQUE DO ALMOXARIFADO DA SUP. INFRAESTRUTURA (11.89)',
        Usuário: 'jonatas.silva -JONATAS HENRIQUE CAMARA DA SILVA(Ramal',
        Email: 'jonatasufrn@yahoo.com',
        'Data de Cadastro': '06/07/2022',
        'Data de Envio': '06/07/2022',
        'Valor da Requisição': 'R$ 223,30',
        'Valor do Total Atendido': 'R$ 223,30',
        'Opção Orçamentária': 'SOLICITAR AUTORIZAÇÃO ORÇAMENTÁRIA',
        'Número da Requisição Relacionada':
          '4977/2022 (REQUISIÇÃO DE MANUTENÇÃO)',
        Local: 'LABORATÓRIO DE MANUFATURA - NTI.',
        Observações: 'Executado.',
        'Status Atual': 'FINALIZADA',
      },
      itensJSON: [
        {
          Nr: '1',
          Código: '302400007915',
          Denominação: 'CIMENTO PORTLAND CP II-E-32 COM 50KG',
          'Unid. Med.': 'Saco',
          'Qt.': '7',
          Valor: 'R$ 31,90',
          Total: 'R$ 223,30',
          A: '7',
          D: '0',
          C: '0',
          'Valor A.': 'R$ 31,90',
        },
      ],
    },
    {
      dadosJSON: {
        'Número da Requisição': '15025/2022',
        Tipo: 'REQUISIÇÃO DE MATERIAL',
        Convênio: 'Não',
        'Grupo de Material': '(0)',
        'Unidade de Custo': 'INSTITUTO DE QUÍMICA (12.88)',
        'Unidade Requisitante':
          'DIRETORIA DE MANUTENÇÃO DE INSTALAÇÕES FÍSICAS (11.08.05)',
        'Destino da Requisição':
          'SUSTENTAÇÃO DE ESTOQUE DO ALMOXARIFADO DA SUP. INFRAESTRUTURA (11.89)',
        Usuário: 'iranilton.sousa -IRANILTON FERREIRA DE SOUSA(Ramal',
        Email: 'iranilton.sousa@ufrn.br',
        'Data de Cadastro': '05/07/2022',
        'Data de Envio': '05/07/2022',
        'Valor da Requisição': 'R$ 310,96',
        'Valor do Total Atendido': 'R$ 310,96',
        'Opção Orçamentária': 'SOLICITAR AUTORIZAÇÃO ORÇAMENTÁRIA',
        'Número da Requisição Relacionada':
          '4797/2022 (REQUISIÇÃO DE MANUTENÇÃO)',
        Local: 'IQ',
        Observações: 'REPOSIÇÃO',
        'Status Atual': 'FINALIZADA',
      },
      itensJSON: [
        {
          Nr: '1',
          Código: '302400029466',
          Denominação: 'ADAPTADOR EM PVC, SOLDA-ROSCA, ÁGUA FRIA - 60MM (2")',
          'Unid. Med.': 'UNIDADE',
          'Qt.': '2',
          Valor: 'R$ 8,40',
          Total: 'R$ 16,80',
          A: '2',
          D: '0',
          C: '0',
          'Valor A.': 'R$ 8,40',
        },
        {
          Nr: '2',
          Código: '302400004207',
          Denominação:
            'BOIA PARA CAIXA DAGUA COM MECANISMO EM METAL - 1/2" - 3/4"',
          'Unid. Med.': 'UNIDADE',
          'Qt.': '2',
          Valor: 'R$ 19,52',
          Total: 'R$ 39,04',
          A: '2',
          D: '0',
          C: '0',
          'Valor A.': 'R$ 19,52',
        },
        {
          Nr: '3',
          Código: '302400013443',
          Denominação: 'FITA VEDA ROSCA - 18MM X 25 METROS',
          'Unid. Med.': 'UNIDADE',
          'Qt.': '1',
          Valor: 'R$ 5,69',
          Total: 'R$ 5,69',
          A: '1',
          D: '0',
          C: '0',
          'Valor A.': 'R$ 5,69',
        },
        {
          Nr: '4',
          Código: '302400021241',
          Denominação: 'JOELHO EM PVC 90° ESGOTO, SOLDÁVEL - 100MM',
          'Unid. Med.': 'UNIDADE',
          'Qt.': '4',
          Valor: 'R$ 4,96',
          Total: 'R$ 19,84',
          A: '4',
          D: '0',
          C: '0',
          'Valor A.': 'R$ 4,96',
        },
        {
          Nr: '5',
          Código: '3042000000001',
          Denominação: 'LÂMINA DE SERRA MANUAL',
          'Unid. Med.': 'UNIDADE',
          'Qt.': '2',
          Valor: 'R$ 1,99',
          Total: 'R$ 3,98',
          A: '2',
          D: '0',
          C: '0',
          'Valor A.': 'R$ 1,99',
        },
        {
          Nr: '6',
          Código: '302400022272',
          Denominação:
            'LUVA DE CORRER EM PVC COM ANÉIS DE BORRACHA, SOLDÁVEL, ÁGUA FRIA - 60MM (2")',
          'Unid. Med.': 'UNIDADE',
          'Qt.': '1',
          Valor: 'R$ 9,09',
          Total: 'R$ 9,09',
          A: '1',
          D: '0',
          C: '0',
          'Valor A.': 'R$ 9,09',
        },
        {
          Nr: '7',
          Código: '3024000000454',
          Denominação: 'LUVA EM PVC, SOLDÁVEL, ÁGUA FRIA - 60MM (2")',
          'Unid. Med.': 'UNIDADE',
          'Qt.': '1',
          Valor: 'R$ 9,21',
          Total: 'R$ 9,21',
          A: '1',
          D: '0',
          C: '0',
          'Valor A.': 'R$ 9,21',
        },
        {
          Nr: '8',
          Código: '302400019530',
          Denominação: 'TUBO DE PVC, SOLDÁVEL, ÁGUA FRIA - 60MM (2")',
          'Unid. Med.': 'METRO',
          'Qt.': '3',
          Valor: 'R$ 5,63',
          Total: 'R$ 16,89',
          A: '3',
          D: '0',
          C: '0',
          'Valor A.': 'R$ 5,63',
        },
        {
          Nr: '9',
          Código: '302400019476',
          Denominação: 'TUBO DE PVC, SOLDÁVEL, ESGOTO - 100MM (4")',
          'Unid. Med.': 'METRO',
          'Qt.': '3',
          Valor: 'R$ 12,64',
          Total: 'R$ 37,92',
          A: '3',
          D: '0',
          C: '0',
          'Valor A.': 'R$ 12,64',
        },
        {
          Nr: '10',
          Código: '302400030127',
          Denominação: 'VÁLVULA DE ESFERA COM ALAVANCA - 2" (60MM)',
          'Unid. Med.': 'UNIDADE',
          'Qt.': '1',
          Valor: 'R$ 152,50',
          Total: 'R$ 152,50',
          A: '1',
          D: '0',
          C: '0',
          'Valor A.': 'R$ 152,50',
        },
      ],
    },
    {
      dadosJSON: {
        'Número da Requisição': '14870/2022',
        Tipo: 'REQUISIÇÃO DE MATERIAL',
        Convênio: 'Não',
        'Grupo de Material': '(0)',
        'Unidade de Custo': 'CENTRO DE CIÊNCIAS DA SAÚDE (15.00)',
        'Unidade Requisitante':
          'DIRETORIA DE MANUTENÇÃO DE INSTALAÇÕES FÍSICAS (11.08.05)',
        'Destino da Requisição':
          'SUSTENTAÇÃO DE ESTOQUE DO ALMOXARIFADO DA SUP. INFRAESTRUTURA (11.89)',
        Usuário: 'gilson.augusto -GILSON AUGUSTO DA SILVA(Ramal',
        Email: 'gilson.augusto@ufrn.br',
        'Data de Cadastro': '04/07/2022',
        'Data de Envio': '04/07/2022',
        'Valor da Requisição': 'R$ 129,16',
        'Valor do Total Atendido': 'R$ 129,16',
        'Opção Orçamentária': 'SOLICITAR AUTORIZAÇÃO ORÇAMENTÁRIA',
        'Número da Requisição Relacionada':
          '4478/2022 (REQUISIÇÃO DE MANUTENÇÃO)',
        Local: 'LIAC - subsolo da Faculdade de Farmácia',
        Observações: 'Para instalação de dois pontos elétricos no LIAC.',
        'Status Atual': 'FINALIZADA',
      },
      itensJSON: [
        {
          Nr: '1',
          Código: '302400027973',
          Denominação: 'ABRAÇADEIRA TIPO "D" EM FERRO GALVANIZADO - 3/4"',
          'Unid. Med.': 'UNIDADE',
          'Qt.': '16',
          Valor: 'R$ 1,71',
          Total: 'R$ 27,36',
          A: '16',
          D: '0',
          C: '0',
          'Valor A.': 'R$ 1,71',
        },
        {
          Nr: '2',
          Código: '3026000001372',
          Denominação: 'CAIXA DE PASSAGEM ELÉTRICA CPT15 - SOBREPOR',
          'Unid. Med.': 'UNIDADE',
          'Qt.': '2',
          Valor: 'R$ 25,20',
          Total: 'R$ 50,40',
          A: '2',
          D: '0',
          C: '0',
          'Valor A.': 'R$ 25,20',
        },
        {
          Nr: '3',
          Código: '302600000477',
          Denominação:
            'CURVA PARA ELETRODUTO, EM PVC SEMI-RÍGIDO, PONTA E BOLSA, 90 GRAUS - 25MM',
          'Unid. Med.': 'UNIDADE',
          'Qt.': '6',
          Valor: 'R$ 3,06',
          Total: 'R$ 18,36',
          A: '6',
          D: '0',
          C: '0',
          'Valor A.': 'R$ 3,06',
        },
        {
          Nr: '4',
          Código: '302600000655',
          Denominação: 'ELETRODUTO EM PVC RÍGIDO, PONTA E BOLSA - 25MM (3/4")',
          'Unid. Med.': 'Vara',
          'Qt.': '4',
          Valor: 'R$ 8,26',
          Total: 'R$ 33,04',
          A: '4',
          D: '0',
          C: '0',
          'Valor A.': 'R$ 8,26',
        },
      ],
    },
    {
      dadosJSON: {
        'Número da Requisição': '14532/2022',
        Tipo: 'REQUISIÇÃO DE MATERIAL',
        Convênio: 'Não',
        'Grupo de Material': '(0)',
        'Unidade de Custo': 'CENTRO DE CIÊNCIAS DA SAÚDE (15.00)',
        'Unidade Requisitante':
          'DIRETORIA DE MANUTENÇÃO DE INSTALAÇÕES FÍSICAS (11.08.05)',
        'Destino da Requisição':
          'SUSTENTAÇÃO DE ESTOQUE DO ALMOXARIFADO DA SUP. INFRAESTRUTURA (11.89)',
        Usuário: 'jonatas.silva -JONATAS HENRIQUE CAMARA DA SILVA(Ramal',
        Email: 'jonatasufrn@yahoo.com',
        'Data de Cadastro': '30/06/2022',
        'Data de Envio': '30/06/2022',
        'Valor da Requisição': 'R$ 490,00',
        'Opção Orçamentária': 'SOLICITAR AUTORIZAÇÃO ORÇAMENTÁRIA',
        'Número da Requisição Relacionada':
          '4518/2022 (REQUISIÇÃO DE MANUTENÇÃO)',
        Local: 'DEPARTAMENTO DE ODONTOLOGIA',
        Observações: '',
        'Status Atual': 'ENVIADA',
      },
      itensJSON: [
        {
          Nr: '1',
          Código: '302400029505',
          Denominação: 'PORTA EM MADEIRA IPÊ - 0,80M X 2,10M',
          'Unid. Med.': 'UNIDADE',
          'Qt.': '1',
          Valor: 'R$ 490,00',
          Total: 'R$ 490,00',
          A: '0',
          D: '0',
          C: '0',
          Status: 'CADASTRADO',
        },
      ],
    },
    {
      dadosJSON: {
        'Número da Requisição': '14318/2022',
        Tipo: 'REQUISIÇÃO DE MATERIAL',
        Convênio: 'Não',
        'Grupo de Material': '(0)',
        'Unidade de Custo': 'PRÓ-REITORIA DE ADMINISTRAÇÃO (PROAD) (11.02)',
        'Unidade Requisitante':
          'DIRETORIA DE MANUTENÇÃO DE INSTALAÇÕES FÍSICAS (11.08.05)',
        'Destino da Requisição':
          'SUSTENTAÇÃO DE ESTOQUE DO ALMOXARIFADO DA SUP. INFRAESTRUTURA (11.89)',
        Usuário: 'iranilton.sousa -IRANILTON FERREIRA DE SOUSA(Ramal',
        Email: 'iranilton.sousa@ufrn.br',
        'Data de Cadastro': '28/06/2022',
        'Data de Envio': '28/06/2022',
        'Valor da Requisição': 'R$ 890,70',
        'Valor do Total Atendido': 'R$ 957,00',
        'Opção Orçamentária': 'SOLICITAR AUTORIZAÇÃO ORÇAMENTÁRIA',
        'Número da Requisição Relacionada':
          '8340/2019 (REQUISIÇÃO DE MANUTENÇÃO)',
        Local: 'CENTRO DE CONVIVÊNCIA DJALMA MARINHO.',
        Observações: 'OBRA DO NAC',
        'Status Atual': 'FINALIZADA',
      },
      itensJSON: [
        {
          Nr: '1',
          Código: '302400007915',
          Denominação: 'CIMENTO PORTLAND CP II-E-32 COM 50KG',
          'Unid. Med.': 'Saco',
          'Qt.': '30',
          Valor: 'R$ 29,69',
          Total: 'R$ 890,70',
          A: '30',
          D: '0',
          C: '0',
          'Valor A.': 'R$ 31,90',
        },
      ],
    },
    {
      dadosJSON: {
        'Número da Requisição': '14206/2022',
        Tipo: 'REQUISIÇÃO DE MATERIAL',
        Convênio: 'Não',
        'Grupo de Material': '(0)',
        'Unidade de Custo': 'CENTRO DE TECNOLOGIA (14.00)',
        'Unidade Requisitante':
          'DIRETORIA DE MANUTENÇÃO DE INSTALAÇÕES FÍSICAS (11.08.05)',
        'Destino da Requisição':
          'SUSTENTAÇÃO DE ESTOQUE DO ALMOXARIFADO DA SUP. INFRAESTRUTURA (11.89)',
        Usuário: 'jonatas.silva -JONATAS HENRIQUE CAMARA DA SILVA(Ramal',
        Email: 'jonatasufrn@yahoo.com',
        'Data de Cadastro': '28/06/2022',
        'Data de Envio': '28/06/2022',
        'Valor da Requisição': 'R$ 218,33',
        'Valor do Total Atendido': 'R$ 218,33',
        'Opção Orçamentária': 'SOLICITAR AUTORIZAÇÃO ORÇAMENTÁRIA',
        'Número da Requisição Relacionada':
          '4428/2022 (REQUISIÇÃO DE MANUTENÇÃO)',
        Local: 'Setor de Aulas IV  - Sala dos Professores.',
        Observações: 'Executado.',
        'Status Atual': 'FINALIZADA',
      },
      itensJSON: [
        {
          Nr: '1',
          Código: '302400029485',
          Denominação: 'MOLA DE PRESSÃO HIDRÁULICA PARA PORTA DE VIDRO',
          'Unid. Med.': 'UNIDADE',
          'Qt.': '1',
          Valor: 'R$ 218,33',
          Total: 'R$ 218,33',
          A: '1',
          D: '0',
          C: '0',
          'Valor A.': 'R$ 218,33',
        },
      ],
    },
  ];

  const [reqs, setReqs] = useState('');
  const [newReq, setNewReq] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sipac, setSipac] = useState([]);

  const addReq = (req) => {
    const id = reqs.length ? reqs[reqs.length - 1].id + 1 : 1;
    const myNewReq = { id, req };
    const listReqs = [...reqs, myNewReq];
    setReqs(listReqs);
  };
  const deleteReq = (id) => {
    // forma diferente de escrever, poderia usar splice
    const listReqs = reqs.filter((req) => req.id !== id);
    setReqs(listReqs);
  };
  const submitReq = (e) => {
    e.preventDefault();
    if (!newReq) return;
    addReq(newReq);
    setNewReq('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const requisicoes = {
        requisicoes: Object.values(reqs).map((item) => item.req),
      };
      console.log(requisicoes);
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
    const req = novoSipac.splice(index, 1)[0];
    toast.warning(
      `A requisição ${req.dadosJSON['Número da Requisição']} foi excluída da lista`
    );
    setSipac([...novoSipac]);
  };

  const handleStore = async (e, index) => {
    e.preventDefault();
    const novoSipac = [...sipac];
    const req = novoSipac.splice(index, 1)[0];
    toast.success(
      `Material da requisição ${req.dadosJSON['Número da Requisição']} recebido com sucesso`
    );
    setSipac([...novoSipac]);
  };

  const handleClear = async (e) => {
    e.preventDefault();
    setSipac([]);
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
          {sipac.length === 0 ? (
            <ImportSipac
              handleSubmit={handleSubmit}
              handleClear={handleClear}
              reqs={reqs}
              deleteReq={deleteReq}
              newReq={newReq}
              setNewReq={setNewReq}
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
