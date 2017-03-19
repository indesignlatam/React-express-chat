import express from 'express';
import Channels, { get, create, join, remove } from './api/Channels.js';


const ChannelsController = express();

// Get all channels
ChannelsController.get('/channels', (request, response) => {
	const userId = request.query.user;
	const all = request.query.all;

	get({ userId, all }, (error, docs) => {
		if(error){
			response.json(error);
		}else{
			response.json(docs);
		}
	});
});

ChannelsController.post('/channels/create', (request, response) => {
	const data = {
		name: request.body.name,
		participants: [request.body.user]
	};

	create(data, (error, channel) => {
		if(error){
			response.json(error);
		}else{
			response.json(channel);
		}
	});
});

ChannelsController.post('/channels/join', (request, response) => {
	const _id = request.body.channel;
	const userId = request.body.user;

	join({ _id, userId }, (error, channel) => {
		if(error){
			response.json(error);
		}else{
			response.json(channel);
		}
	});
});

ChannelsController.post('/channels/delete', (request, response) => {
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
