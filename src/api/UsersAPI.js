import axios from 'axios';

class UsersAPI {
	static login({ name }){
		console.log(name);
		return axios.post('/login', { name });
	}

	static getUser({ _id }){
		return axios.get(`/users/${_id}`);
	}
}

export default UsersAPI;
