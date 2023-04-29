import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import router from './routes';
import { log } from './Functions/Logs';

dotenv.config({ path: '.env' });

let started = false;


function main() {
	if (started) {
		log('index.ts', 'INFORMATION', 'Server already started');
		return;
	}
	started = true;

	// Connect to MongoDB using Mongoose
	mongoose.connect(process.env.URI).then(() => {
		log('index.ts', 'DEBUG', 'Successfully connected to MongoDB');
	}).catch((error) => {
		log('index.ts', 'CRITICAL', 'Error connecting to MongoDB', error);
	});

	// Create an instance of the Express app
	const app = express();
	app.use(express.json());
	app.use(cors());
	app.use('/api', router);

	// Start the Express app
	const port = 8082;
	app.listen(port, () => {
		log('index.ts', 'DEBUG', `listening at http://localhost:${port}`)
	});

	app.get('/', (req, res) => {
		res.sendFile(path.resolve('./README.html'))
	});
}

main();

export default main;