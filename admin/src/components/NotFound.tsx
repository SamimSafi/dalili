import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Container className="my-5 py-5">
      <Row className="justify-content-center align-items-center">
        <Col md={6} className="text-center">
          <h1 className="display-4 mb-3">404 - Page Not Found</h1>
          <p className="lead mb-4">Oops! The page you are looking for does not exist.</p>
          <Link to={"/"}>
          <Button variant="primary" size="lg">
            Go back to homepage
          </Button>

          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;