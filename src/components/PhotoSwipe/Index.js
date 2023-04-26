import React, { useState } from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import Gallery from 'react-photoswipe-gallery';

function GalleryComponent() {
  // Define an array of images to be displayed
  const images = [
    {
      src: 'https://placeimg.com/640/480/nature',
      w: 640,
      h: 480,
      title: 'Nature',
    },
    {
      src: 'https://placeimg.com/640/480/arch',
      w: 640,
      h: 480,
      title: 'Architecture',
    },
    {
      src: 'https://placeimg.com/640/480/animals',
      w: 640,
      h: 480,
      title: 'Animals',
    },
  ];

  // Define state to keep track of the currently selected image
  const [currentIndex, setCurrentIndex] = useState(0);

  // Define a function to handle the thumbnail click event
  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <Container fluid>
      <Row>
        <Gallery
          items={images}
          options={{
            closeOnScroll: false,
            history: false,
            showHideOpacity: true,
            index: currentIndex,
          }}
        >
          {images.map((image, index) => (
            <Col key={index} xs={6} md={4} lg={3}>
              <Image
                src={image.src}
                alt={image.title}
                thumbnail
                onClick={() => handleThumbnailClick(index)}
              />
            </Col>
          ))}
        </Gallery>
      </Row>
    </Container>
  );
}

export default GalleryComponent;
