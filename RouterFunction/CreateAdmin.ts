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
**	name:string,
**	email:String,
**	password:String
**}
*/

export default async function createAdmin(req: Request<{}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) {
	const regexSHA512 = /^[a-fA-F0-9]{128}$/;

	if (typeof req.body != 'object' || Object.keys(req.body).length != 4) {
		Log('createAdmin.ts', 'WARNING', 'Invalid body');
		res.status(400).send({ message: "Specify { login: { email:string, password: Sha512 String }, name: String, email: String, password: String }" });
		return;
	}

	if (!await CheckAdmin(req, res)) {
		Log('assing.ts', 'WARNING', 'Invalid admin login');
		return;
	}

	if (!req.body.name || typeof req.body.name != 'string') {
		Log('assing.ts', 'WARNING', 'Invalid type for name');
		res.status(400).send({ message: "Name must be a string" });
		return;
	} else if (!req.body.email || typeof req.body.email != 'string' || req.body.email.length == 0) {
		Log('assing.ts', 'WARNING', 'Invalid type for email');
		res.status(400).send({ message: "Email must be a string" });
		return;
	} else if (!req.body.password || req.body.password.length != 128 || !regexSHA512.test(req.body.password)) {
		Log('assing.ts', 'WARNING', 'Invalid format for password');
		res.status(400).send({ message: 'Password must be in sha512 format' })
		return;
	}

	if (await Admin.findOne({ email: req.body.email })) {
		Log('assing.ts', 'WARNING', 'An admin with this email already exists');
		res.status(409).send({ message: "An admin with this email already exists" });
		return;
	}
	const admin = new Admin({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password
	});

	await admin.save();

	Log('createAdmin.ts', 'INFORMATION', 'Admin "' + admin._id + '" created');
	res.send('Admin created successfully');
}
