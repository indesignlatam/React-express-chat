import '../../styles/login.less';
import swal from 'sweetalert2';
import React, { Component } from 'react';
import { Container, Grid, Segment, Form, Button } from 'semantic-ui-react';


export default class Login extends Component {
	constructor(props){
		super(props);

		this.state = {
			name: null
		};
	}

	setName(event) {
		event.preventDefault();

		this.setState({name: event.target.value});
	}

	login(event) {
		event.preventDefault();

		if(!this.state.name){
			swal('Debes ingresar tu nombre', null, 'error');
			return;
		}

		let name = this.state.name;
		name = name.charAt(0).toUpperCase() + name.slice(1);

		this.props.onLogin(name);
		this.setState({name: null});
	}

	render() {
		return (
			<Container className="login">
				<h1 className="title">
					Welcome to Homelike Chat
				</h1>

				<Grid centered columns={3}>
					<Grid.Column>
						<Form onSubmit={(event) => this.login(event)}>
							<Form.Field>
								<label>Please tell us your name</label>
								<input
									placeholder="Name"
									onChange={(event) => this.setName(event)}/>
							</Form.Field>

							<Button size={'huge'} fluid primary type="submit">
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
