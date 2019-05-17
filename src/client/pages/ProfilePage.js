import React, { Component } from 'react';
import { Button, Card, Container, Row, Col, Nav } from 'react-bootstrap';
import moment from 'moment';

import { errorsBlock, loadingBlock } from '../Util';

import NewsFeedTab from './profile/NewsFeedTab'
import TimelineTab from './profile/TimelineTab'
import FriendsListTab from './profile/FriendsListTab'
import FriendRequestsTab from './profile/FriendRequestsTab'

const enumValue = (name) => Object.freeze({ toString: () => name });

const TABS = Object.freeze({
  TIME_LINE: enumValue("Tabs.TIME_LINE"),
  FRIENDS: enumValue("Tabs.FRIENDS"),
  FRIEND_REQUESTS: enumValue("Tabs.FRIEND_REQUESTS")
});

export default class ProfilePage extends Component {

  state = {
    isLoading: true
  };

  constructor(props) {
    super(props);

    let defaultTab = TABS.TIME_LINE;
    if(this.props.profileId == this.props.clientId) {
        defaultTab = TABS.NEWS_FEED;
    }

    this.state = {
      isLoading: true,
      errors: [],
      currentTab: defaultTab,
      areFriends: false,
      profileFullName: '',
      profileEmail: '',
      profileBirthdate: '',
      sentFriendRequest: false,
      receivedFriendRequest: false
    };

    this.switchToTimeline = this.switchToTimeline.bind(this);
    this.switchToFriends = this.switchToFriends.bind(this);
    this.switchToFriendRequests = this.switchToFriendRequests.bind(this);

    this.addFriend = this.addFriend.bind(this);
    this.acceptFriendRequest = this.acceptFriendRequest.bind(this);
    this.rejectFriendRequest = this.rejectFriendRequest.bind(this);
    this.cancelFriendRequest = this.cancelFriendRequest.bind(this);
    this.deleteFriend = this.deleteFriend.bind(this);
  }

  componentDidMount() {
    this.update()
  }

  componentDidUpdate(prevProps) {
    if(this.props.profileId != prevProps.profileId) {
      this.update()
    }
  }

  async getProfileInfo() {
    let requestParams = { userId: this.props.profileId }
    let personalInfo = await fetch('/api/get_user_personal_info',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestParams) })
      .then(res => res.json())
    return personalInfo
  }

  async areFriends() {
    let requestParams = { userId1:this.props.clientId, userId2:this.props.profileId }
    let areFriends = await fetch('/api/are_friends',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestParams) })
      .then(res => res.json())
      .then(res => res.errors.length == 0);
    return areFriends;
  }

  update() {
    fetch('/api/has_user_by_id?userId=' + this.props.profileId, {
      method : 'GET',
      credentials: "same-origin",
      headers : { 'Content-Type' : 'application/json' },
    }).then(res => res.json())
      .then(async (result) => {
        let errors = result.errors;
        let { fullName, birthdate, email } = await this.getProfileInfo();
        let areFriends = await this.areFriends();
        let sentFriendRequest = await this.hasFriendRequest(this.props.clientId, this.props.profileId);
        let receivedFriendRequest = await this.hasFriendRequest(this.props.profileId, this.props.clientId);
        this.setState({ isLoading: false, errors: errors, areFriends: areFriends,
          profileFullName: fullName, profileBirthdate: birthdate, profileEmail: email,
          sentFriendRequest: sentFriendRequest, receivedFriendRequest: receivedFriendRequest });
      })
  }

  switchToTimeline() {
    this.setState({ currentTab: TABS.TIME_LINE });
  }

  switchToFriends() {
    this.setState({ currentTab: TABS.FRIENDS });
  }

  switchToFriendRequests() {
    this.setState({ currentTab: TABS.FRIEND_REQUESTS });
  }

  async addFriend() {
    let requestParams = { userId: this.props.clientId, friendId: this.props.profileId };
    await fetch('/api/add_friend', {
      method: 'POST',
      credentials: "same-origin",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestParams) })
    this.update();
  }

  async acceptFriendRequest() {
    let requestParams = { userId: this.props.profileId, friendId: this.props.clientId };
    await fetch('/api/accept_friend_request', {
      method: 'POST',
      credentials: "same-origin",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestParams) })
    this.update();
  }

  async rejectFriendRequest() {
    let requestParams = { userId: this.props.profileId, friendId: this.props.clientId };
    await fetch('/api/reject_friend_request', {
      method: 'POST',
      credentials: "same-origin",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestParams) })
    this.update();
  }

  async cancelFriendRequest() {
    let requestParams = { userId: this.props.clientId, friendId: this.props.profileId };
    await fetch('/api/reject_friend_request', {
      method: 'POST',
      credentials: "same-origin",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestParams) })
    this.update();
  }

  async deleteFriend() {
    let requestParams = { userId: this.props.clientId, friendId: this.props.profileId }
    await fetch('/api/delete_friend', {
      method: 'POST',
      credentials: "same-origin",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestParams) })
    this.update();
  }

  async hasFriendRequest(userId, friendId) {
    let requestParams = { userId: userId, friendId: friendId };
    return await fetch('/api/has_friend_request', {
      method: 'POST',
      credentials: "same-origin",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestParams) })
      .then(res => res.json())
      .then(res => res.hasFriendRequest)
  }

  renderNavbar() {
    let friendRequestsNavItem = '';
    if(this.props.profileId == this.props.clientId) {
      friendRequestsNavItem = (
        <Nav.Item>
          <Nav.Link
            onClick={this.switchToFriendRequests}
            active={this.state.currentTab == TABS.FRIEND_REQUESTS}
          >
            Friend Requests
          </Nav.Link>
        </Nav.Item>
      );
    }
    return (
      <Nav justify variant="tabs" defaultActiveKey="/home">
        <Nav.Item>
          <Nav.Link
            onClick={this.switchToTimeline}
            active={this.state.currentTab == TABS.TIME_LINE}
          >
            Timeline
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            onClick={this.switchToFriends}
            active={this.state.currentTab == TABS.FRIENDS}
          >
            Friends
          </Nav.Link>
        </Nav.Item>
        {friendRequestsNavItem}
      </Nav>
    );
  }

  renderMainContent() {
    if(this.state.currentTab == TABS.NEWS_FEED) {
      return (
        <NewsFeedTab
          clientId={this.props.clientId}
          profileId={this.props.profileId}
          fullName={this.props.fullName}
        />
      );
    } else if(this.state.currentTab == TABS.TIME_LINE) {
      return (
        <TimelineTab
          clientId={this.props.clientId}
          profileId={this.props.profileId}
          fullName={this.props.fullName}
        />
      );
    } else if(this.state.currentTab == TABS.FRIENDS) {
      return (
        <FriendsListTab
          profileId={this.props.profileId}
        />
      );
    } else if(this.state.currentTab == TABS.FRIEND_REQUESTS) {
      return (<FriendRequestsTab profileId={this.props.profileId} />);
    }
  }

  renderPersonalInfo() {
    let friendRequestButton = ''
    if(this.props.profileId != this.props.clientId && !this.state.areFriends) {
      if(this.state.sentFriendRequest) {
        friendRequestButton = <Button variant="primary" onClick={this.cancelFriendRequest}>Cancel Request</Button>
      } else if(this.state.receivedFriendRequest) {
        friendRequestButton = (
          <>
            <Container>
              <Row>
                <Col md={{ span: 1, offset: 0 }}>
                  <Button variant="primary" onClick={this.acceptFriendRequest}>Accept Request</Button>
                </Col>
                <Col md={{ span: 1, offset: 6 }}>
                  <Button variant="primary" onClick={this.rejectFriendRequest}>Reject Request</Button>
                </Col>
              </Row>
            </Container>
          </>
        );
      } else {
        friendRequestButton = <Button variant="primary" onClick={this.addFriend}>Add Friend</Button>;
      }
    } else if(this.props.profileId != this.props.clientId) {
      friendRequestButton = <Button variant="primary" onClick={this.deleteFriend}>Delete Friend</Button>
    }
    return (
      <>
        <Container>
          <Row>
            <Col md={4}>
              <h3>{this.state.profileFullName}</h3>
            </Col>
            <Col md={{ span: 4, offset: 3 }}>
              {friendRequestButton}
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              Email: {this.state.profileEmail}
              <br />
              Birthdate: { moment(this.state.profileBirthdate).format('YYYY MMM Mo')}
            </Col>
          </Row>
        </Container>
      </>
    )
  }

  render() {
    let nav = ''
    let cont = ''
    let personalInfo = '';
    if(this.state.errors.length == 0 && !this.state.isLoading) {
      nav = this.renderNavbar();
      cont = this.renderMainContent();
      personalInfo = this.renderPersonalInfo();
    }
    return (
      <Container>
        {errorsBlock(this.state.errors)}
        <Row>
          <Col md={{ span: 10, offset: 1 }}>
            <Card body>
              {personalInfo}
            </Card>
            <br />
          </Col>
          <Col md={{ span: 12, offset: 0 }}>
            {nav}
            <Card body>
              {cont}
              {loadingBlock(this.state.isLoading)}
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}
