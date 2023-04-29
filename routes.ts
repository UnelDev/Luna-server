import { Router } from 'express';
import Login from './RouterFunction/Login';
import loginAdmin from './RouterFunction/LoginAdmin';
import createUser from './RouterFunction/CreateUser';
import createAdmin from './RouterFunction/CreateAdmin';
import CreateBox from './RouterFunction/CreateBox';
import assign from './RouterFunction/Assign';
import unassign from './RouterFunction/Unassign';
import deletUser from './RouterFunction/DeleteUser';
import deletAdmin from './RouterFunction/DeleteAdmin';
import listBox from './RouterFunction/ListBoxs';
import changePassword from './RouterFunction/ChangePassword';
import changeAdminPassword from './RouterFunction/ChangeAdminPassword';


const router = Router();

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
router.put('/changeAdminPassword', changeAdminPassword);

export default router;
