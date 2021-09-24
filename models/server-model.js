const express = require('express')
const cors = require('cors')
const { dbConnection } = require('../database/config')

class Server {
	constructor() {
		this.app = express();
		this.port = process.env.PORT || 3000;

		this.usersPath = '/api/users';
		this.authPath = '/api/auth';
		this.invitePath = '/api/invite';

		this.connectToDatabase();
		this.middlewares();
		this.routes();
	}

	async connectToDatabase() {
		await dbConnection();
	}

	middlewares() {
		this.app.use(cors());
		this.app.use(express.json());
		this.app.use(express.static('public'));
	}

	routes() {
		this.app.use(this.authPath, require('../routes/auth-routes'));
		this.app.use(this.usersPath, require('../routes/users-routes'));
		this.app.use(this.invitePath, require('../routes/invite-routes'));
	}

	listen() {
		this.app.listen(this.port, () => {
			return console.log(`Example app listening on port `, this.port);
		});
	}
}

module.exports = Server;