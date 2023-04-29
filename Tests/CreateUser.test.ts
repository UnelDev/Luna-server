import dotenv from 'dotenv';
import mongoose from 'mongoose';
import request from 'supertest';

import { User } from '../Models/User';

dotenv.config();

const req = request('http://localhost:8082');

beforeAll(async () => {
	await mongoose.connect(process.env.URI);
});

afterEach(async () => {
	await User.deleteOne({ email: 'testCreateUser@example.com' });
});

describe('POST /NewUser', () => {
	it('Should return a 400 if request body is not an object', async () => {
		const res = await req
			.post('/api/NewUser')
			.send('invalidBody');
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'Specify { name: String, email: String, password: Sha512 String }');
	});

	it('Should return a 400 if name is not a string', async () => {
		const res = await req
			.post('/api/NewUser')
			.send({
				name: 123,
				email: 'testCreateUser@example.com',
				password: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'Name must be a string');
	});

	it('Should return a 400 if email is not a string', async () => {
		const res = await req
			.post('/api/NewUser')
			.send({
				name: 'Test Create User',
				email: 123,
				password: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'Email must be a string');
	});

	it('Should return a 400 if email is empty', async () => {
		const res = await req
			.post('/api/NewUser')
			.send({
				name: 'Test Create User',
				email: '',
				password: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'Email must be a string');
	});

	it('Should return a 400 if password is not in SHA512 format', async () => {
		const res = await req
			.post('/api/NewUser')
			.send({
				name: 'Test Create User',
				email: 'testCreateUser@example.com',
				password: 'badPassword'
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'Password must be in Sha512 format');
	});

	it('Should return a 409 if a user with the same email already exists', async () => {
		const res1 = await req
			.post('/api/NewUser')
			.send({
				name: 'Test Create User',
				email: 'testCreateUser@example.com',
				password: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
			});
		expect(res1.status).toEqual(200);

		const res2 = await req
			.post('/api/NewUser')
			.send({
				name: 'Test Create User',
				email: 'testCreateUser@example.com',
				password: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
			});
		expect(res2.status).toEqual(409);
		expect(res2.body).toHaveProperty('message', 'A user with this email already exists');
	});

	it('Should create a user', async () => {
		const res1 = await req
			.post('/api/NewUser')
			.send({
				name: 'Test Create User',
				email: 'testCreateUser@example.com',
				password: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
			});
		expect(res1.status).toEqual(200);
		expect(res1.body).toHaveProperty('message', 'User created successfully');

		const user = await User.findOne({ email: 'testCreateUser@example.com' });
		expect(user ? true : false).toEqual(true);
	});
});
