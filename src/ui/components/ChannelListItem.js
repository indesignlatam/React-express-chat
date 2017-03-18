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
	}

	renderJoinButton(channel) {
		const isParticipant = channel.participants.includes(this.props.user);

		if(this.props.all && !isParticipant){
			return (
				<List.Content floated="right">
					<Button
						size="small"
						onClick={(event) => this.joinChannel(event, channel)}>
						Join
					</Button>
				</List.Content>
			);
		}

		return null;
	}

	render() {
		const channel = this.props.channel;

		return (
			<List.Item key={channel._id}>
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
	user: React.PropTypes.string,
	channel: React.PropTypes.object,
	all: React.PropTypes.bool,
	onChannelSelect: React.PropTypes.func,
	socket: React.PropTypes.object
};
