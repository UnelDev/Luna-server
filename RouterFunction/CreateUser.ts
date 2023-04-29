import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { User } from "../Models/User";
import { log } from "../Functions/Logs";

export default async function createUser(req: Request<{}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) {
	const regexSHA512 = /^[a-fA-F0-9]{128}$/;
	if (typeof req.body != 'object' || Object.keys(req.body).length != 3) {
		log('createUser.ts', 'WARNING', 'create user has been call with wrong body');
		res.status(400).send({ status: 400, message: "specify user object" });
		return;
	}
	if (!req.body.name || typeof req.body.name != 'string') {
		log('createUser.ts', 'WARNING', 'create user has been call with wrong type of name');
		res.status(400).send({ status: 400, message: "username must be a string" });
		return;
	} if (!req.body.email || typeof req.body.email != 'string') {
		log('createUser.ts', 'WARNING', 'create user has been call with wrong type of email');
		res.status(400).send({ status: 400, message: "email must be a string" });
		return;
	} if (!req.body.password || req.body.password.length != 128 || !regexSHA512.test(req.body.password)) {
		log('createUser.ts', 'WARNING', 'create user has been call with wrong type of password');
		res.status(400).send({ status: 400, message: 'the password must be sha512' });
		return;
	}

	if (await User.findOne({ email: req.body.email })) {
		log('createUser.ts', 'WARNING', 'create user has been call but email is aldready use for other account');
		res.status(409).send({ status: 409, message: "User with email " + req.body.email + " already exists" });
		return;
	}
	const user = new User({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password
	});
	await user.save();
	log('createUser.ts', 'INFORMATION', 'user ' + user._id + ' created');
	res.send('User ' + user.email + ' created');
}