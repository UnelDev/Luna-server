import request from 'supertest';
import mongoose from 'mongoose';
import { Admin } from '../Models/Admin';
import dotenv from 'dotenv';
dotenv.config();

const req = request('http://localhost:8082');

beforeAll(async () => {
	await mongoose.connect(process.env.URI);
	const admin = new Admin({
		name: 'testgetLog',
		email: 'testgetLog@example.com',
		password: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
	});
	await admin.save();
});

afterAll(async () => {
	await Admin.deleteOne({ email: 'testgetLog@example.com' });
})

describe('POST /getLogs', () => {
	it('should return a 400 if request body is not an object', async () => {
		const res = await req
			.post('/api/getLogs')
			.send('invalidBody');
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'specify login object');
	});

	it('should return 400 if login object is not specified', async () => {
		const res = await req
			.post('/api/getLogs')
			.send({
				login: {}
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('status', 400);
		expect(res.body).toHaveProperty('message', 'Specify login: { email: String, password: Sha512 String }');
	});

	it('should return 404 if email is not link to Admin', async () => {
		const res = await req
			.post('/api/getLogs')
			.send({
				login: {
					"email": "badtestgetLogs@example.com",
					"password": "EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF"
				}
			});
		expect(res.status).toEqual(404);
		expect(res.body).toHaveProperty('status', 404);
		expect(res.body).toHaveProperty('message', 'Admin login not found');
	});

	it('should return 403 if password of admin is bad', async () => {
		const res = await req
			.post('/api/getLogs')
			.send({
				login: {
					"email": "testgetLog@example.com",
					"password": "bad"
				}
			});
		expect(res.status).toEqual(403);
		expect(res.body).toHaveProperty('status', 403);
		expect(res.body).toHaveProperty('message', 'Wrong confidentials');
	});

	it('should return 200 if all is correct', async () => {
		const res = await req
			.post('/api/getLogs')
			.send({
				login: {
					"email": "testgetLog@example.com",
					"password": "EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF"
				}
			});
		expect(res.status).toEqual(200);
	});
});
