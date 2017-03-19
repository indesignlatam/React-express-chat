import mongoose, { Schema } from 'mongoose';

import Channels from './Channels.js';


const schema = Schema({
	user: String,
	text: String,
	channel: String,
	createdAt: Date
});

const Messages = mongoose.model('Messages', schema);

export function getInChannel(channel, callback = () => null) {
	// TODO: Validate params
	// TODO: Check if user is a participant in the channel
	Messages.find({ channel }, (error, docs) => {
		callback(error, docs);
	});
}

export function create(data, callback = () => null) {
	// TODO: Validate params
	const query = Channels.where({ _id: data.channel, participants: { $in: [data.user] } });

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
	Messages.deleteOne({ _id }, (error) => {
		callback(error);
	});
}

export default Messages;
