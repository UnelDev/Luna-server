import dotenv from 'dotenv';
import mongoose from 'mongoose';
import request from 'supertest';

import { Admin } from '../models/admin';
dotenv.config();

const req = request('http://localhost:8082');

beforeAll(async () => {
	await mongoose.connect(process.env.URI);
});

beforeEach(async () => {
	const admin = new Admin({
		name: 'changePassword',
		email: 'changePassword@example.com',
		password: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
	});
	await admin.save();
});

afterEach(async () => {
	await Admin.deleteOne({ email: 'changePassword@example.com' });
});

describe('Put /changeAdminPassword', () => {
	it('Should return a 400 if request body is not an object', async () => {
		const res = await req
			.put('/api/changeAdminPassword')
			.send('invalidBody');
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'specify {email:string, oldPassword:sha512string, newPassword:sha512String} object');
	});

	it('Should return a 400 if email is not define', async () => {
		const res = await req
			.put('/api/changeAdminPassword')
			.send({
				changePassword: 'bad password'
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'specify {email:string, oldPassword:sha512string, newPassword:sha512String} object');
	});

	it('Should return a 400 if newPassword is not define', async () => {
		const res = await req
			.put('/api/changeAdminPassword')
			.send({
				email: 'changePassword@example.com',
				oldPassword: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'specify {email:string, oldPassword:sha512string, newPassword:sha512String} object');
	});

	it('Should return a 400 if oldPassword is not define', async () => {
		const res = await req
			.put('/api/changeAdminPassword')
			.send({
				email: 'changePassword@example.com',
				newPassword: 'AA26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'specify {email:string, oldPassword:sha512string, newPassword:sha512String} object');
	});

	it('Should return a 400 if email is not a string', async () => {
		const res = await req
			.put('/api/changeAdminPassword')
			.send({
				email: 123,
				newPassword: 'AA26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF',
				oldPassword: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'email must be a string');
	});

	it('Should return a 400 if newPassword is not a sha512 string', async () => {
		const res = await req
			.put('/api/changeAdminPassword')
			.send({
				email: 'changePassword@example.com',
				oldPassword: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF',
				newPassword: 'bad password'
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'the newPassword must be sha512');
	});

	it('Should return a 400 if oldPassword is not a sha512 string', async () => {
		const res = await req
			.put('/api/changeAdminPassword')
			.send({
				email: 'changePassword@example.com',
				newPassword: 'AA26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF',
				oldPassword: 'bad password'
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message', 'the oldPassword must be sha512');
	});

	it('Should return a 403 if oldPassword is wrong', async () => {
		const res = await req
			.put('/api/changeAdminPassword')
			.send({
				email: 'changePassword@example.com',
				newPassword: 'AA26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF',
				oldPassword: 'FF26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
			});
		expect(res.status).toEqual(403);
		expect(res.body).toHaveProperty('message', 'bad old password');
	});

	it('Should return a 404 if email is not link to an admin', async () => {
		const res = await req
			.put('/api/changeAdminPassword')
			.send({
				email: 'example@example.com',
				newPassword: 'AA26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF',
				oldPassword: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
			});
		expect(res.status).toEqual(404);
		expect(res.body).toHaveProperty('message', 'user not fond');
	});
});
