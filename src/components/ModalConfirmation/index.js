/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import React, { useEffect, useContext } from 'react';
import { Button, Modal } from 'react-bootstrap';

export default function ModalConfirmation(props) {
  const { show, title, message, handleConfirmModal, handleCancelModal } = props;

  // Manipulando o botão de voltar do navegador para não sair da página de reserva
  useEffect(() => {
    // Add a fake history event so that the back button does nothing if pressed once
    window.history.pushState(
      'fake-route',
      document.title,
      window.location.href
    );

    addEventListener('popstate', handleCancelModal);

    // Here is the cleanup when this component unmounts
    return () => {
      removeEventListener('popstate', closeQuickView);
      // If we left without using the back button, aka by using a button on the page, we need to clear out that fake history event
      if (window.history.state === 'fake-route') {
        window.history.back();
      }
    };
  }, []);

  return (
    <Modal
      show={show}
      onHide={handleCancelModal}
      backdrop="static"
      keyboard={false}
      size="sm"
      centered
    >
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <Button variant="danger" onClick={handleCancelModal}>
          Cancelar
        </Button>
        <Button variant="success" onClick={handleConfirmModal}>
          Confirmar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
