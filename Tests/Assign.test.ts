import dotenv from 'dotenv';
import mongoose from 'mongoose';
import request from 'supertest';

import { Admin } from '../Models/Admin';
import { Box } from '../Models/Box';
import { User } from '../Models/User';

dotenv.config();

const req = request('http://localhost:8082');

beforeAll(async () => {
	await mongoose.connect(process.env.URI);
	const admin = new Admin({
		name: 'assigntestAdmin',
		email: 'assigntestAdmin@example.com',
		password: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
	});
	await admin.save();

	const user = new User({
		name: 'assigntestUser',
		email: 'assigntestUser@example.com',
		password: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
	});
	await user.save();
});

beforeEach(async () => {
	const box = new Box({
		name: 'assignBoxTest',
		placment: '48.862725,2.287592',
		size: 3,
		slot: [undefined, undefined, undefined]
	});
	await box.save();
});

afterEach(async () => {
	await Box.deleteOne({ name: 'assignBoxTest' });
})

afterAll(async () => {
	await Admin.deleteOne({ email: 'assigntestAdmin@example.com' });
	await User.deleteOne({ email: 'assigntestUser@example.com' });
});

describe('POST /Assign', () => {
	it('Should return a 400 if request body is not an object', async () => {
		const res = await req
			.post('/api/Assign')
			.send('invalidBody');
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'specify object');
	});

	it('Should return 400 if login is not defined', async () => {
		const res = await req
			.post('/api/Assign')
			.send({
				name: "createBoxTest",
				IDOfUser: "644671ba82dc1800c84992fc",
				numberOfSlot: 3,
				login: {}
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'specify login object');
	});

	it('Should return 404 if email is not link to an Admin', async () => {
		const res = await req
			.post('/api/Assign')
			.send({
				name: 123,
				email: 'assigntestAdmin@example.com',
				password: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF',
				login: {
					"email": "badTestAdmin@example.com",
					"password": "EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF"
				}
			});
		expect(res.status).toEqual(404);
		expect(res.body).toHaveProperty('message', 'Admin login not found');
	});

	it('Should return 403 if password is wrong', async () => {
		const res = await req
			.post('/api/Assign')
			.send({
				name: "createBoxTest",
				IDOfUser: "644671ba82dc1800c84992fc",
				numberOfSlot: 3,
				login: {
					"email": "assigntestAdmin@example.com",
					"password": "bad"
				}
			});
		expect(res.status).toEqual(403);
		expect(res.body).toHaveProperty('message', 'bad login password');
	});


	it('Sould return 400 if numberOfSlot is not a number', async () => {
		const res = await req
			.post('/api/Assign')
			.send({
				name: "createBoxTest",
				IDOfUser: "644671ba82dc1800c84992fc",
				numberOfSlot: 'bad',
				login: {
					"email": "assigntestAdmin@example.com",
					"password": "EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF"
				}
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'numberOfSlot must be a number');
	});

	it('Sould return 400 if IDOfUser is not a string', async () => {
		const res = await req
			.post('/api/Assign')
			.send({
				name: "createBoxTest",
				IDOfUser: 123,
				numberOfSlot: 1,
				login: {
					"email": "assigntestAdmin@example.com",
					"password": "EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF"
				}
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'IDOfUser must be a string');
	});

	it('Sould return 400 if name is not a string', async () => {
		const res = await req
			.post('/api/Assign')
			.send({
				name: 123,
				IDOfUser: "644671ba82dc1800c84992fc",
				numberOfSlot: 1,
				login: {
					"email": "assigntestAdmin@example.com",
					"password": "EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF"
				}
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'the name must be a string');
	});

	it('Sould return 404 if user is not found', async () => {
		const res = await req
			.post('/api/Assign')
			.send({
				name: 'assignBoxTest',
				IDOfUser: "644671ba82dc1800c84992fc",
				numberOfSlot: 1,
				login: {
					"email": "assigntestAdmin@example.com",
					"password": "EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF"
				}
			});
		expect(res.status).toEqual(404);
		expect(res.body).toHaveProperty('message', 'user not found');
	});

	it('Assign a lock', async () => {
		const id = (await Box.findOne({ name: 'assignBoxTest' })).id.valueOf();
		const IDOfUser = (await User.findOne({ name: 'assigntestUser' })).id.valueOf();
		const res = await req
			.post('/api/Assign')
			.send({
				id: id,
				IDOfUser: IDOfUser,
				numberOfSlot: 1,
				login: {
					"email": "assigntestAdmin@example.com",
					"password": "EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF"
				}
			});
		expect(res.status).toEqual(200);
		expect(res.body).toHaveProperty('message', 'slot assigned with sucess');
		expect((await Box.findOne({ name: 'assignBoxTest' })).slot[1].length).toEqual(2);
	});
});