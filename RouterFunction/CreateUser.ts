import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";

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
		res.status(400).send({ message: "Specify { name: String, email: String, password: Sha512 String }" })
		return;
	}
	if (!req.body.name || typeof req.body.name != 'string') {
		res.status(400).send({ message: "Name must be a string" });
		return;
	} if (!req.body.email || typeof req.body.email != 'string' || req.body.email.length == 0) {
		res.status(400).send({ message: "Email must be a string" });
		return;
	} if (!req.body.password || req.body.password.length != 128 || !regexSHA512.test(req.body.password)) {
		res.status(400).send({ message: 'Password must be in Sha512 format' })
		return;
	}

	if (await User.findOne({ email: req.body.email })) {
		res.status(409).send({ message: "A user with this email already exists" });
		return;
	}
	const user = new User({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password
	});

	await user.save();
	res.send({ message: 'User created successfully' });
}
