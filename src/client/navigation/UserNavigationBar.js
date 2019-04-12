import React, { Component } from "react";
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';

export default class UserNavigationBar extends Component {
  state = {
  };

  constructor(props) {
    super(props);

    this.signOut = this.signOut.bind(this)
  }

  signOut() {
    fetch('/api/sign_out',
      {
        method: 'GET',
        credentials: "same-origin"
      })
      .then(() => this.props.loginManager.updateLoggedStatus())
  }

  render() {
    const searchBlock = (
      <Form inline>
        <FormControl type="text" placeholder="Search" className="mr-sm-2" />
        <Button variant="outline-info">Search</Button>
      </Form>
    )
    return (
      <React.Fragment>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="#home">Connect ‘em</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link href="#home">Home</Nav.Link>
          </Nav>
  
          <Nav>
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>
                Hi {this.props.fullName} o/ &nbsp;&nbsp;
              </Navbar.Text>
            </Navbar.Collapse>
            { searchBlock }
            &nbsp;&nbsp;
            <Button 
              variant="outline-success"
              onClick={this.signOut}
            >
              Sign out
            </Button>
          </Nav>
        </Navbar>
      </React.Fragment>
    )
  }
}