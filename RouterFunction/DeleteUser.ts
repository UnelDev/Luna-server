import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { log } from "../Functions/Logs";
import CheckAdmin from "../Functions/CheckAdmin";
import { User } from "../Models/User";

export default async function deletUser(req: Request<{}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) {
	if (typeof req.body != 'object' || Object.keys(req.body).length != 2) {
		log('deleteUser.ts', 'WARNING', 'delete user has been call with wrong body');
		res.status(400).send({ status: 400, message: "specify email and login object" });
		return;
	}

	if (!await CheckAdmin(req, res)) {
		log('deleteUser.ts', 'WARNING', 'delete user has been call without valid admin id');
		return;
	}

	if (typeof req.body.email != 'string') {
		log('deleteUser.ts', 'WARNING', 'delete user has been call with wrong type of email');
		res.status(400).send({ status: 400, message: "bad email to delet user" });
		return;
	}

	if (!(await User.findOne({ email: req.body.email }))) {
		log('deleteUser.ts', 'WARNING', 'delete user has been call but user required does not exist anymore');
		res.status(404).send({ status: 404, message: "user not found" });
		return;
	}

	const user = await User.deleteOne({ email: req.body.email });
	if (user) {
		res.send('user ' + req.body.email + ' deleted');
		//no id for user (deleted) no id for admin because i dont have admin object
		log('deleteUser.ts', 'INFORMATION', 'user' + req.body.email + 'has been deleted by' + req.body.login.email);
	} else {
		log('deleteUser.ts', 'ERROR', 'error in deleting user the ' + req.body.email + ' have create an error');
		res.status(400).send('error in deleting user' + req.body.email + ' user');
	}
}
