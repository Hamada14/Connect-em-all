import React, { Component } from 'react';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import { Redirect } from 'react-router-dom'

import { errorsBlock, loadingBlock } from '../Util';

export default class LoginPage extends Component {
  state = {
    email: '',
    password: '',
    errors: [],
    loading: false,
    done: false
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errors: [],
      loading: false,
      done: false
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);

    this.loginSubmit = this.loginSubmit.bind(this);
  }


  handleEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  loginSubmit() {
    let requestParams = {
      email: this.state.email,
      password: this.state.password
    };
    let errors = [];
    let done = true;
    this.setState({ errors: [], loading: true });
    fetch('/api/login',
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
        console.log(errors);
        this.setState({ loading: false, errors: errors, done: done });
        if(errors.length == 0)
          this.props.loginManager.updateLoggedStatus();
      }).catch(_ => this.setState({ loading: false, errors: ["Couldn't connect to the server"] }));
  }

  render() {
    const { email, password, errors, loading, done } = this.state;
    const redirectBlock = done ? <Redirect to='/' /> : "";
    const submitBlock = (
      <Button variant="primary" type="submit" disabled={loading} onClick={this.loginSubmit}>
        Login
      </Button>
    );
    return (
      <React.Fragment>
        {redirectBlock}
        <Container>
          <Row>
            <Col md={{ span: 6, offset: 3 }}>
              <Card>
                <Card.Header>Login</Card.Header>
                <Card.Body>
                  <Form>
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
                    {errorsBlock(errors)}
                    <br />
                    {loadingBlock(loading)}
                    <br />
                    {submitBlock}
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    )
  }
}