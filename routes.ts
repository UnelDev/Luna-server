import { Router } from 'express';
import Login from './RouterFuction/Login';
import changePassword from './RouterFuction/changePassword';
import createUser from './RouterFuction/createUser';
import { User } from './models/user';
import createAdmin from './RouterFuction/createAdmin';
import deletAdmin from './RouterFuction/deletAdmin';
import deletUser from './RouterFuction/deletUser';
import CreateBox from './RouterFuction/createBox';
import unassign from './RouterFuction/unassign';
import assign from './RouterFuction/assign';
import loginAdmin from './RouterFuction/LoginAdmin';
import listBox from './RouterFuction/listBox';


const router = Router();

// GET /users
router.get('/users', async (req, res) => {
	const users = await User.find();
	res.send(users);
});

// POST /login
router.post('/login', Login);
router.post('/loginAdmin', loginAdmin);
router.post('/newUsers', createUser);
router.post('/newAdmin', createAdmin);
router.post('/newBox', CreateBox);
router.post('/assign', assign);
router.post('/unassign', unassign);
router.post('/deletUser', deletUser);
router.post('/deletAdmin', deletAdmin);
router.post('/listBox', listBox);

router.put('/changePassword', changePassword);

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
