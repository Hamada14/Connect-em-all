import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Form, Button } from 'react-bootstrap';

import CommentList from './CommentList'
import './post.css'
import LikeToggleButton from './ToggleLikeButton'

import moment from 'moment'

export default class Post extends Component {

  state = {
  };

  constructor(props) {
    super(props);
    this.state = {};
  }


  render() {
    return (
      <div className="tweetEntry">
        <div className="tweetEntry-content">
          <strong className="tweetEntry-fullname">
            {this.props.writer}
          </strong>
          <span className="tweetEntry-username">
            &nbsp; &nbsp; - &nbsp; <b>{this.props.email}</b>
          </span> <span className="tweetEntry-timestamp">
            - <div className="tweetEntry-timestamp"> { moment(this.props.date).format('YYYY MMM Do - HH:mm:ss')} </div>
          </span>
          <div className="tweetEntry-text-container">
            {this.props.content}
          </div>
        </div>
        <LikeToggleButton likes={this.props.likes} postId={this.props.postId} clientId={this.props.clientId} likers={this.props.likers}/>
        <div className="comment-section">
          <h5>Comments</h5>
          <CommentList postId={this.props.postId} clientId={this.props.clientId} />
        </div>
      </div>
    )
  }


}

Post.propTypes = {
  writer: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  postId: PropTypes.number.isRequired
};
