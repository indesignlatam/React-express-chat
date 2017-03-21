import axios from 'axios';

class ChannelsAPI {
	static createChannel({ name, userId }){
		return axios.post('/channels/create', { name, userId });
	}

	static joinChannel({ channelId, userId }){
		return axios.post('/channels/join', { channelId, userId });
	}

	static getChannels({ userId, all = false }){
		return axios.get('/channels', { params: { userId, all } });
	}
}

export default ChannelsAPI;
