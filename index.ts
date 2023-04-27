import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import mongoose from 'mongoose';

import router from './routes';

let started = false;

dotenv.config({ path: '.env' });


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
		console.log(`listening at http://localhost:${port}`);
	});

	const readmeContent = fs.readFileSync('./README.md', 'utf-8');
	app.get('/', (req, res) => {
		const content =
			'╔═════════════════════════════════════════════════════════╗\n' +
			'║ for more readability put this text in a markdown reader ║\n' +
			'╚═════════════════════════════════════════════════════════╝\n\n\n\n' +
			readmeContent;
		res.type('markdown').send(content);
	});
}

main();

export default main;