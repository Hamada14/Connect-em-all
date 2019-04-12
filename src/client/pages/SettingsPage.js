import React, { Component } from 'react';
import { Form, Button, Card, Container, Row, Col, Modal } from 'react-bootstrap';
import { errorsBlock, loadingBlock } from "../Util";

export default class SettingsPage extends Component {
    state = {
        oldPassword : '',
        newPassword: '',
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
            oldPassword : '',
            newPassword : '',
            confirmPassword : '',
            fullName : props.fullName,
            birthdate : props.birthdate,
            errors : [],
            loading : false,
            done : false
        };
        this.handleOldPasswordChange = this.handleOldPasswordChange.bind(this);
        this.handleNewPasswordChange = this.handleNewPasswordChange.bind(this);
        this.handleConfirmPasswordChange =
            this.handleConfirmPasswordChange.bind(this);
        this.handleFullNameChange = this.handleFullNameChange.bind(this);
        this.handleBirthdateChange = this.handleBirthdateChange.bind(this);
        this.successfulModalClose = this.successfulModalClose.bind(this);

        this.updateSettings = this.updateSettings.bind(this);
    }

    handleOldPasswordChange(event) {
        this.setState({oldPassword : event.target.value});
    }

    handleNewPasswordChange(event) {
        this.setState({newPassword : event.target.value});
    }

    handleConfirmPasswordChange(event) {
        this.setState({confirmPassword : event.target.value});
    }

    handleFullNameChange(event) {
        this.setState({fullName : event.target.value});
    }

    handleBirthdateChange(event) {
        this.setState({birthdate : event.target.value});
    }

    updateSettings() {
        let requestParams = {
            oldPassword : this.state.oldPassword,
            newPassword : this.state.newPassword,
            confirmPassword : this.state.confirmPassword,
            fullName : this.state.fullName,
            birthdate : this.state.birthdate
        };
        let errors = [];
        let done = true;
        this.setState({errors : [], loading : true});
        fetch('/api/update_info', {
            method : 'POST',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify(requestParams)
        })
            .then(res => res.json())
            .then(result => {
                errors = result.errors;
                if (errors.length != 0) {
                    done = false
                }
                this.setState({loading : false, errors : errors, done : done});
            })
            .catch(_ => this.setState({
                loading : false,
                errors : [ "Couldn't connect to the server" ]
            }));
    }

    successfulModalClose() {
        this.setState({
            oldPassword : '',
            newPassword : '',
            confirmPassword : '',
            fullName : '',
            birthdate : '',
            errors : [],
            loading : false,
            done : false
        });
    }

    render() {
        const {
            oldPassword,
            newPassword,
            confirmPassword,
            fullName,
            birthdate,
            errors,
            loading,
            done
        } = this.state;
    const submitBlock = (
      <Button variant="primary" type="submit" disabled={loading} onClick={this.updateSettings}>
        Submit
      </Button>
    );

    const successfulModal = (
      <Modal show={done} onHide={this.successfulModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Done</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You have updated the settings successfully.
        </Modal.Body>
      </Modal>
    )
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
    type = "password"
    placeholder = "New Password"
    value = {newPassword} onChange =
    { this.handleNewPasswordChange } />
                    </Form.Group >

        <Form.Group><Form.Label>Confirm Password<
            /Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={this.handleConfirmPasswordChange}
                      />
        </Form.Group>

                    <Form.Group>
                      <Form.Label>Full Name</Form
             .Label>< Form.Control
    placeholder = "Full Name"
                        value={fullName}
                        onChange={
            this.handleFullNameChange}
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
};
