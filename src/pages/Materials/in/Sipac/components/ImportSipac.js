import React from 'react';

import { Row, Col } from 'react-bootstrap';

import AddReq from './AddReq';
import Content from './Content';
import { primaryDarkColor } from '../../../../../config/colors';

export default function importSipac({
  handleSubmit,
  reqs,
  deleteReq,
  handleClear,
  newReq,
  setNewReq,
  submitReq,
}) {
  return (
    <Row className="my-3">
      <Col xs={10} md={8} lg={4} className="border">
        <Row
          className="justify-content-center fs-6"
          style={{ background: primaryDarkColor, color: 'white' }}
        >
          Lista de importação
        </Row>
        <Row>
          <AddReq newReq={newReq} setNewReq={setNewReq} submitReq={submitReq} />
        </Row>
        <Row>
          <Content
            reqs={reqs}
            deleteReq={deleteReq}
            handleClear={handleClear}
            handleSubmit={handleSubmit}
          />
        </Row>
      </Col>
    </Row>
  );
}
