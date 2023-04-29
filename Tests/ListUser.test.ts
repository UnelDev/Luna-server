import dotenv from 'dotenv';
import mongoose from 'mongoose';
import request from 'supertest';

import { Admin } from '../Models/Admin';
import { User } from '../Models/User';

dotenv.config();

const req = request('http://localhost:8082');

beforeAll(async () => {
	await mongoose.connect(process.env.URI);
	const admin = new Admin({
		name: 'testListUserAdmin',
		email: 'testListUserAdmin@example.com',
		password: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
	});
	await admin.save();

	const user = new User({
		name: 'testListUserUser',
		email: 'testListUserUser@example.com',
		password: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
	});
	await user.save();
});

afterAll(async () => {
	await Admin.deleteOne({ email: 'testListUserAdmin@example.com' });
	await User.deleteOne({ email: 'testListUserUser@example.com' });
})

describe('POST /ListUser', () => {
	it('Should return a 400 if request body is not an object', async () => {
		const res = await req
			.post('/api/ListUser')
			.send('invalidBody');
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'Specify { email: String, password: Sha512 String }');
	});

	it('Should return a 400 if login object is not defined', async () => {
		const res = await req
			.post('/api/ListUser')
			.send({
				login: {}
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'Specify login: { email: String, password: Sha512 String }');
	});

	it('Should return a 404 if email is not linkd to an admin', async () => {
		const res = await req
			.post('/api/ListUser')
			.send({
				login: {
					"email": "badtestListUser@example.com",
					"password": "EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF"
				}
			});
		expect(res.status).toEqual(404);
		expect(res.body).toHaveProperty('message', 'Admin login not found');
	});

	it('Should return a 403 if admin password is wrong', async () => {
		const res = await req
			.post('/api/ListUser')
			.send({
				login: {
					"email": "testListUserAdmin@example.com",
					"password": "bad"
				}
			});
		expect(res.status).toEqual(403);
		expect(res.body).toHaveProperty('message', 'Wrong confidentials');
	});

	it('Should return a list', async () => {
		const res = await req
			.post('/api/ListUser')
			.send({
				login: {
					"email": "testListUserAdmin@example.com",
					"password": "EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF"
				}
			});
		expect(res.status).toEqual(200);
		expect(Array.isArray(res.body)).toEqual(true);
	});
});
