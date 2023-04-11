import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';

import router from './routes';

let serverStarted = false;

async function startServer() {
	if (serverStarted) {
		console.log('Server already started!');
		return;
	}

	// Connexion à la base de données MongoDB
	mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.0');

	const db = mongoose.connection;
	db.on('error', console.error.bind(console, 'Connection error:'));
	db.once('connected', () => {
		console.log('Connected to MongoDB!');
	});
	const app = express();
	const port = 8082;
	// Middleware pour analyser le corps des requêtes HTTP
	app.use(express.json());
	app.use(cors());

	// Utilisation du routeur pour les routes de l'API
	app.use('/api', router);

	// Démarrage du serveur
	app.listen(port, () => {
		console.log(`Server started at http://localhost:${port}`);
	});

	serverStarted = true;
}

startServer();
export default startServer;