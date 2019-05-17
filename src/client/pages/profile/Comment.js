import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './post.css'

export default class Comment extends Component {
	constructor(props){
		super(props);
		this.state = {
            body: props.body,
            author: props.author,
            date: new Date(props.date).toGMTString()
		}
	}

	render(){
		return (
			<div className='comment'>
				<div className='comment-body'>
					{this.state.body}
				</div>
				<div className='comment-author'>
					{this.state.author}
				</div>
				<div className='comment-date'>
					{this.state.date}
				</div>
			</div>
		)
	}
}
