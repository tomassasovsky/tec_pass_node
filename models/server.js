const express = require('express')
const cors = require('cors')

class Server {
	constructor() {
		this.app = express();
		this.port = process.env.PORT || 3000;

		this.usersPath = '/api/users';

		this.middlewares();
		this.routes();
	}

	middlewares() {
		this.app.use(cors());
		this.app.use(express.json());
		this.app.use(express.static('public'));
	}

	routes() {
		this.app.use(this.usersPath, require('../routes/users'));
	}

	listen() {
		this.app.listen(this.port, () => {
			return console.log(`Example app listening on port `, this.port);
		});
	}
}

module.exports = Server;