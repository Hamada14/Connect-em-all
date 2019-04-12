/* eslint-disable react/jsx-one-expression-per-line */
import React, { Component } from 'react';
import { Form, Button, Card, Container, Row, Col, Modal } from 'react-bootstrap';
import { errorsBlock, loadingBlock } from "../Util";


export default class RegisterPage extends Component {
  state = {
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    birthdate: '',
    errors: [],
    loading: false,
    done: false
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      birthdate: '',
      errors: [],
      loading: false,
      done: false
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(this);
    this.handleFullNameChange = this.handleFullNameChange.bind(this);
    this.handleBirthdateChange = this.handleBirthdateChange.bind(this);
    this.successfulModalClose = this.successfulModalClose.bind(this);

    this.registerAccount = this.registerAccount.bind(this);
  }

  handleEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  handleConfirmPasswordChange(event) {
    this.setState({ confirmPassword: event.target.value });
  }

  handleFullNameChange(event) {
    this.setState({ fullName: event.target.value });
  }

  handleBirthdateChange(event) {
    this.setState({ birthdate: event.target.value });
  }

  registerAccount() {
    let requestParams = {
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
      fullName: this.state.fullName,
      birthdate: this.state.birthdate
    };
    let errors = [];
    let done = true;
    this.setState({ errors: [], loading: true });
    fetch('/api/register',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestParams) })
      .then(res => res.json())
      .then(result => {
        errors = result.errors;
        if(errors.length != 0) {
          done = false
        }
        this.setState({ loading: false, errors: errors, done: done });
      }).catch(_ => this.setState({ loading: false, errors: ["Couldn't connect to the server"] }));
  }

  successfulModalClose() {
    this.setState({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      birthdate: '',
      errors: [],
      loading: false,
      done: false
    });
  }

  render() {
    const { email, password, confirmPassword, fullName, birthdate, errors, loading, done } = this.state;
    const submitBlock = (
      <Button variant="primary" type="submit" disabled={loading} onClick={this.registerAccount}>
        Submit
      </Button>
    );

    const successfulModal = (
      <Modal show={done} onHide={this.successfulModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Done</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You have registered successfully, welcome to the family.
          <br />
          Please login to your account
        </Modal.Body>
      </Modal>
    )
    return (
      <React.Fragment>
        <Container>
          <Row>
            <Col md={{ span: 6, offset: 3 }}>
              <Card>
                <Card.Header>Register</Card.Header>
                <Card.Body>
                  <Form onSubmit={this.registerAccount}>
                    <Form.Group>
                      <Form.Label>Email address</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={this.handleEmailChange}
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={this.handlePasswordChange}
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={this.handleConfirmPasswordChange}
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        placeholder="Full Name"
                        value={fullName}
                        onChange={this.handleFullNameChange}
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Birthday</Form.Label>
                      <Form.Control
                        type="date"
                        value={birthdate}
                        onChange={this.handleBirthdateChange}
                      />
                    </Form.Group>

                  </Form>
                  {errorsBlock(errors)}
                  <br />
                  {loadingBlock(loading)}
                  <br />
                  {submitBlock}
                  {successfulModal}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    )
  }
}
