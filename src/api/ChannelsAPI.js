import axios from 'axios';

class ChannelsAPI {
	static createChannel({ name, user }){
		return axios.post('/channels/create', { name, user });
	}

	static joinChannel({ channel, user }){
		return axios.post('/channels/join', { channel, user });
	}

	static getChannels({ user, all = false }){
		return axios.get('/channels', { params: { user, all } });
	}
}

export default ChannelsAPI;
