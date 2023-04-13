import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import router from './routes';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
let started = false;

export default function startServer() {
	if (started) {
		console.log('server already started');
		return;
	}
	started = true;
	// Connect to MongoDB using Mongoose
	console.log(process.env.URI);
	mongoose.connect(process.env.URI)
		.then(() => {
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
		console.log(`Example app listening at http://localhost:${port}`);
	});
}

startServer();