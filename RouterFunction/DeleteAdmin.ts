import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";

import CheckAdmin from "../Functions/CheckAdmin";
import { Log } from "../Functions/Logs";

import { Admin } from "../Models/Admin";

/*
**{
**	login:{
**		email:string
**		password:stringSha512
**	},
**	email:String
**}
*/

export default async function deleteAdmin(req: Request<{}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) {
	if (typeof req.body != 'object' || Object.keys(req.body).length != 2) {
		Log('deleteAdmin.ts', 'WARNING', 'Invalid body');
		res.status(400).send({ message: "Specify { login: { email: String, password: Sha512 String }, email: String }" })
		return;
	}

	if (!await CheckAdmin(req, res)) {
		Log('deleteAdmin.ts', 'WARNING', 'Invalid admin login');
		return;
	}

	if (typeof req.body.email != 'string') {
		Log('deleteAdmin.ts', 'WARNING', 'Invalid type for email');
		res.status(400).send({ message: "Email must be a string" });
		return;
	}

	if (!(await Admin.findOne({ email: req.body.email }))) {
		Log('deleteAdmin.ts', 'WARNING', 'Admin not found');
		res.status(404).send({ message: "Admin not found" });
		return;
	}

	await Admin.deleteOne({ email: req.body.email });

	Log('deleteAdmin.ts', 'INFORMATION', 'Admin "' + req.body.email + '" deleted by "' + req.body.login.email + '"');
	res.status(200).send('Admin deleted successfully');
}
