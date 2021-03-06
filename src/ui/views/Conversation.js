import swal from 'sweetalert2';
import React, { Component } from 'react';
import remove from 'lodash.remove';
import { Icon } from 'semantic-ui-react';

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
		this.setListeners();
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.channel !== this.props.channel){
			this.setState({messages: []});
		}

		if(nextProps.channel){
			this.props.socket.emit('unsubscribe', {channelId: nextProps.channel._id});
			this.props.socket.emit('subscribe', {channelId: nextProps.channel._id, userId: nextProps.user._id});

			setTimeout(() => {
				this.getMessages(nextProps.channel);
			}, 50);
		}
	}

	setListeners() {
		// Usually channel is not set on mounting but just in case
		if(this.props.channel){
			this.props.socket.emit('subscribe', {channelId: this.props.channel._id, userId: this.props.user._id});
		}

		this.props.socket.on('chat message', (message) => {
			const messages = this.state.messages;
			messages.push(JSON.parse(message));
			this.setState({messages});
		});

		this.props.socket.on('edit message', (editedMessage) => {
			const messages = this.state.messages;
			const index = messages.findIndex((message) => message._id === editedMessage._id);
			editedMessage = JSON.parse(editedMessage);
			messages.splice(index, 1, editedMessage);
			this.setState({messages});
		});

		this.props.socket.on('remove message', (_id) => {
			const messages = this.state.messages;
			remove(messages, (message) => message._id === _id);
			this.setState({messages});
		});
	}

	getMessages(channel) {
		if(channel){
			MessagesAPI.getChannelMessages({channelId: channel._id, userId: this.props.user._id}).then((response) => {
				this.setState({messages: response.data});
			}).catch((error) => {
				if(error.response){
					const {message, reason} = error.response.data;
					swal(message, reason, 'error');
				}else{
					swal('There was an error!', error.message, 'error');
				}
			});
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
			title: 'Edit this message',
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
			this.props.socket.emit('remove message', { _id, userId: this.props.user._id });
		}).catch(error => null);
	}

	openMenu(event) {
		event.preventDefault();
		document.getElementsByClassName('conversations')[0].classList.add('active');
	}

	render() {
		if(!this.props.channel){
			return (
				<div>
					<h2 onClick={(event) => this.openMenu(event)}>
						<a 	className="hidden-large open-menu"
							onClick={(event) => this.openMenu(event)}>
							<Icon name="content"/>
						</a>

						Select a channel
					</h2>
				</div>
			);
		}

		return (
			<div>
				<h2>
					<a 	className="hidden-large open-menu"
						onClick={(event) => this.openMenu(event)}>
						<Icon name="content"/>
					</a>

					{this.props.channel.name}
				</h2>

				<Chat
					self={this.props.user}
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
	user: React.PropTypes.object,
	channel: React.PropTypes.object,
	socket: React.PropTypes.object
};
