import swal from 'sweetalert2';
import React, { Component } from 'react';
import { List, Button, Icon } from 'semantic-ui-react';

import ChannelsAPI from '../../api/ChannelsAPI.js';


export default class ChannelListItem extends Component {
	constructor(props) {
		super(props);
	}

	joinChannel(event) {
		event.persist();
		event.preventDefault();

		const userId = this.props.user._id;
		const channelId = this.props.channel._id;

		ChannelsAPI.joinChannel({channelId, userId}).then((response) => {
			this.props.onJoinChannel(response.data);
			this.goToChannel(event);
			swal('Congratulations', `You have joined ${response.data.name}`, 'success');
		});
	}

	goToChannel(event){
		event.preventDefault();

		const { channel } = this.props;
		this.props.onChannelSelect(channel);
		document.getElementsByClassName('conversations')[0].classList.remove('active');
	}

	renderJoinButton(channel) {
		const isParticipant = channel.participants.includes(this.props.user._id);

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
	user: React.PropTypes.object,
	channel: React.PropTypes.object,
	onJoinChannel: React.PropTypes.func,
	onChannelSelect: React.PropTypes.func,
	selectedChannel: React.PropTypes.object,
	socket: React.PropTypes.object
};
