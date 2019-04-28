import React, { Component } from 'react';

export default class FriendsListTab extends Component {

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
    return <h1> Friends </h1>
  }
}
