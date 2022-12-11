/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { Button, Modal, Row, Col, Image, Badge } from 'react-bootstrap';

export default function SearchModal(props) {
  const { show, handleClose, worker } = props;

  const date = new Date();

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      size="sm"
      centered
      // style={{ width: '300px' }}
    >
      <Modal.Header>
        <Row>
          <Col>
            <Modal.Title
              className="text-center"
              style={{ fontSize: '1.2em', textAlign: 'center' }}
            >
              REGISTRAR FREQUÊNCIA
            </Modal.Title>
          </Col>
        </Row>
      </Modal.Header>
      <Modal.Body>
        <Row className="py-2">
          <Image
            crossOrigin=""
            src={worker.urlPhoto}
            alt="Foto de perfil do colaborador"
            width="150"
            rounded="true"
          />
        </Row>
        <Row className="d-flex justify-content-center">
          <Col xs="auto">
            <Badge bg="light" text="dark">
              {worker.name}
            </Badge>
          </Col>
        </Row>
        <Row className="d-flex justify-content-center">
          <Col xs="auto">
            <Badge bg="light" text="dark">
              {worker.job}
            </Badge>
          </Col>
        </Row>

        <Row className="pt-3">
          <Col>{date.toLocaleString('pt-BR')}</Col>
        </Row>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <Button variant="danger" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="success">Confirmar</Button>
      </Modal.Footer>
    </Modal>
  );
}
