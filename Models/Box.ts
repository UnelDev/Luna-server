import mongoose from 'mongoose';

type nameOfUser = string;
type timeToStart = Date;

const BoxSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	placement: {
		type: String,
		required: true
	},
	slot: {
		type: Array<[nameOfUser, timeToStart] | undefined>,
		default: []
	},
	size: {
		type: Number,
		default: 0
	},
	createdAt: {
		type: Date,
		default: Date.now()
	}
});


export const Box = mongoose.model('Box', BoxSchema);