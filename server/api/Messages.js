import mongoose, { Schema } from 'mongoose';


const schema = Schema({
	user: String,
	text: String,
	channel: String,
	createdAt: Date
});

export default mongoose.model('Messages', schema);
