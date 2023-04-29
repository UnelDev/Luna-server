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
		name: 'testAdminDeletUser',
		email: 'testAdminDeletUser@example.com',
		password: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
	});
	await admin.save();
});

afterAll(async () => {
	await mongoose.connect(process.env.URI);
	await Admin.deleteOne({ email: 'testAdminDeletUser@example.com' });
})

beforeEach(async () => {
	const user = new User({
		name: 'testDeleteUser',
		email: 'testDeleteUser@example.com',
		password: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
	});
	await user.save();
});

afterEach(async () => {
	await User.deleteOne({ email: 'testDeleteUser@example.com' });
})

describe('POST /DeleteUser', () => {
	it('Should return a 400 if request body is not an object', async () => {
		const res = await req
			.post('/api/DeleteUser')
			.send('invalidBody');
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'Specify { login: { email: String, password: Sha512 String }, email: String }');
	});

	it('Should return a 400 if login object is not define', async () => {
		const res = await req
			.post('/api/DeleteUser')
			.send({
				email: 'testDeleteUser@example.com',
				login: {}
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'Specify login: { email: String, password: Sha512 String }');
	});

	it('Should return a 404 if the login email is not link to an admin', async () => {
		const res = await req
			.post('/api/DeleteUser')
			.send({
				email: 'testDeleteUser@example.com',
				login: {
					"email": "badTestAdmin@example.com",
					"password": "EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF"
				}
			});
		expect(res.status).toEqual(404);
		expect(res.body).toHaveProperty('message', 'Admin login not found');
	});

	it('Should return a 403 if admin password is wrong', async () => {
		const res = await req
			.post('/api/DeleteUser')
			.send({
				email: 'testDeleteUser@example.com',
				login: {
					"email": "testAdminDeletUser@example.com",
					"password": "bad"
				}
			});
		expect(res.status).toEqual(403);
		expect(res.body).toHaveProperty('message', 'Wrong confidentials');
	});

	it('Should return a 400 if email is not a string', async () => {
		const res = await req
			.post('/api/DeleteUser')
			.send({
				email: 1234,
				login: {
					"email": "testAdminDeletUser@example.com",
					"password": "EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF"
				}
			});

		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'Email must be a string');
	});

	it('Should delete the user', async () => {
		const res = await req
			.post('/api/DeleteUser')
			.send({
				email: 'testDeleteUser@example.com',
				login: {
					"email": "testAdminDeletUser@example.com",
					"password": "EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF"
				}
			});
		expect(res.status).toEqual(200);
		const user = await User.findOne({ email: 'testDeleteUser@example.com' });
		expect(user ? true : false).toEqual(false);
	});
});
