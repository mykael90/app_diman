import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

function ImagesGallery({ images }) {
  return (
    <Row
      xs={2}
      md={4}
      lg={6}
      className="d-flex justify-content-center align-items-center"
    >
      {images.map((url) => (
        <Col className="pb-4">
          <Card>
            <Card.Img src={url} />
          </Card>
        </Col>
      ))}
    </Row>
  );
}
export default ImagesGallery;
