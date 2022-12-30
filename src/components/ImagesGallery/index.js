/* eslint-disable react/prop-types */
import React from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { FaSearchPlus, FaTrash } from 'react-icons/fa';

function ImagesGallery({ files, removeFileFromArray }) {
  console.log('imagesGallery', files);
  return (
    <Row
      xs={2}
      md={4}
      lg={6}
      className="d-flex justify-content-center align-items-center"
    >
      {files?.map((file, index) => (
        <Col className="pb-4" key={file.imageURL}>
          <Card>
            <Card.Img src={file.imageURL} />
            <Card.Footer className="d-flex justify-content-between">
              <Button
                className="border-0"
                variant="outline-primary"
                onClick={() =>
                  window.open(file.imageURL, '_blank', 'noreferrer')
                }
              >
                <FaSearchPlus />
              </Button>
              <Button
                className="border-0"
                variant="outline-danger"
                onClick={() => removeFileFromArray(index)}
              >
                <FaTrash />
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
export default ImagesGallery;
