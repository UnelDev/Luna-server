import dotenv from 'dotenv';
import mongoose from 'mongoose';
import request from 'supertest';

import { Box } from '../Models/Box';
import { User } from '../Models/User';

dotenv.config();

const req = request('http://localhost:8082');

beforeAll(async () => {
	await mongoose.connect(process.env.URI);

	const user = new User({
		name: 'BookSlotTestUser',
		email: 'BookSlotTestUser@example.com',
		password: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
	});
	await user.save();
});

beforeEach(async () => {
	const box = new Box({
		name: 'BookSlotBoxTest',
		placement: '48.862725,2.287592',
		size: 3,
		slot: [undefined, undefined, undefined]
	});
	await box.save();
});

afterEach(async () => {
	await Box.deleteOne({ name: 'BookSlotBoxTest' });
})

afterAll(async () => {
	await User.deleteOne({ email: 'BookSlotTestUser@example.com' });
});

describe('POST /BookSlot', () => {
	it('Should return a 400 if request body is not an object', async () => {
		const res = await req
			.post('/api/BookSlot')
			.send('invalidBody');
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'Specify { login: { email: String, password: Sha512 String }, name: String, numberOfSlot: Number }');
	});

	it('Should return 400 if login is not defined', async () => {
		const res = await req
			.post('/api/BookSlot')
			.send({
				name: "createBoxTest",
				numberOfSlot: 1,
				login: {}
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'Specify login: { email: String, password: Sha512 String }');
	});

	it('Should return 404 if email is not link to an User', async () => {
		const res = await req
			.post('/api/BookSlot')
			.send({
				name: 'createBoxTest',
				numberOfSlot: 1,
				login: {
					"email": "badTestUser@example.com",
					"password": "EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF"
				}
			});
		expect(res.status).toEqual(404);
		expect(res.body).toHaveProperty('message', 'User login not found');
	});
	it('Should return 403 if password is wrong', async () => {
		const res = await req
			.post('/api/BookSlot')
			.send({
				name: "createBoxTest",
				numberOfSlot: 1,
				login: {
					"email": "BookSlotTestUser@example.com",
					"password": "bad"
				}
			});
		expect(res.status).toEqual(403);
		expect(res.body).toHaveProperty('message', 'Wrong confidentials');
	});


	it('Sould return 400 if numberOfSlot is not a number', async () => {
		const res = await req
			.post('/api/BookSlot')
			.send({
				name: "createBoxTest",
				numberOfSlot: 'bad',
				login: {
					"email": "BookSlotTestUser@example.com",
					"password": "EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF"
				}
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'numberOfSlot must be a number');
	});

	it('Sould return 400 if name is not a string', async () => {
		const res = await req
			.post('/api/BookSlot')
			.send({
				name: 123,
				numberOfSlot: 1,
				login: {
					"email": "BookSlotTestUser@example.com",
					"password": "EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF"
				}
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'Name must be a string');
	});

	it('Book a lock', async () => {
		const id = (await Box.findOne({ name: 'BookSlotBoxTest' })).id.valueOf();
		const res = await req
			.post('/api/BookSlot')
			.send({
				id: id,
				numberOfSlot: 1,
				login: {
					"email": "BookSlotTestUser@example.com",
					"password": "EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF"
				}
			});
		expect(res.status).toEqual(200);
		expect(res.body).toHaveProperty('message', 'Slot booked successfully');
		expect((await Box.findOne({ name: 'BookSlotBoxTest' })).slot[1].length).toEqual(2);
	});
});