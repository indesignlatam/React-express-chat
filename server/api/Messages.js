import mongoose, { Schema } from 'mongoose';

import Channels from './Channels.js';


const schema = Schema({
	user: Object,
	text: String,
	channel: String,
	createdAt: Date
});

const Messages = mongoose.model('Messages', schema);

export function getInChannel({ channel, userId }, callback = () => null) {
	// TODO: Validate params
	const query = Channels.where({ _id: channel, participants: { $in: [userId] } });

	// Check if user is in the channel participants
	query.findOne((error, channel) => {
		if(error){
			callback(error, null);
		}else if(channel){
			Messages.find({ channel: channel._id }, (error, docs) => {
				callback(error, docs);
			});
		}else{
			callback({
				code: 401,
				reason: 'You have no permission to access this channel messages.',
				message: 'Permission error'
			}, null);
		}
	});
}

export function create(data, callback = () => null) {
	// TODO: Validate params
	data.text = data.text.trim();
	data.createAt = new Date();

	const query = Channels.where({ _id: data.channel, participants: { $in: [data.user._id] } });

	// Check if user is in the channel participants
	query.findOne((error, channel) => {
		if(error){
			callback(error, null);
		}else if(channel){
			// Create message
			const message = new Messages(data);

			message.save((error, response) => {
				callback(error, response);
			});
		}
	});
}

export function update({ _id, text }, callback = () => null) {
	// TODO: Validate params
	Messages.findOneAndUpdate({ _id }, { $set: { text } }, { new: true }, (error, response) => {
		callback(error, response);
	});
}

export function remove(_id, callback = () => null) {
	// TODO: Validate params
	Messages.findOneAndRemove({ _id }, (error, response) => {
		callback(error, response);
	});
}

export default Messages;
