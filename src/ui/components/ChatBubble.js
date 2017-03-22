import moment from 'moment';
import React, { Component } from 'react';


export default class ChatBubble extends Component {
	constructor(props) {
		super(props);
	}

	selectUser(event) {
		event.preventDefault();

		this.props.onClickUser(this.props.message.user);
	}

	messageType() {
		if(this.props.self._id === this.props.message.user._id){
			return 'self';
		}

		return 'other';
	}

	senderName() {
		if(this.props.self._id !== this.props.message.user._id){
			return this.props.message.user.name || this.props.message.user;
		}

		return 'You';
	}

	renderImage() {
		const message = this.props.message;

		if(message.image){
			return (
				<div>
					<img src={message.image.url} draggable={false}/>
					<h4 className="title">{message.content}</h4>
				</div>
			);
		}

		return null;
	}

	renderButtons() {
		if(this.props.self._id === this.props.message.user._id){
			return (
				<span>
					<span
						className="range edit"
						onClick={() => this.props.onEditMessage(this.props.message)}>
						edit
					</span>

					<span
						className="range remove"
						onClick={() => this.props.onRemoveMessage(this.props.message)}>
						x
					</span>
				</span>
			);
		}

		return null;
	}

	render() {
		return (
			<li className={this.messageType()}>
				<div className="msg">
					<a 	className="user" href="#"
						onClick={(event) => this.selectUser(event)}>
						{this.senderName()}
						{this.renderButtons()}
					</a>
					{this.renderImage()}
					<p>{this.props.message.text}</p>
					<time>{moment(this.props.message.createdAt).fromNow()}</time>
				</div>
			</li>
		);
	}
}


ChatBubble.propTypes = {
	self: React.PropTypes.object.isRequired,
	message: React.PropTypes.object.isRequired,
	onClickUser: React.PropTypes.func,
	onEditMessage: React.PropTypes.func,
	onRemoveMessage: React.PropTypes.func
};
