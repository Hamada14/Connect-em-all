import React from "react";
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';

const UserNavigationBar = () => {
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
        { searchBlock }
      </Navbar>
    </React.Fragment>
  )
}

export default UserNavigationBar;