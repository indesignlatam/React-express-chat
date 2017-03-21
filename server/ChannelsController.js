import express from 'express';
import Channels, { get, create, join, remove } from './api/Channels.js';


const ChannelsController = express();

// Get all channels
ChannelsController.get('/', (request, response) => {
	const { userId, all } = request.query;

	get({ userId, all }, (error, docs) => {
		if(error){
			response.json(error);
		}else{
			response.json(docs);
		}
	});
});

ChannelsController.post('/create', (request, response) => {
	const data = {
		name: request.body.name,
		participants: [request.body.userId]
	};

	create(data, (error, channel) => {
		if(error){
			response.json(error);
		}else{
			response.json(channel);
		}
	});
});

ChannelsController.post('/join', (request, response) => {
	const _id = request.body.channelId;
	const userId = request.body.userId;

	join({ _id, userId }, (error, channel) => {
		if(error){
			response.json(error);
		}else{
			response.json(channel);
		}
	});
});

ChannelsController.post('/delete', (request, response) => {
	const _id = request.body.channel;

	remove({ _id }, (error, docs) => {
		if(error){
			response.json(error);
		}else{
			response.json(docs);
		}
	});
});


export default ChannelsController;
