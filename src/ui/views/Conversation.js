import swal from 'sweetalert2';
import React, { Component } from 'react';

import Chat from '../components/Chat';
import TypeZone from '../components/TypeZone';
import MessagesAPI from '../../api/MessagesAPI.js';


export default class Conversation extends Component {
	constructor(props) {
		super(props);

		this.state = {
			messages: []
		};
	}


	componentWillMount() {
		this.getMessages(this.props.channel);
	}

	componentDidMount() {

	}

	componentWillUpdate(nextProps, nextState) {
		this.getMessages(nextProps.channel);
	}

	getMessages(channel) {
		if(channel){
			MessagesAPI.getChannelMessages().then((response) => {
				this.setState({messages: response.data});
			});

			this.props.socket.emit('subscribe', {channel: channel._id});
		}
	}

	sendMessage(text) {
		this.props.socket.emit('chat message', {
			text,
			channel: this.props.channel._id,
			user: this.props.user
		});
	}

	editMessage({ _id }) {
		swal({
			title: 'Editar this message',
			input: 'text',
			showCancelButton: true,
			confirmButtonText: 'Send',
			allowOutsideClick: false,
			preConfirm(text) {
				return new Promise((resolve, reject) => {
					if(!text || text.length == 0){
						reject('You have to type you message.');
					}else{
						resolve();
					}
				});
			}
		}).then((text) => {
			this.props.socket.emit('edit message', { _id, text });
		}).catch(error => null);
	}

	removeMessage({ _id }) {
		swal({
			title: 'Are you sure?',
			text: 'You wont be able to revert this!',
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Yes, delete it!',
			cancelButtonText: 'No, cancel!',
			allowOutsideClick: false
		}).then(() => {
			this.props.socket.emit('remove message', { _id, user: this.props.user });
		}).catch(error => null);
	}

	render() {
		if(!this.props.channel){
			return null;
		}

		return (
			<div>
				<h2>{this.props.channel.name}</h2>

				<Chat
					self={{_id: this.props.user}}
					hasMore={false}
					messages={this.state.messages}
					loadMoreText={'Load previous messages'}
					onEditMessage={(message) => this.editMessage(message)}
					onRemoveMessage={(message) => this.removeMessage(message)}/>

				<TypeZone
					onSend={(message) => this.sendMessage(message)}
					placeholder={'Write your message'}
					sendText={'Send'}/>
			</div>
		);
	}
}

Conversation.propTypes = {
	user: React.PropTypes.string,
	channel: React.PropTypes.object,
	socket: React.PropTypes.object
};
