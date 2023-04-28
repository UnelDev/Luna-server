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
		name: 'testAdminCreateBox',
		email: 'testAdminCreateBox@example.com',
		password: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
	});
	await admin.save();
});

afterAll(async () => {
	await Admin.deleteOne({ email: 'testAdminCreateBox@example.com' });
	await mongoose.connection.close();
})

afterEach(async () => {
	await Box.deleteOne({ name: 'createBoxTest' });
});

describe('POST /NewBox', () => {
	it('Should return a 400 if request body is not an object', async () => {
		const res = await req
			.post('/api/NewBox')
			.send('invalidBody');
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'Specify { login:{ email: String, password: Sha512 String }, name: String, placment: String, ?slot[undefined, undefined, undefined, undefined], ?size: Number }');
	});

	it('Should return a 400 if name is not a string', async () => {
		const res = await req
			.post('/api/NewBox')
			.send({
				name: 123,
				placment: '48.862725,2.287592',
				login: {
					email: 'testAdminCreateBox@example.com',
					password: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
				}
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'Name must be a string');
	});

	it('Should return a 400 if placement is not a string', async () => {
		const res = await req
			.post('/api/NewBox')
			.send({
				name: 'createBoxTest',
				placment: 123,
				login: {
					email: 'testAdminCreateBox@example.com',
					password: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
				}
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'Placment must be a string');
	});

	it('Should return a 400 if the size is specified but the slot is not', async () => {
		const res = await req
			.post('/api/NewBox')
			.send({
				name: 'createBoxTest',
				placment: '48.862725,2.287592',
				size: 10,
				login: {
					email: 'testAdminCreateBox@example.com',
					password: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
				}
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'Slot must be specified if the size is specified');
	});

	it('Should return a 400 if the slot is specified but the size is not', async () => {
		const res = await req
			.post('/api/NewBox')
			.send({
				name: 'createBoxTest',
				placment: '48.862725,2.287592',
				slot: ['ID', 'ID', 'ID'],
				login: {
					email: 'testAdminCreateBox@example.com',
					password: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
				}
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'Size must be specified if the slot is specified');
	});


	it('Should return 400 if the size does not match with the slot size', async () => {
		const res = await req
			.post('/api/NewBox')
			.send({
				name: 'createBoxTest',
				placment: '48.862725,2.287592',
				size: 10,
				slot: ['ID', 'ID', 'ID'],
				login: {
					email: 'testAdminCreateBox@example.com',
					password: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
				}
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'Size of the slot array is not equal to the size argument');
	});

	it('Should return a 400 if a box already exists with this name ', async () => {
		await req
			.post('/api/NewBox')
			.send({
				name: 'createBoxTest',
				placment: '48.862725,2.287592',
				size: 3,
				slot: ['ID', 'ID', 'ID'],
				login: {
					email: 'testAdminCreateBox@example.com',
					password: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
				}
			});
		const res = await req
			.post('/api/NewBox')
			.send({
				name: 'createBoxTest',
				placment: '48.862725,2.287592',
				size: 3,
				slot: ['ID', 'ID', 'ID'],
				login: {
					email: 'testAdminCreateBox@example.com',
					password: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
				}
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'A box already exists with this name');
	});

	it('Should save the box', async () => {
		const res = await req
			.post('/api/NewBox')
			.send({
				name: 'createBoxTest',
				placment: '48.862725,2.287592',
				size: 3,
				slot: ['ID', 'ID', 'ID'],
				login: {
					email: 'testAdminCreateBox@example.com',
					password: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
				}
			});
		expect(res.status).toEqual(200);
		expect(res.body).toHaveProperty('message', 'Box created successfully');

		const box = await Box.findOne({ name: 'createBoxTest' });
		expect(box.name).toEqual('createBoxTest');
		expect(box.placment).toEqual('48.862725,2.287592');
		expect(box.slot).toEqual(new Array('ID', 'ID', 'ID'));
		expect(box.size).toEqual(3);
	});
});
