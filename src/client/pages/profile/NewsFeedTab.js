import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'react-bootstrap';

import { errorsBlock, loadingBlock } from '../../Util';

import Post from './Post'

export default class NewsFeedTab extends Component {

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

  getAllPosts() {
    return fetch('/api/get_news_feed?userId=' + this.props.clientId,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }).then(res => res.json())
      .then(posts_data => {
        let posts = posts_data.posts;
        return posts.map((post) => { return { clientId: this.props.clientId, writer: post.FULL_NAME, content: post.CONTENT, date: post.CREATED_AT, email: post.EMAIL, likesCount: post.LIKES_COUNT, likes: post.LIKES, postId: post.POST_ID, userId: post.USER_ID }} );
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
			content={post.content} date={post.date} email={post.email} likes={post.likes} likers={post.likers}/>
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

NewsFeedTab.props = {
  clientId: PropTypes.string.isRequired,
  fullName: PropTypes.string
}
