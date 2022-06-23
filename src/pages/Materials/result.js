import React, { useState } from 'react';
import { get } from 'lodash';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

export default function result(props) {
  return (
    <>
      <Row className="my-4">
        {Object.entries(props.dadosJSON).map(([key, value]) => (
          <p>
            {key}: {value}
          </p>
        ))}
      </Row>

      <Row className="my-4">
        {props.itensJSON.map((item) => (
          <p key={item.Nr}>{item.Nr}</p>
        ))}
      </Row>
    </>
  );
}
