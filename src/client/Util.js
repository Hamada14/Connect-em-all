/* eslint-disable import/prefer-default-export */
import React from 'react';
import { ListGroup, Spinner, Alert } from 'react-bootstrap';

export function errorsBlock(errors) {
  if(errors.length == 0) {
    return <React.Fragment />;
  }
  const error_list = (
    <React.Fragment>
      { errors.map((v) => (<ListGroup.Item key={v} variant="danger">{v}</ListGroup.Item>)) }
    </React.Fragment>
  )
  return (
    <ListGroup>
      { error_list }
    </ListGroup>
  )
}

export function successfulBlock(message) {
  return <Alert variant='success'>{message}</Alert>;
}

export function loadingBlock(loading) {
  const spinner = (
    <Spinner animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>
  );
  return loading ? spinner : <React.Fragment />
}