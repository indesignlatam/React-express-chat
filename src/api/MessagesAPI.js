import axios from 'axios';

class MessagesAPI {
	static getChannelMessages({channelId, userId}){
		return axios.get(`/messages/${channelId}`, { params: { userId } });
	}
}

export default MessagesAPI;
