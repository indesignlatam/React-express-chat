import mongoose, { Schema } from 'mongoose';


const schema = Schema({
	name: String,
	participants: Array
});

export default mongoose.model('Channels', schema);
