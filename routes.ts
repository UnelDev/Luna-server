import { Router } from 'express';

import { User } from './Models/User';

import Assign from './RouterFunction/Assign';
import ChangeAdminPassword from './RouterFunction/ChangeAdminPassword';
import ChangePassword from './RouterFunction/ChangePassword';
import CreateAdmin from './RouterFunction/CreateAdmin';
import CreateBox from './RouterFunction/CreateBox';
import CreateUser from './RouterFunction/CreateUser';
import DeleteAdmin from './RouterFunction/DeleteAdmin';
import DeleteUser from './RouterFunction/DeleteUser';
import ListBoxs from './RouterFunction/ListBoxs';
import Login from './RouterFunction/Login';
import LoginAdmin from './RouterFunction/LoginAdmin';
import Unassign from './RouterFunction/Unassign';


const router = Router();

// GET /users
router.get('/users', async (req, res) => {
	const users = await User.find();
	res.send(users);
});

router.post('/Login', Login);
router.post('/LoginAdmin', LoginAdmin);
router.post('/NewUser', CreateUser);
router.post('/NewAdmin', CreateAdmin);
router.post('/NewBox', CreateBox);
router.post('/Assign', Assign);
router.post('/Unassign', Unassign);
router.post('/DeleteUser', DeleteUser);
router.post('/DeleteAdmin', DeleteAdmin);
router.post('/ListBoxs', ListBoxs);
router.put('/ChangePassword', ChangePassword);
router.put('/ChangeAdminPassword', ChangeAdminPassword);

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
