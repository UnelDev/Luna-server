import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';

import router from './routes';

dotenv.config({ path: '.env' });

let started = false;


function main() {
	if (started) {
		console.log('Server already started');
		return;
	}
	started = true;

	// Connect to MongoDB using Mongoose
	mongoose.connect(process.env.URI).then(() => {
		console.log('Successfully connected to MongoDB');
	}).catch((error) => {
		console.log('Error connecting to MongoDB:', error);
	});

	// Create an instance of the Express app
	const app = express();
	app.use(express.json());
	app.use(cors());
	app.use('/api', router);

	// Start the Express app
	const port = 8082;
	app.listen(port, () => {
		console.log(`Listening at http://localhost:${port}`);
	});

	app.get('/', (req, res) => {
		res.sendFile(path.resolve('./README.html'))
	});
}

main();

export default main;