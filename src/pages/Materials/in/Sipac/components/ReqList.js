/* eslint-disable react/prop-types */
import React from 'react';
import { ListGroup, Row, Col, Button } from 'react-bootstrap';

import LineReq from './LineReq';

function ReqList({ reqs, deleteReq, handleClear, handleSubmit }) {
  return (
    <>
      <ListGroup>
        <ListGroup.Item>
          {reqs.map((req) => (
            <LineReq
              key={req.id}
              req={req}
              deleteReq={deleteReq}
              handleClear={handleClear}
              handleSubmit={handleSubmit}
            />
          ))}
        </ListGroup.Item>
      </ListGroup>
      <Row className="text-center justify-content-center">
        <Col xs="auto" className="my-1">
          <Button variant="warning" onClick={handleClear}>
            Limpar
          </Button>
        </Col>
        <Col xs="auto" className="my-1">
          <Button
            variant="primary"
            className="btn-primary"
            onClick={handleSubmit}
          >
            Importar
          </Button>
        </Col>
      </Row>
    </>
  );
}

export default ReqList;
