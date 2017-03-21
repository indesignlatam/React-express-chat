import mongoose, { Schema } from 'mongoose';


const schema = Schema({
	name: String,
	avatar: Object,
	description: String,
	createdAt: Date
});

const Users = mongoose.model('Users', schema);

export function getOneById(_id, callback = () => null) {
	// TODO: Validate params
	Users.findOne({ _id }, (error, response) => {
		callback(error, response);
	});
}


export function getOneByName(name, callback = () => null) {
	// TODO: Validate params
	// TODO: We should add an index for the name field
	Users.findOne({ name }, (error, response) => {
		callback(error, response);
	});
}

export function create(data, callback = () => null) {
	// TODO: Validate params
	// Create message
	const user = new Users(data);
	user.createdAt = new Date();

	user.save((error, response) => {
		callback(error, response);
	});
}

export default Users;
