import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";

import { Log } from "../Functions/Logs";

import { User } from "../Models/User";

/*
**{
**	name: String,
**	email: String,
**	password: Sha512 String
**}
*/

export default async function createUser(req: Request<{}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) {
	const regexSHA512 = /^[a-fA-F0-9]{128}$/;
	if (typeof req.body != 'object' || Object.keys(req.body).length != 3) {
		Log('createUser.ts', 'WARNING', 'Invalid body');
		res.status(400).send({ message: "Specify { name: String, email: String, password: Sha512 String }" })
		return;
	}
	if (!req.body.name || typeof req.body.name != 'string') {
		Log('createUser.ts', 'WARNING', 'Invalid type for name');
		res.status(400).send({ message: "Name must be a string" });
		return;
	} if (!req.body.email || typeof req.body.email != 'string' || req.body.email.length == 0) {
		Log('createUser.ts', 'WARNING', 'Invalid type for email');
		res.status(400).send({ message: "Email must be a string" });
		return;
	} if (!req.body.password || req.body.password.length != 128 || !regexSHA512.test(req.body.password)) {
		Log('createUser.ts', 'WARNING', 'Invalid format for password');
		res.status(400).send({ message: 'Password must be in Sha512 format' })
		return;
	}

	if (await User.findOne({ email: req.body.email })) {
		Log('createUser.ts', 'WARNING', 'A user with this email already exists');
		res.status(409).send({ message: "A user with this email already exists" });
		return;
	}
	const user = new User({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password
	});

	await user.save();

	Log('createUser.ts', 'INFORMATION', 'User "' + user._id + '" created');
	res.send({ message: 'User created successfully' });
}
