import { Router } from 'express';

import Login from './RouterFuction/Login';
import changePassword from './RouterFuction/changePassword';
import createUser from './RouterFuction/createUser';
import { User } from './models/user';
import createAdmin from './RouterFuction/createAdmin';
import deletAdmin from './RouterFuction/deletAdmin';

const router = Router();

// GET /users
router.get('/users', async (req, res) => {
	const users = await User.find();
	res.send(users);
});

// POST /login
router.post('/login', async (req, res) => {
	await Login(req, res);
});

// POST /users
router.post('/newUsers', async (req, res) => {
	const instance = await createUser(req, res);
	if (instance) {
		res.send(instance);
	}
});

router.post('/newAdmin', async (req, res) => {
	const instance = await createAdmin(req, res);
	if (instance) {
		res.send(instance);
	}
});

router.post('/deletAdmin', async (req, res) => {
	const instance = await deletAdmin(req, res);
	if (instance) {
		res.send(instance);
	}
});

router.put('/changePassword', async (req, res) => {
	const instance = await changePassword(req, res);
	if (instance) {
		res.send(instance);
	}
});


// PUT /users/:id
router.put('/users/:id', async (req, res) => {
	const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
	res.send(user);
});

// DELETE /users/:email
router.delete('/users/:email', async (req, res) => {
	const user = await User.findOneAndDelete({ email: req.params.email });
	res.send(user);
});


export default router;
