import request from 'supertest';
import { User } from '../models/user';
import mongoose from 'mongoose';

const req = request('http://localhost:8082');

beforeAll(async () => {
	await mongoose.connect('mongodb://localhost:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.0');
});

beforeEach(async () => {
	const user = new User({
		name: 'changePassword',
		email: 'changePassword@example.com',
		password: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
	});
	await user.save();
});

afterEach(async () => {
	await User.deleteOne({ email: 'changePassword@example.com' });
});

describe('put /changePassword', () => {
	it('should return a 400 if request body is not an object', async () => {
		const res = await req
			.put('/api/changePassword')
			.send('invalidBody');
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('status', 400);
		expect(res.body).toHaveProperty('message', 'specify {email:string, oldPassword:sha512string, newPassword:sha512String} object');
	});

	it('should return a 400 if key email is not give', async () => {
		const res = await req
			.put('/api/changePassword')
			.send({
				changePassword: 'bad password'
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('status', 400);
		expect(res.body).toHaveProperty('message', 'specify {email:string, oldPassword:sha512string, newPassword:sha512String} object');
	});

	it('should return a 400 if key newPassword is not give', async () => {
		const res = await req
			.put('/api/changePassword')
			.send({
				email: 'changePassword@example.com',
				oldPassword: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('status', 400);
		expect(res.body).toHaveProperty('message', 'specify {email:string, oldPassword:sha512string, newPassword:sha512String} object');
	});

	it('should return a 400 if key oldPassword is not give', async () => {
		const res = await req
			.put('/api/changePassword')
			.send({
				email: 'changePassword@example.com',
				newPassword: 'AA26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('status', 400);
		expect(res.body).toHaveProperty('message', 'specify {email:string, oldPassword:sha512string, newPassword:sha512String} object');
	});

	it('should return a 400 if email is not a string', async () => {
		const res = await req
			.put('/api/changePassword')
			.send({
				email: 123,
				newPassword: 'AA26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF',
				oldPassword: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('status', 400);
		expect(res.body).toHaveProperty('message', 'email must be a string');
	});

	it('should return a 400 if newPassword is not a sha512 string', async () => {
		const res = await req
			.put('/api/changePassword')
			.send({
				email: 'changePassword@example.com',
				oldPassword: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF',
				newPassword: 'bad password'
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('status', 400);
		expect(res.body).toHaveProperty('message', 'the newPassword must be sha512');
	});

	it('should return a 400 if oldPassword is not a sha512 string', async () => {
		const res = await req
			.put('/api/changePassword')
			.send({
				email: 'changePassword@example.com',
				newPassword: 'AA26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF',
				oldPassword: 'bad password'
			});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('status', 400);
		expect(res.body).toHaveProperty('message', 'the oldPassword must be sha512');
	});

	it('should return a 403 if oldPassword is bad', async () => {
		const res = await req
			.put('/api/changePassword')
			.send({
				email: 'changePassword@example.com',
				newPassword: 'AA26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF',
				oldPassword: 'FF26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
			});
		expect(res.status).toEqual(403);
		expect(res.body).toHaveProperty('status', 403);
		expect(res.body).toHaveProperty('message', 'bad old password');
	});

	it('should return a 404 if email is not link at user', async () => {
		const res = await req
			.put('/api/changePassword')
			.send({
				email: 'example@example.com',
				newPassword: 'AA26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF',
				oldPassword: 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF'
			});
		expect(res.status).toEqual(404);
		expect(res.body).toHaveProperty('status', 404);
		expect(res.body).toHaveProperty('message', 'user not fond');
	});
});
