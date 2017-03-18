import React, { Component } from 'react';


export default class TypeZone extends Component {
	constructor(props) {
		super(props);
	}

	onEnter(event) {
		if(event.which === 13 /* Enter */){
			event.preventDefault();
			this.send(event);
		}
	}

	send(event) {
		event.preventDefault();
		// Get text in the textarea
		const text = event.currentTarget.message.value;
		// Remove the text from the textarea
		event.currentTarget.reset();
		// Trigger the onSend callback with the text param & target
		this.props.onSend(text);
	}

	render() {
		return (
			<div className="typezone">
				<form
					id="messageForm"
					onKeyUp={(event) => this.onEnter(event)}
					onSubmit={(event) => this.send(event)}>
					<textarea
						name="message"
						id="message"
						placeholder={this.props.placeholder || 'Escribe tu mensaje'}/>
					<button className="send">
						{this.props.sendText || 'Enviar'}
					</button>
				</form>
			</div>
		);
	}
}


TypeZone.propTypes = {
	onSend: React.PropTypes.func,
	sendText: React.PropTypes.string,
	placeholder: React.PropTypes.string
};
