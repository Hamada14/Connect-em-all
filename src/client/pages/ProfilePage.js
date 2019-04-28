import React, { Component } from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';

import { errorsBlock, loadingBlock } from '../Util';

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
    this.state = {
      isLoading: true,
      errors: [],
      currentTab: TABS.TIME_LINE
    };

    this.switchToTimeline = this.switchToTimeline.bind(this);
    this.switchToFriends = this.switchToFriends.bind(this);
    this.switchToFriendRequests = this.switchToFriendRequests.bind(this);
  }

  componentDidMount() {
    let requestParams = { userId: this.props.profileId };
    fetch('/api/is_valid_user_id', {
      method : 'POST',
      credentials: "same-origin",
      headers : { 'Content-Type' : 'application/json' },
      body : JSON.stringify(requestParams)
    }).then(res => res.json())
      .then(result => {
        let errors = result.errors;
        this.setState({ isLoading: false, errors: errors });
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

  renderTimeline() {
    return <TimelineTab />
  }

  renderFriends() {
    return <FriendsListTab />
  }

  renderFriendRequests() {
    return <FriendRequestsTab />
  }

  renderMainContent() {
    if(this.state.currentTab == TABS.TIME_LINE) {
      return this.renderTimeline();
    } else if(this.state.currentTab == TABS.FRIENDS) {
      return this.renderFriends();
    } else if(this.state.currentTab == TABS.FRIEND_REQUESTS) {
      return this.renderFriendRequests();
    }
  }

  render() {
    let nav = ''
    let cont = ''
    if(this.state.errors.length == 0 && !this.state.isLoading) {
      nav = this.renderNavbar();
      cont = this.renderMainContent();
    }
    return (
      <Container>
        {errorsBlock(this.state.errors)}
        <Row>
          <Col md={{ span: 12, offset: 0 }}>
            {nav}
            {cont}
            {loadingBlock(this.state.isLoading)}
          </Col>
        </Row>
      </Container>
    );
  }
}
