import express from 'express';
import { getOneByName, getOneById, create } from './api/Users.js';


const UsersController = express();

// Get single user
UsersController.post('/users/:_id', (request, response) => {
	const { _id } = request.params;

	create(data, (error, channel) => {
		if(error){
			response.json(error);
		}else{
			response.json(channel);
		}
	});
});

// Get or create user by name
UsersController.post('/login', (request, response) => {
	const name = request.body.name;

	getOneByName(name, (error, user) => {
		if(error){
			console.log('ERROR 1: ', error);
			response.status(500).json(error);
		}else{
			if(user){
				response.json(user);
			}else{
				create({ name }, (error, user) => {
					if(error){
						console.log('ERROR 2: ', error);
						response.status(500).json(error);
					}else{
						response.json(user);
					}
				});
			}
		}
	});
});


export default UsersController;
