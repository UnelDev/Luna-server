import request from 'supertest';
import mongoose from 'mongoose';
import { Admin } from '../Models/Admin';
import dotenv from 'dotenv';
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
		name: 'testdeletUser',
		email: 'testdeletUser@example.com',
		password: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
	});
	await user.save();
});

afterEach(async () => {
	await User.deleteOne({ email: 'testdeletUser@example.com' });
})

describe('POST /deletUser', () => {
	it('should return a 400 if request body is not an object', async () => {
		const res = await req
			.post('/api/deletUser')
			.send('invalidBody');
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('status', 400);
		expect(res.body).toHaveProperty('message', 'specify email and login object');
	});

	it('should return 400 if login object is not specified', async () => {
		const res = await req
			.post('/api/deletUser')
			.send({
				email: 'testdeletUser@example.com',
				login: {}
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('status', 400);
		expect(res.body).toHaveProperty('message', 'Specify login: { email: String, password: Sha512 String }');
	});

	it('should return 404 if email is not link to Admin', async () => {
		const res = await req
			.post('/api/deletUser')
			.send({
				email: 'testdeletUser@example.com',
				login: {
					"email": "badTestAdmin@example.com",
					"password": "EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF"
				}
			});
		expect(res.status).toEqual(404);
		expect(res.body).toHaveProperty('status', 404);
		expect(res.body).toHaveProperty('message', 'Admin login not found');
	});

	it('should return 403 if password of admin is bad', async () => {
		const res = await req
			.post('/api/deletUser')
			.send({
				email: 'testdeletUser@example.com',
				login: {
					"email": "testAdminDeletUser@example.com",
					"password": "bad"
				}
			});
		expect(res.status).toEqual(403);
		expect(res.body).toHaveProperty('status', 403);
		expect(res.body).toHaveProperty('message', 'Wrong confidentials');
	});

	it('should return a 400 if email is not a string', async () => {
		const res = await req
			.post('/api/deletUser')
			.send({
				email: 1234,
				login: {
					"email": "testAdminDeletUser@example.com",
					"password": "EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF"
				}
			});

		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('status', 400);
		expect(res.body).toHaveProperty('message', 'bad email to delet user');
	});

	it('should delet user', async () => {
		const res = await req
			.post('/api/deletUser')
			.send({
				email: 'testdeletUser@example.com',
				login: {
					"email": "testAdminDeletUser@example.com",
					"password": "EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF"
				}
			});
		expect(res.status).toEqual(200);
		const user = await User.findOne({ email: 'testdeletUser@example.com' });
		let exist: boolean;
		if (user) {
			exist = true
		} else {
			exist = false;
		}
		expect(exist).toEqual(false);
	});
});
