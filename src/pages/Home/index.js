/* eslint-disable global-require */
import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Collapse } from 'react-bootstrap';
import { ImgIcon } from './styled';
import { primaryDarkColor } from '../../config/colors';

export default function Home() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Container fluid className="px-0">
        <Card className="d-flex border-0 rounded-0 position-relative justify-content-center">
          <Card.Img
            fluid
            src={require('../../assets/img/buildings/infra.jpg')}
            alt="Superintendência de infraestrutura"
            className="px-0 border-0 rounded-0"
          />
          <Card.ImgOverlay
            className="position-absolute justify-content-center"
            style={{ top: `20%` }}
          >
            <Col
              xs="12"
              md="6"
              className="d-none d-sm-block border rounded justify-content-center mx-auto"
              style={{
                backgroundColor: `rgba(255,255,255, 0.9)`,
                color: 'rgba(40,40,40,.8)',
              }}
            >
              <Card.Title
                className="text-center card-title pt-4 fw-bolder"
                style={{ color: primaryDarkColor }}
              >
                SISMAN
              </Card.Title>

              <Card.Text className="text-center card-title pt-2 pb-4 fw-bolder">
                SISTEMA DE GESTÃO DA DIRETORIA MANUTENÇÃO DAS INSTALAÇOES
                FÍSICAS - INFRA/UFRN
              </Card.Text>
            </Col>
          </Card.ImgOverlay>
        </Card>
      </Container>
      <Container className="pt-4">
        <Card>
          <Card.Body>
            <Card.Title>MANUTENÇÃO DE INSTALAÇÕES FÍSICAS</Card.Title>
            <Card.Subtitle className="py-2 mb-2 text-muted">
              A manutenção de edificações é um tema cuja importância supera,
              gradualmente, a cultura de se pensar o processo de construção
              limitado até o momento quando a edificação é entregue e entra em
              uso.
            </Card.Subtitle>
            <Card.Text className="lead" style={{ textAlign: 'justify' }}>
              As edificações são suporte físico para a realização direta ou
              indireta de todas as atividades produtivas e possuem, portanto, um
              valor social fundamental. Todavia, as edificações apresentam uma
              característica que as diferencia de outros produtos: elas são
              construídas para atender a seus usuários durante muitos anos, e ao
              longo deste tempo de serviço devem apresentar condições adequadas
              ao uso a que se destinam, resistindo aos agentes ambientais e de
              uso que alteram suas propriedades técnicas iniciais.
            </Card.Text>

            {!open ? (
              <Button
                variant="secondary"
                onClick={() => setOpen(!open)}
                aria-controls="collapse-text"
                aria-expanded={open}
              >
                {' '}
                Ver mais{' '}
              </Button>
            ) : null}

            <Collapse in={open}>
              <div id="collapse-text">
                <Card.Text
                  className="lead pt-2"
                  style={{ textAlign: 'justify' }}
                >
                  É inviável, sob o ponto de vista econômico, e inaceitável, sob
                  o ponto de vista ambiental, considerar as edificações como
                  produtos descartáveis, passíveis da simples substituição por
                  novas construções quando os requisitos de desempenho atingem
                  níveis inferiores àqueles exigidos pela ABNT NBR 15575 (Partes
                  1 a 6). Isto exige que a manutenção das edificações seja
                  levada em conta tão logo elas sejam colocadas em uso.
                </Card.Text>
                <Card.Text className="lead" style={{ textAlign: 'justify' }}>
                  A omissão em relação à necessária atenção para a manutenção
                  das edificações pode ser constatada nos frequentes casos de
                  edificações retiradas de serviço muito antes de cumprida a sua
                  vida útil projetada (VUP), causando muitos transtornos aos
                  seus usuários e um sobrecusto intensivo dos serviços de
                  recuperação ou construção de novas edificações.
                </Card.Text>
                <Card.Text className="lead" style={{ textAlign: 'justify' }}>
                  Significando custo relevante na fase de uso da edificação, a
                  manutenção não pode ser feita de modo improvisado, esporádico
                  ou casual. Ela deve ser entendida como um serviço técnico
                  perfeitamente programável e como um investimento na
                  preservação do valor patrimonial.
                </Card.Text>
                <Card.Text className="lead" style={{ textAlign: 'justify' }}>
                  A elaboração e a implantação de um programa de manutenção
                  corretiva e preventiva nas edificações, além de serem
                  importantes para a segurança e qualidade de vida dos usuários,
                  são essenciais para a manutenção dos níveis de desempenho ao
                  longo da vida útil projetada.
                </Card.Text>
                <Card.Text className="lead" style={{ textAlign: 'justify' }}>
                  Para atingir maior eficiência e eficácia na administração de
                  uma edificação ou de um conjunto de edificações, é necessária
                  uma abordagem fundamentada em procedimentos organizados em um
                  sistema na gestão da manutenção, segundo uma lógica de
                  controle de qualidade e de custo.
                </Card.Text>
              </div>
            </Collapse>
          </Card.Body>
        </Card>
      </Container>
      <Container className="pt-4">
        <Card>
          <Card.Body>
            <Card.Title>SOBRE</Card.Title>
            <Card.Subtitle className="py-2 mb-2 text-muted">
              Objetivo e contexto do desenvolvimento do sistema
            </Card.Subtitle>
            <Card.Text className="lead" style={{ textAlign: 'justify' }}>
              O sistema de gestão integrado da DIMAN tem o objetivo de
              possibilitar a otimização e controle dos processos internos, a fim
              de obter maior segurança, confiabilidade e rastreabilidade,
              poporcionando dessa forma uma melhor eficiência nos atendimentos
              prestados por essa diretoria. O sistema está sendo desenvolvido
              por módulos interdependentes, sendo o primeiro módulo escolhido
              para operacionalizar o de gestão de materiais do depósito
              transitório da infraestrutura.
            </Card.Text>
            <Button variant="secondary" className="me-2">
              Desenvolvedores
            </Button>
            <Button variant="secondary">collaborator</Button>
          </Card.Body>
        </Card>
      </Container>
      <Container className="pt-4">
        <Card>
          <Card.Body>
            <Card.Title>MÓDULOS</Card.Title>
            <Card.Subtitle className="py-2 mb-2 text-muted">
              Módulos interdependentes associados as principais atividades de
              manutenção
            </Card.Subtitle>
            <Row md="5" className="d-flex justify-content-around">
              <Card as="Col" className="px-0 mx-1 my-2">
                <Card.Img
                  variant="top"
                  src="https://source.unsplash.com/400x400/?workers"
                />
                <Card.Body>
                  <Card.Title>collaborator</Card.Title>
                  <Card.Subtitle className="py-2 mb-2 text-muted">
                    Gestão dos profissionais da DIMAN
                  </Card.Subtitle>
                </Card.Body>
              </Card>
              <Card as="Col" className="px-0 mx-1 my-2">
                <Card.Img
                  variant="top"
                  src="https://source.unsplash.com/400x400/?construction"
                />
                <Card.Body>
                  <Card.Title>MATERIAIS</Card.Title>
                  <Card.Subtitle className="py-2 mb-2 text-muted">
                    Insumos materiais
                  </Card.Subtitle>
                </Card.Body>
              </Card>
              <Card as="Col" className="px-0 mx-1 my-2">
                <Card.Img
                  variant="top"
                  src="https://source.unsplash.com/400x400/?equipment"
                />
                <Card.Body>
                  <Card.Title>EQUIPAMENTOS</Card.Title>
                  <Card.Subtitle className="py-2 mb-2 text-muted">
                    Gestão de ferramentas e equipamentos
                  </Card.Subtitle>
                </Card.Body>
              </Card>
              <Card as="Col" className="px-0 mx-1 my-2">
                <Card.Img
                  variant="top"
                  src="https://source.unsplash.com/400x400/?building"
                />
                <Card.Body>
                  <Card.Title>EDIFICAÇÕES</Card.Title>
                  <Card.Subtitle className="py-2 mb-2 text-muted">
                    Edificações sob gestão da manutenção
                  </Card.Subtitle>
                </Card.Body>
              </Card>
              <Card as="Col" className="px-0 mx-1 my-2">
                <Card.Img
                  variant="top"
                  src="https://source.unsplash.com/400x400/?water"
                />
                <Card.Body>
                  <Card.Title>ABASTECIMENTO DE ÁGUA</Card.Title>
                  <Card.Subtitle className="py-2 mb-2 text-muted">
                    Módulos interdependentes associados as principais atividades
                    de manutenção
                  </Card.Subtitle>
                </Card.Body>
              </Card>
              <Card as="Col" className="px-0 mx-1 my-2">
                <Card.Img
                  variant="top"
                  src="https://source.unsplash.com/400x400/?pump"
                />
                <Card.Body>
                  <Card.Title>SANEAMENTO</Card.Title>
                  <Card.Subtitle className="py-2 mb-2 text-muted">
                    Módulos interdependentes associados as principais atividades
                    de manutenção
                  </Card.Subtitle>
                </Card.Body>
              </Card>
              <Card as="Col" className="px-0 mx-1 my-2">
                <Card.Img
                  variant="top"
                  src="https://source.unsplash.com/400x400/?energy"
                />
                <Card.Body>
                  <Card.Title>FORNECIMENTO ELÉTRICO</Card.Title>
                  <Card.Subtitle className="py-2 mb-2 text-muted">
                    Módulos interdependentes associados as principais atividades
                    de manutenção
                  </Card.Subtitle>
                </Card.Body>
              </Card>
              <Card as="Col" className="px-0 mx-1 my-2">
                <Card.Img
                  variant="top"
                  src="https://source.unsplash.com/400x400/?asphalt"
                />
                <Card.Body>
                  <Card.Title>PAVIMENTAÇÃO</Card.Title>
                  <Card.Subtitle className="py-2 mb-2 text-muted">
                    Módulos interdependentes associados as principais atividades
                    de manutenção
                  </Card.Subtitle>
                </Card.Body>
              </Card>
            </Row>
          </Card.Body>
        </Card>
      </Container>
      <Container className="py-4">
        <Card>
          <Card.Body>
            <Card.Title>TECNOLOGIAS</Card.Title>
            <Card.Subtitle className="py-2 mb-2 text-muted">
              Principais linguagens e tecnologias utilizadas para elaboração
              desse projeto
            </Card.Subtitle>
            <Row className="justify-content-center text-center">
              <Col xs={12} sm={12} md={10}>
                <Row xs={1} sm={2} md={4} className="mt-3">
                  <Col>
                    <ImgIcon
                      crossOrigin=""
                      src={require('../../assets/img/fullstack/react.png')}
                      alt="react"
                    />
                    <p>React</p>
                  </Col>
                  <Col>
                    {' '}
                    <ImgIcon
                      crossOrigin=""
                      src={require('../../assets/img/fullstack/nodejs.png')}
                      alt="nodejs"
                    />
                    <p>NodeJS</p>
                  </Col>
                  <Col>
                    {' '}
                    <ImgIcon
                      crossOrigin=""
                      src={require('../../assets/img/fullstack/npm.png')}
                      alt="npm"
                    />
                    <p>NPM</p>
                  </Col>
                  <Col>
                    {' '}
                    <ImgIcon
                      crossOrigin=""
                      src={require('../../assets/img/fullstack/javascript.png')}
                      alt="javascript"
                    />
                    <p>JavaScript</p>
                  </Col>
                </Row>
                <Row xs={1} sm={2} md={4}>
                  <Col>
                    {' '}
                    <ImgIcon
                      crossOrigin=""
                      src={require('../../assets/img/fullstack/mariadb.png')}
                      alt="mariadb"
                    />
                    <p>MariaDB</p>
                  </Col>
                  <Col>
                    {' '}
                    <ImgIcon
                      crossOrigin=""
                      src={require('../../assets/img/fullstack/git.png')}
                      alt="git"
                    />
                    <p>Git</p>
                  </Col>
                  <Col>
                    {' '}
                    <ImgIcon
                      crossOrigin=""
                      src={require('../../assets/img/fullstack/html5.png')}
                      alt="html5"
                    />
                    <p>HTML 5</p>
                  </Col>
                  <Col>
                    {' '}
                    <ImgIcon
                      crossOrigin=""
                      src={require('../../assets/img/fullstack/css3.png')}
                      alt="css3"
                    />
                    <p>CSS 3</p>
                  </Col>
                </Row>
                <Row xs={1} sm={2} md={4}>
                  <Col>
                    {' '}
                    <ImgIcon
                      crossOrigin=""
                      src={require('../../assets/img/fullstack/docker.png')}
                      alt="docker"
                    />
                    <p>Docker</p>
                  </Col>
                  <Col>
                    {' '}
                    <ImgIcon
                      crossOrigin=""
                      src={require('../../assets/img/fullstack/sequelize.png')}
                      alt="sequelize"
                    />
                    <p>Sequelize</p>
                  </Col>
                  <Col>
                    {' '}
                    <ImgIcon
                      crossOrigin=""
                      src={require('../../assets/img/fullstack/bootstrap.png')}
                      alt="bootstrap"
                    />
                    <p>Bootstrap</p>
                  </Col>
                  <Col>
                    {' '}
                    <ImgIcon
                      crossOrigin=""
                      src={require('../../assets/img/fullstack/express.png')}
                      alt="express"
                    />
                    <p>Express</p>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}
