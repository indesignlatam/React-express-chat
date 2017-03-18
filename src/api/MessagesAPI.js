import axios from 'axios';

class MessagesAPI {
	static getChannelMessages(){
		return axios.get('/messages');
	}
}

export default MessagesAPI;
