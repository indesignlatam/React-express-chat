import '../../styles/chat.less';
import React, { Component } from 'react';

import ChatBubble from './ChatBubble.js';


export default class Chat extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		setTimeout(() => {
			const chat = document.getElementById('chat');
			chat.scrollTop = chat.scrollHeight;
		}, 200);
	}

	componentDidUpdate(prevProps) {
		if(this.props.messages !== prevProps.messages){
			setTimeout(() => {
				const chat = document.getElementById('chat');
				chat.scrollTop = chat.scrollHeight;
			}, 50);
		}
	}

	loadMore() {
		if(this.props.hasMore && this.props.messages.length > 0){
			return (
				<p className="notification">
					{this.props.loadMoreText || 'Cargar mensajes anteriores'}
				</p>
			);
		}

		return null;
	}

	render() {
		return (
			<ol className="chat" id="chat">
				{this.loadMore()}

				{
					this.props.messages.map((message) =>
						<ChatBubble
							key={message._id || Math.random() * 100000000}
							self={this.props.self}
							message={message}
							onEditMessage={(msg) => this.props.onEditMessage(msg)}
							onRemoveMessage={(msg) => this.props.onRemoveMessage(msg)}/>
					)
				}
			</ol>
		);
	}
}


Chat.propTypes = {
	self: React.PropTypes.object,
	hasMore: React.PropTypes.bool,
	messages: React.PropTypes.array,
	loadMoreText: React.PropTypes.string,
	onEditMessage: React.PropTypes.func,
	onRemoveMessage: React.PropTypes.func
};
