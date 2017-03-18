import Messages from './api/Messages.js';


export default class Bot {
	constructor({ message, io }) {
		this.text = message.text;
		this.user = message.user;
		this.channel = message.channel;
		this.io = io;

		this.mappings = {
			'hello homie': `Hi ${this.user}`,
			'hi homie': `hello ${this.user}`,
			'how are you?': 'fine and you?',
			'how are you doing?': 'fine and you?',
			'im fine': 'How can i help you?',
			'bot': `How can i help you ${this.user}?`,
			'homie': `Can i help you ${this.user}?`,
			'help': `How can i assist you today ${this.user}?`,
			'homie help': 'You can try saying: \nhello homie\hhi homie\hhow are you?\nbot\nhomie'
		};
	}

	reply() {
		const data = {
			user: 'Home Bot',
			text: this.mappings[this.text.toLowerCase()],
			channel: this.channel,
			createdAt: new Date()
		};

		if(data.text){
			setTimeout(() => {
				const message = new Messages(data);
				message.save((error) => {
					if(error){
						return error;
					}
				});
				this.io.to(data.channel).emit('chat message', JSON.stringify(data));

				return true;
			}, 1000);
		}else{
			return false;
		}
	}
}
