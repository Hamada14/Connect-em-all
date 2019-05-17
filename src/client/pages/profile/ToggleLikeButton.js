import React, { Component } from 'react';

export default class LikeToggleButton extends Component {
  constructor(props){
    super(props);
    this.state = {
      likes: this.parseLikes(props.likes),
      postId: props.postId,
      clientId: props.clientId,
      disabled: false
    };
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
              disabled : false
          });
      });
  }

  render() {
    let text;
    if (this.state.likes.includes(this.state.clientId)) {
        text = "UnLike";
    } else {
        text = "Like";
    }

    return <React.Fragment>
      <div className='like-bar'>
      {this.renderCounter(this.state.likes.length)}
      {this.renderButton(text)}
      </div>
          </React.Fragment>
  }

   renderCounter(count) {
       return <label className='like-counter'>Likes: {count}</label>;
   }

   renderButton(text) {
       return <button className='like-btn' onClick={this.toggleLike}>{text}</button>;
   }
}
