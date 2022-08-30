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
    <Row className="my-3">
      <Col xs={12} md={8} lg={4}>
        <Row
          className="justify-content-center fs-5 py-2 rounded-top rounded-3"
          style={{ background: primaryDarkColor, color: 'white' }}
        >
          Lista de importação
        </Row>
        <Row className="bg-light rounded-bottom rounded-3">
          <Row className="my-3">
            <AddReq submitReq={submitReq} />
          </Row>
          <Col className="border-top">
            <Content
              reqs={reqs}
              deleteReq={deleteReq}
              handleClear={handleClear}
              handleSubmit={handleSubmit}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
