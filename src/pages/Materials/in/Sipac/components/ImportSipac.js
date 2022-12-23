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
  submitReq,
}) {
  return (
    <Row className="bg-light border rounded d-flex justify-content-center pt-2">
      <Row
        className="px-0 mx-0 py-2 text-center"
        style={{ background: primaryDarkColor, color: 'white' }}
      >
        <span className="fs-5">ENTRADA DE MATERIAL: SIPAC </span>
      </Row>
      <Row className="bg-light rounded-bottom rounded-3">
        <Row className="my-3">
          <AddReq submitReq={submitReq} />
        </Row>
        <Col xs={10} sm={8} md={4} lg={3} className="border-top">
          <Content
            reqs={reqs}
            deleteReq={deleteReq}
            handleClear={handleClear}
            handleSubmit={handleSubmit}
          />
        </Col>
      </Row>
    </Row>
  );
}
