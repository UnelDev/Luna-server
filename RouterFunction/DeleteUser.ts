import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";

import CheckAdmin from "../Functions/CheckAdmin";
import { Log } from "../Functions/Logs";

import { User } from "../Models/User";

/*
**{
**	login:{
**		email:string
**		password:stringSha512
**	},
**	email:String
**}
*/

export default async function deleteUser(req: Request<{}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) {
	if (typeof req.body != 'object' || Object.keys(req.body).length != 2) {
		Log('deleteUser.ts', 'WARNING', 'Invalid body');
		res.status(400).send({ message: "Specify { login: { email: String, password: Sha512 String }, email: String }" })
		return;
	}

	if (!await CheckAdmin(req, res)) {
		Log('deleteUser.ts', 'WARNING', 'Invalid admin login');
		return;
	}

	if (typeof req.body.email != 'string') {
		Log('deleteUser.ts', 'WARNING', 'Invalid type for email');
		res.status(400).send({ message: "Email must be a string" });
		return;
	}

	if (!(await User.findOne({ email: req.body.email }))) {
		Log('deleteUser.ts', 'WARNING', 'User not found');
		res.status(404).send({ message: "User not found" });
		return;
	}

	await User.deleteOne({ email: req.body.email });

	Log('deleteUser.ts', 'INFORMATION', 'User "' + req.body.email + '" deleted by "' + req.body.login.email + '"');
	res.status(200).send('User deleted successfully');
}
