import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './post.css'

export default class Comment extends Component {
	render(){
		return (
			<div className='comment'>
				<div className='comment-body'>
					{this.props.body}
				</div>
				<div className='comment-author'>
					{this.props.author}
				</div>
				<div className='comment-date'>
					{this.props.date}
				</div>
			</div>
		)
	}
}
