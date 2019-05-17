import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import Comment from './Comment'

import loadingBlock from '../../Util';


export default class CommentList extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      comments: [],
      isLoading: true
    }
    ' '
    this.changeCommentContent = this.changeCommentContent.bind(this)
    this.submitComment = this.submitComment.bind(this)
  }

  async componentDidMount() {
    let comments = await this.getPostComments();
    this.setState({ comments: comments, isLoading: false });
  }

  changeCommentContent(event){
    this.setState({ commentContent: event.target.value });
  }

  getPostComments() {
    return fetch('/api/get_post_comments?postId=' + this.props.postId,
      {
        method: 'GET',
	            headers: { 'Content-Type': 'application/json' }
      }).then(res => res.json())
     		 .then(comments_data => {
        let comments = comments_data.comments;
        if (!comments) {
          comments = [];
        }
        return comments.map((comment) => {
					   	return {
            body: comment.CONTENT,
            author: comment.FULL_NAME,
            date: comment.CREATED_AT
          }
        } );
      });

  }

  async submitComment() {
    let requestParams = { userId: this.props.clientId,
		       	commentContent: this.state.commentContent,
       			postId: this.props.postId	};
    await fetch('/api/add_comment',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestParams) })
    let comments = await this.getPostComments();
    this.setState({ comments: comments, commentContent: '' })
  }

  renderCommentBox() {
    let button = <Button type="submit" onClick={this.submitComment}>Add Comment</Button>;
    if(this.state.commentContent == undefined || this.state.commentContent.length == 0) {
      button = <Button type="submit" onClick={this.submitComment} disabled>Add Comment</Button>
    }
    return (
      <>
        <Form>
          <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Control
              as="textarea"
              rows="3"
              placeholder="Write a comment ..."
              value={this.state.commentContent}
              onChange={this.changeCommentContent}
            />
          </Form.Group>
          {button}
        </Form>
      </>
    )
  }

	render(){
    let commentNodes = Array.from(this.state.comments).map(
      (comment) => (
        <Comment author={comment.author} body={comment.body} date={comment.date} key={comment.date}/>
      ));

    if (commentNodes.length) {
      return (
        <React.Fragment>
          <div className='comments-list'>
            {commentNodes}
          </div>
          {this.renderCommentBox()}
        </React.Fragment>
      );
    }
    return (
      this.renderCommentBox()
    );
  }
}
