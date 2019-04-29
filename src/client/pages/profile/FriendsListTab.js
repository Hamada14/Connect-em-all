import React, { Component } from 'react';

import Friend from './Friend';

import { loadingBlock } from '../../Util';

export default class FriendsListTab extends Component {

  state = {
    isLoading: true
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      friends: []
    };

  }

  componentDidMount() {
    this.update()
  }

  componentDidUpdate(prevProps) {
    if(this.props.profileId != prevProps.profileId) {
      this.update()
    }
  }

  async update() {
    this.setState({ isLoading: false });
    let requestParams = { userId: this.props.profileId };
    const friends = await fetch('/api/get_friends',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestParams) })
      .then(res => res.json())
      .then(res => res.friends);
    this.setState({ isLoading: false, friends: friends })
  }

  renderFriends() {
    return (
      <>
        {this.state.friends.map((friend, idx) => (
          <div className="friend" key={idx}>
            <Friend userId={friend.userId} email={friend.email} fullName={friend.fullName} />
          </div>
        ))}
      </>
    )
  }

  render() {
    return (
      <>
        {loadingBlock(this.state.isLoading)}
        {this.renderFriends()}
      </>
    );
  }
}
