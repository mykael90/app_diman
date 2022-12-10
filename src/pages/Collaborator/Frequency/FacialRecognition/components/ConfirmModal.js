/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { Button, Modal } from 'react-bootstrap';

export default function SearchModal(props) {
  const { show, handleClose, workerId } = props;

  console.log(workerId);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      size="xl"
    >
      <Modal.Header closeButton>
        <Modal.Title>Registrar frequência </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {workerId}
        <p>Criar modal para registrar frequência do colaborador</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Fechar
        </Button>
        <Button variant="primary">Entendido</Button>
      </Modal.Footer>
    </Modal>
  );
}
