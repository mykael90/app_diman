import React from 'react';
import { Container, Row, Card, CardGroup } from 'react-bootstrap';

export default function Home() {
  return (
    <Container>
      <Row>
        <CardGroup className="py-2">
          <Card className="mx-2">
            <Card.Img
              variant="top"
              src="https://dummyimage.com/80x80/576cab/fff.jpg&text=DIMAN"
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
              src="https://dummyimage.com/80x80/576cab/fff.jpg&text=DIMAN"
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
              src="https://dummyimage.com/80x80/576cab/fff.jpg&text=DIMAN"
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
              src="https://dummyimage.com/80x80/576cab/fff.jpg&text=DIMAN"
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
              src="https://dummyimage.com/80x80/576cab/fff.jpg&text=DIMAN"
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
      <p className="text-end fs-6">
        Testes de palavras{' '}
        <spam className="fw-bolder">
          {' '}
          diferentes! <spam className="fw-bolder"> diferentes! </spam>{' '}
        </spam>
      </p>
    </Container>
  );
}
