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
			ChannelsAPI.createChannel({name, user: this.props.user}).then((response) => {
				const channel = response.data;

				let { channels } = this.state;
				channels.push(channel);

				this.props.onChannelSelect(channel);
				this.setState({channels: channels});
			});
		}).catch(error => null);
	}

	toggleAllChannels(event) {
		event.preventDefault();

		let { all } = this.state;
		all = !all;
		this.setState({all});

		this.getChannels(all);
	}

	getChannels(all = false){
		ChannelsAPI.getChannels({user: this.props.user, all}).then((response) => {
			const channels = response.data;
			this.props.onChannelSelect(channels[0]);
			this.setState({channels: channels});
		});
	}

	render() {
		return (
			<div>
				<h2>
					Channels
					<Button
						circular icon="add"
						color="green" size="large"
						onClick={(event) => this.createChannel(event)}/>

					<Button
						circular icon={this.state.all ? 'lock' : 'unlock'}
						size="large"
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
								onChannelSelect={(channel) => this.props.onChannelSelect(channel)}/>
						)
					}
				</List>
			</div>
		);
	}
}

Channels.propTypes = {
	user: React.PropTypes.string,
	socket: React.PropTypes.object,
	selectedChannel: React.PropTypes.object,
	onChannelSelect: React.PropTypes.func
};
