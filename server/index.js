import path from 'path';
import socket from 'socket.io';
import express from 'express';
import webpack from 'webpack';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { Server } from 'http';

import Bot2 from './Bot2.js';
import config from '../webpack.config.dev';
import ChannelsController from './ChannelsController.js';
import Messages, { getInChannel, create, update, remove } from './api/Messages.js';
import { isInChannel } from './api/Channels.js';


const port = 3000;
const app = express();
const server = Server(app);
const io = socket(server);
const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
	publicPath: config.output.publicPath
}));
app.use(require('webpack-hot-middleware')(compiler));
app.use(bodyParser.json());

// Controllers
app.use(ChannelsController);


// Return the index.html file
app.get('/', (request, response) => {
	response.sendFile(path.join( __dirname, '../src/index.html'));
});

// Return messages for the current channel
app.get('/messages/:channel', (request, response) => {
	const { channel } = request.params;
	const { userId } = request.query;

	getInChannel({ channel, userId }, (error, docs) => {
		if(error){
			response.status(error.code || 500).send(error);
		}else{
			response.json(docs);
		}
	});
});

// Socket event listeners
io.on('connection', (socket) => {
	// Subscribe to messages of a channel
	socket.on('subscribe', ({ channel, user }) => {
		const userId = user;

		isInChannel({ channel, userId }, (error, response) => {
			if(error){
				return error;
			}else if(response){
				socket.join(channel);
			}
		});
	});

	// Listen on new messages
	socket.on('chat message', (data) => {
		data.text = data.text.trim();
		data.createAt = new Date();

		create(data, (error, message) => {
			if(error){
				return error;
			}else{
				io.to(message.channel).emit('chat message', JSON.stringify(message));
				// Very basic bot
				const bot = new Bot2({ message, io });
			}
		});
	});

	// Listen for edit message event
	socket.on('edit message', ({ _id, text }) => {
		update({ _id, text }, (error, message) => {
			if(error){
				return error;
			}else{
				io.to(message.channel).emit('edit message', message._id);
			}
		});
	});

	// Listen for remove message event
	socket.on('remove message', ({ _id }) => {
		remove(_id, (error, message) => {
			if(error){
				return error;
			}else{
				io.to(message.channel).emit('remove message', message._id);
			}
		});
	});

	// Unsubscribe to a channel
	socket.on('unsubscribe', ({ channel }) => {
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
