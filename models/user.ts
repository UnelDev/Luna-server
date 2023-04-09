import mongoose from 'mongoose';

// Définition du schéma de la collection "users"
const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now()
	},


});

// Création du modèle pour la collection "users"
export const User = mongoose.model('User', userSchema);
