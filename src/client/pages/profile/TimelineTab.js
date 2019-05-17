import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'react-bootstrap';

import { errorsBlock, loadingBlock } from '../../Util';

import Post from './Post'

export default class TimelineTab extends Component {

  state = {
    isLoading: true
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      newPostContent: '',
      posts: []
    };

    this.changeNewPostContent = this.changeNewPostContent.bind(this);
    this.submitPost = this.submitPost.bind(this)
  }

  async componentDidMount() {
    let posts = await this.getAllPosts();
    this.setState({ posts: posts, isLoading: false });
  }


  async componentDidUpdate(prevProps) {
    if(this.props.profileId != prevProps.profileId) {
      this.setState({ isLoading: true, posts: [], newPostContent: '' });
      let posts = await this.getAllPosts();
      this.setState({ posts: posts, isLoading: false });
    }
  }

  getAllPosts() {
    return fetch('/api/get_posts_by_user?userId=' + this.props.profileId,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }).then(res => res.json())
      .then(posts_data => {
        let posts = posts_data.posts;
        return posts.map((post) => {
			return { postId: post.POST_ID, writer: post.FULL_NAME, content: post.CONTENT, date: post.CREATED_AT, email: post.EMAIL }} );
      });
  }

  async submitPost() {
    let requestParams = { userId: this.props.clientId, postContent: this.state.newPostContent };
    await fetch('/api/create_post',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestParams) })
    let posts = await this.getAllPosts();
    this.setState({ posts: posts, newPostContent: '' })
  }

  changeNewPostContent(event) {
    this.setState({ newPostContent: event.target.value });
  }

  renderCreatePostBlock() {
    if(this.props.profileId != this.props.clientId) {
      return;
    }
    return (
      <>
        <Form>
          <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Label>Hi {this.props.fullName}</Form.Label>
            <Form.Control
              as="textarea"
              rows="3"
              placeholder="What's on your mind?"
              value={this.state.newPostContent}
              onChange={this.changeNewPostContent}
            />
          </Form.Group>
          <Button type="submit" onClick={this.submitPost}>Submit Post</Button>
        </Form>
      </>
    )
  }

  renderPosts() {
    return (
      <>
        {this.state.posts.map((post, idx) => (
          <div className="station" key={idx}>
            <Post postId={post.postId} writer={post.writer} clientId={this.props.clientId}
			content={post.content} date={post.date} email={post.email} />
			</div>
        ))}
      </>
    )
  }

  render() {
    return (
      <React.Fragment>
        {this.renderCreatePostBlock()}
        <hr />
        {this.renderPosts()}
        {loadingBlock(this.state.isLoading)}
      </React.Fragment>
    );
  }
}

TimelineTab.props = {
  profileId: PropTypes.string.isRequired,
  clientId: PropTypes.string.isRequired,
  fullName: PropTypes.string
}
