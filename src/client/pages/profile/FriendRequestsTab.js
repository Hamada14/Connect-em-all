import React, { Component } from 'react';

export default class FriendRequestTab extends Component {

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
    return <h1> Friend Requests </h1>
  }
}
