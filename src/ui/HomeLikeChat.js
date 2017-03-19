import io from 'socket.io-client';
import React from 'react';

import Login from './components/Login.js';
import AuthLayout from './layouts/AuthLayout.js';


export default class HomeLikeChat extends React.Component {
	constructor(props){
		super(props);

		this.state = {
			user: null
		};
	}

	componentWillMount() {
		const socket = io('http://localhost:3000');

		socket.on('connect', () => {
			this.socket = socket;
		});
	}

	renderContent(){
		if(this.state.user){
			return (
				<AuthLayout
					user={this.state.user}
					socket={this.socket}/>
			);
		}
		return (
			<Login
				socket={this.socket}
				onLogin={(user) => this.setState({user})}/>
		);
	}

	render() {
		return (
			<div>
				{this.renderContent()}
			</div>
		);
	}
}
