/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { Button, Modal } from 'react-bootstrap';

export default function SearchModal(props) {
  const { show, handleClose, materialId } = props;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      size="xl"
    >
      <Modal.Header closeButton>
        <Modal.Title>Transações cod={materialId}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Relatório de transações do item {materialId} e demais em
          desenvolvimento
        </p>
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
