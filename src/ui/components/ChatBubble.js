import moment from 'moment';
import React, { Component } from 'react';


export default class ChatBubble extends Component {
	constructor(props) {
		super(props);
	}

	messageType() {
		if(this.props.self._id === this.props.message.user){
			return 'self';
		}

		return 'other';
	}

	senderName() {
		if(this.props.self._id !== this.props.message.user){
			return this.props.message.user;
		}

		return 'Tu';
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

	render() {
		return (
			<li className={this.messageType()}>
				<div className="msg">
					<div className="user">
						{this.senderName()}
						<span
							className="range edit"
							onClick={() => this.props.onEditMessage(this.props.message)}>
							editar
						</span>

						<span
							className="range remove"
							onClick={() => this.props.onRemoveMessage(this.props.message)}>
							x
						</span>
					</div>
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
	onEditMessage: React.PropTypes.func,
	onRemoveMessage: React.PropTypes.func
};
