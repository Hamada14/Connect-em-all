import React, { Component } from 'react';
import { Link } from 'react-router-dom'


export default class Friend extends Component {

  state = {
  };

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <Link to={"/profile/" + this.props.userId}>
        <div className="tweetEntry">
          <div className="tweetEntry-content">
            <strong className="tweetEntry-fullname">
              {this.props.fullName}
            </strong>
            <span className="tweetEntry-username">
              &nbsp; &nbsp; - &nbsp; <b>{this.props.email}</b>
            </span>
          </div>
        </div>
      </Link>
    )
  }
}
