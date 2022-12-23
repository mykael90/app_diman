/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { Button, Modal } from 'react-bootstrap';

import ListImport from './ListImport';

export default function SearchModal(props) {
  const { show, handleClose, push, hiddenItems, inventoryData } = props;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      // backdrop="static"
      keyboard={false}
      size="xl"
    >
      <Modal.Header closeButton>
        <Modal.Title>Inventário</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListImport
          push={push}
          hiddenItems={hiddenItems}
          inventoryData={inventoryData}
        />
      </Modal.Body>
      <Modal.Footer />
    </Modal>
  );
}
