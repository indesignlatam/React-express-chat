import swal from 'sweetalert2';
import React, { Component } from 'react';
import { List, Button, Icon } from 'semantic-ui-react';

import ChannelsAPI from '../../api/ChannelsAPI.js';


export default class ChannelListItem extends Component {
	constructor(props) {
		super(props);
	}

	joinChannel(event) {
		event.preventDefault();

		const { channel, user } = this.props;

		ChannelsAPI.joinChannel({channel, user}).then((response) => {
			swal('Congratulations', `You have joined ${response.data.name}`, 'success');
		});
	}

	goToChannel(event){
		event.preventDefault();

		const { channel, user } = this.props;

		this.props.socket.emit('unsubscribe');
		this.props.socket.emit('subscribe', {channel: channel._id, user});
		this.props.onChannelSelect(channel);
		document.getElementsByClassName('conversations')[0].classList.remove('active');
	}

	renderJoinButton(channel) {
		const isParticipant = channel.participants.includes(this.props.user);

		if(this.props.all && !isParticipant){
			return (
				<List.Content floated="right">
					<Button
						size="mini"
						onClick={(event) => this.joinChannel(event, channel)}>
						Join
					</Button>
				</List.Content>
			);
		}

		return null;
	}

	get isActive() {
		if(this.props.selectedChannel && this.props.selectedChannel._id === this.props.channel._id){
			return true;
		}

		return false;
	}

	render() {
		const channel = this.props.channel;

		return (
			<List.Item key={channel._id} active={this.isActive}>
				{this.renderJoinButton(channel)}

				<List.Content onClick={(event) => this.goToChannel(event)}>
					<List.Header>
						{channel.name}
					</List.Header>
				</List.Content>
			</List.Item>
		);
	}
}


ChannelListItem.propTypes = {
	all: React.PropTypes.bool,
	user: React.PropTypes.string,
	channel: React.PropTypes.object,
	onChannelSelect: React.PropTypes.func,
	selectedChannel: React.PropTypes.object,
	socket: React.PropTypes.object
};
