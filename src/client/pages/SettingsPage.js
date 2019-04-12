import React, { Component } from 'react';
import { Form, Button, Card, Container, Row, Col, Modal } from 'react-bootstrap';
import { errorsBlock, loadingBlock, successfulBlock } from "../Util";

export default class SettingsPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fullName : props.fullName,
      birthdate : props.birthdate,
      oldPassword : '',
      newPassword : '',
      confirmPassword : '',
      errors : [],
      loading : false,
      done : false
    };
    console.log(props.birthdate)
    this.handleOldPasswordChange = this.handleOldPasswordChange.bind(this);
    this.handleNewPasswordChange = this.handleNewPasswordChange.bind(this);
    this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(this);
    this.handleFullNameChange = this.handleFullNameChange.bind(this);
    this.handleBirthdateChange = this.handleBirthdateChange.bind(this);

    this.updateSettings = this.updateSettings.bind(this);
  }

  handleFullNameChange(event) {
    this.setState({ fullName : event.target.value });
  }

  handleBirthdateChange(event) {
    this.setState({ birthdate : event.target.value });
  }

  handleOldPasswordChange(event) {
    this.setState({ oldPassword : event.target.value });
  }

  handleNewPasswordChange(event) {
    this.setState({ newPassword : event.target.value });
  }

  handleConfirmPasswordChange(event) {
    this.setState({ confirmPassword : event.target.value });
  }

  updateSettings() {
    let requestParams = {
      fullName : this.state.fullName,
      birthdate : this.state.birthdate,
      oldPassword : this.state.oldPassword,
      newPassword : this.state.newPassword,
      confirmPassword : this.state.confirmPassword,
    };
    let errors = [];
    let done = true;
    this.setState({ errors : [], loading : true });
    fetch('/api/update_info', {
      method : 'POST',
      headers : { 'Content-Type' : 'application/json' },
      body : JSON.stringify(requestParams)
    }).then(res => res.json())
      .then(result => {
        errors = result.errors;
        if (errors.length != 0) {
          done = false
        }
        this.setState({ loading : false, errors : errors, done : done });
      })
      .catch(_ => this.setState({ loading : false, done: false, errors : [ "Couldn't connect to the server" ] }));
  }

  render() {
    const { fullName, birthdate, oldPassword, newPassword, confirmPassword, errors, loading, done } = this.state;
    const submitBlock = (
      <Button variant="primary" type="submit" disabled={loading} onClick={this.updateSettings}>
        Change Information
      </Button>
    );
    
    return (
      <React.Fragment>
        <Container>
          <Row>
            <Col md={{ span: 6, offset: 3 }}>
              <Card>
                <Card.Header>Update Settings</Card.Header>
                <Card.Body>
                  <Form onSubmit={this.updateSettings}>
                    <Form.Group>
                      <Form.Label>Old Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Old Password"
                        value={oldPassword}
                        onChange={this.handleOldPasswordChange}
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>New Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={this.handleNewPasswordChange}
                      />
                    </Form.Group>

                    <Form.Group><Form.Label>Confirm Password</Form.Label>
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
                        value={birthdate.substring(0, 10)}
                        onChange={this.handleBirthdateChange}
                      />
                    </Form.Group>

                  </Form>
                  {errorsBlock(errors)}
                  <br />
                  {loadingBlock(loading)}
                  {done ? successfulBlock('Information has been updated') : ''}
                  <br />
                  {submitBlock}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    )
  }
}