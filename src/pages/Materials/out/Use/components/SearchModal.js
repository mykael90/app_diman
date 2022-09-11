/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { Button, Modal } from 'react-bootstrap';

import ListImport from './ListImport';

export default function SearchModal(props) {
  const { show, handleClose, push, items } = props;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      size="xl"
    >
      <Modal.Header closeButton>
        <Modal.Title>Inventário</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListImport push={push} items={items} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary">Understood</Button>
      </Modal.Footer>
    </Modal>
  );
}
