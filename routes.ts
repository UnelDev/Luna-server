import { Router } from 'express';

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

router.post('/Login', Login);
router.post('/LoginAdmin', LoginAdmin);
router.post('/CreateUser', CreateUser);
router.post('/CreateAdmin', CreateAdmin);
router.post('/CreateBox', CreateBox);
router.post('/Assign', Assign);
router.post('/Unassign', Unassign);
router.post('/DeleteUser', DeleteUser);
router.post('/DeleteAdmin', DeleteAdmin);
router.post('/ListBoxs', ListBoxs);
router.put('/ChangePassword', ChangePassword);
router.put('/ChangeAdminPassword', ChangeAdminPassword);

export default router;