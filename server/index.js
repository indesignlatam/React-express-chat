import path from 'path';
import socket from 'socket.io';
import express from 'express';
import webpack from 'webpack';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { Server } from 'http';

import Bot from './Bot.js';
import Bot2 from './Bot2.js';
import config from '../webpack.config.dev';
import Channels from './api/Channels.js';
import Messages from './api/Messages.js';


const port = 3000;
const app = express();
const server = Server(app);
const io = socket(server);
const compiler = webpack(config);
var channel;

app.use(require('webpack-dev-middleware')(compiler, {
	publicPath: config.output.publicPath
}));
app.use(require('webpack-hot-middleware')(compiler));
app.use(bodyParser.json());


// Return the index.html file
app.get('/', (request, response) => {
	response.sendFile(path.join( __dirname, '../src/index.html'));
});

// Return messages for the current channel
app.get('/messages', (request, response) => {
	Messages.find({ channel }, (error, docs) => {
		response.json(docs) ;
	});
});

// Get all channels
app.get('/channels', (request, response) => {
	const user = request.query.user;
	const all = request.query.all || false;

	let query = { participants: user };

	if(all === 'true'){
		query = {};
	}

	Channels.find(query, (error, docs) => {
		response.json(docs);
	});
});

app.post('/channels/create', (request, response) => {
	const data = {
		name: request.body.name,
		participants: [request.body.user]
	};

	const channel = new Channels(data);

	channel.save((error) => {
		if(error){
			return error;
		}
	});

	response.json(channel);
});

app.post('/channels/join', (request, response) => {
	const _id = request.body.channel;
	const user = request.body.user;

	const query = Channels.where({ _id, participants: { $nin: [user] } });
	query.findOne((error, channel) => {
		if(error){
			return error;
		}else if(channel){
			channel.update({ $addToSet: { participants: user } }, (error) => {
				if(error){
					return error;
				}else{
					response.json(channel);
				}
			});
		}
	});
});


// Socket event listeners
io.on('connection', (socket) => {
	// Subscribe to messages of a channel
	socket.on('subscribe', (data) => {
		channel = data.channel;
		socket.join(channel);
	});

	// Listen on new messages
	socket.on('chat message', (messageData) => {
		const query = Channels.where({ _id: messageData.channel, participants: { $in: [messageData.user] } });
		query.findOne((error, channel) => {
			if(error){
				return error;
			}else if(channel){
				// Only allow to send messages in a channel to users that have joined
				const data = {
					user: messageData.user,
					text: messageData.text.trim(),
					channel: messageData.channel,
					createdAt: new Date()
				};

				// Create message
				const message = new Messages(data);
				message.save((error) => {
					if(error){
						return error;
					}
				});
				io.to(data.channel).emit('chat message', JSON.stringify(data));

				// Very basic bot
				const bot = new Bot2({ message: data, io });
				// bot.reply();
			}
		});
	});

	// Listen for remove message event
	socket.on('remove message', ({ _id }) => {
		// Remove message
		Messages.deleteOne({ _id }, (error) => {
			if(error){
				return error;
			}
		});
	});

	// Listen for edit message event
	socket.on('edit message', ({ _id, text }) => {
		// Fin the message
		const query = Messages.where({ _id });
		query.findOne((error, message) => {
			if(error){
				return error;
			}else{
				// Update message
				message.update({ text }, (error) => {
					if(error){
						return error;
					}
				});
			}
		});
	});

	// Unsubscribe to a channel
	socket.on('unsubscribe', () => {
		socket.leave(channel);
	});
});

// Connect to mongodb
mongoose.connect('mongodb://apptestuser:67be90c50a7a994180c4dd76a5c23ba8@ds135680.mlab.com:35680/homelikechat');
const db = mongoose.connection;

// Open connection to DB
db.once('open', () => {
	// Start listening for events
	server.listen(port, (error) => {
		if(error){
			console.log(error);
		}
	});
});
