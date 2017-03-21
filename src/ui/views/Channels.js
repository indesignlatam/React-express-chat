import swal from 'sweetalert2';
import React, { Component } from 'react';
import { Segment, List, Image, Button, Icon } from 'semantic-ui-react';

import ChannelsAPI from '../../api/ChannelsAPI.js';
import ChannelListItem from '../components/ChannelListItem.js';


export default class Channels extends Component {
	constructor(props){
		super(props);

		this.state = {
			channels: [],
			all: false
		};
	}

	componentDidMount(){
		this.getChannels();
	}

	createChannel(event) {
		event.preventDefault();

		swal({
			title: 'Create channel',
			input: 'text',
			showCancelButton: true,
			confirmButtonText: 'Create',
			allowOutsideClick: false,
			preConfirm(name) {
				return new Promise((resolve, reject) => {
					if(!name || name.length < 6){
						reject('Channel name must have min 6 characters.');
					}else{
						resolve();
					}
				});
			}
		}).then((name) => {
			ChannelsAPI.createChannel({name, userId: this.props.user._id}).then((response) => {
				const channel = response.data;

				let { channels } = this.state;
				channels.push(channel);

				this.props.onChannelSelect(channel);
				this.setState({channels: channels});
			});
		}).catch(error => null);
	}

	onJoinChannel(newChannel) {
		const {channels} = this.state;
		const index = channels.findIndex((channel) => channel._id === newChannel._id);
		channels.splice(index, 1, newChannel);
		this.setState({channels});
	}

	toggleAllChannels(event) {
		event.preventDefault();

		let { all } = this.state;
		all = !all;
		this.setState({all});

		this.getChannels(all);
	}

	getChannels(all = false){
		ChannelsAPI.getChannels({userId: this.props.user._id, all}).then((response) => {
			const channels = response.data;
			this.setState({channels: channels});

			// If there is no selected channel select the firstone
			if(!this.props.selectedChannel){
				this.props.onChannelSelect(channels[0]);
			}
		});
	}

	closeMenu(event) {
		event.preventDefault();
		document.getElementsByClassName('conversations')[0].classList.remove('active');
	}

	render() {
		return (
			<div>
				<h2>
					<a 	className="hidden-large close"
						onClick={(event) => this.closeMenu(event)}>
						<Icon name="remove"/>
					</a>

					Channels

					<Button
						className="hidden-small"
						circular icon="add"
						color="green" size="small"
						onClick={(event) => this.createChannel(event)}/>

					<Button
						className="hidden-small"
						circular icon={this.state.all ? 'lock' : 'unlock'}
						size="small"
						onClick={(event) => this.toggleAllChannels(event)}/>
				</h2>

				<List relaxed className="list">
					{
						this.state.channels.map((channel) =>
							<ChannelListItem
								key={channel._id}
								user={this.props.user}
								channel={channel}
								all={this.state.all}
								socket={this.props.socket}
								selectedChannel={this.props.selectedChannel}
								onJoinChannel={(channel) => this.onJoinChannel(channel)}
								onChannelSelect={(channel) => this.props.onChannelSelect(channel)}/>
						)
					}
				</List>

				<div className="footer hidden-large">
					<Button
						icon="add"
						color="green" size="small"
						onClick={(event) => this.createChannel(event)}/>

					<Button
						icon={this.state.all ? 'lock' : 'unlock'}
						size="small"
						onClick={(event) => this.toggleAllChannels(event)}/>
				</div>
			</div>
		);
	}
}

Channels.propTypes = {
	user: React.PropTypes.object,
	socket: React.PropTypes.object,
	selectedChannel: React.PropTypes.object,
	onChannelSelect: React.PropTypes.func
};
