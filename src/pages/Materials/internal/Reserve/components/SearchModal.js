/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import React, { useEffect, useContext } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useNavigate, UNSAFE_NavigationContext } from 'react-router-dom';

import ListImport from './ListImport';

export default function SearchModal(props) {
  const { show, handleClose, push, hiddenItems, inventoryData } = props;

  const useBackListener = (callback) => {
    const { navigator } = useContext(UNSAFE_NavigationContext);

    useEffect(() => {
      const listener = ({ location, action }) => {
        console.log('listener', { location, action });
        if (action === 'POP') {
          callback({ location, action });
        }
      };

      const unlisten = navigator.listen(listener);
      return unlisten;
    }, [callback, navigator]);
  };

  const navigate = useNavigate();

  useBackListener(({ location }) => {
    console.log('Navigated Back', { location });
    navigate('/materials/internal/reserve', { replace: false });
  });

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
