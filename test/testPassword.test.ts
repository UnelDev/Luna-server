import request from 'supertest';
import { User } from '../models/user';
import mongoose from 'mongoose';

const req = request('http://localhost:8082');

beforeAll(async () => {
	mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.0');
});

beforeEach(async () => {
	const user = new User({
		name: 'testPassword',
		email: 'testPassword@example.com',
		password: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
	});
	await user.save();
});

afterEach(async () => {
	await User.deleteOne({ email: 'testPassword@example.com' });
});

describe('GET /testPassword', () => {
	it('should return a 400 if request body is not an object', async () => {
		const res = await req
			.get('/api/testPassword')
			.send('invalidBody');
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('status', 400);
		expect(res.body).toHaveProperty('message', 'specify {email:string, password:sha512string} object');
	});

	it('should return a 400 if key email is not give', async () => {
		const res = await req
			.get('/api/testPassword')
			.send({
				testPassword: 'bad password'
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('status', 400);
		expect(res.body).toHaveProperty('message', 'specify {email:string, password:sha512string} object');
	});

	it('should return a 400 if key testPassword is not give', async () => {
		const res = await req
			.get('/api/testPassword')
			.send({
				email: 'testPassword@example.com',
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('status', 400);
		expect(res.body).toHaveProperty('message', 'specify {email:string, password:sha512string} object');
	});

	it('should return a 400 if email is not a string', async () => {
		const res = await req
			.get('/api/testPassword')
			.send({
				email: 123,
				testPassword: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('status', 400);
		expect(res.body).toHaveProperty('message', 'email must be a string');
	});

	it('should return a 400 if password is not a sha512 string', async () => {
		const res = await req
			.get('/api/testPassword')
			.send({
				email: 'testPassword@example.com',
				testPassword: 'bad password'
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('status', 400);
		expect(res.body).toHaveProperty('message', 'the testPassword must be sha512');
	});

	it('should return a 404 if email is not link at user', async () => {
		const res = await req
			.get('/api/testPassword')
			.send({
				email: 'example@example.com',
				testPassword: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
			});
		expect(res.status).toEqual(404);
		expect(res.body).toHaveProperty('status', 404);
		expect(res.body).toHaveProperty('message', 'user not fond');
	});
});
