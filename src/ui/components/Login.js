import '../../styles/login.less';
import swal from 'sweetalert2';
import React, { Component } from 'react';
import { Container, Grid, Segment, Form, Button } from 'semantic-ui-react';

import UsersAPI from '../../api/UsersAPI';


export default class Login extends Component {
	constructor(props){
		super(props);

		this.state = {
			name: null,
			loading: false
		};

		this.mounted = false;
	}

	componentDidMount() {
		this.mounted = true;
	}

	componentWillUnmount() {
		this.mounted = false;
	}

	setName(event) {
		event.preventDefault();

		this.setState({name: event.target.value});
	}

	saveSetState(state) {
		if(this.mounted){
			this.setState(state);
		}
	}

	login(event) {
		event.preventDefault();

		if(!this.state.name){
			swal('Debes ingresar tu nombre', null, 'error');
			return;
		}

		this.setState({loading: true});

		const name = this.state.name.charAt(0).toUpperCase() + this.state.name.slice(1);

		UsersAPI.login({name}).then((response) => {
			this.props.onLogin(response.data);
			this.saveSetState({name: null, loading: false});

			setTimeout(() => {
				swal(
					`Welcome ${response.data.name}`,
					'Nice to have you with us',
					'success'
				);
			}, 500);
		}).catch((error) => {
			this.saveSetState({loading: false});
			swal('There was an error!', error.message, 'error');
		});
	}

	render() {
		return (
			<Container className="login">
				<h1 className="title">
					Welcome to Homelike Chat
				</h1>

				<Grid centered>
					<Grid.Column mobile={16} largeScreen={6} widescreen={6}>
						<Form onSubmit={(event) => this.login(event)}>
							<Form.Field>
								<label>Please tell us your name</label>
								<input
									placeholder="Name"
									onChange={(event) => this.setName(event)}/>
							</Form.Field>

							<Button
								size={'huge'} fluid primary
								loading={this.state.loading}
								type="submit">
								Continue
							</Button>
						</Form>
					</Grid.Column>
				</Grid>
			</Container>
		);
	}
}

Login.propTypes = {
	onLogin: React.PropTypes.func
};
