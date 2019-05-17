import React, { Component } from "react";
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';
import SearchBox from './SearchBox'

export default class UserNavigationBar extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
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
      <SearchBox />
    )
    return (
      <React.Fragment>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="#/">Connect ‘em</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link href="#/">Home</Nav.Link>
          </Nav>

          <Nav>
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>
                Hi {this.props.fullName} o/ &nbsp;&nbsp;
              </Navbar.Text>
            </Navbar.Collapse>
            { searchBlock }
            &nbsp;&nbsp;
            <Button variant="outline-info" href={"#/profile/" + this.props.userId}>My Profile</Button>
            &nbsp;&nbsp;
            <Button variant="outline-warning" href="#/settings">Settings</Button>
            &nbsp;&nbsp;
            <Button variant="outline-danger" onClick={this.signOut}>Sign out</Button>
          </Nav>
        </Navbar>
      </React.Fragment>
    )
  }
}
