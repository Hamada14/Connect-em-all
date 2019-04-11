import React, { Component } from 'react';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';

export default class LoginPage extends Component {
   state = {};

   render() {
     return (
       <React.Fragment>
         <Container>
           <Row>
             <Col md={{ span: 6, offset: 3 }}>
               <Card>
                 <Card.Header>Login</Card.Header>
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
                     <Button variant="primary" type="submit">
                           Login
                     </Button>
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