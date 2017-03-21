import mongoose, { Schema } from 'mongoose';


const schema = Schema({
	name: String,
	participants: Array
});

const Channels = mongoose.model('Channels', schema);

export function get({ userId, all }, callback = () => null) {
	// TODO: Validate params
	let query = { participants: userId };

	if(all === 'true'){
		query = {};
	}

	Channels.find(query, (error, docs) => {
		callback(error, docs);
	});
}

export function isInChannel({ channelId, userId }, callback = () => null) {
	// TODO: Validate params
	Channels.findOne({ _id: channelId, participants: userId }, (error, doc) => {
		callback(error, doc);
	});
}

export function create(data, callback = () => null) {
	// TODO: Validate params
	const channel = new Channels(data);

	channel.save((error, response) => {
		callback(error, response);
	});
}

export function update({ _id, data }, callback = () => null) {
	// TODO: Validate params
	Channels.findOneAndUpdate({ _id }, { $set: data }, { new: true }, (error, response) => {
		callback(error, response);
	});
}

export function join({ _id, userId }, callback = () => null) {
	// TODO: Validate params
	Channels.findOneAndUpdate({ _id }, { $addToSet: { participants: userId } }, { new: true }, (error, response) => {
		callback(error, response);
	});
}

export function remove(_id, callback = () => null) {
	// TODO: Validate params
	Channels.deleteOne({ _id }, (error) => {
		callback(error);
	});
}

export default Channels;
