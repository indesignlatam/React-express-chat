import moment from 'moment';
import React, { Component } from 'react';
import { Button, Header, Icon, Modal, Image } from 'semantic-ui-react';


export default class UserProfileModal extends Component {
	constructor(props) {
		super(props);
	}

	componentWillMount() {

	}

	componentDidMount() {

	}

	render() {
		let imageURI = 'https://react.semantic-ui.com/assets/images/avatar/large/elliot.jpg';

		if(this.props.user.avatar){
			imageURI = this.props.user.avatar.url;
		}

		return (
			<Modal
				basic size="small"
				open={this.props.visible}
				onClose={() => this.props.onClose()}>
				<Modal.Content>
					<h1 className="text-center">
						{this.props.user ? this.props.user.name : null}
					</h1>

					<Image
						avatar centered size="medium"
						src={imageURI}/>

					<h3 className="text-center">
						{this.props.user.description || 'No description'}
					</h3>

					<p className="text-center">
						User since: {moment(this.props.user.createdAt).format('dddd, MMMM Do YYYY')}
					</p>
				</Modal.Content>

				<Modal.Actions>
					<Button color="green" inverted onClick={() => this.props.onClose()}>
						<Icon name="checkmark" /> Close
					</Button>
				</Modal.Actions>
			</Modal>
		);
	}
}


UserProfileModal.propTypes = {
	user: React.PropTypes.object,
	visible: React.PropTypes.bool,
	onClose: React.PropTypes.func
};
