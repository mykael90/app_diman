/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import React, { useEffect, useContext } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { primaryDarkColor } from '../../../../../config/colors';

import Subdivision from '../../Subdivision/index';

import Geolocation from '../../Geolocation/index';

export default function ModalEdit(props) {
  const { show, handleSaveModal, handleCancelModal, data, modalName } = props;

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

  const renderSwitch = (param) => {
    switch (param) {
      case 'Subdivision':
        return (
          <Subdivision
            buildingData={data}
            handleCancelModal={handleCancelModal}
            handleSaveModal={handleSaveModal}
          />
        );
      case 'Geolocation':
        return (
          <Geolocation
            buildingData={data}
            handleCancelModal={handleCancelModal}
            handleSaveModal={handleSaveModal}
          />
        );
      default:
        return 'foo';
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleCancelModal}
      backdrop="static"
      keyboard={false}
      size="xl"
    >
      <Modal.Header
        style={{ background: primaryDarkColor, color: 'white' }}
        closeButton
      >
        <Modal.Title>SUBDIVISÕES EM INSTALAÇÕES FÍSICAS</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* <Subdivision
          buildingData={data}
          handleCancelModal={handleCancelModal}
          handleSaveModal={handleSaveModal}
        /> */}
        {renderSwitch(modalName)}
      </Modal.Body>
      {/* <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary">Understood</Button>
      </Modal.Footer> */}
    </Modal>
  );
}
