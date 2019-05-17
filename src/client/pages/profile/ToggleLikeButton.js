import React, { Component } from 'react';
import { Button, Modal, ListGroup, Row, Col, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom'

export default class LikeToggleButton extends Component {
  constructor(props){
    super(props);
    this.state = {
      likes: this.parseLikes(props.likes),
      likers: this.props.likers,
      postId: props.postId,
      clientId: props.clientId,
      disabled: false
    };

    this.handleShowLikers = this.handleShowLikers.bind(this);
    this.handleCloseLikers = this.handleCloseLikers.bind(this);
    this.toggleLike = this.toggleLike.bind(this);
  }

  parseLikes(likes) {
    if (likes && likes.length) {
      return likes.split(",").map(Number);
    }
    return [];
  }

  toggleLike() {
    if (this.state.disabled) {
      return;
    }
    this.setState({
      disabled : true,
    });

    fetch('/api/toggle_like_post?userId=' + this.state.clientId + "&postId=" + this.state.postId,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }).then(res => res.json())
      .then(data => {
        this.setState({
          likes: this.parseLikes(data.likes),
          likers: data.likers,
          disabled : false
        });
      });
  }

  handleShowLikers() {
    this.setState({ showLikers: true });
  }

  handleCloseLikers() {
    this.setState({ showLikers: false });
  }

  renderCounter(count) {
    return <Button className='like-counter' onClick={this.handleShowLikers} variant="light">Likes: {count}</Button>;
  }

  renderButton(text) {
    return <Button className='like-btn' onClick={this.toggleLike}>{text}</Button>;
  }

  renderLikersList() {
    if(!this.state.likers)
      return ''
    return (
      <ListGroup>
        {this.state.likers.map((liker) => {
          return (

            <div key={liker.EMAIL}>
              <ListGroup.Item>
                <Link to={"/profile/" + liker.USER_ID}>
                  <strong className="tweetEntry-fullname">
                    {liker.FULL_NAME}
                  </strong>
                  <span className="tweetEntry-username">
                    &nbsp; &nbsp; - &nbsp; <b>{liker.EMAIL}</b>
                  </span>
                </Link>
              </ListGroup.Item>
            </div>
          )
        })
      }
      </ListGroup>
    )
  }

  render() {
    let text;
    if (this.state.likes.includes(this.state.clientId)) {
      text = "Unlike";
    } else {
      text = "Like";
    }

    let likersModal = (
      <Modal show={this.state.showLikers} onHide={this.handleCloseLikers}>
        <Modal.Header closeButton>
          <Modal.Title>Likes</Modal.Title>
        </Modal.Header>
        <Modal.Body>{this.renderLikersList()}</Modal.Body>
      </Modal>
    )
    return (
      <React.Fragment>
        {likersModal}
        <div className='like-bar'>
          {this.renderCounter(this.state.likes.length)}
          {this.renderButton(text)}
        </div>
      </React.Fragment>
    )
  }
}
