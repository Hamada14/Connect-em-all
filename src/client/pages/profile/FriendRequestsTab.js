import React, { Component } from 'react';
import { Button, Card, Container, Row, Col, Nav } from 'react-bootstrap';

import { Link } from 'react-router-dom'

import { loadingBlock } from '../../Util';

export default class FriendRequestTab extends Component {

  state = {
    isLoading: true
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      friendRequests: []
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
    this.setState({ isLoading: true });
    let friendRequests = await fetch('/api/get_user_friend_requests',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: this.props.profileId }) })
      .then(res => res.json())
      .then(res => res.friendRequests);
    this.setState({ isLoading: false, friendRequests: friendRequests });
  }

  async acceptFriendRequest(userId, friendId) {
    let requestParams = { userId: userId, friendId: friendId };
    await fetch('/api/accept_friend_request', {
      method: 'POST',
      credentials: "same-origin",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestParams) })
    this.update();
  }

  async rejectFriendRequest(userId, friendId) {
    let requestParams = { userId: userId, friendId: friendId };
    await fetch('/api/reject_friend_request', {
      method: 'POST',
      credentials: "same-origin",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestParams) })
    this.update();
  }

  renderFriendRequests() {
    return (
      <>
        {this.state.friendRequests.map((friendRequest, idx) => (
          <div className="friendRequest" key={idx}>
            <Row>
              <Col xs={12} md={8}>
                <div className="tweetEntry">
                  <div className="tweetEntry-content">
                    <Link to={"/profile/" + friendRequest.userId}>
                      <strong className="tweetEntry-fullname">
                        {friendRequest.fullName}
                      </strong>
                      <span className="tweetEntry-username">
                        &nbsp; &nbsp; - &nbsp; <b>{friendRequest.email}</b>
                      </span>
                    </Link>
                  </div>
                </div>
              </Col>
              <Col xs={6} md={4}>
                <Row>
                  <Col md={{ span: 1, offset: 0 }}>
                    <Button
                      variant="primary"
                      onClick={() => this.acceptFriendRequest(friendRequest.userId, this.props.profileId)}
                    >
                      Accept Request
                    </Button>
                  </Col>
                  <Col md={{ span: 1, offset: 6 }}>
                    <Button
                      variant="primary"
                      onClick={() => this.rejectFriendRequest(friendRequest.userId, this.props.profileId)}
                    >
                      Reject Request
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        ))}
      </>
    );
  }

  render() {
    let mainContent = ''
    if(!this.state.isLoading) {
      mainContent = this.renderFriendRequests();
    }
    return (
      <Container>
        {mainContent}
        {loadingBlock(this.state.isLoading)}
      </Container>
    )
  }
}
