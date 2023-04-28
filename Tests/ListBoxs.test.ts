import dotenv from 'dotenv';
import mongoose from 'mongoose';
import request from 'supertest';

import { Admin } from '../Models/Admin';
import { Box } from '../Models/Box';

dotenv.config();

const req = request('http://localhost:8082');

beforeAll(async () => {
	await mongoose.connect(process.env.URI);
	const admin = new Admin({
		name: 'testListBoxsMaster',
		email: 'testListBoxsMaster@example.com',
		password: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
	});
	await admin.save();

	const box = new Box({
		name: 'ListBoxsTest',
		placment: '48.862725,2.287592',
		size: 3,
		slot: [null, null, null]
	});
	await box.save();
});

afterAll(async () => {
	await Admin.deleteOne({ email: 'testListBoxsMaster@example.com' });
	await Box.deleteOne({ name: 'ListBoxsTest' });
})

describe('POST /ListBoxs', () => {
	it('should return a 400 if request body is not an object', async () => {
		const res = await req
			.post('/api/ListBoxs')
			.send('invalidBody');
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'Specify { email: string, password: sha512string }');
	});

	it('should return 400 if login object is not specified', async () => {
		const res = await req
			.post('/api/ListBoxs')
			.send({
				login: {}
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('status', 400);
		expect(res.body).toHaveProperty('message', 'specify login object');
	});

	it('should return 404 if email is not link to Admin', async () => {
		const res = await req
			.post('/api/ListBoxs')
			.send({
				login: {
					"email": "badtestListBoxs@example.com",
					"password": "EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF"
				}
			});
		expect(res.status).toEqual(404);
		expect(res.body).toHaveProperty('status', 404);
		expect(res.body).toHaveProperty('message', 'Admin login not found');
	});

	it('should return 403 if password of admin is bad', async () => {
		const res = await req
			.post('/api/ListBoxs')
			.send({
				login: {
					"email": "testListBoxsMaster@example.com",
					"password": "bad"
				}
			});
		expect(res.status).toEqual(403);
		expect(res.body).toHaveProperty('status', 403);
		expect(res.body).toHaveProperty('message', 'bad login password');
	});

	it('should return 403 if password of admin is bad', async () => {
		const res = await req
			.post('/api/ListBoxs')
			.send({
				login: {
					"email": "testListBoxsMaster@example.com",
					"password": "EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF"
				}
			});
		expect(res.status).toEqual(200);
		expect(Array.isArray(res.body)).toEqual(true);
		//typof
	});
});
