import { Router } from 'express';

import { User } from './models/user';

import Login from './RouterFuction/Login';
import loginAdmin from './RouterFuction/LoginAdmin';
import assign from './RouterFuction/assign';
import changeAdminPassword from './RouterFuction/changeAdminPassword';
import changePassword from './RouterFuction/changePassword';
import createAdmin from './RouterFuction/createAdmin';
import CreateBox from './RouterFuction/createBox';
import createUser from './RouterFuction/createUser';
import deletAdmin from './RouterFuction/deletAdmin';
import deletUser from './RouterFuction/deletUser';
import listBox from './RouterFuction/listBox';
import unassign from './RouterFuction/unassign';


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
