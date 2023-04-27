import request from 'supertest';
import mongoose from 'mongoose';
import { Admin } from '../models/admin';
import dotenv from 'dotenv';
import { Box } from '../models/Box';
import { User } from '../models/user';
dotenv.config();

const req = request('http://localhost:8082');

beforeAll(async () => {
	await mongoose.connect(process.env.URI);
	const admin = new Admin({
		name: 'unassigntestAdmin',
		email: 'unassigntestAdmin@example.com',
		password: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
	});
	await admin.save();

	const user = new User({
		name: 'unassigntestUser',
		email: 'unassigntestUser@example.com',
		password: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
	});
	await user.save();
});

beforeEach(async () => {
	const box = new Box({
		name: 'unassignBoxTest',
		placment: '48.862725,2.287592',
		size: 3,
		slot: [undefined, undefined, undefined]
	});
	await box.save();
});

afterEach(async () => {
	await Box.deleteOne({ name: 'unassignBoxTest' });
})

afterAll(async () => {
	await Admin.deleteOne({ email: 'unassigntestAdmin@example.com' });
	await User.deleteOne({ email: 'unassigntestUser@example.com' });
});

describe('POST /unassign', () => {
	it('should return a 400 if request body is not an object', async () => {
		const res = await req
			.post('/api/unassign')
			.send('invalidBody');
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'specify object');
	});

	it('should return 400 if login object is not specified', async () => {
		const res = await req
			.post('/api/unassign')
			.send({
				name: "createBoxTest",
				numberOfSlot: 2,
				login: {}
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'specify login object');
	});

	it('should return 404 if email is not link to Admin', async () => {
		const res = await req
			.post('/api/unassign')
			.send({
				name: "createBoxTest",
				numberOfSlot: 2,
				login: {
					"email": "badTestAdmin@example.com",
					"password": "EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF"
				}
			});
		expect(res.status).toEqual(404);
		expect(res.body).toHaveProperty('message', 'Admin login not found');
	});

	it('should return 403 if password of admin is bad', async () => {
		const res = await req
			.post('/api/unassign')
			.send({
				name: "createBoxTest",
				numberOfSlot: 2,
				login: {
					"email": "unassigntestAdmin@example.com",
					"password": "bad"
				}
			});
		expect(res.status).toEqual(403);
		expect(res.body).toHaveProperty('message', 'bad login password');
	});


	it('sould return 400 if numberOfSlot is not a number', async () => {
		const res = await req
			.post('/api/unassign')
			.send({
				name: "createBoxTest",
				numberOfSlot: 'bad',
				login: {
					"email": "unassigntestAdmin@example.com",
					"password": "EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF"
				}
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'numberOfSlot must be a number');
	});

	it('sould return 400 if name is not a string', async () => {
		const res = await req
			.post('/api/unassign')
			.send({
				name: 123,
				numberOfSlot: 1,
				login: {
					"email": "unassigntestAdmin@example.com",
					"password": "EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF"
				}
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'the name must be a string');
	});

	it('unassign a lock', async () => {
		const id = (await Box.findOne({ name: 'unassignBoxTest' })).id.valueOf();
		const IDOfUser = (await User.findOne({ name: 'unassigntestUser' })).id.valueOf();
		const res = await req
			.post('/api/unassign')
			.send({
				id: id,
				numberOfSlot: 1,
				login: {
					"email": "unassigntestAdmin@example.com",
					"password": "EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF"
				}
			});
		expect(res.status).toEqual(200);
		expect(res.body).toHaveProperty('message', 'slot unassigned with sucess');
		expect((await Box.findOne({ name: 'unassignBoxTest' })).slot[1]).toEqual(null);
	});
});