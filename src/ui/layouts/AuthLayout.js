import React, { Component } from 'react';
import { Container, Grid, Segment, List, Image } from 'semantic-ui-react';

import Channels from '../views/Channels.js';
import Conversation from '../views/Conversation.js';


export default class AuthLayout extends Component {
	constructor(props) {
		super(props);

		this.state = {
			channel: null
		};
	}

	componentWillMount() {

	}

	componentDidMount() {

	}

	render() {
		return (
			<div style={{height: '100vh'}} className="chat-layout">
				<Grid>
					<Grid.Column
						width={4} largeScreen={4} widescreen={4} computer={4}
						tablet={4} mobile={16}
						className="conversations">
						<Channels
							user={this.props.user}
							socket={this.props.socket}
							selectedChannel={this.state.channel}
							onChannelSelect={(channel) => this.setState({channel})}/>
					</Grid.Column>

					<Grid.Column
						width={12} largeScreen={12} widescreen={12} computer={12}
						tablet={12} mobile={16}
						className="messages">
						<Conversation
							user={this.props.user}
							socket={this.props.socket}
							channel={this.state.channel}/>
					</Grid.Column>
				</Grid>
			</div>
		);
	}
}


AuthLayout.propTypes = {
	user: React.PropTypes.object,
	socket: React.PropTypes.object
};
