import { Router } from 'express';
import { User } from './models/user';
import testPassword from './RouterFuction/testPassword';
import changePassword from './RouterFuction/changePassword';
import CreateUser from './RouterFuction/createUser';
const router = Router();

// GET /users
router.get('/users', async (req, res) => {
	const users = await User.find();
	res.send(users);
});

router.get('/testPassword', async (req, res) => {
	const instance = await testPassword(req, res);
	if (instance) {
		res.send(instance);
	}
});

// POST /users
router.post('/NewUsers', async (req, res) => {
	const instance = await CreateUser(req, res);
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
