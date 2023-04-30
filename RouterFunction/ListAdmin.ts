import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";

import CheckAdmin from "../Functions/CheckAdmin";
import { Log } from "../Functions/Logs";

import { Admin } from "../Models/Admin";

/**
**{
*	login:{
*		email: String
*		password: Sha512 String
*	}
**}
*/

export default async function ListAdmin(req: Request<{}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) {

	if (typeof req.body != 'object' || Object.keys(req.body).length != 1) {
		Log('listAdmin.ts', 'WARNING', 'Invalid body');
		res.status(400).send({ message: "Specify { email: String, password: Sha512 String }" });
		return;
	}

	if (!await CheckAdmin(req, res)) {
		Log('listAdmin.ts', 'WARNING', 'Invalid admin login');
		return;
	}

	const alladmin = await Admin.find();
	Log('listAdmin.ts', 'INFORMATION', 'Admin "' + req.body.login.email + '" got the admin list');
	res.status(200).send(alladmin);

}