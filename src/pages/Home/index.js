import React from 'react';
import {
  Container,
  Row,
  Col,
  Carousel,
  Card,
  CardGroup,
  Alert,
} from 'react-bootstrap';

export default function Home() {
  return (
    <Container>
      <Row className="my-2 py-2">
        <Col>
          <Carousel fade>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="https://dummyimage.com/800x400/5fc5c7/fff.jpg&text=DIMAN"
                alt="First slide"
              />
              <Carousel.Caption>
                <h3>First slide label</h3>
                <p>
                  Nulla vitae elit libero, a pharetra augue mollis interdum.
                </p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="https://dummyimage.com/800x400/787778/fff.jpg&text=DIMAN"
                alt="Second slide"
              />

              <Carousel.Caption>
                <h3>Second slide label</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="https://dummyimage.com/800x400/787778/fff.jpg&text=DIMAN"
                alt="Third slide"
              />

              <Carousel.Caption>
                <h3>Third slide label</h3>
                <p>
                  Praesent commodo cursus magna, vel scelerisque nisl
                  consectetur.
                </p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </Col>
      </Row>
      <Row className="my-2 py-2">
        <CardGroup className="py-2">
          <Card className="mx-2">
            <Card.Img
              variant="top"
              src="https://dummyimage.com/100x160/576cab/fff.jpg&text=DIMAN"
            />
            <Card.Body>
              <Card.Title>Card title</Card.Title>
              <Card.Text>
                This is a wider card with supporting text below as a natural
                lead-in to additional content. This content is a little bit
                longer.
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <small className="text-muted">Last updated 3 mins ago</small>
            </Card.Footer>
          </Card>
          <Card className="mx-2">
            <Card.Img
              variant="top"
              src="https://dummyimage.com/100x160/576cab/fff.jpg&text=DIMAN"
            />
            <Card.Body>
              <Card.Title>Card title</Card.Title>
              <Card.Text>
                This card has supporting text below as a natural lead-in to
                additional content.{' '}
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <small className="text-muted">Last updated 3 mins ago</small>
            </Card.Footer>
          </Card>
          <Card className="mx-2">
            <Card.Img
              variant="top"
              src="https://dummyimage.com/100x160/576cab/fff.jpg&text=DIMAN"
            />
            <Card.Body>
              <Card.Title>Card title</Card.Title>
              <Card.Text>
                This is a wider card with supporting text below as a natural
                lead-in to additional content. This card has even longer content
                than the first to show that equal height action.
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <small className="text-muted">Last updated 3 mins ago</small>
            </Card.Footer>
          </Card>
        </CardGroup>
      </Row>
      <Row className="border my-2 py-2">
        <Col>1 of 3</Col>
        <Col xs={5}>2 of 3 (wider)</Col>
        <Col>3 of 3</Col>
      </Row>
      <Row>
        <Alert variant="danger" dismissible>
          <Alert.Heading>
            I am an alert of type <span className="dangerText">danger</span>!
            But my color is Teal!
          </Alert.Heading>
          <p>
            By the way the button you just clicked is an{' '}
            <span className="infoText">Info</span> button but is using the color
            Tomato. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Accusantium debitis deleniti distinctio impedit officia
            reprehenderit suscipit voluptatibus. Earum, nam necessitatibus!
          </p>
        </Alert>
      </Row>
    </Container>
  );
}
