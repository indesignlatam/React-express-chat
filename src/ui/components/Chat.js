import '../../styles/chat.less';
import swal from 'sweetalert2';
import React, { Component } from 'react';

import ChatBubble from './ChatBubble.js';
import UserProfileModal from './UserProfileModal.js';


export default class Chat extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showProfile: false,
			user: null
		};
	}

	componentDidMount() {
		setTimeout(() => {
			const chat = document.getElementById('chat');
			chat.scrollTop = chat.scrollHeight;
		}, 200);
	}

	componentDidUpdate(prevProps) {
		setTimeout(() => {
			const chat = document.getElementById('chat');
			chat.scrollTop = chat.scrollHeight;
		}, 50);
	}

	setUser(user) {
		if(!user.name){
			swal(
				'This user is not backwards compatible',
				'This user was created with a previous version of the app and we cant show its profile.'
			);

			return;
		}

		this.setState({user, showProfile: true});
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
			<div>
				<ol className="chat" id="chat">
					{this.loadMore()}

					{
						this.props.messages.map((message) =>
							<ChatBubble
								key={message._id || Math.random() * 100000000}
								self={this.props.self}
								message={message}
								onClickUser={(user) => this.setUser(user)}
								onEditMessage={(msg) => this.props.onEditMessage(msg)}
								onRemoveMessage={(msg) => this.props.onRemoveMessage(msg)}/>
						)
					}
				</ol>

				<UserProfileModal
					visible={this.state.showProfile}
					user={this.state.user}
					onClose={() => this.setState({showProfile: false})}/>
			</div>
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
