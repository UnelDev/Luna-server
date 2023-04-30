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
		name: 'UnassignTestAdmin',
		email: 'UnassignTestAdmin@example.com',
		password: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
	});
	await admin.save();

	const user = new User({
		name: 'UnassignTestUser',
		email: 'UnassignTestUser@example.com',
		password: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
	});
	await user.save();
});

beforeEach(async () => {
	const box = new Box({
		name: 'UnassignBoxTest',
		placement: '48.862725,2.287592',
		size: 3,
		slot: [[(await User.findOne({ email: 'UnassignTestUser@example.com' }))._id, new Date()], undefined, undefined]
	});
	await box.save();
});

afterEach(async () => {
	await Box.deleteOne({ name: 'UnassignBoxTest' });
})

afterAll(async () => {
	await Admin.deleteOne({ email: 'UnassignTestAdmin@example.com' });
	await User.deleteOne({ email: 'UnassignTestUser@example.com' });
});

describe('POST /Unassign', () => {
	it('Should return a 400 if request body is not an object', async () => {
		const res = await req
			.post('/api/Unassign')
			.send('invalidBody');
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'Specify { login: { username: String, password: Sha512 String }, name: String|id, numberOfSlot: Number }');
	});

	it('Should return a 400 if login object is not define', async () => {
		const res = await req
			.post('/api/Unassign')
			.send({
				name: "createBoxTest",
				numberOfSlot: 0,
				login: {}
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'Specify login: { email: String, password: Sha512 String }');
	});

	it('Should return a 404 if email is not link to an admin', async () => {
		const res = await req
			.post('/api/Unassign')
			.send({
				name: "createBoxTest",
				numberOfSlot: 0,
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
			.post('/api/Unassign')
			.send({
				name: "createBoxTest",
				numberOfSlot: 0,
				login: {
					"email": "UnassignTestAdmin@example.com",
					"password": "bad"
				}
			});
		expect(res.status).toEqual(403);
		expect(res.body).toHaveProperty('message', 'Wrong confidentials');
	});


	it('Sould return a 400 if numberOfSlot is not a number', async () => {
		const res = await req
			.post('/api/Unassign')
			.send({
				name: "createBoxTest",
				numberOfSlot: 'bad',
				login: {
					"email": "UnassignTestAdmin@example.com",
					"password": "EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF"
				}
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'numberOfSlot must be a number');
	});

	it('Sould return 400 if name is not a string', async () => {
		const res = await req
			.post('/api/Unassign')
			.send({
				name: 123,
				numberOfSlot: 0,
				login: {
					"email": "UnassignTestAdmin@example.com",
					"password": "EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF"
				}
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'Name must be a string');
	});

	it('Sould return 400 if the slot to unassing is dosn\'t assing', async () => {
		const id = (await Box.findOne({ name: 'UnassignBoxTest' })).id.valueOf();
		const res = await req
			.post('/api/Unassign')
			.send({
				id: id,
				numberOfSlot: 1,
				login: {
					"email": "UnassignTestAdmin@example.com",
					"password": "EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF"
				}
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'Slot required is not allocated');
		expect((await Box.findOne({ name: 'UnassignBoxTest' })).slot[1]).toEqual(null);
	});

	it('Sould return 404 if the user in the slot is not real user', async () => {
		const id = (await Box.findOne({ name: 'UnassignBoxTest' })).id.valueOf();
		await Box.findOneAndUpdate({ name: 'UnassignBoxTest' }, { slot: [['99999999999999f9ff99ff9f', new Date()], undefined, undefined] });
		const res = await req
			.post('/api/Unassign')
			.send({
				id: id,
				numberOfSlot: 0,
				login: {
					"email": "UnassignTestAdmin@example.com",
					"password": "EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF"
				}
			});
		expect(res.status).toEqual(404);
		expect(res.body).toHaveProperty('message', 'user not found');
	});

	it('Sould return 500 if the date in the slot is not real date', async () => {
		const id = (await Box.findOne({ name: 'UnassignBoxTest' })).id.valueOf();
		await Box.findOneAndUpdate({ name: 'UnassignBoxTest' }, { slot: [[(await User.findOne({ email: 'UnassignTestUser@example.com' }))._id, 'hello'], undefined, undefined] });
		const res = await req
			.post('/api/Unassign')
			.send({
				id: id,
				numberOfSlot: 0,
				login: {
					"email": "UnassignTestAdmin@example.com",
					"password": "EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF"
				}
			});
		expect(res.status).toEqual(500);
		expect(res.body).toHaveProperty('message', 'this slot does not contain date');
	});

	it('Unassign a lock', async () => {
		const id = (await Box.findOne({ name: 'UnassignBoxTest' })).id.valueOf();
		const res = await req
			.post('/api/Unassign')
			.send({
				id: id,
				numberOfSlot: 0,
				login: {
					"email": "UnassignTestAdmin@example.com",
					"password": "EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF"
				}
			});
		expect(res.status).toEqual(200);
		expect(res.body).toHaveProperty('message', 'Slot unassigned successfully');
		expect((await Box.findOne({ name: 'UnassignBoxTest' })).slot[0]).toEqual(null);
	});
});