/* eslint-disable react/prop-types */
import React from 'react';
import { ListGroup, Row, Col, Button } from 'react-bootstrap';

import LineReq from './LineReq';

function ReqList({ reqs, deleteReq, handleClear, handleSubmit }) {
  return (
    <>
      <Row className="pt-4">
        <Col>
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
        </Col>
      </Row>
      <Row className="my-4 text-center justify-content-center">
        <Col xs="auto" className="my-1">
          <Button variant="secondary" onClick={handleClear}>
            Limpar
          </Button>
        </Col>
        <Col xs="auto" className="my-1">
          <Button variant="primary" onClick={handleSubmit}>
            Importar
          </Button>
        </Col>
      </Row>
    </>
  );
}

export default ReqList;
