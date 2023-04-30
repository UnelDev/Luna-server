import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";

import CheckAdmin from "../Functions/CheckAdmin";
import { Log } from "../Functions/Logs";

import { User } from "../Models/User";

/**
**{
*	login:{
*		email: String
*		password: Sha512 String
*	}
**}
*/

export default async function listUser(req: Request<{}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) {

	if (typeof req.body != 'object' || Object.keys(req.body).length != 1) {
		Log('listUser.ts', 'WARNING', 'Invalid body');
		res.status(400).send({ message: "Specify { email: String, password: Sha512 String }" });
		return;
	}

	if (!await CheckAdmin(req, res)) {
		Log('listUser.ts', 'WARNING', 'Invalid admin login');
		return;
	}

	const alluser = await User.find();
	Log('listUser.ts', 'INFORMATION', 'Admin "' + req.body.login.email + '" got the user list');
	res.status(200).send(alluser);
}
