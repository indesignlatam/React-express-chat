import axios from 'axios';

class MessagesAPI {
	static getChannelMessages({channel, user}){
		return axios.get(`/messages/${channel._id}`, { params: { userId: user } });
	}
}

export default MessagesAPI;
