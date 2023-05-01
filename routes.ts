import { Router } from 'express';

import Assign from './RouterFunction/Assign';
import ChangeAdminPassword from './RouterFunction/ChangeAdminPassword';
import ChangePassword from './RouterFunction/ChangePassword';
import CreateAdmin from './RouterFunction/CreateAdmin';
import CreateBox from './RouterFunction/CreateBox';
import CreateUser from './RouterFunction/CreateUser';
import DeleteAdmin from './RouterFunction/DeleteAdmin';
import DeleteUser from './RouterFunction/DeleteUser';
import GetLogs from './RouterFunction/GetLogs';
import ListBoxs from './RouterFunction/ListBoxs';
import Login from './RouterFunction/Login';
import LoginAdmin from './RouterFunction/LoginAdmin';
import Unassign from './RouterFunction/Unassign';
import ListUser from './RouterFunction/ListUser';
import listAdmin from './RouterFunction/ListAdmin';
import ReleaseSlot from './RouterFunction/ReleaseSlot';
import BookSlot from './RouterFunction/BookSlot';

const router = Router();

router.post('/Login', Login);
router.post('/LoginAdmin', LoginAdmin);
router.post('/CreateUser', CreateUser);
router.post('/CreateAdmin', CreateAdmin);
router.post('/CreateBox', CreateBox);
router.post('/Assign', Assign);
router.post('/BookSlot', BookSlot);
router.post('/Unassign', Unassign);
router.post('/ReleaseSlot', ReleaseSlot);
router.post('/DeleteUser', DeleteUser);
router.post('/DeleteAdmin', DeleteAdmin);
router.post('/ListBoxs', ListBoxs);
router.post('/ListUser', ListUser);
router.post('/ListAdmin', listAdmin);
router.put('/ChangePassword', ChangePassword);
router.put('/ChangeAdminPassword', ChangeAdminPassword);
router.post('/GetLogs', GetLogs);

export default router;