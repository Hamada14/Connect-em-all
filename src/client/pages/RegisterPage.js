import React, { Component } from 'react';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';

export default class RegisterPage extends Component {
  state = {};

  render() {
    return (
      <React.Fragment>
        <Container>
          <Row>
            <Col md={{ span: 6, offset: 3 }}>
              <Card>
                <Card.Header>Register</Card.Header>
                <Card.Body>
                  <Form>
                    <Form.Group>
                      <Form.Label>Email address</Form.Label>
                      <Form.Control type="email" placeholder="Email" />
                    </Form.Group>
                  
                    <Form.Group>
                      <Form.Label>Password</Form.Label>
                      <Form.Control type="password" placeholder="Password" />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control type="password" placeholder="Confirm Password" />
                    </Form.Group>
                                      
                    <Form.Group>
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control placeholder="Full Name" />
                    </Form.Group>
                                      
                    <Form.Group>
                      <Form.Label>Birthday</Form.Label>
                      <Form.Control type="date" />
                    </Form.Group>

                    <Form.Group>
                      <Form.Check type="checkbox" label="I agree to the terms and conditions" />
                    </Form.Group>

                  </Form>
                  <Button variant="primary" type="submit">
                      Submit
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    )
  }
}