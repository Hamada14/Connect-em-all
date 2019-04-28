import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './post.css'

import moment from 'moment'

export default class Post extends Component {

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
    return (
      <div className="tweetEntry">
        <div className="tweetEntry-content">
          <strong className="tweetEntry-fullname">
            {this.props.writer}
          </strong>
          <span className="tweetEntry-username">
            &nbsp; &nbsp; - &nbsp; <b>{this.props.email}</b>
          </span>
          <span className="tweetEntry-timestamp"> - { moment(this.props.date).format('YYYY MMM Mo - HH:mm:ss')} </span>
          <div className="tweetEntry-text-container">
            {this.props.content}
          </div>
        </div>
      </div>
    )
  }
}

Post.propTypes = {
  writer: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired
};
