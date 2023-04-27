import request from 'supertest';
import mongoose from 'mongoose';
import { Admin } from '../models/admin';
import dotenv from 'dotenv';
import { Box } from '../models/Box';
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

describe('POST /newBox', () => {
	it('should return a 400 if request body is not an object', async () => {
		const res = await req
			.post('/api/newBox')
			.send('invalidBody');
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('status', 400);
		expect(res.body).toHaveProperty('message', 'specify email and login object');
	});

	it('should return 400 if name is not a string', async () => {
		const res = await req
			.post('/api/newBox')
			.send({
				name: 123,
				placment: '48.862725,2.287592',
				login: {
					email: 'testAdminCreateBox@example.com',
					password: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
				}
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('status', 400);
		expect(res.body).toHaveProperty('message', 'the name must be a string');
	});

	it('should return 400 if placement is not a string', async () => {
		const res = await req
			.post('/api/newBox')
			.send({
				name: 'createBoxTest',
				placment: 123,
				login: {
					email: 'testAdminCreateBox@example.com',
					password: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
				}
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('status', 400);
		expect(res.body).toHaveProperty('message', 'the placment must be a string');
	});

	it('should return 400 if size is specified but slot is not', async () => {
		const res = await req
			.post('/api/newBox')
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
		expect(res.body).toHaveProperty('status', 400);
		expect(res.body).toHaveProperty('message', 'the slot must be specified if the size is specified');
	});

	it('should return 400 if slot is sppecified but size is not', async () => {
		const res = await req
			.post('/api/newBox')
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
		expect(res.body).toHaveProperty('status', 400);
		expect(res.body).toHaveProperty('message', 'the size must be specified if the slot is specified');
	});


	it('should return 400 if size does not match with slot size', async () => {
		const res = await req
			.post('/api/newBox')
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
		expect(res.body).toHaveProperty('status', 400);
		expect(res.body).toHaveProperty('message', 'the size of slot array is not equal of size argument');
	});

	it('should return 400 if slot if slot is a duplicate', async () => {
		await req
			.post('/api/newBox')
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
			.post('/api/newBox')
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
		expect(res.body).toHaveProperty('status', 400);
		expect(res.body).toHaveProperty('message', 'the box with this name already exist');
	});

	it('test the savig of the box', async () => {
		const res = await req
			.post('/api/newBox')
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
		const box = await Box.findOne({ name: 'createBoxTest' });
		expect(box.name).toEqual('createBoxTest');
		expect(box.placment).toEqual('48.862725,2.287592');
		expect(box.slot).toEqual(new Array('ID', 'ID', 'ID'));
		expect(box.size).toEqual(3);
	});
});
