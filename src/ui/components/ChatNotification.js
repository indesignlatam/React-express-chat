import React, { Component } from 'react';


export default class ChatNotification extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<p className="notification">
				{this.props.children}
			</p>
		);
	}
}


ChatNotification.propTypes = {
	children: React.PropTypes.text.isRequired
};
