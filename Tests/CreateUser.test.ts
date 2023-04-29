import request from 'supertest';
import { User } from '../models/user';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const req = request('http://localhost:8082');

beforeAll(async () => {
	await mongoose.connect(process.env.URI);
});

afterEach(async () => {
	await User.deleteOne({ email: 'testCreateUser@example.com' });
});

describe('POST /newUsers', () => {
	it('should return a 400 if request body is not an object', async () => {
		const res = await req
			.post('/api/newUsers')
			.send('invalidBody');
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('status', 400);
		expect(res.body).toHaveProperty('message', 'specify user object');
	});

	it('should return a 400 if name is not a string', async () => {
		const res = await req
			.post('/api/newUsers')
			.send({
				name: 123,
				email: 'testCreateUser@example.com',
				password: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('status', 400);
		expect(res.body).toHaveProperty('message', 'username must be a string');
	});

	it('should return a 400 if email is not a string', async () => {
		const res = await req
			.post('/api/newUsers')
			.send({
				name: 'Test Create User',
				email: 123,
				password: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('status', 400);
		expect(res.body).toHaveProperty('message', 'email must be a string');
	});

	it('should return a 400 if password is not a SHA512 string', async () => {
		const res = await req
			.post('/api/newUsers')
			.send({
				name: 'Test Create User',
				email: 'testCreateUser@example.com',
				password: 'badPassword'
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('status', 400);
		expect(res.body).toHaveProperty('message', 'the password must be sha512');
	});

	it('should return a 409 if a user with the same email already exists', async () => {
		const res1 = await req
			.post('/api/newUsers')
			.send({
				name: 'Test Create User',
				email: 'testCreateUser@example.com',
				password: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
			});
		expect(res1.status).toEqual(200);

		const res2 = await req
			.post('/api/newUsers')
			.send({
				name: 'Test Create User',
				email: 'testCreateUser@example.com',
				password: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
			});
		expect(res2.status).toEqual(409);
		expect(res2.body).toHaveProperty('status', 409);
		expect(res2.body).toHaveProperty('message', 'User with email testCreateUser@example.com already exists');
	});

	it('should create user', async () => {
		const res1 = await req
			.post('/api/newUsers')
			.send({
				name: 'Test Create User',
				email: 'testCreateUser@example.com',
				password: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
			});
		expect(res1.status).toEqual(200);

		const user = await User.findOne({ email: 'testCreateUser@example.com' });
		let exist: boolean;
		if (user) {
			exist = true
		} else {
			exist = false;
		}
		expect(exist).toEqual(true);
	});
});
