import React from "react";
import { Navbar, Nav } from 'react-bootstrap';

const GenericNavigationBar = () => {
  return (
    <React.Fragment>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#">Connect ‘em</Navbar.Brand>
        <Nav className="mr-auto" />

        <Nav>
          <Nav.Link href="#register">Register</Nav.Link>
          <Nav.Link href="#login">Login</Nav.Link>
        </Nav>
      </Navbar>
    </React.Fragment>
  )
}

export default GenericNavigationBar;