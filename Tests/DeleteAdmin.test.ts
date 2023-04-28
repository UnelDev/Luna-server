import dotenv from 'dotenv';
import mongoose from 'mongoose';
import request from 'supertest';

import { Admin } from '../Models/Admin';

dotenv.config();

const req = request('http://localhost:8082');

beforeAll(async () => {
	await mongoose.connect(process.env.URI);
	const admin = new Admin({
		name: 'testAdminMaster',
		email: 'testAdminMaster@example.com',
		password: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
	});
	await admin.save();
});

afterAll(async () => {
	await Admin.deleteOne({ email: 'testAdminMaster@example.com' });
})

beforeEach(async () => {
	const admin = new Admin({
		name: 'testDeleteAdmin',
		email: 'testDeleteAdmin@example.com',
		password: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
	});
	await admin.save();
});

afterEach(async () => {
	await Admin.deleteOne({ email: 'testDeleteAdmin@example.com' });
})

describe('POST /DeleteAdmin', () => {
	it('Should return a 400 if request body is not an object', async () => {
		const res = await req
			.post('/api/DeleteAdmin')
			.send('invalidBody');
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'Specify { login: { email: String, password: Sha512 String }, email: String }');
	});

	it('Should return a 400 if the login object is not defined', async () => {
		const res = await req
			.post('/api/DeleteAdmin')
			.send({
				email: 'testDeleteAdmin@example.com',
				login: {}
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'Specify login: { email: String, password: Sha512 String }');
	});

	it('Should return a 404 if the login email is not linked to an admin', async () => {
		const res = await req
			.post('/api/DeleteAdmin')
			.send({
				email: 'testDeleteAdmin@example.com',
				login: {
					"email": "badTestAdmin@example.com",
					"password": "EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF"
				}
			});
		expect(res.status).toEqual(404);
		expect(res.body).toHaveProperty('message', 'Admin login not found');
	});

	it('Should return a 403 if the admin password is wrong', async () => {
		const res = await req
			.post('/api/DeleteAdmin')
			.send({
				email: 'testDeleteAdmin@example.com',
				login: {
					"email": "testAdminMaster@example.com",
					"password": "bad"
				}
			});
		expect(res.status).toEqual(403);
		expect(res.body).toHaveProperty('message', 'Wrong confidentials');
	});

	it('Should return a 400 if email is not a string', async () => {
		const res = await req
			.post('/api/DeleteAdmin')
			.send({
				email: 1234,
				login: {
					"email": "testAdminMaster@example.com",
					"password": "EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF"
				}
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'Email must be a string');
	});

	it('Should delete the admin', async () => {
		const res1 = await req
			.post('/api/DeleteAdmin')
			.send({
				email: 'testDeleteAdmin@example.com',
				login: {
					"email": "testAdminMaster@example.com",
					"password": "EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF"
				}
			});
		expect(res1.status).toEqual(200);

		const admin = await Admin.findOne({ email: 'testDeleteAdmin@example.com' });
		expect(admin ? true : false).toEqual(false);
	});
});
