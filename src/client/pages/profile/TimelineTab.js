import React, { Component } from 'react';

export default class TimelineTab extends Component {

  state = {
    isLoading: true
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };

  }

  render() {
    return <h1> Timeline </h1>
  }
}
