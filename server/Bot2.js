import path from 'path';
import RiveScript from 'rivescript';

import Messages from './api/Messages.js';


export default class Bot2 {
	constructor({ message, io }) {
		this.text = message.text;
		this.user = message.user;
		this.channel = message.channel;
		this.io = io;

		this.bot = new RiveScript();
		this.bot.loadDirectory(path.join(__dirname, 'brain'), () => this.loaded(), () => this.loadError());
	}

	loaded() {
		this.bot.sortReplies();
		this.reply();
	}

	loadError(error) {
		console.log(`ERROR LOADING BRAIN: ${error}`);
	}

	reply() {
		const data = {
			user: { _id: 'siccdeebhydl365cef1c75ca', name: 'Home Bot' },
			text: this.bot.reply(this.user, this.text),
			channel: this.channel,
			createdAt: new Date()
		};

		if(data.text && data.text !== 'ERR: No Reply Matched'){
			setTimeout(() => {
				const message = new Messages(data);

				message.save((error) => {
					if(error){
						return error;
					}
				});

				this.io.to(data.channel).emit('chat message', JSON.stringify(data));

				return true;
			}, Math.floor(Math.random() * 2000) + 500);
		}else{
			return false;
		}
	}
}
