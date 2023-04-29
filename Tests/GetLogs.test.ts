import request from 'supertest';
import mongoose from 'mongoose';
import { Admin } from '../Models/Admin';
import dotenv from 'dotenv';
dotenv.config();

const req = request('http://localhost:8082');

beforeAll(async () => {
	await mongoose.connect(process.env.URI);
	const admin = new Admin({
		name: 'testGetLog',
		email: 'testGetLog@example.com',
		password: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
	});
	await admin.save();
});

afterAll(async () => {
	await Admin.deleteOne({ email: 'testGetLog@example.com' });
})

describe('POST /GetLogs', () => {
	it('Should return a 400 if request body is not an object', async () => {
		const res = await req
			.post('/api/GetLogs')
			.send('invalidBody');
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'Specify { login: { email: string, password: Sha512 String } }');
	});

	it('Should return a 400 if login object is not define', async () => {
		const res = await req
			.post('/api/GetLogs')
			.send({
				login: {}
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'Specify login: { email: String, password: Sha512 String }');
	});

	it('should return 404 if email is not link to Admin', async () => {
		const res = await req
			.post('/api/GetLogs')
			.send({
				login: {
					"email": "badTestGetLogs@example.com",
					"password": "EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF"
				}
			});
		expect(res.status).toEqual(404);
		expect(res.body).toHaveProperty('message', 'Admin login not found');
	});

	it('Should return a 403 if admin password is wrong', async () => {
		const res = await req
			.post('/api/GetLogs')
			.send({
				login: {
					"email": "testGetLog@example.com",
					"password": "bad"
				}
			});
		expect(res.status).toEqual(403);
		expect(res.body).toHaveProperty('message', 'Wrong confidentials');
	});

	it('Should return a 200 if all is correct', async () => {
		const res = await req
			.post('/api/GetLogs')
			.send({
				login: {
					"email": "testGetLog@example.com",
					"password": "EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF"
				}
			});
		expect(res.status).toEqual(200);
	});
});
