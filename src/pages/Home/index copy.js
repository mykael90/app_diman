/* eslint-disable global-require */
import React from 'react';
import { Container, Row, Col, Card, Image } from 'react-bootstrap';
import { ImgIcon } from './styled';
import { primaryDarkColor } from '../../config/colors';

export default function Home() {
  return (
    <>
      <Container fluid>
        <Row className="position-relative justify-content-center">
          <Image
            fluid
            src={require('../../assets/img/buildings/infra.jpg')}
            alt="Superintendência de infraestrutura"
            className="px-0"
          />
          <Row
            className="position-absolute justify-content-center"
            style={{ top: `30%` }}
          >
            <Col
              xs="12"
              md="6"
              className="border rounded"
              style={{
                backgroundColor: `rgba(255,255,255, 0.9)`,
                color: 'rgba(40,40,40,.8)',
              }}
            >
              <div className="text-center fs-4 card-title py-3 px-2">
                <span style={{ color: primaryDarkColor }} className="fw-bolder">
                  SISMAN
                </span>{' '}
                <br />
                SISTEMA DE GESTÃO DA MANUTENÇÃO DAS INSTALAÇOES FÍSICAS
              </div>
            </Col>
          </Row>
        </Row>
      </Container>
      <Container className="text-center">
        <Row className="px-4 py-4 justify-content-center">
          <Row>
            <h5 className="display-7 fw-bold text-center">
              {' '}
              SISMAN: Sistema integrado da Diretoria de Manutenções Físicas -
              INFRA/UFRN
            </h5>
          </Row>
          <Row>
            <p className="lead" style={{ textAlign: 'justify' }}>
              O sistema integrado da DIMAN tem o objetivo de possibilitar a
              otimização e controle dos processos internos, a fim de obter
              melhor eficiência nos atendimentos prestados por essa diretoria. O
              sistema está sendo desenvolvido por módulos interdependentes,
              sendo o primeiro módulo escolhido para operacionalizar o de gestão
              de materiais do depósito transitório da infraestrutura.
            </p>
          </Row>
          <Row className="pt-4">
            <h5 className="display-7 fw-bold text-center">
              {' '}
              Tecnologias utilizadas
            </h5>
          </Row>
          <Row>
            <p className="lead" style={{ textAlign: 'center' }}>
              As principais linguagens e tecnologias utilizadas para elaboração
              desse projeto estão indicadas abaixo:
            </p>
          </Row>

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
      </Container>
    </>
  );
}
