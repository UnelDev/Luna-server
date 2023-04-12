import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import router from './routes';
import dotenv from 'dotenv';
dotenv.config();

let serverStarted = false;

async function startServer() {
	if (serverStarted) {
		console.log('Server already started!');
		return;
	}
	await mongoose.connect(process.env.URI);

	const db = mongoose.connection;
	db.on('error', console.error.bind(console, 'Connection error:'));
	db.once('connected', () => {
		console.log('Connected to MongoDB!');
	});
	const app = express();
	const port = 8082;


	app.use(express.json());
	app.use(cors());


	app.use('/api', router);


	app.listen(port, async () => {
		console.log(`Server started at http://localhost:${port}`);
	});

	serverStarted = true;
}

startServer();
export default startServer;