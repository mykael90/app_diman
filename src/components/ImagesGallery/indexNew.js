/* eslint-disable react/prop-types */
import React from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { FaSearchPlus, FaTrash } from 'react-icons/fa';
import LightGallery from 'lightgallery/react';

// import styles
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';

// If you want you can use SCSS instead of css
import 'lightgallery/scss/lightgallery.scss';
import 'lightgallery/scss/lg-zoom.scss';

// import plugins if you need
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

function ImagesGallery({ files, removeFileFromArray }) {
  const onInit = () => {
    console.log('lightGallery has been initialized');
  };
  console.log('imagesGallery', files);
  return (
    <Row
      xs={2}
      md={4}
      lg={6}
      className="d-flex justify-content-center align-items-center"
    >
      <LightGallery
        onInit={onInit}
        speed={500}
        plugins={[lgThumbnail, lgZoom]}
        className="d-flex"
      >
        {files?.map((file, index) => (
          <Col
            lg={4}
            className="pb-4 gallery-item"
            key={file.imageURL}
            data-src={file.imageURL}
          >
            <Card>
              <Card.Img src={file.imageURL} />
              <Card.Footer className="d-flex justify-content-between">
                <Button
                  className="border-0"
                  variant="outline-primary"
                  onClick={() => {
                    window.open(file.imageURL, '_blank', 'noreferrer');
                    console.log(file.imageURL);
                  }}
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
      </LightGallery>
    </Row>
  );
}
export default ImagesGallery;
