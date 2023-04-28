import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";

import CheckAdmin from "../Functions/CheckAdmin";

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
		res.status(400).send({ message: "Specify { login: { email: String, password: Sha512 String }, email: String }" })
		return;
	}

	if (!await CheckAdmin(req, res)) {
		return;
	}

	if (typeof req.body.email != 'string') {
		res.status(400).send({ message: "Email must be a string" });
		return;
	}

	if (!(await Admin.findOne({ email: req.body.email }))) {
		res.status(404).send({ message: "Admin not found" });
		return;
	}

	await Admin.deleteOne({ email: req.body.email });

	res.status(200).send('Admin deleted successfully');
}
